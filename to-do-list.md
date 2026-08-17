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

## 阻塞 🔒

| 事项 | 阻塞原因 |
|------|---------|
| 图片/音频真实展示 | R2 未开通（外币卡） |
| 表单提交后企微通知 | 企微机器人密钥未配置 |

## 页面效果打磨 🎨

- [ ] Gallery/Contact 独立页面纯 CSS 背景渐变（不带 PageLayout 的 #FAF9F6 底色）
- [ ] 独立页面 SEO meta 标签
- [ ] 页面加载进度条（NProgress 风格）
- [ ] Section 间过渡带更精细的颜色微调

## 功能增强

- [ ] 搜索功能 — 视频/资料关键词搜索
- [ ] 评论/点赞 — 视频和画展互动功能
- [ ] 数据导出 — 管理后台留言/统计导出 CSV
- [ ] 图片真实上传 — R2 开通后接入
