-- Migration: videos support R2 direct-upload files
-- 视频从 B站 iframe 改为 R2 直传（mp4/webm/mov），file_key 存 R2 对象 key
-- Created: 2026-09-01

ALTER TABLE videos ADD COLUMN file_key TEXT;
