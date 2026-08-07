# 米粒支教社 · 待办清单

## 已完成 ✅

- [x] 项目骨架（React + Vite + Hono + D1）
- [x] 数据库表结构
- [x] 基础 API（认证、视频、资料、画展、留言）
- [x] 本地开发环境跑通
- [x] 管理后台（登录、仪表盘、视频/资料/画展/留言管理）
- [x] 前台 UI 重构 — 多页改造为明亮温暖长滚动单页
  - 6 Section：Hero → About → Videos → Materials → Gallery → Contact
  - 品牌色 #6BAF92、辅助色 #F5A623、米白 #FAF9F6
  - TransparentNav（滚动玻璃态 + 移动端汉堡菜单）
  - RevealWrapper 滚动渐入动画、CountUp 数字滚动
  - Footer（深绿底 + 管理入口）
- [x] 自定义域名 mili-edu.cn（Cloudflare Workers + Pages 同源部署）
- [x] 仪表盘真实数据 — `Dashboard.tsx` 并行请求 4 个 API，替换死数字
- [x] 删除二次确认 + 操作反馈 — `Popconfirm` + `message.success/error` 统一
- [x] 加载状态优化 — 前台 Section 从 `Spin` 升级为 `Skeleton` 骨架屏
- [x] 响应式优化 — 移动端间距/按钮/光晕/表单自适应，480px 下按钮全宽

## 阻塞 🔒

| 事项 | 阻塞原因 |
|------|---------|
| 图片/音频真实展示 | R2 未开通（外币卡） |
| 表单提交后企微通知 | 企微机器人密钥未配置 |

## 页面效果打磨 🎨

待补充...
