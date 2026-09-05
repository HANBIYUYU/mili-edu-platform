import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import authRoutes from './routes/auth'
import videoRoutes from './routes/videos'
import materialRoutes from './routes/materials'
import artworkRoutes from './routes/artworks'
import voiceRoutes from './routes/voices'
import momentRoutes from './routes/moments'
import contactRoutes from './routes/contact'
import uploadRoutes from './routes/upload'
import uploadLargeRoutes from './routes/upload-large'
import uploadChunkRoutes from './routes/upload-chunk'
import fileRoutes from './routes/files'
import mediaRoutes from './routes/media'
import statsRoutes from './routes/stats'

const app = new Hono<{ Bindings: Env }>()

app.use('*', logger())
app.use('*', cors({
  origin: [
    'http://localhost:5173',
    'https://mili-edu.cn',
    'https://www.mili-edu.cn',
  ],
  credentials: true,
}))

app.get('/', (c) => c.json({ 
  message: '米粒支教社 API',
  version: '1.0.0',
  status: 'running'
}))

app.route('/api/auth', authRoutes)
app.route('/api/videos', videoRoutes)
app.route('/api/materials', materialRoutes)
app.route('/api/artworks', artworkRoutes)
app.route('/api/voices', voiceRoutes)
app.route('/api/moments', momentRoutes)
app.route('/api/contact-forms', contactRoutes)
app.route('/api/upload', uploadRoutes)
app.route('/api/upload-large', uploadLargeRoutes)
app.route('/api/upload-chunk', uploadChunkRoutes)
app.route('/api/files', fileRoutes)
app.route('/api/media', mediaRoutes)
app.route('/api/stats', statsRoutes)

app.onError((err, c) => {
  console.error(err)
  return c.json({ error: 'Internal Server Error', message: err.message }, 500)
})

app.notFound((c) => c.json({ error: 'Not Found' }, 404))

export default app

type Env = {
  DB: D1Database
  WEBHOOK_URL: string
  JWT_SECRET: string
  BUCKET: R2Bucket
  // 大文件 S3 直传密钥（可选；由 wrangler secret 注入）
  R2_ENDPOINT?: string
  R2_ACCESS_KEY_ID?: string
  R2_SECRET_ACCESS_KEY?: string
}