import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom'
import { Layout, Menu, Button, message } from 'antd'
import { useEffect, useState } from 'react'
import { authAPI } from '../api'

const { Sider, Content } = Layout

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState<string | null>(null)
  
  useEffect(() => {
    if (location.pathname === '/admin/login') return
    authAPI.me().then((res: any) => {
      setUser(res.username)
    }).catch(() => {
      navigate('/admin/login')
    })
  }, [location.pathname])
  
  const handleLogout = async () => {
    await authAPI.logout()
    message.success('已退出登录')
    navigate('/admin/login')
  }
  
  const menuItems = [
    { key: '/admin/dashboard', label: <Link to="/admin/dashboard">仪表盘</Link> },
    { key: '/admin/videos', label: <Link to="/admin/videos">视频管理</Link> },
    { key: '/admin/materials', label: <Link to="/admin/materials">资料管理</Link> },
    { key: '/admin/gallery', label: <Link to="/admin/gallery">画展管理</Link> },
    { key: '/admin/contacts', label: <Link to="/admin/contacts">留言管理</Link> },
  ]
  
  if (location.pathname === '/admin/login') {
    return <Outlet />
  }
  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light" style={{ borderRight: '1px solid #f0f0f0' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
          <h3 style={{ margin: 0 }}>管理后台</h3>
          {user && <p style={{ margin: '8px 0 0', color: '#666', fontSize: 12 }}>{user}</p>}
        </div>
        <Menu 
          mode="inline" 
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
        <div style={{ padding: 16, position: 'absolute', bottom: 0, width: '100%' }}>
          <Button onClick={handleLogout} block>退出登录</Button>
        </div>
      </Sider>
      <Content style={{ padding: 24, background: '#f5f5f5' }}>
        <Outlet />
      </Content>
    </Layout>
  )
}