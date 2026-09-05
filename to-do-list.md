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
  - 颜色渐变链：暖黄(#EDCC80) → 米白(#FAF9F6) → 浅绿(#E8F5E9) → 暖绿(#C8E6C9) → 亮绿(#7CB342) → 橙黄渐变(#7CB342→#F5A623→#F5C76E)
  - TransparentNav（滚动毛玻璃态 + 移动端汉堡菜单）
  - FloatingNext 悬浮底部导航 pill（自动检测当前 section，最后一节变「返回起点」）
  - RevealWrapper 滚动渐入动画、CountUp 数字滚动
  - Footer（深色底 #2C3E50 + 管理入口）
  - Hero 暖黄渐变 + 光晕/光带动画 + 滚动弹跳提示
  - Section 间过渡带（absolute 定位，clamp(300px, 40vh, 600px) 高度）
- [x] 仪表盘真实数据 — `Dashboard.tsx` 并行请求 4 个 API
- [x] 删除二次确认 + 操作反馈 — `Popconfirm` + `message.success/error` 统一
- [x] 加载状态优化 — 前台 Section 从 `Spin` 升级为 `Skeleton` 骨架屏
- [x] 响应式优化 — 移动端间距/按钮/光晕/表单自适应，480px 下按钮全宽
- [x] 页面效果打磨 — BackToTop、Hero 装饰动画、滚动提示、双向渐入动画
- [x] **CSS 工具类提取** — section-header / section-title / section-desc / section-transition / section-link-light
- [x] **全局悬浮效果统一** — 所有可交互元素 hover 时 translateY(-2px) + 阴影
  - btn-primary / btn-secondary / section-link-light / glow-card
  - Materials 资料卡片、Contact 联系卡片、输入框、提交按钮
  - Footer 链接、Gallery 画展卡片
- [x] **独立详情页** — 5 个独立页面（About/Videos/Materials/Gallery/Contact）使用 PageLayout
  - 返回首页自动滚动到对应 section（backTo prop + hash 处理）
  - 进入独立页自动 scrollTo(0,0)
- [x] **真实文案替换** — About 页面和 Section 替换为真实内容（社团 2013 成立、六地实践基地、为爱助跑/蓝信封/童年一课等）
- [x] 路由调整 — 移除重定向，独立页面正式上线，hash 锚点导航
- [x] **视频详情页** — `/videos/:id` 独立播放页（P0），视频卡片改为跳转详情页播放，新增 `GET /api/videos/:id`
- [x] **童声童语模块** — 儿童诗/拼贴诗/心愿/留言（图片+视频）
  - 新表 `voices`（`0002_voices.sql`）+ `/api/voices` CRUD（视频复用 iframe 白名单校验）
  - 后台「童声童语管理」+ 仪表盘统计卡
  - 首页新 Section（推普资料↔儿童画展之间，中间绿 #AED581）+ 独立页 `/voices`（分类筛选 + 图片灯箱 + 视频弹窗）
- [x] 联系信息 — 邮箱 `SHU_MILIvolunteer@163.com`、地址上海市宝山区大场镇上大路99号上海大学，隐藏联系电话
- [x] 关于我们数据 — 统计改为 300+ 支教志愿者 / 7所 覆盖学校 / 2000+ 受益儿童
- [x] **支教拾光模块** — 首页 Hero 之下新 section（暖纸色 #F8EBD4），年份数字按时间顺序平铺，点击悬浮弹窗查看该年照片
  - 新表 `moments`（`0003_moments.sql`）+ `/api/moments` CRUD + 后台「支教拾光管理」+ 仪表盘统计卡
  - 无独立页面（按需求，悬浮查看即可）
- [x] 交互调整 — 首页视频恢复悬浮 Modal 播放（`/videos` 独立页卡片仍跳转详情页）
- [x] 导航修复 — section 高亮检测改为覆盖判断（修复短区块抢占高亮），导航加入「支教拾光」并改为紧凑布局
- [x] **R2 文件存储接入**（R2 已开通）
  - 云端：创建桶 `mili-edu-assets`，`wrangler.toml` 启用 `BUCKET` 绑定（顶层 + dev/production），恢复 `mili-edu.cn/api/*` Worker 域名路由
  - 后端：`POST /api/upload`（鉴权+类型/大小白名单）、`GET /api/files/*`（公开流式读取+下载）、`GET/DELETE /api/media`（素材库）、`GET /api/stats`（仪表盘）
  - 资源删除级联清理 R2 对象；`materials` 真实附件下载 + 自动读取文件大小；补 `materials/artworks` PUT 编辑
- [x] **后台管理平台重做**（参照 redo 设计模式）
  - 登录页 — 品牌渐变 + 表单内联错误提示 + 返回主页
  - `AdminLayout` — 分组菜单侧栏（内容管理/互动反馈/素材）、移动端顶栏+抽屉菜单
  - `Dashboard` — 统计卡 + 最新留言待办（未通知标记）+ 快捷入口
  - 通用 CRUD 引擎（`components/admin/AdminCrudPage.tsx`）— 搜索/列排序筛选/新增编辑删除/自动刷新
  - 素材库页 `/admin/media`（R2 图床）— 按目录上传、预览、复制 URL、删除、搜索
  - 各模块字段接入「素材库选择 + 实时预览」，替代手填 R2 路径
- [x] **前台真实展示** — 移除占位图标（🖼️/🎬/PictureOutlined）
  - Gallery 画展、Voices 童声童语（图片与独立页）、Moments 支教拾光（年份照片墙 + 单张放大）显示真实图片
  - Materials 下载按钮对接 R2 真实下载，列表显示文件大小
- [x] 线上部署与验证 — API + Web（Pages）已部署，mili-edu.cn 全链路（登录→上传→公网读取→删除）验证通过
- [x] **视频 R2 直传改造（不再用 B站）** — 示范视频 + 童声童语视频全部改 R2 直传 + HTML5 播放
  - 迁移 `0004_videos_file.sql`：videos 表新增 `file_key`
  - 上传白名单新增视频（mp4/webm/mov，目录 `videos/`，上限约 95MB）；`/api/files/*` 支持 `Range` 分段响应（拖动进度条必需）
  - 后端 videos/voices CRUD 改为要求 R2 视频 key，删除记录级联清理视频对象；移除 iframe 白名单校验
  - 后台「示范视频/童声童语」改为素材库选视频（含视频预览）；素材库支持上传/预览视频
  - 前台首页弹窗、视频详情页、童声童语视频弹窗改用 `<video controls>` 播放；旧 iframe 数据不再播放（后台显示「未上传」）
  - 本地 + 线上（mili-edu.cn）验证：上传 mp4 → Range 206 → 建记录 → 删除级联全通过

## 阻塞 🔒

| 事项 | 阻塞原因 |
|------|---------|
| 表单提交后企微通知 | 企微机器人密钥未配置（代码与 `WEBHOOK_URL`/`notified` 字段已就绪） |

## 页面效果打磨 🎨

- [ ] Gallery/Contact 独立页面纯 CSS 背景渐变（不带 PageLayout 的 #FAF9F6 底色）
- [ ] 独立页面 SEO meta 标签
- [ ] 页面加载进度条（NProgress 风格）
- [ ] Section 间过渡带更精细的颜色微调

## 进行中 / 待完成（需要你在 Cloudflare 提供密钥）

- [ ] **大文件直传启用（代码已上线，等 R2 API Token）**
  - [ ] 控制台 R2 → Manage R2 API Tokens → 创建（对象读/写，桶 mili-edu-assets），记录 Access Key ID / Secret / Account ID
  - [ ] 注入 secrets（可自执行，或把三值发给维护者代为注入）：
    - `pnpm --filter mili-edu-api exec wrangler secret put R2_ENDPOINT`（值：`https://<AccountID>.r2.cloudflarestorage.com`）
    - `pnpm --filter mili-edu-api exec wrangler secret put R2_ACCESS_KEY_ID`
    - `pnpm --filter mili-edu-api exec wrangler secret put R2_SECRET_ACCESS_KEY`
  - [ ] 用管理员登录后调用一次 `POST /api/upload-large/setup-cors`（开启浏览器直传 CORS）
  - [ ] 实测 ~800MB mp4 上传（后台素材库，自动分片 64MB×N 直传）

## 功能增强

- [x] 站内压缩指引 — 上传大视频提示中可打开 `/compress-guide`（源码 `video-compress-guide.md` / `apps/web/public/compress-guide.html`）
- [ ] 大文件直传实测（等 secrets）：`scripts/verify-direct-upload.ps1` 端到端验证

- [ ] 内容填充 — 后台上传真实素材（支教照片按年份 / 儿童画作 / 朗诵音频 / 推普 PDF）并替换种子数据
- [ ] 搜索功能 — 视频/资料关键词搜索
- [ ] 评论/点赞 — 视频和画展互动功能
- [ ] 数据导出 — 管理后台留言/统计导出 CSV
