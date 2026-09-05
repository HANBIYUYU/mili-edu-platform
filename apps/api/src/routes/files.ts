import { Hono } from 'hono'
import { contentTypeOfKey } from '../lib/files'

const files = new Hono<{ Bindings: Env }>()

const PREFIX = '/api/files/'

function keyFromPath(path: string): string {
  if (!path.startsWith(PREFIX)) return ''
  const raw = path.slice(PREFIX.length)
  try {
    return raw.split('/').map((s) => decodeURIComponent(s)).join('/')
  } catch {
    return raw
  }
}

/**
 * GET /api/files/* — 公开读取 R2 对象（挂在 /api/files 前缀下）
 * 附带 Content-Type / Cache-Control；支持 Range（HTML5 视频拖动必需）；?download=1 时强制下载。
 */
files.get('/*', async (c) => {
  const key = keyFromPath(c.req.path)
  if (!key) {
    return c.json({ error: '缺少文件路径' }, 400)
  }

  const bucket = c.env.BUCKET
  const download = c.req.query('download') === '1'

  let object = await bucket.get(key)
  if (!object) {
    return c.json({ error: '文件不存在' }, 404)
  }

  const headers = new Headers()
  headers.set(
    'Content-Type',
    object.httpMetadata?.contentType || contentTypeOfKey(key) || 'application/octet-stream'
  )
  headers.set('Cache-Control', 'public, max-age=86400')
  headers.set('Accept-Ranges', 'bytes')

  // 仅非下载场景支持分段（浏览器播放/拖动）
  let status = 200
  const rangeHeader = c.req.header('range')
  if (!download && rangeHeader && object.size !== undefined) {
    const m = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader.trim())
    const size = object.size
    if (m && size > 0) {
      const start = m[1] ? parseInt(m[1], 10) : 0
      let end = m[2] ? parseInt(m[2], 10) : size - 1
      if (!Number.isFinite(start) || start >= size || start > end) {
        return c.json({ error: '范围无效' }, 416)
      }
      if (end >= size) end = size - 1
      const length = end - start + 1
      const partial = await bucket.get(key, { range: { offset: start, length } })
      if (partial) {
        object = partial
        status = 206
        headers.set('Content-Range', `bytes ${start}-${end}/${size}`)
        headers.set('Content-Length', String(length))
      }
    }
  }

  if (status === 200 && object.size !== undefined) {
    headers.set('Content-Length', String(object.size))
  }

  if (download) {
    const filename = key.split('/').pop() || 'download'
    headers.set(
      'Content-Disposition',
      `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`
    )
  }

  return new Response(object.body as ReadableStream, {
    status,
    headers,
  })
})

export default files

type Env = {
  BUCKET: R2Bucket
}
