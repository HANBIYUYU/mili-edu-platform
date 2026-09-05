import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'
import { ALLOWED_DIRS, EXT_TYPES, extOf, kindOfExt, newObjectKey } from '../lib/files'
import { abortMultipart, completeMultipart, credsFromEnv, initiateMultipart, setBucketCors, type S3UploadSession } from '../lib/s3'

const uploadLarge = new Hono<{ Bindings: Env }>()

/**
 * 大文件直传：浏览器分片 PUT 到 R2 S3 端点（不经 Worker 中转）。
 * 需要 Worker secrets：R2_ENDPOINT / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY。
 * 缺失时返回 503 并提示配置。
 */

uploadLarge.post('/init', authMiddleware, async (c) => {
  const creds = credsFromEnv(c.env as unknown as Record<string, string | undefined>)
  if (!creds) {
    return c.json({
      error: '直传功能尚未配置：请先创建 R2 API Token 并注入 R2_ENDPOINT / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY',
    }, 503)
  }

  const { dir, name, size } = await c.req.json()
  if (!(ALLOWED_DIRS as readonly string[]).includes(String(dir || ''))) {
    return c.json({ error: `目录不合法，可选：${ALLOWED_DIRS.join('、')}` }, 400)
  }
  const ext = extOf(String(name || ''))
  const kind = kindOfExt(ext)
  if (!kind || !EXT_TYPES[ext]) {
    return c.json({ error: '不支持的文件类型（直传支持图片/音频/视频/PDF/Word）' }, 400)
  }
  if (!Number.isInteger(size) || size <= 0 || size > 5 * 1024 * 1024 * 1024) {
    return c.json({ error: '文件大小不合法（0 < size ≤ 5GiB）' }, 400)
  }

  const key = newObjectKey(String(dir), String(name))
  const contentType = EXT_TYPES[ext]

  let session: S3UploadSession
  try {
    session = await initiateMultipart(creds, key, contentType, size)
  } catch (e: any) {
    return c.json({ error: e?.message || '发起直传失败' }, 500)
  }

  return c.json({
    data: {
      key,
      uploadId: session.uploadId,
      partSize: session.partSize,
      partCount: session.partCount,
      contentType,
      parts: session.presignedParts,
    },
  }, 201)
})

uploadLarge.post('/complete', authMiddleware, async (c) => {
  const creds = credsFromEnv(c.env as unknown as Record<string, string | undefined>)
  if (!creds) {
    return c.json({ error: '直传功能尚未配置（缺少 R2 secrets）' }, 503)
  }

  const { key, uploadId, parts } = await c.req.json()
  if (!key || !uploadId || !Array.isArray(parts) || parts.length === 0) {
    return c.json({ error: '缺少必要参数' }, 400)
  }

  try {
    await completeMultipart(creds, String(key), String(uploadId), parts)
  } catch (e: any) {
    return c.json({ error: e?.message || '合并分片失败' }, 500)
  }
  return c.json({ success: true, key })
})

uploadLarge.post('/abort', authMiddleware, async (c) => {
  const creds = credsFromEnv(c.env as unknown as Record<string, string | undefined>)
  if (!creds) return c.json({ success: true })

  const { key, uploadId } = await c.req.json()
  if (!key || !uploadId) {
    return c.json({ error: '缺少必要参数' }, 400)
  }
  await abortMultipart(creds, String(key), String(uploadId)).catch(() => undefined)
  return c.json({ success: true })
})

/** 一次性配置桶 CORS（浏览器直传分片必需，配置一次即可） */
uploadLarge.post('/setup-cors', authMiddleware, async (c) => {
  const creds = credsFromEnv(c.env as unknown as Record<string, string | undefined>)
  if (!creds) {
    return c.json({ error: '直传功能尚未配置（缺少 R2 secrets）' }, 503)
  }
  try {
    await setBucketCors(creds)
  } catch (e: any) {
    return c.json({ error: e?.message || '配置 CORS 失败' }, 500)
  }
  return c.json({ success: true, message: '桶 CORS 已配置' })
})

export default uploadLarge

type Env = {
  DB: D1Database
  JWT_SECRET: string
  BUCKET: R2Bucket
}
