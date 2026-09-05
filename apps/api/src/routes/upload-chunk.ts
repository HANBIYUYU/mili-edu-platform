import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'
import { ALLOWED_DIRS, EXT_TYPES, extOf, kindOfExt, newObjectKey } from '../lib/files'

/**
 * 大文件分片上传（经 Worker R2 binding，不依赖 S3 签名/CORS/Token）。
 * 每片 ≤ ~64MB（低于 Worker 请求体 100MB 上限），整体可分片传任意大小。
 * 客户端：init → 逐片 part（multipart）→ complete / abort
 */
const uploadChunk = new Hono<{ Bindings: Env }>()

uploadChunk.post('/init', authMiddleware, async (c) => {
  const { dir, name, size } = await c.req.json()
  if (!(ALLOWED_DIRS as readonly string[]).includes(String(dir || ''))) {
    return c.json({ error: `目录不合法，可选：${ALLOWED_DIRS.join('、')}` }, 400)
  }
  const ext = extOf(String(name || ''))
  const kind = kindOfExt(ext)
  if (!kind || !EXT_TYPES[ext]) {
    return c.json({ error: '不支持的文件类型' }, 400)
  }
  if (!Number.isInteger(size) || size <= 0) {
    return c.json({ error: '文件大小不合法' }, 400)
  }

  const key = newObjectKey(String(dir), String(name))
  const contentType = EXT_TYPES[ext]
  const multipart = await c.env.BUCKET.createMultipartUpload(key, { httpMetadata: { contentType } })

  const chunkSize = 64 * 1024 * 1024
  const count = Math.max(1, Math.ceil(size / chunkSize))

  return c.json({ data: { key, uploadId: multipart.uploadId, chunkSize, count, size } }, 201)
})

uploadChunk.post('/part', authMiddleware, async (c) => {
  const form = await c.req.formData()
  const key = String(form.get('key') || '')
  const uploadId = String(form.get('uploadId') || '')
  const partNumber = Number(form.get('partNumber') || 0)
  const chunk = form.get('file')

  type UpFile = { stream: () => ReadableStream }
  if (!key || !uploadId || !Number.isInteger(partNumber) || partNumber < 1) {
    return c.json({ error: '缺少必要参数' }, 400)
  }
  if (!chunk || typeof chunk === 'string') {
    return c.json({ error: '缺少分片内容' }, 400)
  }

  const multipart = c.env.BUCKET.resumeMultipartUpload(key, uploadId)
  const uploaded = await multipart.uploadPart(partNumber, (chunk as unknown as UpFile).stream())
  return c.json({ data: { partNumber: uploaded.partNumber, etag: uploaded.etag } })
})

uploadChunk.post('/complete', authMiddleware, async (c) => {
  const { key, uploadId, parts } = await c.req.json()
  if (!key || !uploadId || !Array.isArray(parts) || parts.length === 0) {
    return c.json({ error: '缺少必要参数' }, 400)
  }
  const multipart = c.env.BUCKET.resumeMultipartUpload(String(key), String(uploadId))
  await multipart.complete(parts.map((p: any) => ({ partNumber: p.partNumber, etag: p.etag })))
  return c.json({ success: true, key })
})

uploadChunk.post('/abort', authMiddleware, async (c) => {
  const { key, uploadId } = await c.req.json()
  if (!key || !uploadId) return c.json({ success: true })
  try {
    const multipart = c.env.BUCKET.resumeMultipartUpload(String(key), String(uploadId))
    await multipart.abort()
  } catch { /* ignore */ }
  return c.json({ success: true })
})

export default uploadChunk

type Env = {
  DB: D1Database
  JWT_SECRET: string
  BUCKET: R2Bucket
}
