import { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm, Tag } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { voiceAPI } from '../../api'

const categoryOptions = ['儿童诗', '拼贴诗', '心愿', '留言']

export default function AdminVoices() {
  const [voices, setVoices] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()
  const mediaType = Form.useWatch('media_type', form)

  const fetchVoices = async () => {
    setLoading(true)
    try {
      const res: any = await voiceAPI.list()
      setVoices(res.data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchVoices() }, [])

  const handleAdd = async (values: any) => {
    try {
      await voiceAPI.create(values)
      message.success('添加成功')
      setModalVisible(false)
      form.resetFields()
      fetchVoices()
    } catch (err: any) {
      message.error(err.error || '添加失败')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await voiceAPI.delete(id)
      message.success('删除成功')
      fetchVoices()
    } catch (err: any) {
      message.error(err.error || '删除失败')
    }
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '标题', dataIndex: 'title' },
    { title: '作者', dataIndex: 'author', width: 100 },
    {
      title: '类型', dataIndex: 'media_type', width: 90,
      render: (t: string) => <Tag color={t === 'image' ? 'green' : 'purple'}>{t === 'image' ? '图片' : '视频'}</Tag>
    },
    { title: '分类', dataIndex: 'category', width: 100 },
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
        <h1>童声童语管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
          新增内容
        </Button>
      </div>
      <Table columns={columns} dataSource={voices} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
      <Modal title="新增内容" open={modalVisible} onCancel={() => setModalVisible(false)} footer={null}>
        <Form form={form} onFinish={handleAdd} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: true }]}>
            <Input placeholder="如：春天的小诗" />
          </Form.Item>
          <Form.Item name="author" label="作者（孩子署名）">
            <Input placeholder="孩子姓名或昵称" />
          </Form.Item>
          <Form.Item name="media_type" label="类型" rules={[{ required: true }]}>
            <Select placeholder="选择媒体类型">
              <Select.Option value="image">图片（儿童诗/拼贴诗/心愿/留言）</Select.Option>
              <Select.Option value="video">视频</Select.Option>
            </Select>
          </Form.Item>
          {mediaType === 'image' && (
            <Form.Item name="file_key" label="图片路径" rules={[{ required: true, message: '请填写图片路径' }]}>
              <Input placeholder="R2 文件路径（待 R2 开通后生效）" />
            </Form.Item>
          )}
          {mediaType === 'video' && (
            <Form.Item name="iframe_src" label="视频嵌入地址" rules={[{ required: true, message: '请填写视频嵌入地址' }]}>
              <Input placeholder="//player.bilibili.com/player.html?bvid=..." />
            </Form.Item>
          )}
          <Form.Item name="category" label="分类" initialValue="儿童诗">
            <Select>
              {categoryOptions.map((c) => <Select.Option key={c} value={c}>{c}</Select.Option>)}
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
