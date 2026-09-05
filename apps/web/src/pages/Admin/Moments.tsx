import { Tag } from 'antd'
import AdminCrudPage from '../../components/admin/AdminCrudPage'
import { momentAPI } from '../../api'
import { fileUrl } from '../../utils/fileUrl'

const Thumb = ({ v }: { v?: string }) => (
  v ? (
    <img src={fileUrl(v)} alt="预览" loading="lazy" style={{ height: 40, width: 56, objectFit: 'cover', borderRadius: 6, display: 'block' }}
      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
  ) : <span style={{ color: '#bbb', fontSize: 12 }}>无</span>
)

export default function AdminMoments() {
  return (
    <AdminCrudPage
      config={{
        title: '支教拾光管理',
        rowKey: 'id',
        api: {
          list: async () => {
            const r: any = await momentAPI.list()
            return { list: r.data || [] }
          },
          create: (d) => momentAPI.create(d),
          update: (id, d) => momentAPI.update(id, d),
          remove: (id) => momentAPI.delete(id),
        },
        columns: [
          { title: 'ID', dataIndex: 'id', width: 70 },
          { title: '预览', dataIndex: 'file_key', width: 80, render: (v: string) => <Thumb v={v} /> },
          {
            title: '年份', dataIndex: 'year', width: 90,
            render: (v: number) => <Tag color="blue">{v}</Tag>,
          },
          { title: '标题（照片说明）', dataIndex: 'title' },
          { title: '排序', dataIndex: 'sort_order', width: 70 },
          { title: '创建时间', dataIndex: 'created_at', width: 170 },
        ],
        fields: [
          { name: 'year', label: '年份', type: 'number', required: true, placeholder: '如 2024' },
          { name: 'title', label: '标题（照片说明）', span: 2, placeholder: '如：2024 暑期支教合影' },
          {
            name: 'file_key', label: '照片（素材库）', type: 'media', kinds: ['image'], required: true,
            extra: '先到素材库上传到 moments/ 目录，再点「素材库」选用',
          },
          { name: 'sort_order', label: '排序', type: 'number', span: 2 },
        ],
        defaultValues: { sort_order: 0 },
      }}
    />
  )
}
