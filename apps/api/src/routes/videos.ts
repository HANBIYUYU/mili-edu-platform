import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'

const videos = new Hono<{ Bindings: Env }>()

const ALLOWED_DOMAINS = [
  'player.bilibili.com',
  'v.qq.com',
  'www.youtube.com',
]

function validateIframeSrc(src: string): boolean {
  try {
    const url = new URL(src.startsWith('//') ? 'https:' + src : src)
    return ALLOWED_DOMAINS.some(d => url.hostname === d || url.hostname.endsWith('.' + d))
  } catch {
    return false
  }
}

videos.get('/', async (c) => {
  const db = c.env.DB
  const { results } = await db.prepare(
    'SELECT id, title, iframe_src, category, sort_order, created_at FROM videos ORDER BY sort_order, created_at DESC'
  ).all()
  
  return c.json({ data: results })
})

videos.post('/', authMiddleware, async (c) => {
  const { title, iframe_src, category = '示范课堂' } = await c.req.json()
  
  if (!title || !iframe_src) {
    return c.json({ error: '标题和嵌入代码不能为空' }, 400)
  }
  
  if (!validateIframeSrc(iframe_src)) {
    return c.json({ error: '仅支持 B站、腾讯视频、YouTube 的嵌入代码' }, 400)
  }
  
  const db = c.env.DB
  const result = await db.prepare(
    'INSERT INTO videos (title, iframe_src, category) VALUES (?, ?, ?) RETURNING *'
  ).bind(title, iframe_src, category).first()
  
  return c.json({ data: result }, 201)
})

videos.put('/:id', authMiddleware, async (c) => {
  const id = c.req.param('id')
  const { title, iframe_src, category } = await c.req.json()
  
  if (iframe_src && !validateIframeSrc(iframe_src)) {
    return c.json({ error: '仅支持白名单域名的嵌入代码' }, 400)
  }
  
  const db = c.env.DB
  const result = await db.prepare(
    'UPDATE videos SET title = COALESCE(?, title), iframe_src = COALESCE(?, iframe_src), category = COALESCE(?, category) WHERE id = ? RETURNING *'
  ).bind(title, iframe_src, category, id).first()
  
  if (!result) {
    return c.json({ error: '视频不存在' }, 404)
  }
  
  return c.json({ data: result })
})

videos.delete('/:id', authMiddleware, async (c) => {
  const id = c.req.param('id')
  const db = c.env.DB
  await db.prepare('DELETE FROM videos WHERE id = ?').bind(id).run()
  return c.json({ success: true })
})

export default videos

type Env = {
  DB: D1Database
  JWT_SECRET: string
}