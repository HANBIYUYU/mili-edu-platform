import { useEffect, useState, useCallback } from 'react';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';

const navItems = [
  { id: 'moments', label: '支教拾光' },
  { id: 'about', label: '关于我们' },
  { id: 'videos', label: '示范课程' },
  { id: 'materials', label: '推普资料' },
  { id: 'voices', label: '童声童语' },
  { id: 'gallery', label: '儿童画展' },
  { id: 'contact', label: '联系我们' },
];

export default function TransparentNav() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);

      // 计算当前所在 Section（参考线取导航下方 200px，要求区块同时覆盖参考线上下，避免短区块提前抢占高亮）
      const sectionIds = ['moments', 'about', 'videos', 'materials', 'voices', 'gallery', 'contact'];
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom > 200) {
            setActiveSection(sectionIds[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // 初始计算
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = useCallback((id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 12,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          maxWidth: 1100,
          width: 'calc(100% - 32px)',
          padding: '14px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          borderRadius: scrolled ? 20 : 16,
          background: scrolled ? 'rgba(250, 249, 246, 0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px) saturate(1.2)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px) saturate(1.2)' : 'none',
          border: scrolled ? '1px solid rgba(107, 175, 146, 0.12)' : '1px solid transparent',
          boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.06)' : 'none',
        }}
      >
        {/* Logo */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: scrolled ? '#2C3E33' : '#2C3E33',
            letterSpacing: '-0.02em',
            cursor: 'pointer',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'color 0.3s ease',
          }}
        >
          <img src="/logo.png" alt="米粒支教社" style={{ height: 32, width: 'auto', verticalAlign: 'middle' }} />
          <span>米粒支教社</span>
        </div>

        {/* Desktop Nav */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
          }}
          className="nav-desktop"
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 14,
                whiteSpace: 'nowrap',
                fontWeight: 500,
                color: activeSection === item.id ? '#6BAF92' : scrolled ? '#5a6a5a' : '#5a6a5a',
                cursor: 'pointer',
                padding: '4px 0',
                borderBottom: activeSection === item.id ? '2px solid #6BAF92' : '2px solid transparent',
                transition: 'all 0.3s ease',
                fontFamily: 'inherit',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            fontSize: 20,
            color: scrolled ? '#2C3E33' : '#2C3E33',
            cursor: 'pointer',
          }}
          className="nav-mobile-btn"
        >
          {mobileOpen ? <CloseOutlined /> : <MenuOutlined />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99,
            background: 'rgba(250, 249, 246, 0.95)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 32,
          }}
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 24,
                fontWeight: 600,
                color: activeSection === item.id ? '#6BAF92' : '#2C3E33',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: block !important; }
          nav { top: 8px !important; padding: 12px 20px !important; width: calc(100% - 16px) !important; }
        }
      `}</style>
    </>
  );
}
