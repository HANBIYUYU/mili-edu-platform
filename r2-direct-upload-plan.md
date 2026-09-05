# R2 视频直传改造计划（绕过 Worker 100MB 限制）

> 背景：当前上传 = 浏览器 → Worker(/api/upload) → R2。视频需整段经过 Worker，受免费版
> Workers **单请求 ~100MB 上限**约束，且多一跳。用户上传 ~800MB 视频会超限/失败。
> 方案：**大文件走 R2 S3 预签名 Multipart 直传**，浏览器把分片直接 PUT 到 R2 的 S3 端点，
> 不经过 Worker 中转，单对象上限 5GiB，速度接近本地上行带宽。

## 上传分派策略

| 文件大小 | 走法 | 说明 |
|---|---|---|
| ≤ 90MB | 现路径 `/api/upload`（Worker 单 PUT） | 保留，已带进度条 |
| > 90MB | **预签名 Multipart 直传** | 分片直传 + 聚合进度，可传至 5GiB |

## 你需要先在 Cloudflare 控制台做的（一次性）

1. Cloudflare 控制台 → **R2 → 管理 API 令牌（Manage R2 API Tokens）→ 创建 API 令牌**
   - 权限：对象读 + 写；作用范围：`mili-edu-assets`
2. 记录 **Access Key ID** 与 **Secret Access Key**（仅显示一次），以及账号 Account ID
3. 交给我（或自行执行下面的 secret 命令），我把它们注入为 Worker secrets：
   - `R2_ACCESS_KEY_ID`
   - `R2_SECRET_ACCESS_KEY`
   - `R2_ENDPOINT`（= `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`）

> 也可以按“部署脚本”自行执行：
> `pnpm --filter mili-edu-api exec wrangler secret put R2_ACCESS_KEY_ID`（依次放入三个值）

## 后端改动（apps/api）

- 新增 `src/lib/s3.ts`：用 WebCrypto 实现 **AWS SigV4** 签名（PUT/GET presign 与
  `?uploads`/complete 的签名请求），请求发往 `R2_ENDPOINT/<bucket>/<key>`
- 新增路由（挂在 upload 模块或独立 `upload-large.ts`）：
  - `POST /api/upload/init`（auth，JSON `{ dir, name, size }`）
    → 创建 Multipart Upload（S3 `POST ?uploads`），返回：
    `{ key, uploadId, partSize, parts: [{ number, url, size }] }`
    （`partSize` 按大小自适应，例如 target 50MB/片，part ≤ 10000 片）
  - `POST /api/upload/complete`（auth，JSON `{ key, uploadId, etags[] }`）
    → 组装 `<CompleteMultipartUpload>` XML 签名提交，返回对象 key
  - `POST /api/upload/abort`（auth，可选）取消半途上传释放分片
- 保留现有 `/api/upload` 小文件通道
- 文件类型/目录白名单复用 `src/lib/files.ts`（含 `videos/`）
- 完成后端类型检查 + 本地/远程部署验证

## 前端改动（apps/web）

- `src/utils/upload.ts`（或并入 api 层）：
  - `uploadLarge(file, dir, onProgress)`：
    1. `init` 拿 `{ key, uploadId, parts }`
    2. 对每个分片用 XHR `PUT parts[i].url`（`blob.slice` 取片），**3 并发**
    3. 聚合进度 = 已完成字节 / 总字节；收集每片响应的 `ETag`
    4. 全部完成 → `complete`；出错 → 提示并可点重试（重新 init）
- 两处上传弹窗（`components/admin/MediaLibrary.tsx` 与
  `pages/Admin/MediaLibrary.tsx`）：
  - 统一封装 `UploadFlow`：≤90MB 走原通道，>90MB 自动切直传
  - 进度条显示：总百分比 + “第 x/N 片” + 已传/总量（大文件等待感更强）
  - 上传前对 >300MB 文件弹提示：预计耗时与“建议先压缩”说明（可跳过）
- 大文件建议并发/分片大小由 `init` 下发，前端不写死

## 视频体积与质量建议（配合直传）

- 网页教学视频建议参数：H.264、≤1080p、CRF 20–23、码率约 2–3 Mbps、帧率 25/30
- 800MB 原片常见是 4K/超高码率；压缩到 1080p@3Mbps 通常 200–400MB，肉眼几乎无差
- 超过 30 分钟建议拆集，前端加载/拖动也更流畅

## 验证清单

- [ ] 小文件（≤90MB）仍走旧通道，进度正常
- [ ] 大文件 init → 分片直传（观察 Network 面板直接请求 r2.cloudflarestorage.com）→ complete
- [ ] 上传中途断网 → 提示失败、可重试；`abort` 可清理
- [ ] 线上用 ~200MB 假 mp4 实测全链路后清理
- [ ] 更新 to-do-list.md / CLAUDE.md
