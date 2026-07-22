import { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { materialAPI } from '../../api'

export default function AdminMaterials() {
  const [materials, setMaterials] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  const fetchMaterials = async () => {
    setLoading(true)
    try {
      const res: any = await materialAPI.list()
      setMaterials(res.data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMaterials() }, [])

  const handleAdd = async (values: any) => {
    try {
      await materialAPI.create(values)
      message.success('添加成功')
      setModalVisible(false)
      form.resetFields()
      fetchMaterials()
    } catch (err: any) {
      message.error(err.error || '添加失败')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await materialAPI.delete(id)
      message.success('删除成功')
      fetchMaterials()
    } catch (err: any) {
      message.error(err.error || '删除失败')
    }
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '标题', dataIndex: 'title' },
    { title: '类型', dataIndex: 'file_type', render: (t: string) => t.toUpperCase() },
    { title: '大小', dataIndex: 'file_size', render: (s: number) => s ? `${(s/1024).toFixed(0)}KB` : '-' },
    { title: '创建时间', dataIndex: 'created_at' },
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
        <h1>资料管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
          新增资料
        </Button>
      </div>
      <Table columns={columns} dataSource={materials} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
      <Modal title="新增资料" open={modalVisible} onCancel={() => setModalVisible(false)} footer={null}>
        <Form form={form} onFinish={handleAdd} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: true }]}>
            <Input placeholder="资料标题" />
          </Form.Item>
          <Form.Item name="file_key" label="文件路径" rules={[{ required: true }]}>
            <Input placeholder="R2 文件路径（如 docs/file.pdf）" />
          </Form.Item>
          <Form.Item name="file_type" label="类型" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="pdf">PDF</Select.Option>
              <Select.Option value="docx">Word</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>保存</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}