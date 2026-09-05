import { Tag } from 'antd'
import AdminCrudPage from '../../components/admin/AdminCrudPage'
import { materialAPI } from '../../api'
import { fileUrl, fmtSize } from '../../utils/fileUrl'

export default function AdminMaterials() {
  return (
    <AdminCrudPage
      config={{
        title: '推普资料管理',
        rowKey: 'id',
        api: {
          list: async () => {
            const r: any = await materialAPI.list()
            return { list: r.data || [] }
          },
          create: (d) => materialAPI.create(d),
          update: (id, d) => materialAPI.update(id, d),
          remove: (id) => materialAPI.delete(id),
        },
        columns: [
          { title: 'ID', dataIndex: 'id', width: 70 },
          { title: '标题', dataIndex: 'title' },
          {
            title: '类型', dataIndex: 'file_type', width: 90,
            render: (v: string) => <Tag color={v === 'pdf' ? 'red' : 'blue'}>{String(v).toUpperCase()}</Tag>,
          },
          {
            title: '大小', dataIndex: 'file_size', width: 100,
            render: (v: number) => fmtSize(v),
          },
          {
            title: '文件', dataIndex: 'file_key', width: 280,
            render: (v: string) => v ? <a href={fileUrl(v)} target="_blank" rel="noreferrer" style={{ fontSize: 12 }}>{v}</a> : '-',
          },
          { title: '描述', dataIndex: 'description', ellipsis: true },
          { title: '排序', dataIndex: 'sort_order', width: 70 },
          { title: '创建时间', dataIndex: 'created_at', width: 170 },
        ],
        fields: [
          { name: 'title', label: '资料标题', required: true },
          { name: 'file_type', label: '文件类型', type: 'select', span: 1, required: true, options: [{ value: 'pdf', label: 'PDF' }, { value: 'docx', label: 'Word (.docx)' }] },
          { name: 'sort_order', label: '排序', type: 'number', span: 1 },
          {
            name: 'file_key', label: '文件（素材库）', type: 'media', kinds: ['doc'], required: true,
            extra: '先到「素材库」上传 PDF / Word，再点「素材库」选用；文件大小自动读取',
          },
          { name: 'description', label: '描述说明', type: 'textarea' },
        ],
        defaultValues: { file_type: 'pdf', sort_order: 0 },
      }}
    />
  )
}
