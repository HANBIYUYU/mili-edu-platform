import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Skeleton, Empty, Tag } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import PageLayout from '../components/PageLayout';
import RevealWrapper from '../components/RevealWrapper';
import { videoAPI } from '../api';

const categoryMeta: Record<string, { color: string; icon: string }> = {
  '总结视频': { color: 'linear-gradient(135deg, #FFF3E0, #FFE0B2)', icon: '📝' },
  '示范课堂': { color: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)', icon: '📚' },
};
const defaultMeta = { color: 'linear-gradient(135deg, #E3F2FD, #BBDEFB)', icon: '🎬' };

export default function VideosPage() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('全部');

  useEffect(() => {
    videoAPI.list().then((res: any) => {
      setVideos(res.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const categories = ['全部', ...new Set(videos.map((v) => v.category).filter(Boolean))];
  const filteredVideos = filter === '全部' ? videos : videos.filter((v) => v.category === filter);

  return (
    <PageLayout title="示范课程" backTo="/#videos" background="linear-gradient(180deg, #FAF9F6 0%, #E8F5E9 100%)">
      <RevealWrapper>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, color: '#2C3E33', textAlign: 'center', marginBottom: 16, letterSpacing: '-0.02em' }}>
          示范课程
        </h1>
      </RevealWrapper>
      <RevealWrapper delay={1}>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: '#6A7A6A', textAlign: 'center', maxWidth: 560, margin: '0 auto 48px' }}>
          精心设计的课程内容，涵盖语文、数学、美术和科学等多个领域
        </p>
      </RevealWrapper>

      {/* 分类筛选 */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 40, justifyContent: 'center', flexWrap: 'wrap' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: '8px 20px',
              borderRadius: 20,
              border: filter === cat ? 'none' : '1px solid rgba(107, 175, 146, 0.2)',
              background: filter === cat ? '#6BAF92' : 'transparent',
              color: filter === cat ? '#fff' : '#6A7A6A',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.3s ease',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glow-card" style={{ padding: 0, overflow: 'hidden' }}>
              <Skeleton.Image style={{ width: '100%', height: 180 }} active />
              <div style={{ padding: 20 }}><Skeleton active paragraph={{ rows: 1 }} /></div>
            </div>
          ))}
        </div>
      ) : filteredVideos.length === 0 ? (
        <Empty description="暂无课程视频" />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {filteredVideos.map((v, index) => {
            const meta = categoryMeta[v.category] || defaultMeta;
            return (
              <RevealWrapper key={v.id} delay={index}>
                <div
                  className="glow-card"
                  style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}
                  onClick={() => navigate(`/videos/${v.id}`)}
                >
                  <div style={{ height: 180, background: meta.color, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', fontSize: 56 }}>
                    {meta.icon}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.05)' }} className="video-overlay">
                      <PlayCircleOutlined style={{ fontSize: 52, color: 'rgba(255,255,255,0.9)', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))' }} />
                    </div>
                  </div>
                  <div style={{ padding: 20 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 600, color: '#2C3E33', marginBottom: 8 }}>{v.title}</h3>
                    <Tag color="green">{v.category}</Tag>
                  </div>
                </div>
              </RevealWrapper>
            );
          })}
        </div>
      )}
    </PageLayout>
  );
}
