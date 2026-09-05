import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'

const stats = new Hono<{ Bindings: Env }>()

/** GET /api/stats — 后台仪表盘汇总（各表数量 + 最近留言） */
stats.get('/', authMiddleware, async (c) => {
  const db = c.env.DB
  const tables = ['videos', 'materials', 'artworks', 'voices', 'moments', 'contact_forms'] as const

  const counts: Record<string, number> = {}
  for (const t of tables) {
    const row = await db.prepare(`SELECT COUNT(*) AS n FROM ${t}`).first<{ n: number }>()
    counts[t] = row?.n || 0
  }

  const unnotified = await db.prepare('SELECT COUNT(*) AS n FROM contact_forms WHERE notified = 0')
    .first<{ n: number }>()
  const recent = await db.prepare(
    'SELECT id, name, contact, message, notified, created_at FROM contact_forms ORDER BY created_at DESC LIMIT 5'
  ).all()

  return c.json({
    counts,
    unnotified: unnotified?.n || 0,
    recentMessages: recent.results || [],
  })
})

export default stats

type Env = {
  DB: D1Database
  JWT_SECRET: string
}
