# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

米粒支教社 · 推普融合实践项目 — 面向"知行杯"暑期社会实践的公益网站。包含公开的前台页面（首页、项目介绍、示范课程视频、推普资料下载、儿童画展、联系表单）和管理后台（视频/资料/画展/留言的 CRUD）。

## 技术栈与开发命令

Monorepo 使用 pnpm workspaces（`apps/*`）。

```bash
# 安装依赖
pnpm install

# 开发
pnpm dev:api          # API — Wrangler + Hono，端口 8787
pnpm dev:web          # Web — Vite，端口 5173

# 数据库（操作 Cloudflare D1 本地模拟实例）
pnpm db:migrate       # 运行迁移（创建表）
pnpm db:seed          # 填充种子数据

# 部署
pnpm deploy:api       # wrangler deploy
pnpm deploy:web       # 构建后 wrangler pages deploy dist

# 清理
pnpm clean            # 删除所有 node_modules
```

`pnpm dev:api` 和 `pnpm dev:web` 需要同时运行才能本地开发。Web 开发服务器通过 Vite proxy 将 `/api` 请求代理到 `localhost:8787`。

## 架构

### API（`apps/api`）— Cloudflare Workers + Hono + D1

- 入口：`apps/api/src/index.ts` — 创建 Hono app，注册全局中间件（`logger`、`cors`）和路由，配置错误处理。
- 所有路由挂载在 `/api` 前缀下：`auth`、`videos`、`materials`、`artworks`、`voices`、`moments`、`contact-forms`、`upload`。
- **认证**：JWT（`jose` 库），通过 httpOnly cookie（`token`）传递。`authMiddleware`（`src/middleware/auth.ts`）验证 cookie 中的 JWT 并设置 `c.set('user', payload)`。仅对写操作（POST/PUT/DELETE）要求认证；公开的 GET 端点无需认证。
- **数据库**：Cloudflare D1，通过 `c.env.DB` 访问。SQLite 语法。Migration 文件在 `apps/api/migrations/`。类型定义在 `apps/api/src/types.ts`。
- **环境变量**：`WEBHOOK_URL`（企微机器人 webhook，当前为空字符串）、`JWT_SECRET`（开发默认值，生产环境务必修改）。
- R2 存储和 KV 命名空间在 `wrangler.toml` 中已注释 — 等待支付方式开通后启用。在此之前，文件上传/下载 API 返回 stub 响应。

### Web（`apps/web`）— React + Vite + Ant Design + React Router

- 入口：`apps/web/src/main.tsx` — React 18、BrowserRouter、Ant Design ConfigProvider（中文语言包，主题色 `#6BAF92`）。
- 路由定义在 `apps/web/src/App.tsx`：
  - 前台：`/`（Home 长滚动单页）、`/about`、`/videos`、`/videos/:id`（视频详情页）、`/materials`、`/voices`（童声童语）、`/gallery`、`/contact`（重定向到 `/#contact`）
  - 后台：`/admin` → `AdminLayout`，包含 login、dashboard、videos、materials、gallery、voices、moments、contacts
- API 客户端：`apps/web/src/api/index.ts` — axios 实例，baseURL 默认为 `/api`，`withCredentials: true`。401 响应自动重定向到 `/admin/login`。

### 前台组件结构

```
Home.tsx                        ← 长滚动单页
├── TransparentNav.tsx          ← 固定顶部导航（初始透明 → 滚动后毛玻璃米白）
├── sections/HeroSection.tsx    ← 暖黄渐变 Hero、装饰光晕/光带、滚动弹跳提示
├── sections/MomentsSection.tsx ← 暖纸色底、支教拾光、年份数字平铺 + 悬浮弹窗看照片
├── sections/AboutSection.tsx   ← 米白底、使命文案、统计卡片
├── sections/VideosSection.tsx  ← 浅绿底、视频卡片网格、Modal 悬浮播放（独立页 /videos 卡片跳详情页）
├── sections/MaterialsSection.tsx ← 暖绿底、资料列表、下载按钮
├── sections/VoicesSection.tsx  ← 中间绿底、童声童语卡片网格、图片灯箱/视频弹窗
├── sections/GallerySection.tsx ← 亮绿底、画展网格、Lightbox
├── sections/ContactSection.tsx ← 绿→橙黄渐变、联系卡片 + 留言表单
├── FloatingNext.tsx            ← 固定底部悬浮 pill（自动检测 section，最后一节变返回起点）
├── Footer.tsx                  ← 深色底 (#2C3E50)、快捷链接
└── BackToTop.tsx               ← 回到顶部按钮

独立页面（pages/）:
├── About.tsx, Videos.tsx, Materials.tsx, Voices.tsx, Gallery.tsx, Contact.tsx
└── 均使用 PageLayout.tsx 包裹（固定毛玻璃顶栏 + backTo 锚点返回 + Footer）
```

### 设计规范

| Token | 值 | 用途 |
|-------|-----|------|
| `--color-primary` | `#6BAF92` | 品牌绿（较深） |
| `--color-primary-light` | `#7CB342` | 亮绿（btn-primary 默认色、Gallery 背景） |
| `--color-accent` | `#F5A623` | 暖黄/琥珀（Contact 渐变中间色） |
| `--color-surface` | `#FAF9F6` | 米白（About 背景、全局底色） |
| `--color-text` | `#2C3E33` | 深绿文字 |
| `--radius-md` | `16px` | 默认卡片圆角 |
| `--shadow-md` | `0 8px 32px rgba(107,175,146,0.08)` | 弥散阴影 |

**Section 颜色渐变链**（自上而下）：
```
Hero:     暖黄渐变  #EDCC80 → #F5D89A → #F5E6C8 → #F5C76E
Moments:  暖纸色   #F8EBD4
About:    米白     #FAF9F6
Videos:   浅绿     #E8F5E9
Materials: 暖绿    #C8E6C9
Voices:   中间绿   #AED581
Gallery:  亮绿     #7CB342
Contact:  绿→橙黄  #7CB342 → #F5A623 → #F5C76E
Footer:   深色     #2C3E50
```

- 每个 section `min-height: 100vh`，背景为纯色（除 Hero 和 Contact 使用渐变）
- Section 间过渡带：`position: absolute; bottom: 0; height: clamp(300px, 40vh, 600px)`，渐变到下一个 section 的颜色
- 全局悬浮效果：所有按钮/卡片/链接 hover 时 `translateY(-2px)` + 阴影
- `html` 设置了 `scroll-padding-top: 80px` 为固定导航留空间

### 数据库表

`admins`、`videos`、`materials`、`artworks`、`voices`、`moments`、`contact_forms`。完整 schema 见 `apps/api/migrations/`。种子数据带有默认管理员账号（`admin` / `mili2026`）。

## 待办事项

详见 `to-do-list.md`。主要剩余事项：
- R2 图片/音频上传（阻塞于外币卡）
- 企微通知（阻塞于机器人密钥）
- 搜索、评论/点赞、数据导出等功能增强

## 关键注意事项

- 目前**没有自动化测试**。修改后请 `pnpm --filter mili-edu-web build` 验证。
- 视频嵌入仅允许白名单域名：`player.bilibili.com`、`v.qq.com`、`www.youtube.com`（见 `apps/api/src/routes/videos.ts`）。
- JWT secret 硬编码在 `wrangler.toml` 中仅供开发使用，生产环境务必通过 Cloudflare secrets 覆盖。
- 修改全局样式时优先使用 CSS 自定义属性（`var(--color-*)`）和已提取的工具类（`.section-header`、`.btn-primary` 等），避免硬编码。
- 独立页面使用 `PageLayout` 时务必传入正确的 `backTo` 锚点，确保返回首页时滚动到对应 section。
- `FloatingNext` 组件通过检测 section 的 `getBoundingClientRect` 判断当前位置，不要在 Hero/Section 间插入会影响其检测逻辑的 DOM。
