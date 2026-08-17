-- Migration: moments
-- Created: 2026-08-13
-- 支教拾光：按年份归档的支教影像（图片形式，R2 开通前 file_key 为占位路径）

CREATE TABLE IF NOT EXISTS moments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  year INTEGER NOT NULL,
  title TEXT DEFAULT '',
  file_key TEXT NOT NULL,
  thumbnail_key TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_moments_year ON moments(year);
CREATE INDEX IF NOT EXISTS idx_moments_sort ON moments(sort_order);
