import { Card, Statistic, Row, Col } from 'antd'
import { VideoCameraOutlined, FileTextOutlined, PictureOutlined, MessageOutlined } from '@ant-design/icons'

export default function AdminDashboard() {
  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>仪表盘</h1>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="视频数量"
              value={0}
              prefix={<VideoCameraOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="资料数量"
              value={0}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="作品数量"
              value={0}
              prefix={<PictureOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="留言数量"
              value={0}
              prefix={<MessageOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}