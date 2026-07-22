import { useEffect, useState } from 'react'
import { Card, Spin, Empty, Radio, Tag } from 'antd'
import { PictureOutlined, SoundOutlined } from '@ant-design/icons'
import { artworkAPI } from '../api'

export default function Gallery() {
  const [artworks, setArtworks] = useState<any[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const params = filter === 'all' ? {} : { media_type: filter }
    artworkAPI.list(params).then((res: any) => {
      setArtworks(res.data || [])
    }).finally(() => setLoading(false))
  }, [filter])
  
  if (loading) return <Spin style={{ display: 'block', margin: '100px auto' }} />
  
  return (
    <div>
      <h1 style={{ marginBottom: 16 }}>儿童公益画展</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>孩子们的推普成果展示</p>
      
      <Radio.Group 
        value={filter} 
        onChange={(e) => setFilter(e.target.value)}
        style={{ marginBottom: 24 }}
      >
        <Radio.Button value="all">全部</Radio.Button>
        <Radio.Button value="image">美术作品</Radio.Button>
        <Radio.Button value="audio">朗诵/配音</Radio.Button>
      </Radio.Group>
      
      {artworks.length === 0 ? (
        <Empty description="暂无作品" />
      ) : (
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
          {artworks.map((a: any) => (
            <Card key={a.id} hoverable bodyStyle={{ padding: 0 }}>
              <div style={{ 
                background: '#f5f5f5', 
                aspectRatio: a.media_type === 'image' ? '1' : '16/9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {a.media_type === 'image' ? (
                  <PictureOutlined style={{ fontSize: 40, color: '#ccc' }} />
                ) : (
                  <SoundOutlined style={{ fontSize: 40, color: '#ccc' }} />
                )}
              </div>
              <div style={{ padding: 12 }}>
                <h4 style={{ margin: '0 0 4px' }}>{a.title}</h4>
                <p style={{ color: '#999', fontSize: 12, margin: 0 }}>{a.child_name}</p>
                <Tag size="small" style={{ marginTop: 8 }}>
                  {a.media_type === 'image' ? '美术' : '朗诵/配音'}
                </Tag>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}