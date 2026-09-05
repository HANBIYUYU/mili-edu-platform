/**
 * R2 S3 预签名（AWS SigV4）工具 —— 供“大文件直传”使用
 *
 * 浏览器无法对 R2 binding 做预签名；需用 R2 的 S3 API（r2.cloudflarestorage.com）。
 * Worker 用 R2 API Token（Access Key ID / Secret，作为 secrets 注入）签发：
 *   - 发起 Multipart Upload（签名请求，POST ?uploads）
 *   - 给每个分片生成预签名 PUT URL（浏览器直传，不经过 Worker）
 *   - 完成 / 中止 Multipart（签名请求）
 */

const BUCKET = 'mili-edu-assets'
const REGION = 'auto'
const SERVICE = 's3'
const ALGO = 'AWS4-HMAC-SHA256'

export interface S3Creds {
  endpoint: string // 如 https://<accountid>.r2.cloudflarestorage.com
  accessKeyId: string
  secretAccessKey: string
}

export function credsFromEnv(env: Record<string, string | undefined>): S3Creds | null {
  const rawEndpoint = env.R2_ENDPOINT
  const rawAccess = env.R2_ACCESS_KEY_ID
  const rawSecret = env.R2_SECRET_ACCESS_KEY
  if (!rawEndpoint || !rawAccess || !rawSecret) return null
  return {
    endpoint: rawEndpoint.trim().replace(/\/+$/, ''),
    accessKeyId: rawAccess.trim(),
    secretAccessKey: rawSecret.trim(),
  }
}

const EMPTY_HASH = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'

/* ---------------- crypto helpers (WebCrypto) ---------------- */

const te = new TextEncoder()

async function sha256Hex(data: string | Uint8Array): Promise<string> {
  const buf = typeof data === 'string' ? te.encode(data) : data
  const digest = await crypto.subtle.digest('SHA-256', buf as BufferSource)
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function hmacBytes(key: Uint8Array, msg: string): Promise<Uint8Array> {
  const k = await crypto.subtle.importKey(
    'raw', key as BufferSource, { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', k, te.encode(msg) as BufferSource)
  return new Uint8Array(sig)
}

function toHex(bytes: Uint8Array): string {
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function isoBasic(d = new Date()): string {
  return d.toISOString().replace(/[:-]|\.\d{3}/g, '')
}

/** S3 key → canonical URI（按段编码，保留 /） */
function canonicalUri(key: string): string {
  return key.split('/').map((s) => encodeURIComponent(s)).join('/')
}

/** 查询对象 → 规范化查询串（按 key 排序、编码） */
function canonicalQuery(query: Record<string, string>): string {
  return Object.keys(query)
    .sort()
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(query[k])}`)
    .join('&')
}

async function hmacSigningKey(secret: string, dateScope: string): Promise<Uint8Array> {
  const kDate = await hmacBytes(te.encode('AWS4' + secret) as unknown as Uint8Array, dateScope)
  const kRegion = await hmacBytes(kDate, REGION)
  const kService = await hmacBytes(kRegion, SERVICE)
  return hmacBytes(kService, 'aws4_request')
}

export interface SignedRequest {
  url: string
  headers: Record<string, string>
}

/**
 * 生成“header 认证”的签名请求（Worker 侧直接 fetch 用）
 */
export async function signRequest(
  creds: S3Creds,
  opts: {
    method: string
    key: string
    query?: Record<string, string>
    headers?: Record<string, string> // 实际会发送的额外请求头（不含 host/authorization/x-amz-date）
    body?: string | Uint8Array | null
  },
): Promise<SignedRequest> {
  const { method, key } = opts
  const query = opts.query || {}
  const headers: Record<string, string> = { ...(opts.headers || {}) }

  const amzDate = isoBasic()
  const dateScope = amzDate.slice(0, 8)
  const host = new URL(creds.endpoint).host
  const uri = '/' + BUCKET + canonicalUri(key)

  const payloadHash = opts.body === undefined || opts.body === null
    ? EMPTY_HASH
    : await sha256Hex(typeof opts.body === 'string' ? opts.body : new Uint8Array(opts.body))

  const allHeaders: Record<string, string> = {
    host,
    'x-amz-date': amzDate,
    'x-amz-content-sha256': payloadHash,
    ...headers,
  }
  // 统一小写规范化，避免 canonical 与实际发送头不一致（键大小写）
  const normHeaders: Record<string, string> = {}
  Object.keys(allHeaders).forEach((h) => {
    normHeaders[h.toLowerCase()] = String(allHeaders[h])
  })
  const signedHeaders = Object.keys(normHeaders).sort().join(';')

  const canonicalHeaders = Object.keys(normHeaders)
    .sort()
    .map((h) => `${h}:${normHeaders[h]}`)
    .join('\n')

  const canonicalRequest = [
    method,
    uri,
    canonicalQuery(query),
    canonicalHeaders + '\n',
    signedHeaders,
    payloadHash,
  ].join('\n')

  const scope = `${dateScope}/${REGION}/${SERVICE}/aws4_request`
  const stringToSign = [
    ALGO,
    amzDate,
    scope,
    await sha256Hex(canonicalRequest),
  ].join('\n')

  const signingKey = await hmacSigningKey(creds.secretAccessKey, dateScope)
  const signature = toHex(await hmacBytes(signingKey, stringToSign))

  const cred = `${creds.accessKeyId}/${scope}`
  const authHeader = `${ALGO} Credential=${cred}, SignedHeaders=${signedHeaders}, Signature=${signature}`

  const url = new URL(creds.endpoint)
  url.pathname = '/' + BUCKET + canonicalUri(key)
  if (query && Object.keys(query).length) {
    Object.keys(query).sort().forEach((k) => url.searchParams.set(k, query[k]))
  }

  const sendHeaders: Record<string, string> = {
    Authorization: authHeader,
    'X-Amz-Date': amzDate,
    'X-Amz-Content-Sha256': payloadHash,
    ...headers,
  }
  return { url: url.toString(), headers: sendHeaders }
}

/**
 * 生成预签名 PUT URL（浏览器直传单个分片用）
 */
export async function presignPartUpload(
  creds: S3Creds,
  key: string,
  uploadId: string,
  partNumber: number,
  contentType: string,
  expiresSeconds = 3600,
): Promise<string> {
  const amzDate = isoBasic()
  const dateScope = amzDate.slice(0, 8)
  const host = new URL(creds.endpoint).host
  const uri = '/' + BUCKET + canonicalUri(key)

  // 预签名只签 host（浏览器会带 Content-Type/Content-Length，属于“额外头”允许）
  const signedHeaders = 'host'
  const canonicalHeaders = `host:${host}\n`

  const query: Record<string, string> = {
    'X-Amz-Algorithm': ALGO,
    'X-Amz-Credential': `${creds.accessKeyId}/${dateScope}/${REGION}/${SERVICE}/aws4_request`,
    'X-Amz-Date': amzDate,
    'X-Amz-Expires': String(expiresSeconds),
    'X-Amz-SignedHeaders': signedHeaders,
    partNumber: String(partNumber),
    uploadId,
  }
  // AWS 部分实现要求 PutObject 直传带 x-id=PutObject（不参与签名）
  // R2 对此无要求，不追加。

  const canonicalRequest = [
    'PUT',
    uri,
    canonicalQuery(query),
    canonicalHeaders,
    signedHeaders,
    EMPTY_HASH,
  ].join('\n')

  const scope = `${dateScope}/${REGION}/${SERVICE}/aws4_request`
  const stringToSign = [
    ALGO,
    amzDate,
    scope,
    await sha256Hex(canonicalRequest),
  ].join('\n')

  const signingKey = await hmacSigningKey(creds.secretAccessKey, dateScope)
  query['X-Amz-Signature'] = toHex(await hmacBytes(signingKey, stringToSign))

  const url = new URL(creds.endpoint)
  url.pathname = '/' + BUCKET + canonicalUri(key)
  Object.keys(query).sort().forEach((k) => url.searchParams.set(k, query[k]))
  return url.toString()
}

/* ---------------- 高层操作（可直接被路由调用） ---------------- */

export interface S3UploadSession {
  uploadId: string
  partSize: number
  partCount: number
  presignedParts: { number: number; size: number; url: string }[]
}

export async function initiateMultipart(
  creds: S3Creds,
  key: string,
  contentType: string,
  size: number,
  partSize = 64 * 1024 * 1024,
): Promise<S3UploadSession> {
  const req = await signRequest(creds, {
    method: 'POST',
    key,
    query: { uploads: '' },
    headers: { 'Content-Type': contentType },
  })

  const resp = await fetch(req.url, {
    method: 'POST',
    headers: req.headers,
  })
  const text = await resp.text()
  if (!resp.ok) {
    throw new Error(`R2 发起上传失败：${resp.status} ${text.slice(0, 200)}`)
  }
  const m = /<UploadId>([\s\S]*?)<\/UploadId>/.exec(text)
  if (!m) throw new Error('R2 响应缺少 UploadId')

  const partCount = Math.max(1, Math.ceil(size / partSize))
  const presignedParts: S3UploadSession['presignedParts'] = []
  for (let n = 1; n <= partCount; n++) {
    const partSizeBytes = n === partCount ? Math.max(1, size - (n - 1) * partSize) : partSize
    const url = await presignPartUpload(creds, key, m[1], n, contentType)
    presignedParts.push({ number: n, size: partSizeBytes, url })
  }

  return { uploadId: m[1], partSize, partCount, presignedParts }
}

export async function completeMultipart(
  creds: S3Creds,
  key: string,
  uploadId: string,
  parts: { number: number; etag: string }[],
): Promise<void> {
  const xml =
    '<CompleteMultipartUpload>' +
    parts
      .map((p) => `<Part><PartNumber>${p.number}</PartNumber><ETag>"${p.etag}"</ETag></Part>`)
      .join('') +
    '</CompleteMultipartUpload>'

  const req = await signRequest(creds, {
    method: 'POST',
    key,
    query: { uploadId },
    headers: { 'Content-Type': 'application/xml' },
    body: xml,
  })

  const resp = await fetch(req.url, { method: 'POST', headers: req.headers, body: xml })
  const text = await resp.text()
  if (!resp.ok) {
    throw new Error(`R2 完成上传失败：${resp.status} ${text.slice(0, 200)}`)
  }
}

export async function abortMultipart(
  creds: S3Creds,
  key: string,
  uploadId: string,
): Promise<void> {
  const req = await signRequest(creds, {
    method: 'DELETE',
    key,
    query: { uploadId },
  })
  await fetch(req.url, { method: 'DELETE', headers: req.headers })
}

const CORS_XML =
  '<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">' +
  '<CORSRule>' +
  '<AllowedOrigin>*</AllowedOrigin>' +
  '<AllowedMethod>PUT</AllowedMethod>' +
  '<AllowedMethod>GET</AllowedMethod>' +
  '</CORSRule>' +
  '</CORSConfiguration>'

/** 配置桶 CORS：浏览器分片直传 + 读取 ETag 必需 */
export async function setBucketCors(creds: S3Creds): Promise<void> {
  const req = await signRequest(creds, {
    method: 'PUT',
    key: '',
    headers: { 'Content-Type': 'application/xml' },
    body: CORS_XML,
  })
  const resp = await fetch(req.url, { method: 'PUT', headers: req.headers, body: CORS_XML })
  if (!resp.ok) {
    const text = await resp.text()
    throw new Error(`配置桶 CORS 失败：${resp.status} ${text.slice(0, 200)}`)
  }
}

export { BUCKET }
