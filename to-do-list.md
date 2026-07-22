米粒支教社 · 待办清单
已完成 ✅
[x] 项目骨架（React + Vite + Hono + D1）
[x] 数据库表结构
[x] 基础 API（认证、视频、资料、画展、留言）
[x] 前台页面（首页、介绍、视频列表、资料、画展、联系）
[x] 管理后台（登录、仪表盘、视频/资料/画展/留言管理）
[x] 本地开发环境跑通
待办 🔧
1. 视频播放页（独立详情页）
现状：/videos 列表页直接内嵌 iframe，所有视频挤在一起
目标：列表页只显示封面，点击进入 /videos/:id 独立播放页
改动文件：
apps/web/src/App.tsx — 新增路由 /videos/:id
apps/web/src/pages/Videos.tsx — 改造为封面卡片列表，点击跳转
新增 apps/web/src/pages/VideoDetail.tsx — 独立播放页（大 iframe + 返回按钮 + 视频信息）
参考代码：
tsx
// VideoDetail.tsx 核心结构
<Button onClick={() => navigate('/videos')}>返回列表</Button>
<Title>{video.title}</Title>
<div style={{ borderRadius: 12, overflow: 'hidden' }}>
  <iframe src={...} style={{ width: '100%', aspectRatio: '16/9' }} />
</div>
2. 首页仪表盘真实数据
现状：AdminDashboard.tsx 里 value={0} 是死数字
目标：调用 API 显示真实统计
改动文件：
apps/web/src/pages/Admin/Dashboard.tsx — 用 useEffect 调各 API 的 list()，取 data.length
3. 删除二次确认 + 操作反馈
现状：部分删除按钮已有 Popconfirm，但反馈不一致
目标：所有删除操作统一确认 + message.success/error
改动文件：
Admin/Videos.tsx、Admin/Materials.tsx、Admin/Gallery.tsx — 检查并统一删除交互
4. 加载状态优化
现状：部分页面只有简单 Spin
目标：列表页用 Skeleton 或带文字提示的 Spin
改动文件：
Videos.tsx、Materials.tsx、Gallery.tsx、Admin/*.tsx
5. UI 视觉升级
现状：Ant Design 默认绿，平平无奇
目标：公益清新风（参考：壹基金、腾讯公益、多抓鱼）
改动文件：
apps/web/src/styles/global.css — 自定义 CSS 变量（主色、圆角、阴影）
MainLayout.tsx — Header 改造（渐变背景、Logo 区域）
Home.tsx — Banner 视觉升级（插画/大图背景、动画）
各页面卡片统一风格
设计方向：
主色：暖绿 #52c41a → 更柔和的 #6BAF92 或 #7CB342
辅助色：暖黄 #F5A623、米白 #FAF9F6
圆角：大圆角 16px
阴影：柔和弥散阴影
字体：标题加粗、正文 15px 行高 1.8
6. 响应式细节
现状：手机能看但不够精致
目标：移动端导航、卡片布局、字体大小优化
改动文件：
MainLayout.tsx — 移动端汉堡菜单
各页面 Grid 布局断点调整
7. 图片/音频真实展示
现状：画展用 PictureOutlined 图标占位
目标：接入 R2 后显示真实图片，音频可播放
阻塞：R2 未开通
先做准备：Gallery.tsx 里判断 file_key 格式，有 URL 显示图片，无则显示占位
8. 表单提交后企微通知
现状：contact.ts 里 Webhook 注释掉了
目标：取消注释，配置 WEBHOOK_URL 环境变量
阻塞：需要企微机器人密钥
先做准备：代码已写好，只需填 URL
优先级建议
表格
优先级	事项	影响
P0	视频播放页	核心功能体验
P0	UI 视觉升级	第一印象，知行杯材料用
P1	仪表盘真实数据	管理后台完整性
P1	删除确认 + 加载状态	体验细节
P2	响应式优化	移动端
P2	图片/音频展示	等 R2
P2	企微通知	等密钥
