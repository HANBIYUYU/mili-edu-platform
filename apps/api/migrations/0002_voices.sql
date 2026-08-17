-- Migration: voices
-- Created: 2026-08-13
-- 童声童语：孩子的儿童诗、拼贴诗、心愿、留言（图片或视频形式）

CREATE TABLE IF NOT EXISTS voices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT DEFAULT '',
  media_type TEXT CHECK(media_type IN ('image','video')) NOT NULL,
  file_key TEXT,
  iframe_src TEXT,
  category TEXT DEFAULT '儿童诗',
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_voices_sort ON voices(sort_order);
CREATE INDEX IF NOT EXISTS idx_voices_type ON voices(media_type);
