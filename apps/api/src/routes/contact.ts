import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'

const contacts = new Hono<{ Bindings: Env }>()

contacts.post('/', async (c) => {
  const { name, contact, message } = await c.req.json()
  
  if (!name || !contact || !message) {
    return c.json({ error: '姓名、联系方式和留言不能为空' }, 400)
  }
  
  const db = c.env.DB
  const result = await db.prepare(
    'INSERT INTO contact_forms (name, contact, message) VALUES (?, ?, ?) RETURNING *'
  ).bind(name, contact, message).first()
  
  return c.json({ 
    success: true, 
    message: '提交成功，我们会尽快与您联系',
    data: result 
  }, 201)
})

contacts.get('/', authMiddleware, async (c) => {
  const db = c.env.DB
  const { results } = await db.prepare(
    'SELECT id, name, contact, message, notified, created_at FROM contact_forms ORDER BY created_at DESC'
  ).all()
  
  return c.json({ data: results })
})

export default contacts

type Env = {
  DB: D1Database
  WEBHOOK_URL: string
  JWT_SECRET: string
}