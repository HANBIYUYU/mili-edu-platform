import { useEffect, useState } from 'react';
import { Modal, Skeleton, Empty } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import RevealWrapper from '../components/RevealWrapper';
import { videoAPI } from '../api';

const categoryMeta: Record<string, { color: string; icon: string }> = {
  '总结视频': { color: 'linear-gradient(135deg, #FFF3E0, #FFE0B2)', icon: '📝' },
  '示范课堂': { color: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)', icon: '📚' },
};

const defaultMeta = { color: 'linear-gradient(135deg, #E3F2FD, #BBDEFB)', icon: '🎬' };

export default function VideosSection() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState('');

  useEffect(() => {
    videoAPI.list().then((res: any) => {
      setVideos(res.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const openVideo = (url: string) => {
    setCurrentVideo(url);
    setModalOpen(true);
  };

  return (
    <section
      id="videos"
      style={{
        background: 'linear-gradient(180deg, #E8F5E9 0%, #C8E6C9 100%)',
        padding: 'clamp(100px, 14vw, 180px) 24px',
        position: 'relative',
      }}
    >
      <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <RevealWrapper>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, lineHeight: 1.2, color: '#2C3E33', textAlign: 'center', marginBottom: 16 }}>
            示范课程
          </h2>
        </RevealWrapper>

        <RevealWrapper delay={1}>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: '#6A7A6A', textAlign: 'center', maxWidth: 560, margin: '0 auto 60px' }}>
            精心设计的课程内容，涵盖语文、数学、美术和科学等多个领域
          </p>
        </RevealWrapper>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="glow-card" style={{ padding: 0, overflow: 'hidden' }}>
                <Skeleton.Image style={{ width: '100%', height: 160 }} active />
                <div style={{ padding: 20 }}>
                  <Skeleton active paragraph={{ rows: 1 }} />
                </div>
              </div>
            ))}
          </div>
        ) : videos.length === 0 ? (
          <Empty description="暂无课程视频" />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
            {videos.map((v, index) => {
              const meta = categoryMeta[v.category] || defaultMeta;
              return (
                <RevealWrapper key={v.id} delay={index + 1}>
                  <div
                    className="glow-card"
                    style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}
                    onClick={() => openVideo(v.iframe_src)}
                  >
                    <div style={{ height: 160, background: meta.color, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', fontSize: 48 }}>
                      {meta.icon}
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.05)', transition: 'background 0.3s ease' }} className="video-overlay">
                        <PlayCircleOutlined style={{ fontSize: 48, color: 'rgba(255,255,255,0.9)', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))' }} />
                      </div>
                    </div>
                    <div style={{ padding: 20 }}>
                      <h3 style={{ fontSize: 18, fontWeight: 600, color: '#2C3E33', marginBottom: 8 }}>{v.title}</h3>
                      <p style={{ fontSize: 14, lineHeight: 1.6, color: '#8A9E8F' }}>{v.category}</p>
                    </div>
                  </div>
                </RevealWrapper>
              );
            })}
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={800}
        centered
        styles={{ body: { padding: 0, borderRadius: 16, overflow: 'hidden' } }}
      >
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
          <iframe
            src={currentVideo}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </Modal>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 200, background: 'linear-gradient(180deg, transparent, rgba(200, 230, 201, 0.6), #C8E6C9)', pointerEvents: 'none' }} />
    </section>
  );
}
