import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import CountUp from '../components/CountUp';
import RevealWrapper from '../components/RevealWrapper';

const stats = [
  { value: 128, label: '支教志愿者', suffix: '位' },
  { value: 36, label: '覆盖学校', suffix: '所' },
  { value: 5000, label: '受益儿童', suffix: '+' },
  { value: 12, label: '合作省份', suffix: '个' },
];

const milestones = [
  { year: '2018', title: '社团成立', desc: '米粒支教社在上海正式成立，第一批志愿者踏上支教之路。' },
  { year: '2019', title: '首次夏令营', desc: '举办第一届暑期支教夏令营，覆盖 3 所学校、200+ 儿童。' },
  { year: '2020', title: '线上转型', desc: '疫情之下开启线上课程模式，累计录制课程 50+ 节。' },
  { year: '2022', title: '推普计划', desc: '启动普通话推广专项计划，覆盖 8 个偏远地区学校。' },
  { year: '2024', title: '知行杯', desc: '入选"知行杯"暑期社会实践项目，影响力持续扩大。' },
  { year: '2026', title: '数字平台', desc: '上线数字化平台，整合课程、资料、画展等资源。' },
];

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <PageLayout title="关于我们">
      {/* 使命宣言 */}
      <section style={{ marginBottom: 80 }}>
        <RevealWrapper>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, color: '#2C3E33', textAlign: 'center', marginBottom: 24, letterSpacing: '-0.02em' }}>
            我们的使命
          </h1>
        </RevealWrapper>
        <RevealWrapper delay={1}>
          <p style={{ fontSize: 18, lineHeight: 2, color: '#6A7A6A', textAlign: 'center', maxWidth: 720, margin: '0 auto 20px' }}>
            米粒支教社致力于为偏远地区儿童提供优质教育资源。
          </p>
          <p style={{ fontSize: 16, lineHeight: 2, color: '#6A7A6A', textAlign: 'center', maxWidth: 720, margin: '0 auto 60px' }}>
            我们相信，每一份微小的力量都能汇聚成改变世界的光芒。从最初的几名志愿者到如今遍布全国的支教网络，
            米粒支教社始终秉持「以教育连接世界，以爱心点亮未来」的理念。通过志愿者支教、在线课程、推普活动
            和儿童艺术教育，我们努力让知识的光芒照进每一个角落。
          </p>
        </RevealWrapper>

        {/* 统计 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24, marginBottom: 80 }}>
          {stats.map((stat, index) => (
            <RevealWrapper key={stat.label} delay={index + 1}>
              <div className="glow-card" style={{ textAlign: 'center', padding: '32px 24px' }}>
                <div style={{ fontSize: 40, fontWeight: 800, color: '#6BAF92', lineHeight: 1, marginBottom: 8 }}>
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </div>
                <div style={{ fontSize: 14, color: '#8A9E8F', fontWeight: 500 }}>{stat.label}</div>
              </div>
            </RevealWrapper>
          ))}
        </div>
      </section>

      {/* 发展历程 */}
      <section style={{ marginBottom: 80 }}>
        <RevealWrapper>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#2C3E33', textAlign: 'center', marginBottom: 48 }}>
            发展历程
          </h2>
        </RevealWrapper>
        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative' }}>
          <div style={{ position: 'absolute', left: 32, top: 0, bottom: 0, width: 2, background: 'rgba(107, 175, 146, 0.2)' }} />
          {milestones.map((m, index) => (
            <RevealWrapper key={m.year} delay={index}>
              <div style={{ position: 'relative', paddingLeft: 80, marginBottom: 40 }}>
                <div style={{
                  position: 'absolute', left: 24, top: 4, width: 18, height: 18, borderRadius: '50%',
                  background: '#6BAF92', border: '3px solid #FAF9F6',
                  boxShadow: '0 2px 8px rgba(107, 175, 146, 0.3)',
                }} />
                <div style={{ fontSize: 13, color: '#6BAF92', fontWeight: 700, marginBottom: 4 }}>{m.year}</div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#2C3E33', marginBottom: 6 }}>{m.title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: '#6A7A6A', margin: 0 }}>{m.desc}</p>
              </div>
            </RevealWrapper>
          ))}
        </div>
      </section>

      {/* 核心团队（占位） */}
      <section style={{ marginBottom: 60 }}>
        <RevealWrapper>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#2C3E33', textAlign: 'center', marginBottom: 48 }}>
            核心团队
          </h2>
        </RevealWrapper>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
          {['创始人 & 社长', '教学总监', '运营总监', '技术负责人'].map((role, index) => (
            <RevealWrapper key={role} delay={index}>
              <div className="glow-card" style={{ textAlign: 'center', padding: '40px 24px' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
                  🌱
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#2C3E33', marginBottom: 4 }}>期待你的加入</h3>
                <p style={{ fontSize: 13, color: '#9A9A8A', margin: 0 }}>{role}</p>
              </div>
            </RevealWrapper>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div style={{ textAlign: 'center', paddingBottom: 20 }}>
        <p style={{ fontSize: 16, color: '#6A7A6A', marginBottom: 24 }}>想了解更多，或加入我们的团队？</p>
        <button onClick={() => navigate('/contact')} className="btn-primary">
          联系我们
        </button>
      </div>
    </PageLayout>
  );
}
