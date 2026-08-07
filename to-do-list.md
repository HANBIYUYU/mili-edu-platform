# 米粒支教社 · 待办清单

## 已完成 ✅

- [x] 项目骨架（React + Vite + Hono + D1）
- [x] 数据库表结构
- [x] 基础 API（认证、视频、资料、画展、留言）
- [x] 本地开发环境跑通
- [x] 管理后台（登录、仪表盘、视频/资料/画展/留言管理）
- [x] 自定义域名 mili-edu.cn（Cloudflare Workers + Pages 同源部署）
- [x] 前台 UI 重构 — 多页改造为明亮温暖长滚动单页
  - 6 Section：Hero → About → Videos → Materials → Gallery → Contact
  - 品牌色 #6BAF92、辅助色 #F5A623、米白 #FAF9F6
  - TransparentNav（滚动玻璃态 + 移动端汉堡菜单）
  - RevealWrapper 滚动渐入动画、CountUp 数字滚动
  - Footer（深绿底 + 管理入口）
- [x] 仪表盘真实数据 — `Dashboard.tsx` 并行请求 4 个 API
- [x] 删除二次确认 + 操作反馈 — `Popconfirm` + `message.success/error` 统一
- [x] 加载状态优化 — 前台 Section 从 `Spin` 升级为 `Skeleton` 骨架屏
- [x] 响应式优化 — 移动端间距/按钮/光晕/表单自适应，480px 下按钮全宽
- [x] 页面效果打磨 — 回到顶部按钮、Hero 装饰动画、滚动提示、双向渐入动画
- [x] **Hero 配色修复** — 深绿渐变 → 暖黄渐变（#FFF8E7 → #F5D89A），文字联动改为深色
- [x] **导航栏配色联动** — 初始透明 + 深色文字，配合浅色 Hero
- [x] **Section 标题「了解更多」按钮** — 标题左 + 按钮右布局，点击跳转独立详情页
- [x] **Section 内容布局优化** — 加宽 Materials（800→1000）/ About（960→1100）容器，装饰分隔线
- [x] **独立详情页** — 5 个独立页面（About/Videos/Materials/Gallery/Contact）使用 PageLayout
  - AboutPage: 使命宣言 + 数据统计 + 发展历程 + 团队占位
  - VideosPage: 分类筛选 tabs + 视频网格 + Modal 播放
  - MaterialsPage: 类型筛选 + 文件列表 + 下载
  - GalleryPage: 图片网格 + Lightbox
  - ContactPage: 大表单 + 联系方式 + FAQ 占位
- [x] 路由调整 — 移除重定向，独立页面正式上线

## 阻塞 🔒

| 事项 | 阻塞原因 |
|------|---------|
| 图片/音频真实展示 | R2 未开通（外币卡） |
| 表单提交后企微通知 | 企微机器人密钥未配置 |

## 页面效果打磨 🎨

- [ ] 「了解更多」按钮 hover 动效增强
- [ ] Gallery/Contact 独立页面纯 CSS 背景渐变（不带 PageLayout 的 #FAF9F6 底色）
- [ ] 视频详情页 — `/videos/:id` 独立播放页（P0）
- [ ] 独立页面 SEO meta 标签
- [ ] 页面加载进度条（NProgress 风格）

## 功能增强

- [ ] 搜索功能 — 视频/资料关键词搜索
- [ ] 评论/点赞 — 视频和画展互动功能
- [ ] 数据导出 — 管理后台留言/统计导出 CSV
- [ ] 图片真实上传 — R2 开通后接入
