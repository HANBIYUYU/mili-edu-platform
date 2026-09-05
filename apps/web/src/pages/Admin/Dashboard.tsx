import { useEffect, useState } from 'react';
import {
  Card, Col, Row, Statistic, Spin, Tag, List, Empty, Button, Alert,
} from 'antd';
import { Link } from 'react-router-dom';
import {
  VideoCameraOutlined, FileTextOutlined, PictureOutlined,
  SmileOutlined, CameraOutlined, MessageOutlined, ArrowRightOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { statsAPI } from '../../api';

const QUICK = [
  { key: '/admin/videos', label: '示范视频', desc: 'B站/腾讯/YouTube 嵌入' },
  { key: '/admin/materials', label: '推普资料', desc: '上传 PDF / Word' },
  { key: '/admin/gallery', label: '儿童画展', desc: '画作图片上传' },
  { key: '/admin/voices', label: '童声童语', desc: '配图与视频' },
  { key: '/admin/moments', label: '支教拾光', desc: '按年份整理照片' },
  { key: '/admin/contacts', label: '留言管理', desc: '联系表单归档' },
  { key: '/admin/media', label: '素材库', desc: 'R2 图床统一上传' },
];

const MODULE_META: Record<string, { label: string; icon: any; color: string }> = {
  videos: { label: '示范视频', icon: <VideoCameraOutlined />, color: '#6BAF92' },
  materials: { label: '推普资料', icon: <FileTextOutlined />, color: '#7CB342' },
  artworks: { label: '画展作品', icon: <PictureOutlined />, color: '#F5A623' },
  voices: { label: '童声童语', icon: <SmileOutlined />, color: '#AED581' },
  moments: { label: '支教拾光', icon: <CameraOutlined />, color: '#F8EBD4' },
  contact_forms: { label: '留言', icon: <MessageOutlined />, color: '#2C3E50' },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    statsAPI.overview()
      .then((res: any) => setStats(res))
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>;
  }

  const counts = stats?.counts || {};
  const recent: any[] = stats?.recentMessages || [];
  const unnotified = stats?.unnotified ?? 0;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>仪表盘</h1>
        <span style={{ color: '#999', fontSize: 13 }}>
          {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })} · 数据实时读取
        </span>
      </div>

      <Row gutter={[16, 16]}>
        {Object.entries(MODULE_META).map(([key, meta]) => (
          <Col xs={12} md={8} lg={6} key={key}>
            <Card>
              <Statistic
                title={meta.label}
                value={counts[key] ?? 0}
                prefix={<span style={{ color: meta.color }}>{meta.icon}</span>}
                valueStyle={{ fontSize: 28, fontWeight: 700 }}
                suffix={key === 'contact_forms' && unnotified > 0 ? <Tag color="orange" style={{ marginLeft: 6 }}>新 {unnotified}</Tag> : undefined}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* 待办：最近留言 */}
        <Col xs={24} lg={10}>
          <Card
            size="small"
            title={<span style={{ fontSize: 16 }}><BellOutlined style={{ color: '#F5A623', marginRight: 6 }} />待办 · 最新留言</span>}
            extra={<Link to="/admin/contacts">全部 →</Link>}
          >
            {unnotified > 0 && (
              <Alert
                type="warning"
                showIcon
                style={{ marginBottom: 12 }}
                message={`有 ${unnotified} 条留言尚未处理`}
              />
            )}
            {recent.length === 0 ? (
              <Empty description="暂无留言" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <List
                size="small"
                dataSource={recent}
                renderItem={(m: any) => (
                  <List.Item
                    actions={[<Link key="go" to="/admin/contacts"><Button size="small" type="link">查看</Button></Link>]}
                  >
                    <List.Item.Meta
                      title={<span>{m.name} {!m.notified && <Tag color="orange" style={{ marginLeft: 6 }}>未通知</Tag>}</span>}
                      description={
                        <span style={{ fontSize: 13, color: '#666' }}>
                          {String(m.message || '').slice(0, 40)}
                          {String(m.message || '').length > 40 ? '…' : ''}
                        </span>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>

        {/* 快捷入口 */}
        <Col xs={24} lg={14}>
          <Card size="small" title={<span style={{ fontSize: 16 }}>快捷入口</span>}>
            <Row gutter={[12, 12]}>
              {QUICK.map((q) => (
                <Col xs={12} sm={8} key={q.key}>
                  <Link to={q.key}>
                    <div style={{
                      border: '1px solid #f0f0f0', borderRadius: 10, padding: '12px 14px',
                      background: '#fafafa', transition: 'all .2s',
                    }}>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>
                        {q.label} <ArrowRightOutlined style={{ float: 'right', color: '#bbb', fontSize: 12 }} />
                      </div>
                      <div style={{ color: '#999', fontSize: 12, marginTop: 2 }}>{q.desc}</div>
                    </div>
                  </Link>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      <p style={{ color: '#aaa', marginTop: 16, fontSize: 13 }}>
        数据来自 /api/stats 与各内容接口，随数据库实时更新；上传图片 / 音频 / 文档请使用「素材库」。
      </p>
    </div>
  );
}
