import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Form, Input, Button, message, Typography } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { authAPI } from '../../api'

const { Title } = Typography

export default function AdminLogin() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  
  const handleLogin = async (values: any) => {
    setLoading(true)
    try {
      await authAPI.login(values)
      message.success('登录成功')
      navigate('/admin/dashboard')
    } catch (err: any) {
      message.error(err.error || '登录失败')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#f5f5f5'
    }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={3}>管理后台</Title>
          <p style={{ color: '#999' }}>米粒支教社 · 推普融合实践</p>
        </div>
        
        <Form onFinish={handleLogin}>
          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input prefix={<UserOutlined />} placeholder="用户名" size="large" />
          </Form.Item>
          
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}