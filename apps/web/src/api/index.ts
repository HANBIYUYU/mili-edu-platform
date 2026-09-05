import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/admin/login'
    }
    return Promise.reject(error.response?.data || error.message)
  },
)

/**
 * 上传文件到 R2（multipart，携带登录 cookie）；返回 { key, size, contentType, url }
 * 基于 XMLHttpRequest，支持上传进度回调 onProgress(percent 0-100)
 */
export function uploadFile(
  file: File,
  dir: string,
  onProgress?: (percent: number) => void,
): Promise<{ key: string; size: number; contentType: string; kind?: string; url: string }> {
  return new Promise((resolve, reject) => {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('dir', dir)

    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/upload')
    xhr.withCredentials = true

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        const pct = Math.max(0, Math.min(100, Math.round((e.loaded / e.total) * 100)))
        onProgress(pct)
      }
    }

    xhr.onload = () => {
      let body: any = {}
      try { body = JSON.parse(xhr.responseText) } catch { /* ignore */ }
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(body.data)
        return
      }
      if (xhr.status === 401) {
        window.location.href = '/admin/login'
        return
      }
      reject(body || { error: `上传失败（HTTP ${xhr.status}）` })
    }
    xhr.onerror = () => reject({ error: '网络错误，上传失败' })
    xhr.ontimeout = () => reject({ error: '上传超时' })

    xhr.send(fd)
  })
}

export default api

export const authAPI = {
  login: (data: { username: string; password: string }) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
}

export const videoAPI = {
  list: () => api.get('/videos'),
  get: (id: number | string) => api.get(`/videos/${id}`),
  create: (data: any) => api.post('/videos', data),
  update: (id: number, data: any) => api.put(`/videos/${id}`, data),
  delete: (id: number) => api.delete(`/videos/${id}`),
}

export const materialAPI = {
  list: () => api.get('/materials'),
  get: (id: number | string) => api.get(`/materials/${id}`),
  create: (data: any) => api.post('/materials', data),
  update: (id: number, data: any) => api.put(`/materials/${id}`, data),
  delete: (id: number) => api.delete(`/materials/${id}`),
  download: (id: number) => api.get(`/materials/${id}/download`, { responseType: 'blob' }),
  /** 直接触发浏览器下载的地址（新开标签） */
  downloadUrl: (id: number | string) => `/api/materials/${id}/download`,
}

export const artworkAPI = {
  list: (params?: { media_type?: string }) => api.get('/artworks', { params }),
  get: (id: number | string) => api.get(`/artworks/${id}`),
  create: (data: any) => api.post('/artworks', data),
  update: (id: number, data: any) => api.put(`/artworks/${id}`, data),
  delete: (id: number) => api.delete(`/artworks/${id}`),
  updateOrder: (id: number, sort_order: number) => api.put(`/artworks/${id}/order`, { sort_order }),
}

export const voiceAPI = {
  list: (params?: { media_type?: string; category?: string }) => api.get('/voices', { params }),
  get: (id: number | string) => api.get(`/voices/${id}`),
  create: (data: any) => api.post('/voices', data),
  update: (id: number, data: any) => api.put(`/voices/${id}`, data),
  delete: (id: number) => api.delete(`/voices/${id}`),
}

export const momentAPI = {
  list: (params?: { year?: number }) => api.get('/moments', { params }),
  get: (id: number | string) => api.get(`/moments/${id}`),
  create: (data: any) => api.post('/moments', data),
  update: (id: number, data: any) => api.put(`/moments/${id}`, data),
  delete: (id: number) => api.delete(`/moments/${id}`),
}

export const contactAPI = {
  submit: (data: { name: string; contact: string; message: string }) => api.post('/contact-forms', data),
  list: () => api.get('/contact-forms'),
  delete: (id: number) => api.delete(`/contact-forms/${id}`),
}

export const statsAPI = {
  overview: () => api.get('/stats'),
}

export const mediaAPI = {
  list: (params?: { dir?: string; q?: string }) => api.get('/media', { params }),
  remove: (key: string) => api.delete('/media', { data: { key } }),
  upload: uploadFile,
}
