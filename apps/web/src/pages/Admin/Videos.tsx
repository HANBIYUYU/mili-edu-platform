import { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { videoAPI } from '../../api'

export default function AdminVideos() {
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()
  
  const fetchVideos = async () => {
    setLoading(true)
    try {
      const res: any = await videoAPI.list()
      setVideos(res.data || [])
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchVideos()
  }, [])
  
  const handleAdd = async (values: any) => {
    try {
      await videoAPI.create(values)
      message.success('添加成功')
      setModalVisible(false)
      form.resetFields()
      fetchVideos()
    } catch (err: any) {
      message.error(err.error || '添加失败')
    }
  }
  
  const handleDelete = async (id: number) => {
    try {
      await videoAPI.delete(id)
      message.success('删除成功')
      fetchVideos()
    } catch (err: any) {
      message.error(err.error || '删除失败')
    }
  }
  
  const columns = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '标题', dataIndex: 'title' },
    { title: '分类', dataIndex: 'category' },
    { title: '嵌入代码', dataIndex: 'iframe_src', ellipsis: true },
    { title: '创建时间', dataIndex: 'created_at' },
    {
      title: '操作',
      width: 100,
      render: (_: any, record: any) => (
        <Popconfirm
          title="确认删除？"
          onConfirm={() => handleDelete(record.id)}
        >
          <Button type="link" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      )
    }
  ]
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1>视频管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
          新增视频
        </Button>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={videos} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
      
      <Modal
        title="新增视频"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAdd} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: true }]}>
            <Input placeholder="视频标题" />
          </Form.Item>
          <Form.Item name="iframe_src" label="嵌入代码" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="粘贴 B站/腾讯视频 iframe 代码" />
          </Form.Item>
          <Form.Item name="category" label="分类" initialValue="示范课堂">
            <Select>
              <Select.Option value="总结视频">总结视频</Select.Option>
              <Select.Option value="示范课堂">示范课堂</Select.Option>
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