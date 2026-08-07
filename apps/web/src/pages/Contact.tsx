import { useState } from 'react';
import { Input, Button, Form, message } from 'antd';
import { MailOutlined, EnvironmentOutlined, PhoneOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import PageLayout from '../components/PageLayout';
import RevealWrapper from '../components/RevealWrapper';
import { contactAPI } from '../api';

const contactInfo = [
  { icon: <MailOutlined />, label: '邮箱', value: 'contact@milizhijiao.org' },
  { icon: <PhoneOutlined />, label: '电话', value: '400-888-0000' },
  { icon: <EnvironmentOutlined />, label: '地址', value: '北京市海淀区中关村大街1号' },
];

const faqItems = [
  { q: '如何成为支教志愿者？', a: '请通过本页面的联系表单提交申请，我们的工作人员会在一周内与您联系，安排后续的面试和培训。' },
  { q: '支教活动一般持续多长时间？', a: '暑期支教项目通常持续 2-4 周，学期中的线上支教项目以学期为单位。具体时间安排会在招募通知中说明。' },
  { q: '对志愿者有什么要求？', a: '我们欢迎所有热爱教育、有责任心的在校大学生和在职人员。相关专业背景是加分项，但不是必须条件。' },
  { q: '如何捐赠或赞助项目？', a: '感谢您的支持！请通过联系表单选择"合作捐赠"类别，我们会有专人与您对接。' },
];

export default function ContactPage() {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: { name: string; contact: string; message: string }) => {
    setSubmitting(true);
    try {
      await contactAPI.submit(values);
      message.success('感谢您的留言，我们会尽快与您联系！');
      form.resetFields();
    } catch (err: any) {
      message.error(err || '提交失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout title="联系我们" backTo="/#contact" background="linear-gradient(180deg, #6BAF92 0%, #F5A623 60%, #F5D89A 100%)">
      <RevealWrapper>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, color: '#fff', textAlign: 'center', marginBottom: 16, letterSpacing: '-0.02em', textShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          联系我们
        </h1>
      </RevealWrapper>
      <RevealWrapper delay={1}>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.9)', textAlign: 'center', maxWidth: 560, margin: '0 auto 48px' }}>
          无论你是想成为一名支教志愿者，还是希望为乡村教育贡献力量，米粒支教社都欢迎你的加入。
        </p>
      </RevealWrapper>

      {/* 表单 + 联系方式 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40, alignItems: 'start', marginBottom: 80 }}>
        {/* 联系方式 */}
        <RevealWrapper delay={2}>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 24 }}>联系方式</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {contactInfo.map((item) => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.2)' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.25)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: 15, color: '#fff', fontWeight: 500 }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealWrapper>

        {/* 表单 */}
        <RevealWrapper delay={3}>
          <div style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(16px)', borderRadius: 24, padding: 32, border: '1px solid rgba(255,255,255,0.3)' }}>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: '#2C3E33', marginBottom: 24 }}>留言给我们</h3>
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Form.Item name="name" rules={[{ required: true, message: '请输入您的姓名' }]}>
                <Input placeholder="您的姓名" style={{ height: 48, borderRadius: 12, border: '1px solid #E8E6E1', background: '#FAF9F6', fontSize: 15 }} />
              </Form.Item>
              <Form.Item name="contact" rules={[{ required: true, message: '请输入联系方式' }]}>
                <Input placeholder="手机号或邮箱" style={{ height: 48, borderRadius: 12, border: '1px solid #E8E6E1', background: '#FAF9F6', fontSize: 15 }} />
              </Form.Item>
              <Form.Item name="message" rules={[{ required: true, message: '请输入留言内容' }]}>
                <Input.TextArea placeholder="想说的话..." rows={5} style={{ borderRadius: 12, border: '1px solid #E8E6E1', background: '#FAF9F6', fontSize: 15, resize: 'none' }} />
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button type="primary" htmlType="submit" loading={submitting} block
                  style={{ height: 48, borderRadius: 16, fontSize: 16, fontWeight: 700, background: '#F5A623', border: 'none', boxShadow: '0 4px 16px rgba(245, 166, 35, 0.3)' }}>
                  发送留言
                </Button>
              </Form.Item>
            </Form>
          </div>
        </RevealWrapper>
      </div>

      {/* FAQ */}
      <section style={{ maxWidth: 800, margin: '0 auto' }}>
        <RevealWrapper>
          <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, color: '#fff', textAlign: 'center', marginBottom: 40, textShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <QuestionCircleOutlined style={{ marginRight: 8 }} />常见问题
          </h2>
        </RevealWrapper>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {faqItems.map((item, index) => (
            <RevealWrapper key={index} delay={index}>
              <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', borderRadius: 16, padding: '20px 24px', border: '1px solid rgba(255,255,255,0.2)' }}>
                <h4 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 8 }}>{item.q}</h4>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.85)', margin: 0 }}>{item.a}</p>
              </div>
            </RevealWrapper>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
