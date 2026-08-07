import { useEffect, useState } from 'react';
import { Modal, Skeleton, Empty } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import PageLayout from '../components/PageLayout';
import RevealWrapper from '../components/RevealWrapper';
import { artworkAPI } from '../api';

const palette = ['#E8F5E9', '#FCE4EC', '#FFF3E0', '#E3F2FD', '#FFFDE7', '#F3E5F5'];

interface ArtworkItem {
  id: number;
  title: string;
  child_name?: string;
  media_type?: string;
  file_key?: string;
}

export default function GalleryPage() {
  const [artworks, setArtworks] = useState<ArtworkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentArt, setCurrentArt] = useState<ArtworkItem | null>(null);

  useEffect(() => {
    artworkAPI.list({ media_type: 'image' }).then((res: any) => {
      setArtworks(res.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const openLightbox = (art: ArtworkItem) => {
    setCurrentArt(art);
    setLightboxOpen(true);
  };

  return (
    <PageLayout title="儿童画展" backTo="/#gallery" background="linear-gradient(180deg, #C8E6C9 0%, #6BAF92 50%, #8BBC9C 100%)">
      <RevealWrapper>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, color: '#FAF9F6', textAlign: 'center', marginBottom: 16, letterSpacing: '-0.02em', textShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          儿童画展
        </h1>
      </RevealWrapper>
      <RevealWrapper delay={1}>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(250, 249, 246, 0.9)', textAlign: 'center', maxWidth: 560, margin: '0 auto 48px' }}>
          孩子们用画笔描绘心中的世界，每一幅作品都闪耀着纯真的光芒。这里有来自全国各地孩子们的精彩画作。
        </p>
      </RevealWrapper>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} style={{ aspectRatio: '1', background: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: 20 }}>
              <Skeleton.Image style={{ width: '100%', height: '100%' }} active />
            </div>
          ))}
        </div>
      ) : artworks.length === 0 ? (
        <Empty description="暂无作品" />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
          {artworks.map((a, index) => (
            <RevealWrapper key={a.id} delay={index}>
              <div
                style={{
                  aspectRatio: '1',
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 20,
                  border: '1px solid rgba(255,255,255,0.2)',
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
                onClick={() => openLightbox(a)}
              >
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 72, background: palette[index % palette.length], opacity: 0.9 }}>
                  <PictureOutlined style={{ fontSize: 52, color: 'rgba(0,0,0,0.12)' }} />
                </div>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s ease' }} className="gallery-overlay">
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>{a.title}</span>
                    {a.child_name && <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, margin: '4px 0 0' }}>{a.child_name}</p>}
                  </div>
                </div>
              </div>
            </RevealWrapper>
          ))}
        </div>
      )}

      <Modal
        open={lightboxOpen}
        onCancel={() => setLightboxOpen(false)}
        footer={null}
        centered
        width={600}
        styles={{ body: { padding: 0, borderRadius: 20, overflow: 'hidden', background: 'transparent' } }}
      >
        {currentArt && (
          <div style={{ aspectRatio: '1', background: palette[currentArt.id % palette.length], display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}>
            <PictureOutlined style={{ fontSize: 80, color: 'rgba(0,0,0,0.1)', marginBottom: 16 }} />
            <h3 style={{ color: '#2C3E33', margin: 0 }}>{currentArt.title}</h3>
            {currentArt.child_name && <p style={{ color: '#6A7A6A', margin: '4px 0 0' }}>{currentArt.child_name}</p>}
          </div>
        )}
      </Modal>

      <style>{`
        .gallery-overlay { opacity: 0 !important; }
        div:hover > .gallery-overlay { opacity: 1 !important; }
      `}</style>
    </PageLayout>
  );
}
