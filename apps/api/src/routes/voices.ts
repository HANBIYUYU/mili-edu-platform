import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'
import { validateIframeSrc } from './videos'

const voices = new Hono<{ Bindings: Env }>()

voices.get('/', async (c) => {
  const mediaType = c.req.query('media_type')
  const category = c.req.query('category')
  const db = c.env.DB

  let sql = 'SELECT id, title, author, media_type, file_key, iframe_src, category, sort_order, created_at FROM voices WHERE 1=1'
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
    'SELECT id, title, author, media_type, file_key, iframe_src, category, sort_order, created_at FROM voices WHERE id = ?'
  ).bind(id).first()

  if (!result) {
    return c.json({ error: '内容不存在' }, 404)
  }

  return c.json({ data: result })
})

voices.post('/', authMiddleware, async (c) => {
  const { title, author, media_type, file_key, iframe_src, category } = await c.req.json()

  if (!title || !media_type) {
    return c.json({ error: '标题和媒体类型不能为空' }, 400)
  }

  if (!['image', 'video'].includes(media_type)) {
    return c.json({ error: '仅支持图片和视频' }, 400)
  }

  if (media_type === 'image' && !file_key) {
    return c.json({ error: '图片需要填写文件路径' }, 400)
  }

  if (media_type === 'video' && !iframe_src) {
    return c.json({ error: '视频需要填写嵌入代码' }, 400)
  }

  if (media_type === 'video' && !validateIframeSrc(iframe_src)) {
    return c.json({ error: '仅支持 B站、腾讯视频、YouTube 的嵌入代码' }, 400)
  }

  const db = c.env.DB
  const result = await db.prepare(
    'INSERT INTO voices (title, author, media_type, file_key, iframe_src, category) VALUES (?, ?, ?, ?, ?, ?) RETURNING *'
  ).bind(title, author || '', media_type, file_key || null, iframe_src || null, category || '儿童诗').first()

  return c.json({ data: result }, 201)
})

voices.put('/:id', authMiddleware, async (c) => {
  const id = c.req.param('id')
  const { title, author, media_type, file_key, iframe_src, category } = await c.req.json()

  if (media_type && !['image', 'video'].includes(media_type)) {
    return c.json({ error: '仅支持图片和视频' }, 400)
  }

  if (iframe_src && !validateIframeSrc(iframe_src)) {
    return c.json({ error: '仅支持白名单域名的嵌入代码' }, 400)
  }

  const db = c.env.DB
  const result = await db.prepare(
    'UPDATE voices SET title = COALESCE(?, title), author = COALESCE(?, author), media_type = COALESCE(?, media_type), file_key = COALESCE(?, file_key), iframe_src = COALESCE(?, iframe_src), category = COALESCE(?, category) WHERE id = ? RETURNING *'
  ).bind(title, author, media_type, file_key, iframe_src, category, id).first()

  if (!result) {
    return c.json({ error: '内容不存在' }, 404)
  }

  return c.json({ data: result })
})

voices.delete('/:id', authMiddleware, async (c) => {
  const id = c.req.param('id')
  const db = c.env.DB
  await db.prepare('DELETE FROM voices WHERE id = ?').bind(id).run()
  return c.json({ success: true })
})

export default voices

type Env = {
  DB: D1Database
  JWT_SECRET: string
}
