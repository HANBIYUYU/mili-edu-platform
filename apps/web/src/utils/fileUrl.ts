/** R2 key / URL 统一转可访问地址；图片/音频/视频/文档类型判断 */

/** DB 中存的 file_key（R2 对象 key）或外链 → 可直接用于 <img>/<video>/下载 的 URL */
export const fileUrl = (key?: string | null): string => {
  if (!key) return ''
  // 已是完整外链或站内路径，原样返回
  if (/^https?:\/\//i.test(key) || key.startsWith('/')) return key
  return '/api/files/' + key.split('/').map(encodeURIComponent).join('/')
}

/** 把可能带 /api/files/ 前缀的值（如从素材库复制的 URL）归一化为纯 R2 key */
export const normalizeFileKey = (value: string): string => {
  const marker = '/api/files/'
  const idx = value.indexOf(marker)
  let s = idx >= 0 ? value.slice(idx + marker.length) : value
  s = s.trim().replace(/^\/+/, '')
  return s
}

export const isImageKey = (k: string): boolean => /\.(jpe?g|png|webp|gif)$/i.test(k)
export const isAudioKey = (k: string): boolean => /\.(mp3|wav|m4a|aac)$/i.test(k)
export const isVideoKey = (k: string): boolean => /\.(mp4|webm|mov)$/i.test(k)
export const isDocKey = (k: string): boolean => /\.(pdf|docx)$/i.test(k)

export const mediaKindOf = (k?: string | null): 'image' | 'audio' | 'video' | 'doc' | 'other' => {
  if (!k) return 'other'
  if (isImageKey(k)) return 'image'
  if (isAudioKey(k)) return 'audio'
  if (isVideoKey(k)) return 'video'
  if (isDocKey(k)) return 'doc'
  return 'other'
}

export const dirOfKey = (k: string): string =>
  k.includes('/') ? k.split('/')[0] : '其他'

export const fmtSize = (n?: number | null): string => {
  if (!n) return '-'
  if (n >= 1048576) return (n / 1048576).toFixed(1) + ' MB'
  if (n >= 1024) return Math.round(n / 1024) + ' KB'
  return n + ' B'
}
