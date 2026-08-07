import { useState } from 'react';
import { Input, Button, Form, message } from 'antd';
import { MailOutlined, EnvironmentOutlined, PhoneOutlined } from '@ant-design/icons';
import RevealWrapper from '../components/RevealWrapper';
import { contactAPI } from '../api';

const contactInfo = [
  { icon: <MailOutlined />, label: '邮箱', value: 'contact@milizhijiao.org' },
  { icon: <PhoneOutlined />, label: '电话', value: '400-888-0000' },
  { icon: <EnvironmentOutlined />, label: '地址', value: '北京市海淀区中关村大街1号' },
];

export default function ContactSection() {
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
    <section
      id="contact"
      style={{
        background: 'linear-gradient(180deg, #7CB342 0%, #F5A623 55%, #F5C76E 100%)',
        padding: '55px 24px',
        position: 'relative',
      }}
    >
      <div className="container" style={{ maxWidth: 960, margin: '0 auto' }}>
        <RevealWrapper>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, lineHeight: 1.2, color: '#fff', textAlign: 'center', marginBottom: 16, textShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            加入我们
          </h2>
        </RevealWrapper>

        <RevealWrapper delay={1}>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.9)', textAlign: 'center', maxWidth: 560, margin: '0 auto 60px' }}>
            无论你是想成为一名支教志愿者，还是希望为乡村教育贡献力量，
            米粒支教社都欢迎你的加入。
          </p>
        </RevealWrapper>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40, alignItems: 'start' }}>
          <RevealWrapper delay={2}>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 24 }}>联系方式</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {contactInfo.map((item) => (
                  <div key={item.label} className="contact-info-card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.2)', transition: 'all 0.3s ease', cursor: 'default' }}>
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

          <RevealWrapper delay={3}>
            <div className="contact-form-card" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(16px)', borderRadius: 24, padding: '32px', border: '1px solid rgba(255,255,255,0.3)' }}>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: '#2C3E33', marginBottom: 24 }}>留言给我们</h3>

              <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item name="name" rules={[{ required: true, message: '请输入您的姓名' }]}>
                  <Input placeholder="您的姓名" style={{ height: 48, borderRadius: 12, border: '1px solid #E8E6E1', background: '#FAF9F6', fontSize: 15 }} />
                </Form.Item>

                <Form.Item name="contact" rules={[{ required: true, message: '请输入联系方式' }]}>
                  <Input placeholder="手机号或邮箱" style={{ height: 48, borderRadius: 12, border: '1px solid #E8E6E1', background: '#FAF9F6', fontSize: 15 }} />
                </Form.Item>

                <Form.Item name="message" rules={[{ required: true, message: '请输入留言内容' }]}>
                  <Input.TextArea placeholder="想说的话..." rows={4} style={{ borderRadius: 12, border: '1px solid #E8E6E1', background: '#FAF9F6', fontSize: 15, resize: 'none' }} />
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
      </div>

      <style>{`
        .contact-info-card:hover {
          background: rgba(255,255,255,0.28) !important;
          border-color: rgba(255,255,255,0.5) !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        }
        .contact-form-card input:hover,
        .contact-form-card textarea:hover {
          border-color: #7CB342 !important;
        }
        .contact-form-card input:focus,
        .contact-form-card textarea:focus {
          border-color: #7CB342 !important;
          box-shadow: 0 0 0 2px rgba(124, 179, 66, 0.15) !important;
        }
        .contact-form-card .ant-btn-primary:hover {
          background: #E89620 !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(245, 166, 35, 0.45) !important;
        }
      `}</style>

    </section>
  );
}
