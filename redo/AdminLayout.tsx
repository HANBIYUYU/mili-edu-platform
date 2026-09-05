import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom'
import { Layout, Menu, Button, message, Drawer } from 'antd'
import { MenuOutlined, LogoutOutlined, HomeOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { authAPI } from '../api'

const { Sider, Content } = Layout

/** 菜单按「前台页面」分组（可折叠）；roles 为空 = team + admin 均可见 */
const PAGES: { key: string; label: string; items: { key: string; label: string; roles?: string[] }[] }[] = [
  {
    key: 'p-home', label: '主页',
    items: [
      { key: '/admin/films', label: '首页影像', roles: ['team'] },
      { key: '/admin/news', label: '首页动态', roles: ['team'] },
    ],
  },
  {
    key: 'p-archive', label: '档案馆',
    items: [
      { key: '/admin/stages', label: '戏台档案' },
    ],
  },
  {
    key: 'p-culture', label: '文化馆',
    items: [
      { key: '/admin/red-plays', label: '红色戏曲', roles: ['team'] },
      { key: '/admin/articles', label: '互动阅读', roles: ['team'] },
      { key: '/admin/activities', label: '活动预告' },
    ],
  },
  {
    key: 'p-community', label: '共创',
    items: [
      { key: '/admin/submissions', label: '投稿审核', roles: ['team'] },
      { key: '/admin/suggestions', label: '建言归档', roles: ['team'] },
      { key: '/admin/quiz', label: '题库', roles: ['team'] },
    ],
  },
  {
    key: 'p-study', label: '研学',
    items: [
      { key: '/admin/bookings', label: '研学预约', roles: ['team'] },
    ],
  },
  {
    key: 'p-mall', label: '商城',
    items: [
      { key: '/admin/products', label: '商品', roles: ['team'] },
      { key: '/admin/orders', label: '订单' },
    ],
  },
  {
    key: 'p-ai', label: 'AI 助手',
    items: [
      { key: '/admin/faq', label: '问答库', roles: ['team'] },
    ],
  },
  {
    key: 'p-media', label: '素材',
    items: [
      { key: '/admin/media', label: '素材库（图床）', roles: ['team'] },
    ],
  },
]

const ROLE_LABEL: Record<string, string> = {
  team: '项目团队',
  admin: '政企文旅管理员',
}

/** 每页单条功能时折叠成一层，减少嵌套；多条的用可折叠分组 */
function buildMenuItems(user: { role: string } | null) {
  const visible = (roles?: string[]) => !roles || (user && roles.includes(user.role))
  const items: any[] = [{ key: '/admin/dashboard', label: <Link to="/admin/dashboard">仪表盘</Link> }]
  const openKeys: string[] = []
  for (const page of PAGES) {
    const children = page.items.filter((m) => visible(m.roles))
    if (children.length === 0) continue
    const links = children.map((m) => ({ key: m.key, label: <Link to={m.key}>{m.label}</Link> }))
    if (children.length === 1) {
      items.push(links[0])
    } else {
      items.push({ key: page.key, label: page.label, children: links })
      openKeys.push(page.key)
    }
  }
  return { items, openKeys }
}

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState<{ username: string; role: string } | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // 手机端（<992px）收起侧栏，改为顶栏 + 抽屉菜单
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 991px)')
    const fn = () => setIsMobile(mq.matches)
    fn()
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])

  useEffect(() => {
    if (location.pathname === '/admin/login') return
    authAPI.me().then((res: any) => {
      setUser({ username: res.username, role: res.role || 'team' })
    }).catch(() => {
      navigate('/admin/login')
    })
  }, [location.pathname])

  const handleLogout = async () => {
    await authAPI.logout()
    message.success('已退出登录')
    navigate('/admin/login')
  }

  const menu = buildMenuItems(user)

  if (location.pathname === '/admin/login') {
    return <Outlet />
  }

  const menuEl = (
    <Menu
      mode="inline"
      style={{ borderInlineEnd: 'none', fontSize: 14 }}
      selectedKeys={[location.pathname]}
      defaultOpenKeys={menu.openKeys}
      items={menu.items}
      onClick={() => setDrawerOpen(false)}
    />
  )

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* ========== 桌面侧栏 ========== */}
      {!isMobile && (
        <Sider theme="light" width={232} style={{ borderRight: '1px solid #f0f0f0' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
            <h3 style={{ margin: 0 }}>湘村新台 · 管理后台</h3>
            {user && (
              <p style={{ margin: '8px 0 0', color: '#666', fontSize: 12 }}>
                {user.username}（{ROLE_LABEL[user.role] || user.role}）
              </p>
            )}
          </div>
          {/* 菜单区固定高度 + 内置滚动，不影响外层 */}
          <div style={{ height: 'calc(100vh - 196px)', overflowY: 'auto' }}>
            {menuEl}
          </div>
          <div style={{ padding: 12, borderTop: '1px solid #f0f0f0' }}>
            <Button onClick={() => navigate('/')} block style={{ marginBottom: 8 }}>返回主页</Button>
            <Button onClick={handleLogout} block danger>退出登录</Button>
          </div>
        </Sider>
      )}

      {/* ========== 手机顶栏 ========== */}
      {isMobile && (
        <div style={{
          position: 'sticky', top: 0, zIndex: 20,
          display: 'flex', alignItems: 'center', gap: 10,
          height: 52, padding: '0 14px',
          background: '#fff', borderBottom: '1px solid #f0f0f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}>
          <Button
            type="text"
            icon={<MenuOutlined style={{ fontSize: 18 }} />}
            onClick={() => setDrawerOpen(true)}
            aria-label="打开菜单"
          />
          <h3 style={{ margin: 0, fontSize: 16, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            湘村新台 · 管理后台
          </h3>
          <Button type="text" icon={<HomeOutlined />} onClick={() => navigate('/')} aria-label="返回主页" />
        </div>
      )}

      <Content style={{ padding: isMobile ? 12 : 24, background: '#f5f5f5', fontSize: 14 }}>
        <Outlet />
      </Content>

      {/* ========== 手机抽屉菜单 ========== */}
      <Drawer
        title={null}
        placement="left"
        width={268}
        open={isMobile && drawerOpen}
        onClose={() => setDrawerOpen(false)}
        styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column' } }}
      >
        <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #f0f0f0' }}>
          <h3 style={{ margin: 0 }}>湘村新台 · 管理后台</h3>
          {user && (
            <p style={{ margin: '8px 0 0', color: '#666', fontSize: 12 }}>
              {user.username}（{ROLE_LABEL[user.role] || user.role}）
            </p>
          )}
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
          {menuEl}
        </div>
        <div style={{ padding: 12, borderTop: '1px solid #f0f0f0', display: 'flex', gap: 8 }}>
          <Button onClick={() => { setDrawerOpen(false); navigate('/'); }} icon={<HomeOutlined />} style={{ flex: 1 }}>返回主页</Button>
          <Button onClick={handleLogout} icon={<LogoutOutlined />} danger style={{ flex: 1 }}>退出登录</Button>
        </div>
      </Drawer>
    </Layout>
  )
}
