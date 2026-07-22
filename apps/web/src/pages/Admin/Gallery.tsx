import { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm, Tag } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { artworkAPI } from '../../api'

export default function AdminGallery() {
  const [artworks, setArtworks] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  const fetchArtworks = async () => {
    setLoading(true)
    try {
      const res: any = await artworkAPI.list()
      setArtworks(res.data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchArtworks() }, [])

  const handleAdd = async (values: any) => {
    try {
      await artworkAPI.create(values)
      message.success('添加成功')
      setModalVisible(false)
      form.resetFields()
      fetchArtworks()
    } catch (err: any) {
      message.error(err.error || '添加失败')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await artworkAPI.delete(id)
      message.success('删除成功')
      fetchArtworks()
    } catch (err: any) {
      message.error(err.error || '删除失败')
    }
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '标题', dataIndex: 'title' },
    { title: '作者', dataIndex: 'child_name', width: 100 },
    {
      title: '类型', dataIndex: 'media_type', width: 100,
      render: (t: string) => <Tag color={t === 'image' ? 'green' : 'blue'}>{t === 'image' ? '美术' : '音频'}</Tag>
    },
    { title: '分类', dataIndex: 'category', width: 120 },
    {
      title: '授权', dataIndex: 'authorization_status', width: 80,
      render: (s: number) => s ? <Tag color="green">已授权</Tag> : <Tag color="red">未授权</Tag>
    },
    {
      title: '操作', width: 100,
      render: (_: any, record: any) => (
        <Popconfirm title="确认删除？" onConfirm={() => handleDelete(record.id)}>
          <Button type="link" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      )
    }
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1>画展管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
          新增作品
        </Button>
      </div>
      <Table columns={columns} dataSource={artworks} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
      <Modal title="新增作品" open={modalVisible} onCancel={() => setModalVisible(false)} footer={null}>
        <Form form={form} onFinish={handleAdd} layout="vertical">
          <Form.Item name="title" label="作品名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="child_name" label="作者姓名">
            <Input />
          </Form.Item>
          <Form.Item name="media_type" label="类型" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="image">美术作品</Select.Option>
              <Select.Option value="audio">朗诵/配音</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="file_key" label="文件路径" rules={[{ required: true }]}>
            <Input placeholder="R2 文件路径" />
          </Form.Item>
          <Form.Item name="category" label="分类">
            <Input placeholder="如：美术作品、朗诵作品" />
          </Form.Item>
          <Form.Item name="authorization_status" label="已获授权" initialValue={0}>
            <Select>
              <Select.Option value={0}>否</Select.Option>
              <Select.Option value={1}>是</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>保存</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}