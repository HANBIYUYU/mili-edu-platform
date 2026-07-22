import { Typography, Card, Timeline } from 'antd'

const { Title, Paragraph } = Typography

export default function About() {
  return (
    <div>
      <Title>关于米粒支教社</Title>
      
      <Card style={{ marginBottom: 24 }}>
        <Title level={3}>我们的使命</Title>
        <Paragraph>
          米粒支教社成立于2018年，是一支由大学生志愿者组成的公益支教团队。
          我们致力于推广普通话教育，帮助偏远地区的孩子们提升语言表达能力，
          让他们能够自信地与世界对话。
        </Paragraph>
      </Card>
      
      <Card style={{ marginBottom: 24 }}>
        <Title level={3}>2026暑期推普实践</Title>
        <Paragraph>
          本年度项目响应"知行杯"暑期社会实践号召，聚焦"科技成果转化"主题，
          将推普成果通过数字化平台展示，让更多人看到乡村教育的变化。
        </Paragraph>
      </Card>
      
      <Card>
        <Title level={3}>项目历程</Title>
        <Timeline
          items={[
            { children: '2018: 米粒支教社成立' },
            { children: '2020: 首次暑期支教活动' },
            { children: '2023: 推普专项计划启动' },
            { children: '2026: 数字化成果展示平台上线' },
          ]}
        />
      </Card>
    </div>
  )
}