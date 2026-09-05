import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Skeleton, Empty, Tag } from 'antd';
import { PictureOutlined, FilePdfOutlined } from '@ant-design/icons';
import RevealWrapper from '../components/RevealWrapper';
import { artworkAPI } from '../api';
import { fileUrl, isPdfKey } from '../utils/fileUrl';

const palette = ['#E8F5E9', '#FCE4EC', '#FFF3E0', '#E3F2FD', '#FFFDE7', '#F3E5F5'];

interface ArtworkItem {
  id: number;
  title: string;
  child_name?: string;
  media_type?: string;
  file_key?: string;
  thumbnail_key?: string;
}

export default function GallerySection() {
  const navigate = useNavigate();
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
    <section
      id="gallery"
      style={{
        background: '#7CB342',
        padding: '55px 24px',
        position: 'relative',
      }}
    >
      <div className="container" style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* 标题 + 了解更多 */}
        <div className="section-header">
          <RevealWrapper>
            <h2 className="section-title" style={{ color: '#FAF9F6', textShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>儿童画展</h2>
          </RevealWrapper>
          <RevealWrapper delay={1}>
            <button onClick={() => navigate('/gallery')} className="section-link-light">了解更多 →</button>
          </RevealWrapper>
        </div>

        <RevealWrapper delay={1}>
          <p className="section-desc" style={{ color: 'rgba(250, 249, 246, 0.9)' }}>
            孩子们用画笔描绘心中的世界，每一幅作品都闪耀着纯真的光芒
          </p>
        </RevealWrapper>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 24 }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ aspectRatio: '1', background: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: 20 }}>
                <Skeleton.Image style={{ width: '100%', height: '100%' }} active />
              </div>
            ))}
          </div>
        ) : artworks.length === 0 ? (
          <Empty description="暂无作品" />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 24 }}>
            {artworks.map((a, index) => {
              const isPdf = isPdfKey(a.file_key || '');
              const coverKey = a.thumbnail_key || (isPdf ? '' : a.file_key) || '';
              const coverUrl = fileUrl(coverKey);
              return (
                <RevealWrapper key={a.id} delay={index + 1}>
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
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt={a.title}
                        loading="lazy"
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : isPdf ? (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #FFE0B2, #FFCC80)' }}>
                        <FilePdfOutlined style={{ fontSize: 56, color: '#E53935' }} />
                        <Tag color="red" style={{ marginTop: 12 }}>PDF 作品集</Tag>
                      </div>
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, background: palette[index % palette.length], opacity: 0.9 }}>
                        <PictureOutlined style={{ fontSize: 48, color: 'rgba(0,0,0,0.15)' }} />
                      </div>
                    )}
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s ease' }} className="gallery-overlay">
                      <div style={{ textAlign: 'center' }}>
                        <span style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>{a.title}</span>
                        {a.child_name && <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, margin: '4px 0 0' }}>{a.child_name}</p>}
                      </div>
                    </div>
                  </div>
                </RevealWrapper>
              );
            })}
          </div>
        )}
      </div>

      <Modal
        open={lightboxOpen}
        onCancel={() => setLightboxOpen(false)}
        footer={null}
        centered
        width={currentArt && isPdfKey(currentArt.file_key || '') ? 920 : 640}
        styles={{ body: { padding: 0, borderRadius: 20, overflow: 'hidden', background: 'transparent' } }}
      >
        {currentArt && (isPdfKey(currentArt.file_key || '') ? (
          <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden' }}>
            <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
              <h3 style={{ color: '#2C3E33', margin: 0, fontSize: 16 }}>{currentArt.title}</h3>
              <a href={fileUrl(currentArt.file_key)} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: '#6BAF92' }}>
                在新窗口打开 / 下载 →
              </a>
            </div>
            <iframe
              src={fileUrl(currentArt.file_key)}
              title={currentArt.title}
              style={{ width: '100%', height: '72vh', border: 'none', display: 'block', background: '#525659' }}
            />
            {currentArt.child_name && (
              <div style={{ padding: '10px 20px', color: '#6A7A6A', fontSize: 14 }}>小作者：{currentArt.child_name}</div>
            )}
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden' }}>
            {fileUrl(currentArt.file_key) ? (
              <img src={fileUrl(currentArt.file_key)} alt={currentArt.title} style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', background: '#F6F4EE', display: 'block' }} />
            ) : (
              <div style={{ aspectRatio: '1', background: palette[currentArt.id % palette.length], display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <PictureOutlined style={{ fontSize: 80, color: 'rgba(0,0,0,0.1)' }} />
              </div>
            )}
            <div style={{ padding: '14px 20px' }}>
              <h3 style={{ color: '#2C3E33', margin: 0, fontSize: 17 }}>{currentArt.title}</h3>
              {currentArt.child_name && <p style={{ color: '#6A7A6A', margin: '4px 0 0', fontSize: 14 }}>小作者：{currentArt.child_name}</p>}
            </div>
          </div>
        ))}
      </Modal>

      <style>{`
        .gallery-overlay { opacity: 0 !important; }
        div:hover > .gallery-overlay { opacity: 1 !important; }
      `}</style>

      <div className="section-transition" style={{ background: 'linear-gradient(180deg, transparent, #7CB342)' }} />
    </section>
  );
}
