import { useState, useEffect } from 'react'
import { Card, Statistic, Row, Col, Spin } from 'antd'
import { VideoCameraOutlined, FileTextOutlined, PictureOutlined, MessageOutlined } from '@ant-design/icons'
import { videoAPI, materialAPI, artworkAPI, contactAPI } from '../../api'

interface Stats {
  videos: number
  materials: number
  artworks: number
  contacts: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ videos: 0, materials: 0, artworks: 0, contacts: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [videos, materials, artworks, contacts] = await Promise.all([
          videoAPI.list(),
          materialAPI.list(),
          artworkAPI.list(),
          contactAPI.list(),
        ])
        setStats({
          videos: (videos as any).data?.length ?? 0,
          materials: (materials as any).data?.length ?? 0,
          artworks: (artworks as any).data?.length ?? 0,
          contacts: (contacts as any).data?.length ?? 0,
        })
      } catch (err) {
        console.error('获取统计数据失败:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>仪表盘</h1>

      <Spin spinning={loading}>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="视频数量"
                value={stats.videos}
                prefix={<VideoCameraOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="资料数量"
                value={stats.materials}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="作品数量"
                value={stats.artworks}
                prefix={<PictureOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="留言数量"
                value={stats.contacts}
                prefix={<MessageOutlined />}
              />
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  )
}