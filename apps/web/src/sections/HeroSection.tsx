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
        background: 'linear-gradient(10deg, #DBA55A 0%, #EDCC80 35%, #F5E6C8 65%, #DBA55A 100%)',
        padding: 'clamp(80px, 12vh, 140px) 24px clamp(60px, 8vh, 100px)',
      }}
    >
      {/* 动画定义 */}
      <style>{`
        @keyframes glowPulse1 {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.6; }
        }
        @keyframes glowPulse2 {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.7; }
        }
        @keyframes glowPulse3 {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(8px, -12px); }
        }
        @keyframes lightShift1 {
          0%, 100% { transform: rotate(25deg) translateY(0); }
          50% { transform: rotate(28deg) translateY(-30px); }
        }
        @keyframes lightShift2 {
          0%, 100% { transform: rotate(20deg) translateY(0); }
          50% { transform: rotate(17deg) translateY(20px); }
        }
        @keyframes lightShift3 {
          0%, 100% { transform: rotate(30deg) translateY(0); }
          50% { transform: rotate(33deg) translateY(-15px); }
        }
      `}</style>

      {/* 光晕1 — 右上 呼吸 + 漂浮 */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          right: '1%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, transparent 75%)',
          pointerEvents: 'none',
          animation: 'glowPulse1 6s ease-in-out infinite, float1 8s ease-in-out infinite',
        }}
      />
      {/* 光晕2 — 左下 呼吸 */}
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '5%',
          width: 350,
          height: 350,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.75) 0%, transparent 75%)',
          pointerEvents: 'none',
          animation: 'glowPulse2 5s ease-in-out infinite 1s',
        }}
      />
      {/* 光晕3 — 中间 呼吸 */}
      <div
        style={{
          position: 'absolute',
          top: '35%',
          left: '25%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.65) 0%, transparent 70%)',
          pointerEvents: 'none',
          animation: 'glowPulse3 4s ease-in-out infinite 2s',
        }}
      />

      {/* 光带1 — 斜向流转 */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '30%',
          width: 3,
          height: '180%',
          background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.35) 30%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.35) 70%, transparent 100%)',
          pointerEvents: 'none',
          filter: 'blur(1px)',
          animation: 'lightShift1 12s ease-in-out infinite',
        }}
      />
      {/* 光带2 — 斜向流转 */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '55%',
          width: 2,
          height: '150%',
          background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.2) 20%, rgba(255,255,255,0.4) 45%, rgba(255,255,255,0.2) 80%, transparent 100%)',
          pointerEvents: 'none',
          filter: 'blur(1.5px)',
          animation: 'lightShift2 15s ease-in-out infinite',
        }}
      />
      {/* 光带3 — 斜向流转 */}
      <div
        style={{
          position: 'absolute',
          top: '-30%',
          left: '70%',
          width: 1.5,
          height: '200%',
          background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.15) 25%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.15) 75%, transparent 100%)',
          pointerEvents: 'none',
          filter: 'blur(2px)',
          animation: 'lightShift3 10s ease-in-out infinite',
        }}
      />
      {/* 光带4 — 更粗的主光带 */}
      <div
        style={{
          position: 'absolute',
          top: '-40%',
          left: '15%',
          width: 4,
          height: '220%',
          background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.2) 25%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0.2) 75%, transparent 100%)',
          pointerEvents: 'none',
          filter: 'blur(2px)',
          animation: 'lightShift1 18s ease-in-out infinite 3s',
        }}
      />
      {/* 光带5 — 细光带 */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '42%',
          width: 1,
          height: '160%',
          background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.1) 30%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.1) 70%, transparent 100%)',
          pointerEvents: 'none',
          filter: 'blur(1px)',
          animation: 'lightShift3 14s ease-in-out infinite 2s',
        }}
      />
      {/* 光带6 — 右侧边缘光 */}
      <div
        style={{
          position: 'absolute',
          top: '-25%',
          left: '85%',
          width: 2.5,
          height: '190%',
          background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0.15) 80%, transparent 100%)',
          pointerEvents: 'none',
          filter: 'blur(2px)',
          animation: 'lightShift2 16s ease-in-out infinite 4s',
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
          <img
            src="/logo.png"
            alt="米粒支教社"
            style={{
              width: 'clamp(80px, 12vw, 140px)',
              height: 'auto',
              marginBottom: 24,
              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.06))',
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
              color: '#2C3E33',
              marginBottom: 20,
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
              background: 'linear-gradient(135deg, #6BAF92 0%, #F5A623 100%)',
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
              color: '#7a6a4a',
              maxWidth: 520,
              margin: '0 auto 40px',
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

      {/* 滚动提示 — 外层居中，内层弹跳 */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1,
        }}
      >
        <div className="scroll-hint" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 17, color: 'rgba(122, 106, 74, 0.5)', letterSpacing: '0.1em' }}>向下滑动</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6L8 10L12 6" stroke="rgba(122, 106, 74, 0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* 底部过渡 */}
      <div className="section-transition" style={{ background: 'linear-gradient(180deg, transparent 0%, transparent 35%, rgba(248, 235, 212, 0.3) 70%, #F8EBD4 100%)' }} />
    </section>
  );
}