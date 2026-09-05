import { useEffect, useState } from 'react';
import { Modal, Skeleton, Empty, Tag } from 'antd';
import PageLayout from '../components/PageLayout';
import RevealWrapper from '../components/RevealWrapper';
import { voiceAPI } from '../api';
import { fileUrl } from '../utils/fileUrl';

const palette = ['#FFF3E0', '#FCE4EC', '#E8F5E9', '#E3F2FD', '#FFFDE7', '#F3E5F5'];

const categories = ['全部', '儿童诗', '拼贴诗', '心愿', '留言'];

interface VoiceItem {
  id: number;
  title: string;
  author?: string;
  media_type?: string;
  category?: string;
  file_key?: string;
  iframe_src?: string;
}

export default function VoicesPage() {
  const [voices, setVoices] = useState<VoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('全部');
  const [modalOpen, setModalOpen] = useState(false);
  const [current, setCurrent] = useState<VoiceItem | null>(null);

  useEffect(() => {
    voiceAPI.list().then((res: any) => {
      setVoices(res.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const filteredVoices = filter === '全部' ? voices : voices.filter((v) => v.category === filter);

  const openItem = (item: VoiceItem) => {
    setCurrent(item);
    setModalOpen(true);
  };

  return (
    <PageLayout title="童声童语" backTo="/#voices" background="linear-gradient(180deg, #AED581 0%, #7CB342 100%)">
      <RevealWrapper>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, color: '#FAF9F6', textAlign: 'center', marginBottom: 16, letterSpacing: '-0.02em', textShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          童声童语
        </h1>
      </RevealWrapper>
      <RevealWrapper delay={1}>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(250, 249, 246, 0.9)', textAlign: 'center', maxWidth: 560, margin: '0 auto 32px' }}>
          孩子们写的诗、拼贴的心愿与想说给世界听的话
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
              border: filter === cat ? 'none' : '1px solid rgba(255,255,255,0.4)',
              background: filter === cat ? '#fff' : 'transparent',
              color: filter === cat ? '#6BAF92' : '#FAF9F6',
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} style={{ aspectRatio: '1', background: 'rgba(255,255,255,0.18)', borderRadius: 20, padding: 20 }}>
              <Skeleton.Image style={{ width: '100%', height: '100%' }} active />
            </div>
          ))}
        </div>
      ) : filteredVoices.length === 0 ? (
        <Empty description="暂无内容" />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
          {filteredVoices.map((v, index) => (
            <RevealWrapper key={v.id} delay={index}>
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
    </PageLayout>
  );
}
