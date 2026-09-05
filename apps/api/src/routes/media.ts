import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'
import { isLocalKey } from '../lib/files'

const media = new Hono<{ Bindings: Env }>()

/** GET /api/media — 素材库对象列表（需登录），可按 dir 前缀过滤 */
media.get('/', authMiddleware, async (c) => {
  const dir = c.req.query('dir')
  const q = c.req.query('q')
  const bucket = c.env.BUCKET

  const prefix = dir && dir !== '全部' ? `${dir}/` : undefined
  const list: { key: string; size: number; uploaded: Date }[] = []
  let cursor: string | undefined

  do {
    const page = await bucket.list({
      limit: 1000,
      cursor,
      prefix,
    })
    page.objects.forEach((o) => {
      // 客户端按 dir 展示首段目录，这里顺带过滤非当前目录对象
      if (dir && dir !== '全部' && !o.key.startsWith(prefix!)) return
      list.push({ key: o.key, size: o.size, uploaded: o.uploaded })
    })
    cursor = page.truncated ? page.cursor : undefined
  } while (cursor)

  const kw = (q || '').trim().toLowerCase()
  const objects = kw
    ? list.filter((o) => o.key.toLowerCase().includes(kw))
    : list

  return c.json({ objects, count: objects.length })
})

/** DELETE /api/media — 删除单个 R2 对象（需登录，body: { key }） */
media.delete('/', authMiddleware, async (c) => {
  const { key } = await c.req.json()
  if (!isLocalKey(key)) {
    return c.json({ error: '文件路径不合法' }, 400)
  }

  const bucket = c.env.BUCKET
  await bucket.delete(key)
  return c.json({ success: true })
})

export default media

type Env = {
  DB: D1Database
  JWT_SECRET: string
  BUCKET: R2Bucket
}
