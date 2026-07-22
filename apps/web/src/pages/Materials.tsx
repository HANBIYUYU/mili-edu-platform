import { useEffect, useState } from 'react'
import { Card, Spin, Empty, Button, Tag, message } from 'antd'
import { FilePdfOutlined, FileWordOutlined, DownloadOutlined } from '@ant-design/icons'
import { materialAPI } from '../api'

export default function Materials() {
  const [materials, setMaterials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    materialAPI.list().then((res: any) => {
      setMaterials(res.data || [])
    }).finally(() => setLoading(false))
  }, [])
  
  const handleDownload = async (id: number) => {
    try {
      const res: any = await materialAPI.download(id)
      message.info(res.message || '下载功能待启用')
    } catch (err: any) {
      message.error(err.message || '下载失败')
    }
  }
  
  if (loading) return <Spin style={{ display: 'block', margin: '100px auto' }} />
  
  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>推普资料库</h1>
      
      {materials.length === 0 ? (
        <Empty description="暂无资料" />
      ) : (
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {materials.map((m: any) => (
            <Card key={m.id} hoverable>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                {m.file_type === 'pdf' ? (
                  <FilePdfOutlined style={{ fontSize: 48, color: '#ff4d4f' }} />
                ) : (
                  <FileWordOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                )}
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 8px' }}>{m.title}</h3>
                  <Tag color={m.file_type === 'pdf' ? 'red' : 'blue'}>{m.file_type.toUpperCase()}</Tag>
                  <p style={{ color: '#666', fontSize: 13, margin: '8px 0' }}>{m.description}</p>
                  <Button 
                    type="primary" 
                    icon={<DownloadOutlined />}
                    size="small"
                    onClick={() => handleDownload(m.id)}
                  >
                    下载
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}