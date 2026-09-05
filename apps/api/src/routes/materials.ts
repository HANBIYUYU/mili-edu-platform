import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'
import { contentTypeOfKey, extOf, sizeOfKey, toR2Key } from '../lib/files'

const materials = new Hono<{ Bindings: Env }>()

materials.get('/', async (c) => {
  const db = c.env.DB
  const { results } = await db.prepare(
    'SELECT id, title, file_key, file_type, file_size, description, sort_order, created_at FROM materials ORDER BY sort_order, created_at DESC'
  ).all()

  return c.json({ data: results })
})

materials.get('/:id', async (c) => {
  const id = c.req.param('id')
  const db = c.env.DB
  const result = await db.prepare(
    'SELECT id, title, file_key, file_type, file_size, description, sort_order, created_at FROM materials WHERE id = ?'
  ).bind(id).first()

  if (!result) {
    return c.json({ error: '资料不存在' }, 404)
  }

  return c.json({ data: result })
})

materials.post('/', authMiddleware, async (c) => {
  const { title, file_key, file_type, file_size, description, sort_order } = await c.req.json()

  if (!title || !file_key || !file_type) {
    return c.json({ error: '标题、文件路径和类型不能为空' }, 400)
  }

  if (!['pdf', 'docx'].includes(file_type)) {
    return c.json({ error: '仅支持 PDF 和 Word 文档' }, 400)
  }

  const db = c.env.DB
  const head = typeof file_size === 'number' && file_size > 0
    ? file_size
    : (await sizeOfKey(c.env.BUCKET, file_key)) ?? 0
  const result = await db.prepare(
    'INSERT INTO materials (title, file_key, file_type, file_size, description, sort_order) VALUES (?, ?, ?, ?, ?, ?) RETURNING *'
  ).bind(title, file_key, file_type, head, description || '', sort_order || 0).first()

  return c.json({ data: result }, 201)
})

materials.put('/:id', authMiddleware, async (c) => {
  const id = c.req.param('id')
  const { title, file_key, file_type, file_size, description, sort_order } = await c.req.json()

  if (file_type && !['pdf', 'docx'].includes(file_type)) {
    return c.json({ error: '仅支持 PDF 和 Word 文档' }, 400)
  }

  const db = c.env.DB
  const finalSize = typeof file_size === 'number' && file_size > 0
    ? file_size
    : file_key
      ? ((await sizeOfKey(c.env.BUCKET, file_key)) ?? null)
      : null
  const result = await db.prepare(
    `UPDATE materials SET
      title = COALESCE(?, title),
      file_key = COALESCE(?, file_key),
      file_type = COALESCE(?, file_type),
      file_size = COALESCE(?, file_size),
      description = COALESCE(?, description),
      sort_order = COALESCE(?, sort_order)
    WHERE id = ? RETURNING *`
  ).bind(
    title, file_key, file_type, finalSize,
    description, sort_order !== undefined && sort_order !== null ? Number(sort_order) : null,
    id
  ).first()

  if (!result) {
    return c.json({ error: '资料不存在' }, 404)
  }

  return c.json({ data: result })
})

materials.delete('/:id', authMiddleware, async (c) => {
  const id = c.req.param('id')
  const db = c.env.DB
  // 只删数据库记录；R2 素材为素材库公共资产，不随内容删除自动清理
  await db.prepare('DELETE FROM materials WHERE id = ?').bind(id).run()
  return c.json({ success: true })
})

/** GET /:id/download — 从 R2 流式返回文件（附件下载） */
materials.get('/:id/download', async (c) => {
  const id = c.req.param('id')
  const db = c.env.DB
  const material = await db.prepare('SELECT * FROM materials WHERE id = ?').bind(id).first()

  if (!material) {
    return c.json({ error: '资料不存在' }, 404)
  }

  const r2Key = toR2Key(material.file_key as string)
  if (!r2Key) {
    return c.json({ error: '该资料文件不是本站存储（或未在后台重新上传），无法下载' }, 404)
  }

  const bucket = c.env.BUCKET
  const object = await bucket.get(r2Key)

  if (!object) {
    return c.json({ error: '文件尚未上传到存储，请联系管理员在后台重新上传', file_key: material.file_key }, 404)
  }

  const ext = extOf(r2Key) || (material.file_type === 'pdf' ? '.pdf' : '.docx')
  const headers = new Headers()
  headers.set('Content-Type', object.httpMetadata?.contentType || contentTypeOfKey(r2Key))
  headers.set('Cache-Control', 'public, max-age=3600')
  if (object.size !== undefined) headers.set('Content-Length', String(object.size))
  headers.set(
    'Content-Disposition',
    `attachment; filename*=UTF-8''${encodeURIComponent((material.title as string) + ext)}`
  )

  return new Response(object.body as ReadableStream, { headers })
})

export default materials

type Env = {
  DB: D1Database
  JWT_SECRET: string
  BUCKET: R2Bucket
}
