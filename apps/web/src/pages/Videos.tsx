import { useEffect, useState } from 'react'
import { Card, Spin, Empty, Tag } from 'antd'
import { videoAPI } from '../api'

export default function Videos() {
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    videoAPI.list().then((res: any) => {
      setVideos(res.data || [])
    }).finally(() => setLoading(false))
  }, [])
  
  if (loading) return <Spin style={{ display: 'block', margin: '100px auto' }} />
  
  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>示范课程</h1>
      
      {videos.length === 0 ? (
        <Empty description="暂无课程视频" />
      ) : (
        <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {videos.map((v: any) => (
            <Card key={v.id} title={v.title} extra={<Tag color="green">{v.category}</Tag>}>
              <div style={{ 
                position: 'relative',
                paddingBottom: '56.25%',
                background: '#f5f5f5',
                borderRadius: 8,
                overflow: 'hidden'
              }}>
                <iframe
                  src={v.iframe_src}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                  allowFullScreen
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}