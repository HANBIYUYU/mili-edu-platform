import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Skeleton, Empty, message } from 'antd';
import { DownloadOutlined, FilePdfOutlined, FileWordOutlined, FilePptOutlined } from '@ant-design/icons';
import RevealWrapper from '../components/RevealWrapper';
import { materialAPI } from '../api';

const typeMeta: Record<string, { color: string; bgColor: string; icon: React.ReactNode }> = {
  pdf:  { color: '#E57373', bgColor: '#FFEBEE', icon: <FilePdfOutlined /> },
  doc:  { color: '#64B5F6', bgColor: '#E3F2FD', icon: <FileWordOutlined /> },
  docx: { color: '#64B5F6', bgColor: '#E3F2FD', icon: <FileWordOutlined /> },
  ppt:  { color: '#FFB74D', bgColor: '#FFF3E0', icon: <FilePptOutlined /> },
  pptx: { color: '#FFB74D', bgColor: '#FFF3E0', icon: <FilePptOutlined /> },
};

const defaultTypeMeta = { color: '#6BAF92', bgColor: '#E8F5E9', icon: <FilePdfOutlined /> };

export default function MaterialsSection() {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    materialAPI.list().then((res: any) => {
      setMaterials(res.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const handleDownload = async (id: number) => {
    try {
      const res: any = await materialAPI.download(id);
      message.info(res.message || '下载功能待启用');
    } catch (err: any) {
      message.error(err.message || '下载失败');
    }
  };

  return (
    <section
      id="materials"
      style={{
        background: 'linear-gradient(180deg, #C8E6C9 0%, #A5D6A7 100%)',
        padding: '100px 24px',
        position: 'relative',
      }}
    >
      <div className="container" style={{ maxWidth: 1000, margin: '0 auto' }}>
        {/* 标题 + 了解更多 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <RevealWrapper>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, lineHeight: 1.2, color: '#2C3E33', margin: 0 }}>
              推普资料
            </h2>
          </RevealWrapper>
          <RevealWrapper delay={1}>
            <button
              onClick={() => navigate('/materials')}
              className="btn-secondary"
              style={{ padding: '10px 24px', fontSize: 14 }}
            >
              了解更多 →
            </button>
          </RevealWrapper>
        </div>

        <RevealWrapper delay={1}>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: '#5A7A6A', textAlign: 'center', maxWidth: 560, margin: '0 auto 60px' }}>
            精心整理的教学资料，助力普通话推广与乡村教育发展
          </p>
        </RevealWrapper>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.7)', borderRadius: 16 }}>
                <Skeleton active paragraph={{ rows: 1 }} />
              </div>
            ))}
          </div>
        ) : materials.length === 0 ? (
          <Empty description="暂无资料" />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {materials.map((m, index) => {
              const meta = typeMeta[m.file_type] || defaultTypeMeta;
              return (
                <RevealWrapper key={m.id} delay={index + 1}>
                  <div
                    style={{
                      display: 'flex', alignItems: 'center', gap: 16,
                      padding: '16px 20px',
                      background: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(8px)',
                      borderRadius: 16,
                      border: '1px solid rgba(255,255,255,0.3)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.background = '#fff';
                      (e.currentTarget as HTMLDivElement).style.borderLeft = '3px solid #6BAF92';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.background = 'rgba(255, 255, 255, 0.7)';
                      (e.currentTarget as HTMLDivElement).style.borderLeft = '1px solid rgba(255,255,255,0.3)';
                    }}
                  >
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: meta.bgColor, color: meta.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                      {meta.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#2C3E33', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {m.title}
                      </div>
                      <div style={{ fontSize: 12, color: '#9A9A8A' }}>
                        {m.description || m.file_type?.toUpperCase()}
                      </div>
                    </div>
                    <button
                      style={{ width: 36, height: 36, borderRadius: 10, border: 'none', background: '#6BAF92', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'all 0.3s ease' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
                      onClick={(e) => { e.stopPropagation(); handleDownload(m.id); }}
                    >
                      <DownloadOutlined />
                    </button>
                  </div>
                </RevealWrapper>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 200, background: 'linear-gradient(180deg, transparent, rgba(139, 188, 156, 0.6), #8BBC9C)', pointerEvents: 'none' }} />
    </section>
  );
}
