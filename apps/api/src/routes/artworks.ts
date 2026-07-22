import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'

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

artworks.post('/', authMiddleware, async (c) => {
  const { title, child_name, media_type, file_key, thumbnail_key, category, authorization_status } = await c.req.json()
  
  if (!title || !file_key || !media_type) {
    return c.json({ error: '标题、文件路径和媒体类型不能为空' }, 400)
  }
  
  if (!['image', 'audio'].includes(media_type)) {
    return c.json({ error: '仅支持图片和音频' }, 400)
  }
  
  const db = c.env.DB
  const result = await db.prepare(
    'INSERT INTO artworks (title, child_name, media_type, file_key, thumbnail_key, category, authorization_status) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *'
  ).bind(title, child_name || '', media_type, file_key, thumbnail_key || null, category || '未分类', authorization_status || 0).first()
  
  return c.json({ data: result }, 201)
})

artworks.delete('/:id', authMiddleware, async (c) => {
  const id = c.req.param('id')
  const db = c.env.DB
  await db.prepare('DELETE FROM artworks WHERE id = ?').bind(id).run()
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
}