import { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, InputNumber, message, Popconfirm } from 'antd'
import { momentAPI } from '../../api'

export default function AdminMoments() {
  const [moments, setMoments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  const fetchMoments = async () => {
    setLoading(true)
    try {
      const res: any = await momentAPI.list()
      setMoments(res.data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMoments() }, [])

  const handleAdd = async (values: any) => {
    try {
      await momentAPI.create(values)
      message.success('添加成功')
      setModalVisible(false)
      form.resetFields()
      fetchMoments()
    } catch (err: any) {
      message.error(err.error || '添加失败')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await momentAPI.delete(id)
      message.success('删除成功')
      fetchMoments()
    } catch (err: any) {
      message.error(err.error || '删除失败')
    }
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '年份', dataIndex: 'year', width: 100 },
    { title: '标题', dataIndex: 'title' },
    { title: '文件路径', dataIndex: 'file_key', ellipsis: true },
    {
      title: '操作', width: 100,
      render: (_: any, record: any) => (
        <Popconfirm title="确认删除？" onConfirm={() => handleDelete(record.id)}>
          <Button type="link" danger>删除</Button>
        </Popconfirm>
      )
    }
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1>支教拾光管理</h1>
        <Button type="primary" onClick={() => setModalVisible(true)}>
          新增照片
        </Button>
      </div>
      <Table columns={columns} dataSource={moments} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
      <Modal title="新增照片" open={modalVisible} onCancel={() => setModalVisible(false)} footer={null}>
        <Form form={form} onFinish={handleAdd} layout="vertical">
          <Form.Item name="year" label="年份" rules={[{ required: true, message: '请输入年份' }]}>
            <InputNumber min={2000} max={2100} style={{ width: '100%' }} placeholder="如 2024" />
          </Form.Item>
          <Form.Item name="title" label="标题（照片说明）">
            <Input placeholder="如：2024 暑期支教合影" />
          </Form.Item>
          <Form.Item name="file_key" label="图片路径" rules={[{ required: true, message: '请填写图片路径' }]}>
            <Input placeholder="R2 文件路径（待 R2 开通后生效）" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>保存</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
