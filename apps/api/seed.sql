-- Seed: initial admin
-- 默认密码: mili2026 (请在首次登录后修改)
-- 注意：下面的 hash 是占位符，需要用 bcrypt 生成真实的
INSERT OR IGNORE INTO admins (username, password_hash) 
VALUES ('admin', '$2a$10$YourBcryptHashHere');

INSERT OR IGNORE INTO videos (title, iframe_src, category, sort_order) VALUES
('2026暑期支教总结', '//player.bilibili.com/player.html?bvid=BV1xx411c7mD', '总结视频', 1),
('普通话示范课：声母教学', '//player.bilibili.com/player.html?bvid=BV1yy411c7mE', '示范课堂', 2);

INSERT OR IGNORE INTO materials (title, file_key, file_type, file_size, description, sort_order) VALUES
('推普教案模板v1', 'docs/template-v1.pdf', 'pdf', 1024000, '普通话教学教案模板', 1),
('儿童朗诵指导手册', 'docs/recite-guide.pdf', 'pdf', 2048000, '朗诵技巧与指导方法', 2);

INSERT OR IGNORE INTO artworks (title, child_name, media_type, file_key, thumbnail_key, category, sort_order, authorization_status) VALUES
('我的普通话梦', '小明', 'image', 'images/artwork-1.jpg', 'thumbs/artwork-1.jpg', '美术作品', 1, 1),
('春天在哪里', '小红', 'audio', 'audios/recite-1.mp3', NULL, '朗诵作品', 2, 1);