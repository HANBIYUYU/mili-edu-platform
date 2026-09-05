import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Skeleton, Empty, Alert } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import RevealWrapper from '../components/RevealWrapper';
import { videoAPI } from '../api';
import { fileUrl } from '../utils/fileUrl';

const categoryMeta: Record<string, { color: string; icon: string }> = {
  '总结视频': { color: 'linear-gradient(135deg, #FFF3E0, #FFE0B2)', icon: '📝' },
  '示范课堂': { color: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)', icon: '📚' },
};

const defaultMeta = { color: 'linear-gradient(135deg, #E3F2FD, #BBDEFB)', icon: '🎬' };

interface CurrentVideo { title: string; src: string }

export default function VideosSection() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [current, setCurrent] = useState<CurrentVideo | null>(null);

  useEffect(() => {
    videoAPI.list().then((res: any) => {
      setVideos(res.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const openVideo = (v: any) => {
    const src = fileUrl(v.file_key);
    if (!src) return; // 旧数据未上传文件则不响应
    setCurrent({ title: v.title, src });
    setModalOpen(true);
  };

  return (
    <section
      id="videos"
      style={{
        background: '#E8F5E9',
        padding: '55px 24px',
        position: 'relative',
      }}
    >
      <div className="container" style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* 标题 + 了解更多 */}
        <div className="section-header">
          <RevealWrapper>
            <h2 className="section-title" style={{ color: '#2C3E33' }}>示范课程</h2>
          </RevealWrapper>
          <RevealWrapper delay={1}>
            <button onClick={() => navigate('/videos')} className="btn-secondary" style={{ padding: '10px 24px', fontSize: 14 }}>了解更多 →</button>
          </RevealWrapper>
        </div>

        <RevealWrapper delay={1}>
          <p className="section-desc" style={{ color: '#6A7A6A' }}>
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
              const playable = !!fileUrl(v.file_key);
              return (
                <RevealWrapper key={v.id} delay={index + 1}>
                  <div
                    className="glow-card"
                    style={{ padding: 0, overflow: 'hidden', cursor: playable ? 'pointer' : 'not-allowed' }}
                    onClick={() => playable && openVideo(v)}
                  >
                    <div style={{ height: 160, background: meta.color, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', fontSize: 48 }}>
                      {meta.icon}
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.05)', transition: 'background 0.3s ease' }} className="video-overlay">
                        <PlayCircleOutlined style={{ fontSize: 48, color: playable ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.15)', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))' }} />
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
        width={820}
        centered
        title={current?.title}
        styles={{ body: { padding: 0, borderRadius: 16, overflow: 'hidden' } }}
      >
        {current && (
          <video
            key={current.src}
            src={current.src}
            controls
            autoPlay
            playsInline
            style={{ width: '100%', aspectRatio: '16 / 9', display: 'block', background: '#000', objectFit: 'contain' }}
          />
        )}
        {current && <Alert type="info" showIcon message="课程视频由社团上传，若无法播放请稍后刷新重试" style={{ margin: 8 }} />}
      </Modal>

      <div className="section-transition" style={{ background: 'linear-gradient(180deg, transparent, #C8E6C9)' }} />
    </section>
  );
}
