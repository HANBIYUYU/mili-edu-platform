import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import CountUp from '../components/CountUp';
import RevealWrapper from '../components/RevealWrapper';

const stats = [
  { value: 6, label: '长期实践基地', suffix: '处' },
  { value: 128, label: '支教志愿者', suffix: '位' },
  { value: 5000, label: '受益儿童', suffix: '+' },
  { value: 14, label: '深耕乡村', suffix: '年' },
];

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <PageLayout title="关于我们" backTo="/#about">
      {/* 使命宣言 */}
      <section style={{ marginBottom: 80 }}>
        <RevealWrapper>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, color: '#2C3E33', textAlign: 'center', marginBottom: 24, letterSpacing: '-0.02em' }}>
            关注成长，为爱助跑
          </h1>
        </RevealWrapper>
        <RevealWrapper delay={1}>
          <p style={{ fontSize: 18, lineHeight: 2, color: '#6A7A6A', textAlign: 'center', maxWidth: 720, margin: '0 auto 20px' }}>
            上海大学米粒支教社成立于2013年，致力于推广延续性支教活动，为全校支教队伍提供全方位支教前后期服务，
            以及通过各类长期项目解决短期支教的弊端。
          </p>
          <p style={{ fontSize: 16, lineHeight: 2, color: '#6A7A6A', textAlign: 'center', maxWidth: 720, margin: '0 auto 60px' }}>
            目前社团长期运营的项目有：「为爱助跑」暑期支教项目、蓝信封通信大使项目、「童年一课」线上支教项目。
            我们相信，每一份微小的力量都能汇聚成改变世界的光芒，让知识的光芒照进每一个角落。
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

      {/* 项目介绍 */}
      <section style={{ marginBottom: 80 }}>
        <RevealWrapper>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#2C3E33', textAlign: 'center', marginBottom: 48 }}>
            项目介绍
          </h2>
        </RevealWrapper>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <RevealWrapper delay={1}>
            <p style={{ fontSize: 16, lineHeight: 2, color: '#6A7A6A', marginBottom: 24 }}>
              上海大学米粒支教社深耕乡村公益十四年，组建跨专业青年实践队伍，已经在四川凉山、云南虎跳峡、
              浙江文成、河南商丘、河南信阳、浙江绍兴六处地区建立长期乡村实践基地，常态化开展「支教 + 推普」长效教育帮扶。
            </p>
            <p style={{ fontSize: 16, lineHeight: 2, color: '#6A7A6A', marginBottom: 24 }}>
              项目联合「共青团伙伴计划」，搭建「课业辅导 + 素质美育 + 推普专项 + 入户家访」一体化服务体系，
              结合在地资源开设乡土文化、低空科普、红色研学等特色课程，配套趣味运动会、成果汇演等拓展活动。
            </p>
            <p style={{ fontSize: 16, lineHeight: 2, color: '#6A7A6A', marginBottom: 24 }}>
              同步开展实地调研，摸排各地推普现实需求、乡村儿童成长困境，破解短期支教服务断档难题，
              搭建线上结对、年度回访的可持续接力帮扶机制。
            </p>
            <p style={{ fontSize: 16, lineHeight: 2, color: '#6A7A6A' }}>
              项目配备跨学科专业指导教师，拥有标准化队员培育、物资筹备全流程体系，每年产出多地专项调研报告、
              特色教学案例与公益纪实成果，以跨区域多点深耕模式助力乡村教育公平与国家通用语言文字推广，
              打造可复制、可持续的高校乡村振兴公益实践品牌。
            </p>
          </RevealWrapper>
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
        <button onClick={() => navigate('/#contact')} className="btn-primary">
          联系我们
        </button>
      </div>
    </PageLayout>
  );
}
