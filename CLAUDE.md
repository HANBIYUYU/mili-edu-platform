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
- 所有路由挂载在 `/api` 前缀下：`auth`、`videos`、`materials`、`artworks`、`contact-forms`、`upload`。
- **认证**：JWT（`jose` 库），通过 httpOnly cookie（`token`）传递。`authMiddleware`（`src/middleware/auth.ts`）验证 cookie 中的 JWT 并设置 `c.set('user', payload)`。仅对写操作（POST/PUT/DELETE）要求认证；公开的 GET 端点无需认证。
- **数据库**：Cloudflare D1，通过 `c.env.DB` 访问。SQLite 语法。Migration 文件在 `apps/api/migrations/`。类型定义在 `apps/api/src/types.ts`。
- **环境变量**：`WEBHOOK_URL`（企微机器人 webhook，当前为空字符串）、`JWT_SECRET`（开发默认值，生产环境务必修改）。
- R2 存储和 KV 命名空间在 `wrangler.toml` 中已注释 — 等待支付方式开通后启用。在此之前，文件上传/下载 API 返回 stub 响应。

### Web（`apps/web`）— React + Vite + Ant Design + React Router

- 入口：`apps/web/src/main.tsx` — React 18、BrowserRouter、Ant Design ConfigProvider（中文语言包，主题色 `#52c41a`）。
- 路由定义在 `apps/web/src/App.tsx`：
  - 前台路由（`/` → `MainLayout`）：首页、关于、视频、资料、画展、联系
  - 后台路由（`/admin` → `AdminLayout`）：登录、仪表盘、视频/资料/画展/留言管理
- API 客户端：`apps/web/src/api/index.ts` — axios 实例，baseURL 默认为 `/api`，`withCredentials: true`。401 响应自动重定向到 `/admin/login`。按资源模块导出 API 函数（`authAPI`、`videoAPI`、`materialAPI`、`artworkAPI`、`contactAPI`）。
- `AdminLayout` 在非登录页面通过 `/auth/me` 检查认证状态，认证失败则重定向到登录页。

### 数据库表

`admins`、`videos`、`materials`、`artworks`、`contact_forms`。完整 schema 见 `apps/api/migrations/0001_init.sql`。种子数据带有默认管理员账号（`admin` / `mili2026`）。

## 待办事项关键指引

`to-do-list.md` 记录了详细的待办清单，按优先级 P0–P2 排列：

- **P0**：视频播放独立详情页（`/videos/:id`）、UI 视觉升级（更柔和的暖绿配色、大圆角、弥散阴影）。
- **P1**：管理后台仪表盘接入真实数据（目前 `value={0}` 是死数字）、删除二次确认 + 操作反馈统一。
- **P2**：响应式优化、R2 上传（当前阻塞于外币卡）、企微通知（当前阻塞于机器人密钥）。

设计方向：主色从 Ant Design 默认绿 `#52c41a` 换为 `#6BAF92` 或 `#7CB342`，辅助色暖黄 `#F5A623`、米白 `#FAF9F6`，大圆角 16px，柔和阴影。

## 关键注意事项

- 目前**没有自动化测试**。修改 API 路由或前端页面后请手动验证。
- 视频嵌入仅允许白名单域名：`player.bilibili.com`、`v.qq.com`、`www.youtube.com`（见 `apps/api/src/routes/videos.ts` 的 `ALLOWED_DOMAINS`）。
- JWT secret 硬编码在 `wrangler.toml` 中仅供开发使用，生产环境务必通过 Cloudflare secrets 覆盖。
- Web 应用的 Ant Design 主题色在 `apps/web/src/main.tsx` 的 `<ConfigProvider>` 中集中设置；全局样式见 `apps/web/src/styles/global.css`。
