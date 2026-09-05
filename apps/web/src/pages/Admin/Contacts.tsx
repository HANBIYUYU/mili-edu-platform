import { useCallback, useEffect, useState } from 'react'
import { Table, Button, Space, Popconfirm, Tag, message } from 'antd'
import { ReloadOutlined, DeleteOutlined } from '@ant-design/icons'
import { contactAPI } from '../../api'

export default function AdminContacts() {
  const [contacts, setContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res: any = await contactAPI.list()
      setContacts(res.data || [])
    } catch (e: any) {
      message.error(e?.error || '加载失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  // 切回页面自动刷新
  useEffect(() => {
    const onActive = () => { if (document.visibilityState === 'visible') load() }
    window.addEventListener('focus', onActive)
    document.addEventListener('visibilitychange', onActive)
    return () => {
      window.removeEventListener('focus', onActive)
      document.removeEventListener('visibilitychange', onActive)
    }
  }, [load])

  const onDelete = async (id: number) => {
    try {
      await contactAPI.delete(id)
      message.success('已删除')
      load()
    } catch (e: any) {
      message.error(e?.error || '删除失败')
    }
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 70 },
    { title: '姓名', dataIndex: 'name', width: 120 },
    { title: '联系方式', dataIndex: 'contact', width: 180 },
    { title: '留言', dataIndex: 'message', ellipsis: true },
    {
      title: '通知状态', dataIndex: 'notified', width: 110,
      render: (n: number) => (n ? <Tag color="green">已通知</Tag> : <Tag color="orange">未通知</Tag>),
    },
    { title: '提交时间', dataIndex: 'created_at', width: 170 },
    {
      title: '操作', width: 90, fixed: 'right' as const,
      render: (_: any, r: any) => (
        <Popconfirm title="删除该留言？" description="删除后不可恢复" onConfirm={() => onDelete(r.id)}>
          <Button size="small" danger icon={<DeleteOutlined />}>删除</Button>
        </Popconfirm>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 20 }}>留言管理</h2>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={load}>刷新</Button>
        </Space>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={contacts}
        loading={loading}
        pagination={{ pageSize: 18, showTotal: (t) => `共 ${t} 条` }}
        scroll={{ x: 'max-content' }}
        size="middle"
      />
    </div>
  )
}
