import { useEffect, useState } from 'react';
import { Modal, Skeleton, Empty } from 'antd';
import { DownloadOutlined, FilePdfOutlined, FileWordOutlined, FilePptOutlined, ReadOutlined } from '@ant-design/icons';
import PageLayout from '../components/PageLayout';
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

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('全部');

  useEffect(() => {
    materialAPI.list().then((res: any) => {
      setMaterials(res.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const types = ['全部', ...new Set(materials.map((m) => m.file_type).filter(Boolean))];
  const filteredMaterials = filter === '全部' ? materials : materials.filter((m) => m.file_type === filter);

  const handleDownload = (id: number) => {
    // 直接打开下载地址（R2 流式返回，附件下载）
    window.open(materialAPI.downloadUrl(id), '_blank', 'noopener');
  };
  const [reading, setReading] = useState<{ title: string; url: string; id: number } | null>(null);

  return (
    <PageLayout title="推普资料" backTo="/#materials" background="linear-gradient(180deg, #E8F5E9 0%, #C8E6C9 100%)">
      <RevealWrapper>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, color: '#2C3E33', textAlign: 'center', marginBottom: 16, letterSpacing: '-0.02em' }}>
          推普资料
        </h1>
      </RevealWrapper>
      <RevealWrapper delay={1}>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: '#5A7A6A', textAlign: 'center', maxWidth: 560, margin: '0 auto 48px' }}>
          精心整理的教学资料，助力普通话推广与乡村教育发展
        </p>
      </RevealWrapper>

      {/* 类型筛选 */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 40, justifyContent: 'center', flexWrap: 'wrap' }}>
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            style={{
              padding: '8px 20px',
              borderRadius: 20,
              border: filter === t ? 'none' : '1px solid rgba(107, 175, 146, 0.2)',
              background: filter === t ? '#6BAF92' : 'transparent',
              color: filter === t ? '#fff' : '#6A7A6A',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
              textTransform: 'uppercase',
              transition: 'all 0.3s ease',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.7)', borderRadius: 16 }}>
              <Skeleton active paragraph={{ rows: 1 }} />
            </div>
          ))}
        </div>
      ) : filteredMaterials.length === 0 ? (
        <Empty description="暂无资料" />
      ) : (
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredMaterials.map((m, index) => {
            const meta = typeMeta[m.file_type] || defaultTypeMeta;
            return (
              <RevealWrapper key={m.id} delay={index}>
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
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: meta.bgColor, color: meta.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                    {meta.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#2C3E33', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {m.title}
                    </div>
                    <div style={{ fontSize: 12, color: '#9A9A8A' }}>
                      {m.description || m.file_type?.toUpperCase()} · {m.file_type?.toUpperCase()}
                      {m.file_size ? ` · ${fmtSize(m.file_size)}` : ''}
                    </div>
                  </div>
                  {m.file_type === 'pdf' && (
                    <button
                      title="在线阅读 PDF"
                      style={{ width: 40, height: 40, borderRadius: 10, border: 'none', background: '#7CB342', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, marginRight: 10, transition: 'all 0.3s ease' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
                      onClick={(e) => { e.stopPropagation(); setReading({ title: m.title, url: fileUrl(m.file_key), id: m.id }); }}
                    >
                      <ReadOutlined />
                    </button>
                  )}
                  <button
                    title="下载文件"
                    style={{ width: 40, height: 40, borderRadius: 10, border: 'none', background: '#6BAF92', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'all 0.3s ease' }}
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
    </PageLayout>
  );
}
