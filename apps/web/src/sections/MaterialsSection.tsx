import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Skeleton, Empty } from 'antd';
import { DownloadOutlined, FilePdfOutlined, FileWordOutlined, FilePptOutlined, ReadOutlined } from '@ant-design/icons';
import RevealWrapper from '../components/RevealWrapper';
import { materialAPI } from '../api';
import { fileUrl, fmtSize } from '../utils/fileUrl';

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

  const handleDownload = (id: number) => {
    // 直接打开下载地址（R2 流式返回，附件下载）
    window.open(materialAPI.downloadUrl(id), '_blank', 'noopener');
  };
  const [reading, setReading] = useState<{ title: string; url: string; id: number } | null>(null);

  return (
    <section
      id="materials"
      style={{
        background: '#C8E6C9',
        padding: '55px 24px',
        position: 'relative',
      }}
    >
      <div className="container" style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* 标题 + 了解更多 */}
        <div className="section-header">
          <RevealWrapper>
            <h2 className="section-title" style={{ color: '#2C3E33' }}>推普资料</h2>
          </RevealWrapper>
          <RevealWrapper delay={1}>
            <button onClick={() => navigate('/materials')} className="btn-secondary" style={{ padding: '10px 24px', fontSize: 14 }}>了解更多 →</button>
          </RevealWrapper>
        </div>

        <RevealWrapper delay={1}>
          <p className="section-desc" style={{ color: '#5A7A6A' }}>
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
                      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                      (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.background = 'rgba(255, 255, 255, 0.7)';
                      (e.currentTarget as HTMLDivElement).style.borderLeft = '1px solid rgba(255,255,255,0.3)';
                      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                      (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
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
                        {m.file_size ? ` · ${fmtSize(m.file_size)}` : ''}
                      </div>
                    </div>
                    {m.file_type === 'pdf' && (
                      <button
                        title="在线阅读 PDF"
                        style={{ width: 36, height: 36, borderRadius: 10, border: 'none', background: '#7CB342', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, marginRight: 8, transition: 'all 0.3s ease' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
                        onClick={(e) => { e.stopPropagation(); setReading({ title: m.title, url: fileUrl(m.file_key), id: m.id }); }}
                      >
                        <ReadOutlined />
                      </button>
                    )}
                    <button
                      title="下载文件"
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

      {/* PDF 在线阅读 */}
      <Modal
        open={!!reading}
        onCancel={() => setReading(null)}
        footer={null}
        width={920}
        centered
        destroyOnClose
        title={
          reading ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 15 }}>{reading.title}</span>
              <a href={materialAPI.downloadUrl(reading.id)} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: '#6BAF92' }}>
                下载 PDF →
              </a>
            </div>
          ) : undefined
        }
      >
        {reading && (
          <iframe
            key={reading.url}
            src={reading.url}
            title={reading.title}
            style={{ width: '100%', height: '72vh', border: 'none', borderRadius: 10, background: '#525659' }}
          />
        )}
      </Modal>

      <div className="section-transition" style={{ background: 'linear-gradient(180deg, transparent, #AED581)' }} />
    </section>
  );
}
