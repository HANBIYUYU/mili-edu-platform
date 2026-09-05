import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'
import { removeObject } from '../lib/files'

const artworks = new Hono<{ Bindings: Env }>()

artworks.get('/', async (c) => {
  const mediaType = c.req.query('media_type')
  const db = c.env.DB

  let sql = 'SELECT id, title, child_name, media_type, file_key, thumbnail_key, category, sort_order, authorization_status, created_at FROM artworks WHERE 1=1'
  const params: (string | number)[] = []

  if (mediaType) {
    sql += ' AND media_type = ?'
    params.push(mediaType)
  }

  sql += ' ORDER BY sort_order, created_at DESC'

  const { results } = await db.prepare(sql).bind(...params).all()
  return c.json({ data: results })
})

artworks.get('/:id', async (c) => {
  const id = c.req.param('id')
  const db = c.env.DB
  const result = await db.prepare(
    'SELECT id, title, child_name, media_type, file_key, thumbnail_key, category, sort_order, authorization_status, created_at FROM artworks WHERE id = ?'
  ).bind(id).first()

  if (!result) {
    return c.json({ error: '作品不存在' }, 404)
  }

  return c.json({ data: result })
})

artworks.post('/', authMiddleware, async (c) => {
  const { title, child_name, media_type, file_key, thumbnail_key, category, authorization_status, sort_order } = await c.req.json()

  if (!title || !file_key || !media_type) {
    return c.json({ error: '标题、文件路径和媒体类型不能为空' }, 400)
  }

  if (!['image', 'audio'].includes(media_type)) {
    return c.json({ error: '仅支持图片和音频' }, 400)
  }

  const db = c.env.DB
  const result = await db.prepare(
    'INSERT INTO artworks (title, child_name, media_type, file_key, thumbnail_key, category, authorization_status, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING *'
  ).bind(title, child_name || '', media_type, file_key, thumbnail_key || null, category || '未分类', authorization_status || 0, sort_order || 0).first()

  return c.json({ data: result }, 201)
})

/** 全字段编辑 */
artworks.put('/:id', authMiddleware, async (c) => {
  const id = c.req.param('id')
  const { title, child_name, media_type, file_key, thumbnail_key, category, authorization_status, sort_order } = await c.req.json()

  if (media_type && !['image', 'audio'].includes(media_type)) {
    return c.json({ error: '仅支持图片和音频' }, 400)
  }

  const db = c.env.DB
  const result = await db.prepare(
    `UPDATE artworks SET
      title = COALESCE(?, title),
      child_name = COALESCE(?, child_name),
      media_type = COALESCE(?, media_type),
      file_key = COALESCE(?, file_key),
      thumbnail_key = COALESCE(?, thumbnail_key),
      category = COALESCE(?, category),
      authorization_status = COALESCE(?, authorization_status),
      sort_order = COALESCE(?, sort_order)
    WHERE id = ? RETURNING *`
  ).bind(
    title, child_name, media_type, file_key, thumbnail_key, category,
    authorization_status !== undefined && authorization_status !== null ? Number(authorization_status) : null,
    sort_order !== undefined && sort_order !== null ? Number(sort_order) : null,
    id
  ).first()

  if (!result) {
    return c.json({ error: '作品不存在' }, 404)
  }

  return c.json({ data: result })
})

artworks.delete('/:id', authMiddleware, async (c) => {
  const id = c.req.param('id')
  const db = c.env.DB
  const existing = await db.prepare('SELECT file_key, thumbnail_key FROM artworks WHERE id = ?').bind(id).first()

  await db.prepare('DELETE FROM artworks WHERE id = ?').bind(id).run()
  if (existing) {
    await removeObject(c.env.BUCKET, existing.file_key as string | null)
    if (existing.thumbnail_key && existing.thumbnail_key !== existing.file_key) {
      await removeObject(c.env.BUCKET, existing.thumbnail_key as string | null)
    }
  }

  return c.json({ success: true })
})

artworks.put('/:id/order', authMiddleware, async (c) => {
  const id = c.req.param('id')
  const { sort_order } = await c.req.json()

  const db = c.env.DB
  const result = await db.prepare(
    'UPDATE artworks SET sort_order = ? WHERE id = ? RETURNING *'
  ).bind(sort_order, id).first()

  if (!result) {
    return c.json({ error: '作品不存在' }, 404)
  }

  return c.json({ data: result })
})

export default artworks

type Env = {
  DB: D1Database
  JWT_SECRET: string
  BUCKET: R2Bucket
}
