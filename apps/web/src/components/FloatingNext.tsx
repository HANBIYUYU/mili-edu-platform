import { useEffect, useState, useCallback } from 'react';

const sections = ['about', 'videos', 'materials', 'gallery', 'contact'];

export default function FloatingNext() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // 判断当前所在 section
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.5) {
            setCurrent(i);
            break;
          }
        }
      }

      // Hero 区域不显示
      const aboutEl = document.getElementById('about');
      const inHero = aboutEl ? aboutEl.getBoundingClientRect().top > window.innerHeight * 0.8 : false;

      // 滚动到页面最底部时隐藏（Footer 区域）
      const scrollBottom = window.innerHeight + window.scrollY;
      const pageBottom = document.documentElement.scrollHeight;
      setVisible(!inHero && pageBottom - scrollBottom > 120);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isLast = current >= sections.length - 1;

  const handleClick = useCallback(() => {
    if (isLast) {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      const next = document.getElementById(sections[current + 1]);
      next?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [current, isLast]);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: `translateX(-50%) translateY(${visible ? 0 : 120}px)`,
        zIndex: 99,
        padding: '10px 24px',
        borderRadius: 28,
        background: 'rgba(250, 249, 246, 0.85)',
        backdropFilter: 'blur(16px) saturate(1.2)',
        WebkitBackdropFilter: 'blur(16px) saturate(1.2)',
        border: '1px solid rgba(107, 175, 146, 0.15)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        cursor: 'pointer',
        fontSize: 14,
        fontWeight: 600,
        color: '#2C3E33',
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease',
        fontFamily: 'inherit',
        borderStyle: 'solid',
      }}
      onClick={handleClick}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 28px rgba(0,0,0,0.12)';
        (e.currentTarget as HTMLDivElement).style.transform = `translateX(-50%) translateY(${visible ? -2 : 120}px)`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 24px rgba(0,0,0,0.08)';
        (e.currentTarget as HTMLDivElement).style.transform = `translateX(-50%) translateY(${visible ? 0 : 120}px)`;
      }}
    >
      <span>{isLast ? '返回起点' : '继续探索'}</span>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
        style={{ transform: isLast ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }}>
        <path d="M4 6L8 10L12 6" stroke="#2C3E33" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}
