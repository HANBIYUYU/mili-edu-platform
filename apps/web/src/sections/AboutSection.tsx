import { useNavigate } from 'react-router-dom';
import RevealWrapper from '../components/RevealWrapper';
import CountUp from '../components/CountUp';

const stats = [
  { value: 128, label: '支教志愿者', suffix: '位' },
  { value: 36, label: '覆盖学校', suffix: '所' },
  { value: 5000, label: '受益儿童', suffix: '+' },
];

export default function AboutSection() {
  const navigate = useNavigate();

  return (
    <section
      id="about"
      style={{
        background: '#FAF9F6',
        padding: '100px 24px',
        position: 'relative',
      }}
    >
      <div className="container" style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* 标题 + 了解更多 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <RevealWrapper>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, lineHeight: 1.2, color: '#2C3E33', margin: 0 }}>
              我们的使命
            </h2>
          </RevealWrapper>
          <RevealWrapper delay={1}>
            <button
              onClick={() => navigate('/about')}
              className="btn-secondary"
              style={{ padding: '10px 24px', fontSize: 14 }}
            >
              了解更多 →
            </button>
          </RevealWrapper>
        </div>

        <RevealWrapper delay={1}>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.8,
              color: '#6A7A6A',
              textAlign: 'center',
              maxWidth: 640,
              margin: '0 auto 40px',
            }}
          >
            米粒支教社致力于为偏远地区儿童提供优质教育资源。
            我们相信，每一份微小的力量都能汇聚成改变世界的光芒。
            通过志愿者支教、在线课程和推普活动，让知识的光芒照进每一个角落。
          </p>
          {/* 装饰分隔线 */}
          <div style={{ width: 60, height: 3, borderRadius: 2, background: '#6BAF92', margin: '0 auto 60px', opacity: 0.4 }} />
        </RevealWrapper>

        {/* 数据统计 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 24,
          }}
        >
          {stats.map((stat, index) => (
            <RevealWrapper key={stat.label} delay={index + 1}>
              <div
                className="glow-card"
                style={{
                  textAlign: 'center',
                  padding: '32px 24px',
                }}
              >
                <div
                  style={{
                    fontSize: 40,
                    fontWeight: 800,
                    color: '#6BAF92',
                    lineHeight: 1,
                    marginBottom: 8,
                  }}
                >
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: '#8A9E8F',
                    fontWeight: 500,
                  }}
                >
                  {stat.label}
                </div>
              </div>
            </RevealWrapper>
          ))}
        </div>
      </div>

      {/* 过渡到 Videos */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 200,
          background: 'linear-gradient(180deg, transparent, rgba(232, 245, 233, 0.6), #E8F5E9)',
          pointerEvents: 'none',
        }}
      />
    </section>
  );
}
