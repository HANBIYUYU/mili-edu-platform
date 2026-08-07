import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

interface PageLayoutProps {
  title: string;
  background?: string;
  children: ReactNode;
}

export default function PageLayout({ title, background = '#FAF9F6', children }: PageLayoutProps) {
  const navigate = useNavigate();

  return (
    <div style={{ background, minHeight: '100vh' }}>
      {/* 顶部简化导航 */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: '14px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(250, 249, 246, 0.85)',
          backdropFilter: 'blur(16px) saturate(1.2)',
          WebkitBackdropFilter: 'blur(16px) saturate(1.2)',
          borderBottom: '1px solid rgba(107, 175, 146, 0.12)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
        }}
      >
        {/* Logo + 返回首页 */}
        <div
          onClick={() => navigate('/')}
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: '#2C3E33',
            letterSpacing: '-0.02em',
            cursor: 'pointer',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <img src="/logo.png" alt="米粒支教社" style={{ height: 32, width: 'auto', verticalAlign: 'middle' }} />
          <span>米粒支教社</span>
        </div>

        {/* 当前页面标题 + 返回 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#6BAF92' }}>{title}</span>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '8px 20px',
              fontSize: 13,
              borderRadius: 20,
              border: '1px solid rgba(107, 175, 146, 0.2)',
              background: 'transparent',
              color: '#6A7A6A',
              cursor: 'pointer',
              fontWeight: 500,
              fontFamily: 'inherit',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#6BAF92';
              (e.currentTarget as HTMLButtonElement).style.color = '#6BAF92';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(107, 175, 146, 0.2)';
              (e.currentTarget as HTMLButtonElement).style.color = '#6A7A6A';
            }}
          >
            ← 返回首页
          </button>
        </div>
      </nav>

      {/* 内容区 */}
      <main style={{ paddingTop: 100, paddingBottom: 80, minHeight: '60vh' }}>
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
