import { useState } from 'react'
import { Card, Form, Input, Button, message, Typography } from 'antd'
import { SendOutlined } from '@ant-design/icons'
import { contactAPI } from '../api'

const { Title, Paragraph } = Typography
const { TextArea } = Input

export default function Contact() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      await contactAPI.submit(values)
      message.success('提交成功！我们会尽快与您联系')
      setSubmitted(true)
    } catch (err: any) {
      message.error(err.message || '提交失败')
    } finally {
      setLoading(false)
    }
  }
  
  if (submitted) {
    return (
      <Card style={{ maxWidth: 600, margin: '40px auto', textAlign: 'center' }}>
        <Title level={3}>提交成功！</Title>
        <Paragraph>感谢您的留言，我们会尽快与您联系。</Paragraph>
        <Button type="primary" onClick={() => setSubmitted(false)}>继续留言</Button>
      </Card>
    )
  }
  
  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <Title>联系我们</Title>
      <Paragraph style={{ color: '#666', marginBottom: 24 }}>
        如果您对项目感兴趣，或有合作意向，欢迎给我们留言。
      </Paragraph>
      
      <Card>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item 
            label="您的姓名" 
            name="name" 
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          
          <Form.Item 
            label="联系方式" 
            name="contact" 
            rules={[{ required: true, message: '请输入联系方式' }]}
          >
            <Input placeholder="手机号或邮箱" />
          </Form.Item>
          
          <Form.Item 
            label="留言内容" 
            name="message" 
            rules={[{ required: true, message: '请输入留言内容' }]}
          >
            <TextArea rows={4} placeholder="请输入您想说的话..." />
          </Form.Item>
          
          <Form.Item>
            <Paragraph style={{ color: '#999', fontSize: 12 }}>
              您的信息仅用于项目联络，不会泄露给第三方。
            </Paragraph>
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} icon={<SendOutlined />} block>
              提交留言
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}