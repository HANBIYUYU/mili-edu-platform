export interface Admin {
  id: number
  username: string
  password_hash: string
  created_at: string
}

export interface Video {
  id: number
  title: string
  iframe_src: string
  category: string
  sort_order: number
  created_at: string
}

export interface Material {
  id: number
  title: string
  file_key: string
  file_type: 'pdf' | 'docx'
  file_size: number
  description: string
  sort_order: number
  created_at: string
}

export interface Artwork {
  id: number
  title: string
  child_name: string
  media_type: 'image' | 'audio'
  file_key: string
  thumbnail_key: string | null
  category: string
  sort_order: number
  authorization_status: number
  created_at: string
}

export interface Voice {
  id: number
  title: string
  author: string
  media_type: 'image' | 'video'
  file_key: string | null
  iframe_src: string | null
  category: string
  sort_order: number
  created_at: string
}

export interface Moment {
  id: number
  year: number
  title: string
  file_key: string
  thumbnail_key: string | null
  sort_order: number
  created_at: string
}

export interface ContactForm {
  id: number
  name: string
  contact: string
  message: string
  notified: number
  created_at: string
}

export interface JWTPayload {
  sub: string
  username: string
  jti: string
  exp: number
}