import { Tag } from 'antd'
import AdminCrudPage from '../../components/admin/AdminCrudPage'
import { videoAPI } from '../../api'
import { fileUrl, isVideoKey } from '../../utils/fileUrl'

const CATEGORY_COLOR: Record<string, string> = {
  示范课堂: 'green', 总结视频: 'blue', 活动记录: 'purple',
}

export default function AdminVideos() {
  return (
    <AdminCrudPage
      config={{
        title: '示范视频管理',
        rowKey: 'id',
        api: {
          list: async () => {
            const r: any = await videoAPI.list()
            return { list: r.data || [] }
          },
          create: (d) => videoAPI.create(d),
          update: (id, d) => videoAPI.update(id, d),
          remove: (id) => videoAPI.delete(id),
        },
        columns: [
          { title: 'ID', dataIndex: 'id', width: 70 },
          { title: '标题', dataIndex: 'title' },
          {
            title: '分类', dataIndex: 'category', width: 110,
            render: (v: string) => <Tag color={CATEGORY_COLOR[v] || 'default'}>{v}</Tag>,
          },
          {
            title: '视频文件', dataIndex: 'file_key', width: 260,
            render: (v: string) => v && isVideoKey(v)
              ? <a href={fileUrl(v)} target="_blank" rel="noreferrer" style={{ fontSize: 12 }}>{v}</a>
              : <Tag color={v ? 'orange' : 'red'}>{v ? '文件缺失' : '未上传'}</Tag>,
          },
          { title: '排序', dataIndex: 'sort_order', width: 70 },
          { title: '创建时间', dataIndex: 'created_at', width: 170 },
        ],
        fields: [
          { name: 'title', label: '视频标题', required: true },
          { name: 'category', label: '分类', type: 'select', span: 1, options: ['示范课堂', '总结视频', '活动记录'].map((v) => ({ value: v, label: v })) },
          { name: 'sort_order', label: '排序（小到大）', type: 'number', span: 1 },
          {
            name: 'file_key', label: '视频文件（素材库）', type: 'media', kinds: ['video'], required: true,
            extra: '先到「素材库」上传 mp4 / webm / mov（videos/ 目录），再点「素材库」选用；浏览器直接播放',
          },
        ],
        defaultValues: { category: '示范课堂', sort_order: 0 },
      }}
    />
  )
}
