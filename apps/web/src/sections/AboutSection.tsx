import { useNavigate } from 'react-router-dom';
import RevealWrapper from '../components/RevealWrapper';
import CountUp from '../components/CountUp';

const stats = [
  { value: 300, label: '支教志愿者', suffix: '+' },
  { value: 7, label: '覆盖学校', suffix: '所' },
  { value: 2000, label: '受益儿童', suffix: '+' },
];

export default function AboutSection() {
  const navigate = useNavigate();

  return (
    <section
      id="about"
      style={{
        background: '#FAF9F6',
        padding: '55px 24px',
        position: 'relative',
      }}
    >
      <div className="container" style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* 标题 + 了解更多 */}
        <div className="section-header">
          <RevealWrapper>
            <h2 className="section-title" style={{ color: '#2C3E33' }}>关注成长，为爱助跑</h2>
          </RevealWrapper>
          <RevealWrapper delay={1}>
            <button onClick={() => navigate('/about')} className="btn-secondary" style={{ padding: '10px 24px', fontSize: 14 }}>了解更多 →</button>
          </RevealWrapper>
        </div>

        <RevealWrapper delay={1}>
          <p className="section-desc" style={{ color: '#6A7A6A', maxWidth: 640 }}>
            上海大学米粒支教社成立于2013年，致力于推广延续性支教活动，
            为全校支教队伍提供全方位支教前后期服务。
            目前运营「为爱助跑」暑期支教、蓝信封通信大使、「童年一课」线上支教等长期项目。
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
      <div className="section-transition" style={{ background: 'linear-gradient(180deg, transparent, #E8F5E9)' }} />
    </section>
  );
}
