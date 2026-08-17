import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/admin/login'
    }
    return Promise.reject(error.response?.data || error.message)
  }
)

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
  create: (data: any) => api.post('/materials', data),
  delete: (id: number) => api.delete(`/materials/${id}`),
  download: (id: number) => api.get(`/materials/${id}/download`),
}

export const artworkAPI = {
  list: (params?: { media_type?: string }) => api.get('/artworks', { params }),
  create: (data: any) => api.post('/artworks', data),
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
}