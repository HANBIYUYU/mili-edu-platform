import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'
import { isLocalKey, removeObject } from '../lib/files'

const videos = new Hono<{ Bindings: Env }>()

videos.get('/', async (c) => {
  const db = c.env.DB
  const { results } = await db.prepare(
    'SELECT id, title, file_key, category, sort_order, created_at FROM videos ORDER BY sort_order, created_at DESC'
  ).all()

  return c.json({ data: results })
})

videos.get('/:id', async (c) => {
  const id = c.req.param('id')
  const db = c.env.DB
  const result = await db.prepare(
    'SELECT id, title, file_key, category, sort_order, created_at FROM videos WHERE id = ?'
  ).bind(id).first()

  if (!result) {
    return c.json({ error: '视频不存在' }, 404)
  }

  return c.json({ data: result })
})

/** 新增：视频文件直接传 R2，file_key 存 R2 对象 key */
videos.post('/', authMiddleware, async (c) => {
  const { title, file_key, category = '示范课堂', sort_order } = await c.req.json()

  if (!title) {
    return c.json({ error: '视频标题不能为空' }, 400)
  }
  if (!isLocalKey(file_key)) {
    return c.json({ error: '请先上传视频文件（R2 key）' }, 400)
  }

  const db = c.env.DB
  const result = await db.prepare(
    `INSERT INTO videos (title, file_key, iframe_src, category, sort_order)
     VALUES (?, ?, '', ?, ?) RETURNING *`
  ).bind(title, file_key, category, sort_order || 0).first()

  return c.json({ data: result }, 201)
})

videos.put('/:id', authMiddleware, async (c) => {
  const id = c.req.param('id')
  const { title, file_key, category, sort_order } = await c.req.json()

  if (file_key !== undefined && !isLocalKey(file_key)) {
    return c.json({ error: '文件路径不合法' }, 400)
  }

  const db = c.env.DB
  const result = await db.prepare(
    `UPDATE videos SET
      title = COALESCE(?, title),
      file_key = COALESCE(?, file_key),
      category = COALESCE(?, category),
      sort_order = COALESCE(?, sort_order)
    WHERE id = ? RETURNING *`
  ).bind(
    title, file_key, category,
    sort_order !== undefined && sort_order !== null ? Number(sort_order) : null,
    id
  ).first()

  if (!result) {
    return c.json({ error: '视频不存在' }, 404)
  }

  return c.json({ data: result })
})

videos.delete('/:id', authMiddleware, async (c) => {
  const id = c.req.param('id')
  const db = c.env.DB
  const existing = await db.prepare('SELECT file_key FROM videos WHERE id = ?').bind(id).first()

  await db.prepare('DELETE FROM videos WHERE id = ?').bind(id).run()
  if (existing) {
    await removeObject(c.env.BUCKET, existing.file_key as string | null)
  }

  return c.json({ success: true })
})

export default videos

type Env = {
  DB: D1Database
  JWT_SECRET: string
  BUCKET: R2Bucket
}
