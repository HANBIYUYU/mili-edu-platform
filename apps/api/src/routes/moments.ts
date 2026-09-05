import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'
import { removeObject } from '../lib/files'

const moments = new Hono<{ Bindings: Env }>()

moments.get('/', async (c) => {
  const year = c.req.query('year')
  const db = c.env.DB

  let sql = 'SELECT id, year, title, file_key, thumbnail_key, sort_order, created_at FROM moments WHERE 1=1'
  const params: (string | number)[] = []

  if (year) {
    sql += ' AND year = ?'
    params.push(Number(year))
  }

  sql += ' ORDER BY year ASC, sort_order, created_at DESC'

  const { results } = await db.prepare(sql).bind(...params).all()
  return c.json({ data: results })
})

moments.get('/:id', async (c) => {
  const id = c.req.param('id')
  const db = c.env.DB
  const result = await db.prepare(
    'SELECT id, year, title, file_key, thumbnail_key, sort_order, created_at FROM moments WHERE id = ?'
  ).bind(id).first()

  if (!result) {
    return c.json({ error: '内容不存在' }, 404)
  }

  return c.json({ data: result })
})

moments.post('/', authMiddleware, async (c) => {
  const { year, title, file_key, thumbnail_key } = await c.req.json()

  if (!year || !file_key) {
    return c.json({ error: '年份和文件路径不能为空' }, 400)
  }

  if (!Number.isInteger(Number(year))) {
    return c.json({ error: '年份格式不正确' }, 400)
  }

  const db = c.env.DB
  const result = await db.prepare(
    'INSERT INTO moments (year, title, file_key, thumbnail_key) VALUES (?, ?, ?, ?) RETURNING *'
  ).bind(Number(year), title || '', file_key, thumbnail_key || null).first()

  return c.json({ data: result }, 201)
})

moments.put('/:id', authMiddleware, async (c) => {
  const id = c.req.param('id')
  const { year, title, file_key, thumbnail_key } = await c.req.json()

  if (year !== undefined && year !== null && !Number.isInteger(Number(year))) {
    return c.json({ error: '年份格式不正确' }, 400)
  }

  const db = c.env.DB
  const result = await db.prepare(
    'UPDATE moments SET year = COALESCE(?, year), title = COALESCE(?, title), file_key = COALESCE(?, file_key), thumbnail_key = COALESCE(?, thumbnail_key) WHERE id = ? RETURNING *'
  ).bind(year !== undefined && year !== null ? Number(year) : null, title, file_key, thumbnail_key, id).first()

  if (!result) {
    return c.json({ error: '内容不存在' }, 404)
  }

  return c.json({ data: result })
})

moments.delete('/:id', authMiddleware, async (c) => {
  const id = c.req.param('id')
  const db = c.env.DB
  const existing = await db.prepare('SELECT file_key, thumbnail_key FROM moments WHERE id = ?').bind(id).first()

  await db.prepare('DELETE FROM moments WHERE id = ?').bind(id).run()
  if (existing) {
    await removeObject(c.env.BUCKET, existing.file_key as string | null)
    if (existing.thumbnail_key && existing.thumbnail_key !== existing.file_key) {
      await removeObject(c.env.BUCKET, existing.thumbnail_key as string | null)
    }
  }

  return c.json({ success: true })
})

export default moments

type Env = {
  DB: D1Database
  JWT_SECRET: string
  BUCKET: R2Bucket
}
