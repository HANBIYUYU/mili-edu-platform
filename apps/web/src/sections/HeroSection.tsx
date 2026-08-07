import RevealWrapper from '../components/RevealWrapper';

export default function HeroSection() {
  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #2C3E33 0%, #3D6B52 25%, #6BAF92 55%, #C8E6C9 75%, #FAF9F6 100%)',
        padding: 'clamp(80px, 12vh, 140px) 24px clamp(60px, 8vh, 100px)',
      }}
    >
      {/* 装饰光晕 */}
      <div
        className="hero-orb"
        style={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(107, 175, 146, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        className="hero-orb"
        style={{
          position: 'absolute',
          bottom: '25%',
          left: '5%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 166, 35, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          textAlign: 'center',
          maxWidth: 720,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <RevealWrapper delay={0}>
          {/* Logo */}
          <img
            src="/logo.png"
            alt="米粒支教社"
            style={{
              width: 'clamp(80px, 12vw, 140px)',
              height: 'auto',
              marginBottom: 24,
              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))',
            }}
          />
        </RevealWrapper>

        <RevealWrapper delay={0}>
          <div
            style={{
              fontSize: 'clamp(40px, 6vw, 72px)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#FAF9F6',
              marginBottom: 20,
              textShadow: '0 2px 16px rgba(0,0,0,0.2)',
            }}
          >
            米粒支教社
          </div>
        </RevealWrapper>

        <RevealWrapper delay={1}>
          <div
            style={{
              fontSize: 'clamp(20px, 3vw, 32px)',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #F5A623 0%, #F5D89A 50%, #FAF9F6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: 24,
            }}
          >
            点亮乡村教育的微光
          </div>
        </RevealWrapper>

        <RevealWrapper delay={2}>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.8,
              color: 'rgba(250, 249, 246, 0.85)',
              maxWidth: 520,
              margin: '0 auto 40px',
              textShadow: '0 1px 4px rgba(0,0,0,0.1)',
            }}
          >
            我们汇聚每一份微小的力量，为偏远地区的孩子们带去知识与希望。
            让教育的光芒，照亮每一个角落。
          </p>
        </RevealWrapper>

        <RevealWrapper delay={3}>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary"
            >
              了解我们 ↓
            </button>
          </div>
        </RevealWrapper>
      </div>

      {/* 滚动提示 */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
        }}
        className="scroll-hint"
      >
        <span style={{ fontSize: 11, color: 'rgba(250, 249, 246, 0.6)', letterSpacing: '0.1em' }}>向下滚动</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 6L8 10L12 6" stroke="rgba(250, 249, 246, 0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* 底部过渡到 About — 加高 */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 200,
          background: 'linear-gradient(180deg, transparent, rgba(250, 249, 246, 0.6), #FAF9F6)',
          pointerEvents: 'none',
        }}
      />
    </section>
  );
}
