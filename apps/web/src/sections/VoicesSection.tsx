import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Skeleton, Empty, Tag } from 'antd';
import RevealWrapper from '../components/RevealWrapper';
import { voiceAPI } from '../api';
import { fileUrl } from '../utils/fileUrl';

const palette = ['#FFF3E0', '#FCE4EC', '#E8F5E9', '#E3F2FD', '#FFFDE7', '#F3E5F5'];

interface VoiceItem {
  id: number;
  title: string;
  author?: string;
  media_type?: string;
  category?: string;
  file_key?: string;
  iframe_src?: string;
}

export default function VoicesSection() {
  const navigate = useNavigate();
  const [voices, setVoices] = useState<VoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [current, setCurrent] = useState<VoiceItem | null>(null);

  useEffect(() => {
    voiceAPI.list().then((res: any) => {
      setVoices(res.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const openItem = (item: VoiceItem) => {
    setCurrent(item);
    setModalOpen(true);
  };

  return (
    <section
      id="voices"
      style={{
        background: '#AED581',
        padding: '55px 24px',
        position: 'relative',
      }}
    >
      <div className="container" style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* 标题 + 了解更多 */}
        <div className="section-header">
          <RevealWrapper>
            <h2 className="section-title" style={{ color: '#FAF9F6', textShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>童声童语</h2>
          </RevealWrapper>
          <RevealWrapper delay={1}>
            <button onClick={() => navigate('/voices')} className="section-link-light">了解更多 →</button>
          </RevealWrapper>
        </div>

        <RevealWrapper delay={1}>
          <p className="section-desc" style={{ color: 'rgba(250, 249, 246, 0.92)' }}>
            孩子们写的诗、拼贴的心愿与想说给世界听的话
          </p>
        </RevealWrapper>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 24 }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ aspectRatio: '1', background: 'rgba(255,255,255,0.18)', borderRadius: 20, padding: 20 }}>
                <Skeleton.Image style={{ width: '100%', height: '100%' }} active />
              </div>
            ))}
          </div>
        ) : voices.length === 0 ? (
          <Empty description="暂无内容" />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 24 }}>
            {voices.map((v, index) => (
              <RevealWrapper key={v.id} delay={index + 1}>
                <div
                  style={{
                    aspectRatio: '1',
                    background: 'rgba(255, 255, 255, 0.18)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: 20,
                    border: '1px solid rgba(255,255,255,0.25)',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', overflow: 'hidden', position: 'relative',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.transform = 'scale(1.05)';
                    el.style.boxShadow = '0 0 32px rgba(107, 175, 146, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.transform = 'scale(1)';
                    el.style.boxShadow = 'none';
                  }}
                  onClick={() => openItem(v)}
                >
                  {v.media_type === 'video' ? (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, background: palette[index % palette.length], opacity: 0.9 }}>
                      🎬
                    </div>
                  ) : fileUrl(v.file_key) ? (
                    <img
                      src={fileUrl(v.file_key)}
                      alt={v.title}
                      loading="lazy"
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, background: palette[index % palette.length], opacity: 0.9 }}>
                      🖼️
                    </div>
                  )}
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s ease' }} className="voices-overlay">
                    <div style={{ textAlign: 'center', padding: '0 12px' }}>
                      <span style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>{v.title}</span>
                      {v.author && <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, margin: '4px 0 0' }}>{v.author}</p>}
                      {v.category && <p style={{ margin: '8px 0 0' }}><Tag color="green" style={{ fontSize: 11 }}>{v.category}</Tag></p>}
                    </div>
                  </div>
                </div>
              </RevealWrapper>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        centered
        width={current?.media_type === 'video' ? 860 : 600}
        styles={{ body: { padding: 0, borderRadius: 20, overflow: 'hidden', background: 'transparent' } }}
      >
        {current && (current.media_type === 'video' ? (
          fileUrl(current.file_key) ? (
            <video
              key={current.file_key}
              src={fileUrl(current.file_key)}
              controls
              autoPlay
              playsInline
              style={{ width: '100%', aspectRatio: '16 / 9', display: 'block', background: '#000', objectFit: 'contain', borderRadius: 20 }}
            />
          ) : (
            <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden' }}>
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <span style={{ fontSize: 64 }}>🎬</span>
                <h3 style={{ color: '#2C3E33', marginTop: 12 }}>{current.title}</h3>
                <p style={{ color: '#999' }}>视频文件尚未上传</p>
              </div>
            </div>
          )
        ) : current.media_type === 'image' && fileUrl(current.file_key) ? (
          <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden' }}>
            <img src={fileUrl(current.file_key)} alt={current.title} style={{ width: '100%', maxHeight: '72vh', objectFit: 'contain', background: '#F6F4EE', display: 'block' }} />
            <div style={{ padding: '14px 20px' }}>
              <h3 style={{ color: '#2C3E33', margin: 0, fontSize: 17 }}>{current.title}</h3>
              {current.author && <p style={{ color: '#6A7A6A', margin: '4px 0 0', fontSize: 14 }}>{current.author}</p>}
              {current.category && <Tag color="green" style={{ marginTop: 10 }}>{current.category}</Tag>}
            </div>
          </div>
        ) : (
          <div style={{ aspectRatio: '1', background: palette[current.id % palette.length], display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}>
            <span style={{ fontSize: 80, marginBottom: 16 }}>🖼️</span>
            <h3 style={{ color: '#2C3E33', margin: 0 }}>{current.title}</h3>
            {current.author && <p style={{ color: '#6A7A6A', margin: '4px 0 0' }}>{current.author}</p>}
            {current.category && <Tag color="green" style={{ marginTop: 12 }}>{current.category}</Tag>}
          </div>
        ))}
      </Modal>

      <style>{`
        .voices-overlay { opacity: 0 !important; }
        div:hover > .voices-overlay { opacity: 1 !important; }
      `}</style>

      <div className="section-transition" style={{ background: 'linear-gradient(180deg, transparent, #7CB342)' }} />
    </section>
  );
}
