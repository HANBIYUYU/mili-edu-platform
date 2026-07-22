import { Outlet, useLocation, Link } from 'react-router-dom'
import { Layout, Menu, Button } from 'antd'
import { HomeOutlined, BookOutlined, PlayCircleOutlined, PictureOutlined, MailOutlined, TeamOutlined } from '@ant-design/icons'

const { Header, Content, Footer } = Layout

const menuItems = [
  { key: '/', icon: <HomeOutlined />, label: <Link to="/">首页</Link> },
  { key: '/about', icon: <BookOutlined />, label: <Link to="/about">项目介绍</Link> },
  { key: '/videos', icon: <PlayCircleOutlined />, label: <Link to="/videos">示范课程</Link> },
  { key: '/materials', icon: <BookOutlined />, label: <Link to="/materials">推普资料</Link> },
  { key: '/gallery', icon: <PictureOutlined />, label: <Link to="/gallery">儿童画展</Link> },
  { key: '/contact', icon: <MailOutlined />, label: <Link to="/contact">联系我们</Link> },
]

export default function MainLayout() {
  const location = useLocation()
  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: '#fff', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <TeamOutlined style={{ fontSize: 28, color: '#52c41a' }} />
          <span style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>
            米粒支教社
          </span>
        </div>
        
        <Menu 
          mode="horizontal" 
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ borderBottom: 'none', flex: 1, justifyContent: 'flex-end' }}
        />
        
        <Link to="/admin/login" style={{ marginLeft: 16 }}>
          <Button type="link" size="small">管理入口</Button>
        </Link>
      </Header>
      
      <Content style={{ padding: '24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <Outlet />
      </Content>
      
      <Footer style={{ textAlign: 'center', background: '#fff', borderTop: '1px solid #f0f0f0' }}>
        <p>米粒支教社 · 推普融合实践项目</p>
        <p style={{ color: '#999', fontSize: 12 }}>响应"知行杯"暑期社会实践号召</p>
      </Footer>
    </Layout>
  )
}