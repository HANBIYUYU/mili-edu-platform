import { jwtVerify } from 'jose'
import type { Context, Next } from 'hono'

export async function authMiddleware(c: Context, next: Next) {
  const token = c.req.header('Cookie')?.match(/token=([^;]+)/)?.[1]
  
  if (!token) {
    return c.json({ error: '请先登录' }, 401)
  }
  
  try {
    const secret = new TextEncoder().encode(c.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    c.set('user', payload)
    await next()
  } catch {
    return c.json({ error: '登录已过期，请重新登录' }, 401)
  }
}

type Env = {
  JWT_SECRET: string
}