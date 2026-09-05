/** R2 文件上传/读取的公共工具（键命名、类型白名单、级联删除） */

/** 允许直传的顶层目录（后台素材库按此分组） */
export const ALLOWED_DIRS = [
  'videos',     // 课程/童声视频（mp4/webm/mov）
  'docs',       // 推普资料（pdf/docx）
  'artworks',   // 儿童画展图片
  'audios',     // 朗诵音频
  'voices',     // 童声童语配图
  'moments',    // 支教拾光照片
  'images',     // 通用图片
  'misc',       // 其他
] as const

export const DIR_HINTS: Record<string, string> = {
  videos: '视频',
  docs: '推普资料',
  artworks: '儿童画展',
  audios: '朗诵音频',
  voices: '童声童语配图',
  moments: '支教拾光照片',
  images: '通用图片',
  misc: '其他',
}

/** 扩展名 → Content-Type 白名单 */
export const EXT_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.m4a': 'audio/mp4',
  '.aac': 'audio/aac',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

/** 各类别大小上限（字节）；视频经 Worker 代理上传，受 Workers 请求体上限（约 100MB）约束 */
export const MAX_SIZES: Record<string, number> = {
  image: 15 * 1024 * 1024,
  audio: 60 * 1024 * 1024,
  doc: 30 * 1024 * 1024,
  video: 95 * 1024 * 1024,
}

/** 文件类型分组 */
export type FileKind = 'image' | 'audio' | 'doc' | 'video'

export function extOf(name: string): string {
  const i = name.lastIndexOf('.')
  if (i < 0) return ''
  return name.slice(i).toLowerCase()
}

export function kindOfExt(ext: string): FileKind | null {
  if (/^\.(jpe?g|png|webp|gif)$/.test(ext)) return 'image'
  if (/^\.(mp3|wav|m4a|aac)$/.test(ext)) return 'audio'
  if (/^\.(mp4|webm|mov)$/.test(ext)) return 'video'
  if (/^\.(pdf|docx)$/.test(ext)) return 'doc'
  return null
}

export function contentTypeOfKey(key: string): string {
  return EXT_TYPES[extOf(key)] || 'application/octet-stream'
}

/** DB 里存的 key 是否为 R2 本地对象（外链 URL 则不级联删除） */
export function isLocalKey(key: string | null | undefined): key is string {
  return !!key && !/^https?:\/\//i.test(key)
}

/**
 * 归一化 DB 里存的 file_key/thumbnail_key → R2 对象 key。
 * 兼容三种写法：原始 key（docs/202609/x.pdf）、站内路径（/api/files/docs/...）、
 * 完整站内地址（https://mili-edu.cn/api/files/docs/...）。
 * 返回 null 表示不是本桶对象（如站外 http 链接）。
 */
export function toR2Key(value: string | null | undefined): string | null {
  if (!value) return null
  let s = String(value).trim()
  const marker = '/api/files/'
  const idx = s.indexOf(marker)
  if (idx >= 0) {
    s = s.slice(idx + marker.length)
  }
  s = s.replace(/^\/+/, '')
  if (!s) return null
  // 去掉 /api/files 后若仍是外部完整地址（非本桶路径）则视为外链
  if (/^https?:\/\//i.test(s)) return null
  try {
    return s.split('/').map((seg) => decodeURIComponent(seg)).join('/')
  } catch {
    return s
  }
}

/** 生成防覆盖的新对象 key：{dir}/{yyyyMM}/{uuid}{ext}，全 ASCII */
export function newObjectKey(dir: string, originalName: string): string {
  const ext = extOf(originalName) || ''
  const now = new Date()
  const ym = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`
  return `${dir}/${ym}/${crypto.randomUUID()}${ext}`
}

/** 级联删除：资源记录删除时顺带清理 R2 对象（best effort，只处理本地 key） */
export async function removeObject(bucket: R2Bucket, key: string | null | undefined): Promise<void> {
  const r2Key = toR2Key(key)
  if (!r2Key) return
  try {
    await bucket.delete(r2Key)
  } catch (e) {
    console.error(`R2 delete failed: ${key}`, e)
  }
}

/** 查询对象大小（仅本地 key；失败返回 null） */
export async function sizeOfKey(bucket: R2Bucket, key: string | null | undefined): Promise<number | null> {
  const r2Key = toR2Key(key)
  if (!r2Key) return null
  try {
    const o = await bucket.head(r2Key)
    return o?.size ?? null
  } catch (e) {
    console.error(`R2 head failed: ${key}`, e)
    return null
  }
}
