import { Tag } from 'antd'
import AdminCrudPage from '../../components/admin/AdminCrudPage'
import { artworkAPI } from '../../api'
import { fileUrl, isPdfKey } from '../../utils/fileUrl'

const Thumb = ({ v }: { v?: string }) => (
  v && /\.(jpe?g|png|webp|gif)$/i.test(v) ? (
    <img src={fileUrl(v)} alt="预览" loading="lazy" style={{ height: 40, width: 56, objectFit: 'cover', borderRadius: 6, display: 'block' }}
      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
  ) : isPdfKey(v || '') ? (
    <span style={{ color: '#E53935', fontSize: 12 }}>📄 PDF</span>
  ) : (
    <span style={{ color: '#bbb', fontSize: 12 }}>{v ? '音频' : '无'}</span>
  )
)

export default function AdminGallery() {
  return (
    <AdminCrudPage
      config={{
        title: '儿童画展管理',
        rowKey: 'id',
        api: {
          list: async () => {
            const r: any = await artworkAPI.list()
            return { list: r.data || [] }
          },
          create: (d) => artworkAPI.create(d),
          update: (id, d) => artworkAPI.update(id, d),
          remove: (id) => artworkAPI.delete(id),
        },
        columns: [
          { title: 'ID', dataIndex: 'id', width: 70 },
          {
            title: '封面', width: 84,
            render: (_: any, r: any) => <Thumb v={r.thumbnail_key || r.file_key} />,
          },
          { title: '标题', dataIndex: 'title' },
          { title: '作者', dataIndex: 'child_name', width: 110 },
          {
            title: '类型', dataIndex: 'media_type', width: 100,
            render: (t: string, r: any) => {
              const isPdf = isPdfKey((r.thumbnail_key || r.file_key) || '')
              if (isPdf) return <Tag color="red">PDF</Tag>
              return <Tag color={t === 'image' ? 'green' : 'blue'}>{t === 'image' ? '图片' : '音频'}</Tag>
            },
          },
          {
            title: '分类', dataIndex: 'category', width: 120,
            render: (v: string) => <Tag color={v === '美术作品' ? 'volcano' : v === '朗诵作品' ? 'blue' : 'default'}>{v}</Tag>,
          },
          {
            title: '授权', dataIndex: 'authorization_status', width: 90,
            render: (s: number) => (s ? <Tag color="green">已授权</Tag> : <Tag color="red">未授权</Tag>),
          },
          { title: '排序', dataIndex: 'sort_order', width: 70 },
        ],
        fields: [
          { name: 'title', label: '作品名称', required: true },
          { name: 'child_name', label: '作者姓名', span: 1 },
          { name: 'media_type', label: '类型', type: 'select', span: 1, required: true, options: [{ value: 'image', label: '图片 / PDF 作品集' }, { value: 'audio', label: '音频（存档）' }] },
          {
            name: 'file_key', label: '作品文件（素材库）', type: 'media', kinds: ['image', 'doc'], required: true,
            extra: '图片选 artworks/ 目录；PDF 作品集（.pdf）也支持，游客可在线阅读/下载',
          },
          {
            name: 'thumbnail_key', label: '封面图（素材库，可选）', type: 'media', kinds: ['image'], span: 1,
            extra: '网格展示优先用封面图。PDF 作品建议配一张 JPG 封面；图片作品可留空（自动用作品图本身）',
          },
          { name: 'category', label: '分类', type: 'select', span: 1, options: ['美术作品', '朗诵作品', '未分类'].map((v) => ({ value: v, label: v })) },
          { name: 'sort_order', label: '排序', type: 'number', span: 1 },
          { name: 'authorization_status', label: '已获授权（允许公开展示）', type: 'switch' },
        ],
        defaultValues: { media_type: 'image', category: '美术作品', sort_order: 0, authorization_status: 1 },
      }}
    />
  )
}
