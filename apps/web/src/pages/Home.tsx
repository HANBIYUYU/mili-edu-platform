import { useEffect, useState } from 'react'
import { Row, Col, Card, Button, Typography, Spin } from 'antd'
import { Link } from 'react-router-dom'
import { PlayCircleOutlined, BookOutlined, PictureOutlined, TeamOutlined } from '@ant-design/icons'
import { videoAPI, artworkAPI } from '../api'

const { Title, Paragraph } = Typography

export default function Home() {
  const [videos, setVideos] = useState<any[]>([])
  const [artworks, setArtworks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    Promise.all([
      videoAPI.list(),
      artworkAPI.list({ media_type: 'image' })
    ]).then(([vRes, aRes]: any) => {
      setVideos(vRes.data?.slice(0, 3) || [])
      setArtworks(aRes.data?.slice(0, 4) || [])
    }).finally(() => setLoading(false))
  }, [])
  
  if (loading) return <Spin style={{ display: 'block', margin: '100px auto' }} />
  
  return (
    <div>
      <div style={{ 
        background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
        borderRadius: 16,
        padding: '60px 40px',
        color: '#fff',
        marginBottom: 40,
        textAlign: 'center'
      }}>
        <TeamOutlined style={{ fontSize: 64, marginBottom: 24 }} />
        <Title level={1} style={{ color: '#fff', marginBottom: 16 }}>
          米粒支教社
        </Title>
        <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: 18, maxWidth: 600, margin: '0 auto 32px' }}>
          推广普通话，连接城乡教育，让每个孩子都能自信表达
        </Paragraph>
        <Button type="primary" size="large" style={{ background: '#fff', color: '#52c41a', border: 'none' }}>
          <Link to="/about" style={{ color: '#52c41a' }}>了解项目</Link>
        </Button>
      </div>
      
      <Row gutter={[24, 24]} style={{ marginBottom: 40 }}>
        <Col xs={24} sm={12} md={8}>
          <Card hoverable>
            <PlayCircleOutlined style={{ fontSize: 40, color: '#52c41a' }} />
            <Title level={4}>示范课程</Title>
            <Paragraph>观看普通话教学示范视频</Paragraph>
            <Link to="/videos"><Button type="primary">查看课程</Button></Link>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card hoverable>
            <BookOutlined style={{ fontSize: 40, color: '#52c41a' }} />
            <Title level={4}>推普资料</Title>
            <Paragraph>下载教案、手册等学习资料</Paragraph>
            <Link to="/materials"><Button type="primary">浏览资料</Button></Link>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card hoverable>
            <PictureOutlined style={{ fontSize: 40, color: '#52c41a' }} />
            <Title level={4}>儿童画展</Title>
            <Paragraph>欣赏孩子们的推普成果</Paragraph>
            <Link to="/gallery"><Button type="primary">进入画展</Button></Link>
          </Card>
        </Col>
      </Row>
      
      <Title level={3}>最新课程</Title>
      <Row gutter={[24, 24]} style={{ marginBottom: 40 }}>
        {videos.map((v: any) => (
          <Col xs={24} sm={12} md={8} key={v.id}>
            <Card title={v.title}>
              <div style={{ 
                background: '#f5f5f5', 
                height: 180, 
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <PlayCircleOutlined style={{ fontSize: 48, color: '#ccc' }} />
              </div>
              <p style={{ marginTop: 12, color: '#666' }}>{v.category}</p>
            </Card>
          </Col>
        ))}
      </Row>
      
      <Title level={3}>儿童作品</Title>
      <Row gutter={[16, 16]}>
        {artworks.map((a: any) => (
          <Col xs={12} sm={8} md={6} key={a.id}>
            <Card hoverable bodyStyle={{ padding: 0 }}>
              <div style={{ 
                background: '#f5f5f5', 
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <PictureOutlined style={{ fontSize: 32, color: '#ccc' }} />
              </div>
              <div style={{ padding: 12 }}>
                <p style={{ fontWeight: 'bold', margin: 0 }}>{a.title}</p>
                <p style={{ color: '#999', fontSize: 12, margin: 0 }}>{a.child_name}</p>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}