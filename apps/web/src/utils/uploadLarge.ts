import api, { uploadFile } from '../api'

/** 超过该阈值走 R2 S3 预签名 Multipart 直传（Worker 单请求上限 ~100MB，留 90MB 余量） */
export const LARGE_UPLOAD_THRESHOLD = 90 * 1024 * 1024

/** 超过该阈值弹压缩提示 */
export const COMPRESS_ADVICE_THRESHOLD = 300 * 1024 * 1024

const PART_SIZE = 64 * 1024 * 1024 // 与后端 init 默认分片大小一致
const CONCURRENCY = 3

export interface UploadMeta {
  part: number
  parts: number
  bytesLoaded: number
  bytesTotal: number
}

interface InitResponse {
  key: string
  uploadId: string
  partSize: number
  partCount: number
  contentType: string
  parts: { number: number; size: number; url: string }[]
}

/**
 * 大文件直传：init 获取预签名分片 → 浏览器并发 PUT 到 R2 S3 端点 → complete
 * onProgress(percent, meta) 中 meta 带分片进度
 */
export async function uploadLarge(
  file: File,
  dir: string,
  onProgress?: (percent: number, meta: UploadMeta) => void,
): Promise<{ key: string }> {
  let initBody: any
  try {
    const res: any = await api.post('/upload-large/init', { dir, name: file.name, size: file.size })
    initBody = res?.data
  } catch (e: any) {
    throw e?.error ? e : { error: '发起直传失败，请稍后重试' }
  }
  const init: InitResponse = initBody
  const { key, uploadId } = init

  let bytesDone = 0
  let partsDone = 0
  let next = 0
  let failed: string | null = null
  const etags: (string | null)[] = new Array(init.parts.length).fill(null)

  const report = () => {
    const total = file.size || 1
    onProgress?.(Math.min(100, Math.round((bytesDone / total) * 100)), {
      part: partsDone,
      parts: init.parts.length,
      bytesLoaded: bytesDone,
      bytesTotal: file.size,
    })
  }

  const uploadPart = (p: { number: number; size: number; url: string }) =>
    new Promise<void>((resolve, reject) => {
      const start = (p.number - 1) * PART_SIZE
      const blob = file.slice(start, start + p.size)
      const xhr = new XMLHttpRequest()
      xhr.open('PUT', p.url)
      xhr.responseType = 'text'
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const etag = (xhr.getResponseHeader('ETag') || '').replace(/"/g, '')
          etags[p.number - 1] = etag
          bytesDone += p.size
          partsDone += 1
          resolve()
        } else {
          reject(new Error(`分片 ${p.number} 上传失败（HTTP ${xhr.status}）`))
        }
      }
      xhr.onerror = () => reject(new Error(`分片 ${p.number} 网络错误`))
      xhr.send(blob)
    })

  const worker = async () => {
    while (!failed && next < init.parts.length) {
      const idx = next++
      try {
        await uploadPart(init.parts[idx])
        report()
      } catch (err: any) {
        failed = err?.message || '上传失败'
        report()
        break
      }
    }
  }

  const runners: Promise<void>[] = []
  for (let i = 0; i < Math.min(CONCURRENCY, init.parts.length); i++) {
    runners.push(worker())
  }
  await Promise.all(runners)

  if (failed) {
    // 半途失败：尝试清理服务端未完成的分片
    try { await api.post('/upload-large/abort', { key, uploadId }) } catch { /* ignore */ }
    throw { error: failed }
  }

  if (etags.some((t) => !t)) {
    throw { error: '分片 ETag 缺失，上传未完成，请重试' }
  }

  try {
    await api.post('/upload-large/complete', {
      key,
      uploadId,
      parts: etags.map((etag, i) => ({ number: i + 1, etag })),
    })
  } catch (e: any) {
    throw e?.error ? e : { error: '合并分片失败，请重试' }
  }

  return { key }
}

/**
 * 大文件分片上传（经 Worker R2 binding，无需 S3 Token/CORS）：
 * init → 每片 multipart POST（≤64MB）→ complete
 */
export async function uploadChunked(
  file: File,
  dir: string,
  onProgress?: (percent: number, meta?: UploadMeta) => void,
): Promise<{ key: string }> {
  let initBody: any
  try {
    const res: any = await api.post('/upload-chunk/init', { dir, name: file.name, size: file.size })
    initBody = res?.data
  } catch (e: any) {
    throw e?.error ? e : { error: '发起分片上传失败，请稍后重试' }
  }
  const init: { key: string; uploadId: string; chunkSize: number; count: number } = initBody
  const { key, uploadId } = init
  const CHUNK = 64 * 1024 * 1024
  const parts = new Array(init.count).fill(0).map((_, i) => i + 1)

  let bytesDone = 0
  let partsDone = 0
  let next = 0
  let failed: string | null = null
  const etags: { partNumber: number; etag: string }[] = []

  const report = () => {
    const total = file.size || 1
    onProgress?.(Math.min(100, Math.round((bytesDone / total) * 100)), {
      part: partsDone,
      parts: init.count,
      bytesLoaded: bytesDone,
      bytesTotal: file.size,
    })
  }

  const uploadPart = (partNumber: number) =>
    new Promise<void>((resolve, reject) => {
      const start = (partNumber - 1) * CHUNK
      const blob = file.slice(start, start + CHUNK)
      const fd = new FormData()
      fd.append('file', blob, 'chunk')
      fd.append('key', key)
      fd.append('uploadId', uploadId)
      fd.append('partNumber', String(partNumber))

      const xhr = new XMLHttpRequest()
      xhr.open('POST', '/api/upload-chunk/part')
      xhr.withCredentials = true
      xhr.responseType = 'text'
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const body = JSON.parse(xhr.responseText)
            if (body?.data?.etag) {
              etags.push({ partNumber, etag: String(body.data.etag).replace(/"/g, '') })
            }
          } catch { /* ignore */ }
          bytesDone += blob.size
          partsDone += 1
          resolve()
        } else {
          reject(new Error(`分片 ${partNumber} 上传失败（HTTP ${xhr.status}）`))
        }
      }
      xhr.onerror = () => reject(new Error(`分片 ${partNumber} 网络错误`))
      xhr.send(fd)
    })

  const worker = async () => {
    while (!failed && next < parts.length) {
      const idx = next++
      try {
        await uploadPart(parts[idx])
        report()
      } catch (err: any) {
        failed = err?.message || '上传失败'
        report()
        break
      }
    }
  }

  const runners: Promise<void>[] = []
  for (let i = 0; i < Math.min(CONCURRENCY, parts.length); i++) {
    runners.push(worker())
  }
  await Promise.all(runners)

  if (failed) {
    try { await api.post('/upload-chunk/abort', { key, uploadId }) } catch { /* ignore */ }
    throw { error: failed }
  }

  if (etags.length !== parts.length) {
    throw { error: '分片未全部完成，请重试' }
  }
  try {
    await api.post('/upload-chunk/complete', { key, uploadId, parts: etags.sort((a, b) => a.partNumber - b.partNumber) })
  } catch (e: any) {
    throw e?.error ? e : { error: '合并分片失败，请重试' }
  }
  return { key }
}

/**
 * 上传分流：≤90MB 走 Worker 单 PUT（uploadFile），更大走 R2 binding 分片上传。
 */
export async function uploadAny(
  file: File,
  dir: string,
  onProgress?: (percent: number, meta?: UploadMeta) => void,
): Promise<{ key: string; size: number }> {
  if (file.size > LARGE_UPLOAD_THRESHOLD) {
    const r = await uploadChunked(file, dir, onProgress)
    return { key: r.key, size: file.size }
  }
  const r = await uploadFile(file, dir, onProgress ? (p) => onProgress(p) : undefined)
  return { key: r.key, size: r.size }
}
