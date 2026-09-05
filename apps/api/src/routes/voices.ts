import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'
import { isLocalKey, removeObject } from '../lib/files'

const voices = new Hono<{ Bindings: Env }>()

voices.get('/', async (c) => {
  const mediaType = c.req.query('media_type')
  const category = c.req.query('category')
  const db = c.env.DB

  let sql = 'SELECT id, title, author, media_type, file_key, category, sort_order, created_at FROM voices WHERE 1=1'
  const params: (string | number)[] = []

  if (mediaType) {
    sql += ' AND media_type = ?'
    params.push(mediaType)
  }
  if (category) {
    sql += ' AND category = ?'
    params.push(category)
  }

  sql += ' ORDER BY sort_order, created_at DESC'

  const { results } = await db.prepare(sql).bind(...params).all()
  return c.json({ data: results })
})

voices.get('/:id', async (c) => {
  const id = c.req.param('id')
  const db = c.env.DB
  const result = await db.prepare(
    'SELECT id, title, author, media_type, file_key, category, sort_order, created_at FROM voices WHERE id = ?'
  ).bind(id).first()

  if (!result) {
    return c.json({ error: '内容不存在' }, 404)
  }

  return c.json({ data: result })
})

voices.post('/', authMiddleware, async (c) => {
  const { title, author, media_type, file_key, category, sort_order } = await c.req.json()

  if (!title || !media_type) {
    return c.json({ error: '标题和媒体类型不能为空' }, 400)
  }

  if (!['image', 'video'].includes(media_type)) {
    return c.json({ error: '仅支持图片和视频' }, 400)
  }

  if (!isLocalKey(file_key)) {
    return c.json({ error: media_type === 'image' ? '图片需要上传文件（R2 key）' : '视频需要上传文件（R2 key）' }, 400)
  }

  const db = c.env.DB
  const result = await db.prepare(
    'INSERT INTO voices (title, author, media_type, file_key, category, sort_order) VALUES (?, ?, ?, ?, ?, ?) RETURNING *'
  ).bind(title, author || '', media_type, file_key, category || '儿童诗', sort_order || 0).first()

  return c.json({ data: result }, 201)
})

voices.put('/:id', authMiddleware, async (c) => {
  const id = c.req.param('id')
  const { title, author, media_type, file_key, category, sort_order } = await c.req.json()

  if (media_type && !['image', 'video'].includes(media_type)) {
    return c.json({ error: '仅支持图片和视频' }, 400)
  }

  if (file_key !== undefined && !isLocalKey(file_key)) {
    return c.json({ error: '文件路径不合法' }, 400)
  }

  const db = c.env.DB
  const result = await db.prepare(
    `UPDATE voices SET
      title = COALESCE(?, title),
      author = COALESCE(?, author),
      media_type = COALESCE(?, media_type),
      file_key = COALESCE(?, file_key),
      category = COALESCE(?, category),
      sort_order = COALESCE(?, sort_order)
    WHERE id = ? RETURNING *`
  ).bind(
    title, author, media_type, file_key, category,
    sort_order !== undefined && sort_order !== null ? Number(sort_order) : null,
    id
  ).first()

  if (!result) {
    return c.json({ error: '内容不存在' }, 404)
  }

  return c.json({ data: result })
})

voices.delete('/:id', authMiddleware, async (c) => {
  const id = c.req.param('id')
  const db = c.env.DB
  const existing = await db.prepare('SELECT file_key FROM voices WHERE id = ?').bind(id).first()

  await db.prepare('DELETE FROM voices WHERE id = ?').bind(id).run()
  if (existing) {
    await removeObject(c.env.BUCKET, existing.file_key as string | null)
  }

  return c.json({ success: true })
})

export default voices

type Env = {
  DB: D1Database
  JWT_SECRET: string
  BUCKET: R2Bucket
}
