import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'

const materials = new Hono<{ Bindings: Env }>()

materials.get('/', async (c) => {
  const db = c.env.DB
  const { results } = await db.prepare(
    'SELECT id, title, file_key, file_type, file_size, description, sort_order, created_at FROM materials ORDER BY sort_order, created_at DESC'
  ).all()
  
  return c.json({ data: results })
})

materials.post('/', authMiddleware, async (c) => {
  const { title, file_key, file_type, file_size, description } = await c.req.json()
  
  if (!title || !file_key || !file_type) {
    return c.json({ error: '标题、文件路径和类型不能为空' }, 400)
  }
  
  if (!['pdf', 'docx'].includes(file_type)) {
    return c.json({ error: '仅支持 PDF 和 Word 文档' }, 400)
  }
  
  const db = c.env.DB
  const result = await db.prepare(
    'INSERT INTO materials (title, file_key, file_type, file_size, description) VALUES (?, ?, ?, ?, ?) RETURNING *'
  ).bind(title, file_key, file_type, file_size || 0, description || '').first()
  
  return c.json({ data: result }, 201)
})

materials.delete('/:id', authMiddleware, async (c) => {
  const id = c.req.param('id')
  const db = c.env.DB
  await db.prepare('DELETE FROM materials WHERE id = ?').bind(id).run()
  return c.json({ success: true })
})

materials.get('/:id/download', async (c) => {
  const id = c.req.param('id')
  const db = c.env.DB
  const material = await db.prepare('SELECT * FROM materials WHERE id = ?').bind(id).first()
  
  if (!material) {
    return c.json({ error: '资料不存在' }, 404)
  }
  
  return c.json({ 
    message: '下载功能待 R2 开通后启用',
    file_key: material.file_key 
  })
})

export default materials

type Env = {
  DB: D1Database
  JWT_SECRET: string
}