import { Tag } from 'antd'
import AdminCrudPage from '../../components/admin/AdminCrudPage'
import { voiceAPI } from '../../api'
import { fileUrl } from '../../utils/fileUrl'

const Thumb = ({ v, type }: { v?: string | null; type?: string }) => {
  if (!v) return <span style={{ color: '#bbb', fontSize: 12 }}>无</span>
  if (type === 'image' || /\.(jpe?g|png|webp|gif)$/i.test(v)) {
    return (
      <img src={fileUrl(v)} alt="预览" loading="lazy" style={{ height: 40, width: 56, objectFit: 'cover', borderRadius: 6, display: 'block' }}
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
    )
  }
  return (
    <video src={fileUrl(v)} muted preload="metadata" style={{ height: 40, width: 56, objectFit: 'cover', borderRadius: 6, background: '#000' }} />
  )
}

const CATEGORY_COLOR: Record<string, string> = {
  儿童诗: 'green', 拼贴诗: 'gold', 心愿: 'purple', 留言: 'blue',
}

export default function AdminVoices() {
  return (
    <AdminCrudPage
      config={{
        title: '童声童语管理',
        rowKey: 'id',
        api: {
          list: async () => {
            const r: any = await voiceAPI.list()
            return { list: r.data || [] }
          },
          create: (d) => voiceAPI.create(d),
          update: (id, d) => voiceAPI.update(id, d),
          remove: (id) => voiceAPI.delete(id),
        },
        columns: [
          { title: 'ID', dataIndex: 'id', width: 70 },
          { title: '预览', dataIndex: 'file_key', width: 80, render: (v: string, r: any) => <Thumb v={v} type={r.media_type} /> },
          { title: '标题', dataIndex: 'title' },
          { title: '作者', dataIndex: 'author', width: 110 },
          {
            title: '类型', dataIndex: 'media_type', width: 90,
            render: (t: string) => <Tag color={t === 'image' ? 'green' : 'purple'}>{t === 'image' ? '图片' : '视频'}</Tag>,
          },
          {
            title: '分类', dataIndex: 'category', width: 100,
            render: (v: string) => <Tag color={CATEGORY_COLOR[v] || 'default'}>{v}</Tag>,
          },
          { title: '创建时间', dataIndex: 'created_at', width: 170 },
        ],
        fields: [
          { name: 'title', label: '标题', required: true, placeholder: '如：春天的小诗' },
          { name: 'author', label: '作者（孩子署名）', span: 1 },
          { name: 'media_type', label: '类型', type: 'select', span: 1, required: true, options: [{ value: 'image', label: '图片' }, { value: 'video', label: '视频' }] },
          {
            name: 'file_key', label: '素材文件', type: 'media', kinds: ['image', 'video'], required: true,
            extra: '图片选 voices/ 目录，视频选 videos/ 目录；先上传再点「素材库」选用',
          },
          { name: 'category', label: '分类', type: 'select', span: 1, options: ['儿童诗', '拼贴诗', '心愿', '留言'].map((v) => ({ value: v, label: v })) },
          { name: 'sort_order', label: '排序', type: 'number', span: 1 },
        ],
        defaultValues: { media_type: 'image', category: '儿童诗', sort_order: 0 },
      }}
    />
  )
}
