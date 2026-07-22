import { useEffect, useState } from 'react'
import { Table, Tag } from 'antd'
import { contactAPI } from '../../api'

export default function AdminContacts() {
  const [contacts, setContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchContacts = async () => {
    setLoading(true)
    try {
      const res: any = await contactAPI.list()
      setContacts(res.data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchContacts() }, [])

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '姓名', dataIndex: 'name' },
    { title: '联系方式', dataIndex: 'contact' },
    { title: '留言', dataIndex: 'message', ellipsis: true },
    {
      title: '通知状态', dataIndex: 'notified', width: 100,
      render: (n: number) => n ? <Tag color="green">已通知</Tag> : <Tag>未通知</Tag>
    },
    { title: '提交时间', dataIndex: 'created_at' },
  ]

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>留言管理</h1>
      <Table columns={columns} dataSource={contacts} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
    </div>
  )
}