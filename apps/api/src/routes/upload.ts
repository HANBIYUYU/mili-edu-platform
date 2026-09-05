import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'
import {
  ALLOWED_DIRS,
  EXT_TYPES,
  MAX_SIZES,
  extOf,
  kindOfExt,
  newObjectKey,
} from '../lib/files'

const upload = new Hono<{ Bindings: Env }>()

/**
 * POST /api/upload（需登录）
 * multipart/form-data：file（文件）、dir（目录，见 lib/files ALLOWED_DIRS）
 * 校验类型/大小后写入 R2，返回对象 key（前端存 DB 用）。
 */
upload.post('/', authMiddleware, async (c) => {
  const bucket = c.env.BUCKET
  const form = await c.req.formData()
  const raw = form.get('file')
  const dir = String(form.get('dir') || 'misc')

  // Worker 运行时 multipart 字段为 File；此处做最小结构校验
  type UpFile = { name: string; size: number; stream: () => ReadableStream }
  if (!raw || typeof raw === 'string') {
    return c.json({ error: '缺少上传文件' }, 400)
  }
  const file = raw as unknown as UpFile
  if (!(ALLOWED_DIRS as readonly string[]).includes(dir)) {
    return c.json({ error: `目录不合法，可选：${ALLOWED_DIRS.join('、')}` }, 400)
  }

  const ext = extOf(file.name)
  const kind = kindOfExt(ext)
  if (!kind || !EXT_TYPES[ext]) {
    return c.json({ error: '仅支持图片(jpg/png/webp/gif)、音频(mp3/wav/m4a/aac)、视频(mp4/webm/mov)、文档(pdf/docx)' }, 400)
  }

  const maxSize = MAX_SIZES[kind]
  if (file.size > maxSize) {
    return c.json({ error: `文件超过大小限制（${Math.round(maxSize / 1024 / 1024)}MB）` }, 400)
  }

  const key = newObjectKey(dir, file.name)
  const contentType = EXT_TYPES[ext]
  await bucket.put(key, file.stream(), { httpMetadata: { contentType } })

  return c.json({
    data: {
      key,
      size: file.size,
      contentType,
      kind,
      url: '/api/files/' + key,
    },
  }, 201)
})

export default upload

type Env = {
  DB: D1Database
  JWT_SECRET: string
  BUCKET: R2Bucket
}
