import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'

const upload = new Hono<{ Bindings: Env }>()

upload.get('/presigned', authMiddleware, async (c) => {
  return c.json({ message: '预签名上传功能待 R2 开通后启用' })
})

export default upload

type Env = {
  JWT_SECRET: string
}