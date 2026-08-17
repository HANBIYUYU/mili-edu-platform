import { useEffect, useMemo, useState } from 'react';
import { Modal, Skeleton, Empty } from 'antd';
import RevealWrapper from '../components/RevealWrapper';
import { momentAPI } from '../api';

const palette = ['#FFF3E0', '#FCE4EC', '#E8F5E9', '#E3F2FD', '#FFFDE7', '#F3E5F5'];

interface MomentItem {
  id: number;
  year: number;
  title?: string;
  file_key?: string;
}

export default function MomentsSection() {
  const [moments, setMoments] = useState<MomentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeYear, setActiveYear] = useState<number | null>(null);

  useEffect(() => {
    momentAPI.list().then((res: any) => {
      setMoments(res.data || []);
    }).finally(() => setLoading(false));
  }, []);

  // 按年份升序排列
  const years = useMemo(() => {
    return [...new Set(moments.map((m) => m.year))].sort((a, b) => a - b);
  }, [moments]);

  const yearMoments = useMemo(() => {
    return moments.filter((m) => m.year === activeYear);
  }, [moments, activeYear]);

  return (
    <section
      id="moments"
      style={{
        background: '#F8EBD4',
        padding: '55px 24px',
        position: 'relative',
      }}
    >
      <div className="container" style={{ maxWidth: 1100, margin: '0 auto' }}>
        <RevealWrapper>
          <h2 className="section-title" style={{ color: '#2C3E33', textAlign: 'center' }}>支教拾光</h2>
        </RevealWrapper>

        <RevealWrapper delay={1}>
          <p className="section-desc" style={{ color: '#6A7A6A' }}>
            按下时光的快门，回顾每一年的支教记忆
          </p>
        </RevealWrapper>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton.Button key={i} active style={{ width: 110, height: 48 }} />
            ))}
          </div>
        ) : years.length === 0 ? (
          <Empty description="暂无支教影像" />
        ) : (
          <RevealWrapper delay={2}>
            {/* 年份平铺 */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setActiveYear(year)}
                  style={{
                    padding: '14px 32px',
                    borderRadius: 32,
                    border: 'none',
                    background: activeYear === year ? '#7CB342' : '#6BAF92',
                    color: '#fff',
                    fontSize: 22,
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    boxShadow: activeYear === year ? '0 8px 24px rgba(124, 179, 66, 0.4)' : '0 6px 20px rgba(107, 175, 146, 0.25)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 10px 28px rgba(107, 175, 146, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = activeYear === year ? '0 8px 24px rgba(124, 179, 66, 0.4)' : '0 6px 20px rgba(107, 175, 146, 0.25)';
                  }}
                >
                  {year}
                </button>
              ))}
            </div>
          </RevealWrapper>
        )}
      </div>

      {/* 悬浮：该年份的照片 */}
      <Modal
        open={activeYear !== null}
        onCancel={() => setActiveYear(null)}
        footer={null}
        centered
        width={860}
        title={activeYear ? `${activeYear} 年的支教记忆` : ''}
      >
        {yearMoments.length === 0 ? (
          <Empty description="该年份暂无照片" />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
            {yearMoments.map((m, index) => (
              <div key={m.id} style={{ background: palette[index % palette.length], borderRadius: 16, overflow: 'hidden', transition: 'transform 0.3s ease' }}>
                <div style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56 }}>
                  🖼️
                </div>
                {m.title && (
                  <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.7)', fontSize: 13, color: '#2C3E33', textAlign: 'center' }}>
                    {m.title}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Modal>

      <div className="section-transition" style={{ background: 'linear-gradient(180deg, transparent, #FAF9F6)' }} />
    </section>
  );
}
