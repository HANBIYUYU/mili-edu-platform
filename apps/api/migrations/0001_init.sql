-- Migration: init
-- Created: 2026-07-20

CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS videos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  iframe_src TEXT NOT NULL,
  category TEXT DEFAULT '示范课堂',
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS materials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  file_key TEXT NOT NULL,
  file_type TEXT CHECK(file_type IN ('pdf','docx')) NOT NULL,
  file_size INTEGER,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS artworks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  child_name TEXT,
  media_type TEXT CHECK(media_type IN ('image','audio')) NOT NULL,
  file_key TEXT NOT NULL,
  thumbnail_key TEXT,
  category TEXT DEFAULT '未分类',
  sort_order INTEGER DEFAULT 0,
  authorization_status INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_forms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  message TEXT NOT NULL,
  notified INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_videos_sort ON videos(sort_order);
CREATE INDEX IF NOT EXISTS idx_materials_sort ON materials(sort_order);
CREATE INDEX IF NOT EXISTS idx_artworks_type ON artworks(media_type);
CREATE INDEX IF NOT EXISTS idx_artworks_sort ON artworks(sort_order);
CREATE INDEX IF NOT EXISTS idx_contact_forms_date ON contact_forms(created_at);