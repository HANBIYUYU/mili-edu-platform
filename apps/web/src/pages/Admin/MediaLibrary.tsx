import { useCallback, useEffect, useState } from 'react'
import {
  Button, Empty, Input, Select, Space, Spin, Tag, Upload, Modal, Progress, message, Popconfirm,
} from 'antd'
import { CloudUploadOutlined, ReloadOutlined, SearchOutlined, PictureOutlined } from '@ant-design/icons'
import { mediaAPI } from '../../api'
import { fileUrl, fmtSize, dirOfKey, isImageKey, isAudioKey, isVideoKey, isDocKey } from '../../utils/fileUrl'

const UPLOAD_DIRS = ['videos', 'docs', 'artworks', 'audios', 'voices', 'moments', 'images', 'misc']
const DIR_HINTS: Record<string, string> = {
  videos: '课程/童声视频', docs: '推普资料', artworks: '儿童画展', audios: '朗诵音频',
  voices: '童声童语配图', moments: '支教拾光照片', images: '通用图片', misc: '其他',
}

type Asset = { key: string; size: number }

const kindTag = (k: string) => {
  if (isImageKey(k)) return <Tag color="green">图片</Tag>
  if (isVideoKey(k)) return <Tag color="purple">视频</Tag>
  if (isAudioKey(k)) return <Tag color="blue">音频</Tag>
  if (isDocKey(k)) return <Tag color="gold">文档</Tag>
  return <Tag>文件</Tag>
}

export default function MediaLibraryPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [kw, setKw] = useState('')
  const [dir, setDir] = useState('全部')
  const [uploadOpen, setUploadOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [uploadDir, setUploadDir] = useState(UPLOAD_DIRS[0])
  const [preview, setPreview] = useState('')
  const [busy, setBusy] = useState(false)
  const [percent, setPercent] = useState(0)

  const reload = useCallback(() => {
    setLoading(true)
    mediaAPI.list()
      .then((res: any) => setAssets(res.objects || []))
      .catch(() => message.error('素材加载失败'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    reload()
    const onActive = () => { if (document.visibilityState === 'visible') reload() }
    window.addEventListener('focus', onActive)
    document.addEventListener('visibilitychange', onActive)
    return () => {
      window.removeEventListener('focus', onActive)
      document.removeEventListener('visibilitychange', onActive)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload])

  const copy = async (k: string) => {
    try {
      await navigator.clipboard.writeText(fileUrl(k))
      message.success('URL 已复制')
    } catch {
      message.error('复制失败，请手动复制')
    }
  }

  const remove = async (k: string) => {
    try {
      await mediaAPI.remove(k)
      message.success('已删除')
      reload()
    } catch (e: any) {
      message.error(e?.error || '删除失败')
    }
  }

  const beforeUpload = (f: File) => {
    const ok = /\.(jpe?g|png|webp|gif|mp3|wav|m4a|aac|mp4|webm|mov|pdf|docx)$/i.test(f.name)
    if (!ok) message.error('仅支持图片 / 音频 / 视频 / PDF / Word')
    if (ok) {
      setFile(f)
      const isMedia = /\.(jpe?g|png|webp|gif|mp3|wav|m4a|aac|mp4|webm|mov)$/i.test(f.name)
      setPreview(isMedia ? URL.createObjectURL(f) : '')
    }
    return false
  }

  const doUpload = async () => {
    if (!file) { message.warning('请先选择文件'); return }
    setBusy(true)
    setPercent(0)
    try {
      await mediaAPI.upload(file, uploadDir, setPercent)
      message.success('上传成功')
      setFile(null); setPreview(''); setPercent(0); setUploadOpen(false)
      reload()
    } catch (e: any) {
      message.error(e?.error || '上传失败')
    } finally {
      setBusy(false)
    }
  }

  const dirs = useCallback(() => {
    const s = new Set<string>(['全部'])
    assets.forEach((a) => s.add(dirOfKey(a.key)))
    return [...s]
  }, [assets])

  const list = assets.filter((a) => {
    if (dir !== '全部' && dirOfKey(a.key) !== dir) return false
    if (kw && !a.key.toLowerCase().includes(kw.trim().toLowerCase())) return false
    return true
  })

  const isImg = file ? /\.(jpe?g|png|webp|gif)$/i.test(file.name) : false
  const isAudio = file ? /\.(mp3|wav|m4a|aac)$/i.test(file.name) : false
  const isVideo = file ? /\.(mp4|webm|mov)$/i.test(file.name) : false

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 20 }}>素材库（R2 图床）</h2>
        <Space wrap>
          <Button type="primary" icon={<CloudUploadOutlined />} onClick={() => setUploadOpen(true)}>上传素材</Button>
          <Button icon={<ReloadOutlined />} onClick={reload}>刷新</Button>
        </Space>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <Select style={{ width: 200 }} value={dir} onChange={setDir}
          options={dirs().map((d) => ({ value: d, label: `${d}${DIR_HINTS[d] ? `（${DIR_HINTS[d]}）` : ''}` }))} />
        <Input allowClear prefix={<SearchOutlined />} placeholder="搜索文件名" value={kw}
          onChange={(e) => setKw(e.target.value)} style={{ maxWidth: 240 }} />
        <span style={{ color: '#999', fontSize: 13 }}>
          上传后请回到对应内容页，用「素材库」按钮选用 · 共 {assets.length} 个文件
        </span>
      </div>

      <Spin spinning={loading}>
        {list.length === 0 ? (
          <Empty description="暂无素材，点「上传素材」添加" style={{ padding: 40 }} />
        ) : (
          <div style={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto', paddingRight: 6 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(170px, 100%), 1fr))', gap: 12 }}>
              {list.map((a) => {
                const url = fileUrl(a.key)
                return (
                  <div key={a.key} style={{
                    border: '1px solid #eee', borderRadius: 10, overflow: 'hidden', background: '#fff',
                    display: 'flex', flexDirection: 'column',
                  }}>
                    <div style={{
                      height: 112, background: '#f6f4ee', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', overflow: 'hidden',
                    }}>
                      {isImageKey(a.key) ? (
                        <img src={url} alt={a.key} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : isVideoKey(a.key) ? (
                        <video src={url} muted preload="metadata" style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#000' }} />
                      ) : isAudioKey(a.key) ? (
                        <div style={{ textAlign: 'center', color: '#999' }}><div style={{ fontSize: 36 }}>🎵</div></div>
                      ) : (
                        <div style={{ textAlign: 'center', color: '#999' }}><div style={{ fontSize: 36 }}>📄</div></div>
                      )}
                    </div>
                    <div style={{ padding: '6px 8px', fontSize: 11, color: '#666' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }} title={a.key}>{a.key}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        {kindTag(a.key)}
                        <span>{fmtSize(a.size)}</span>
                      </div>
                      <Space size={0}>
                        <Button size="small" type="text" onClick={() => copy(a.key)}>复制URL</Button>
                        <Popconfirm title="删除该素材？" description="被内容引用的图片/文件将无法显示" onConfirm={() => remove(a.key)}>
                          <Button size="small" type="text" danger>删除</Button>
                        </Popconfirm>
                      </Space>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </Spin>

      <Modal
        title="上传素材"
        open={uploadOpen}
        onCancel={() => { setFile(null); setPreview(''); setPercent(0); setUploadOpen(false) }}
        onOk={doUpload}
        okText={busy ? `上传中 ${percent}%` : '确认上传'}
        confirmLoading={busy}
        okButtonProps={{ disabled: !file }}
        closable={!busy}
        maskClosable={!busy}
        keyboard={!busy}
        destroyOnClose
      >
        <div style={{ marginBottom: 12 }}>
          <div style={{ marginBottom: 6, fontWeight: 600 }}>1. 选择素材文件夹</div>
          <Select value={uploadDir} onChange={setUploadDir} style={{ width: '100%' }}
            options={UPLOAD_DIRS.map((d) => ({ value: d, label: `${d}（${DIR_HINTS[d] || ''}）` }))} />
        </div>
        <div>
          <div style={{ marginBottom: 6, fontWeight: 600 }}>2. 选择文件（可预览）</div>
          <Upload beforeUpload={beforeUpload} showUploadList={false}
            accept="image/jpeg,image/png,image/webp,image/gif,audio/mpeg,audio/wav,audio/mp4,video/mp4,video/webm,video/quicktime,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document">
            <Button icon={<PictureOutlined />} block>选择图片 / 音频 / 视频 / 文档</Button>
          </Upload>
        </div>
        {file && (
          <div style={{ marginTop: 12, border: '1px dashed #ddd', borderRadius: 10, padding: 10, textAlign: 'center', background: '#fafafa' }}>
            {isImg ? (
              <img src={preview} alt="预览" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }} />
            ) : isVideo ? (
              <video src={preview} controls muted style={{ width: '100%', maxHeight: 220, borderRadius: 8, background: '#000' }} />
            ) : isAudio ? (
              <audio src={preview} controls style={{ width: '100%' }} />
            ) : null}
            <div style={{ marginTop: 6, color: '#666', fontSize: 13 }}>{file.name} · {fmtSize(file.size)}</div>
          </div>
        )}
        {busy && (
          <div style={{ marginTop: 12 }}>
            <Progress percent={percent} status="active" strokeColor="#7CB342" />
            <div style={{ textAlign: 'center', color: '#999', fontSize: 12 }}>正在上传到 R2… {percent}%</div>
          </div>
        )}
      </Modal>
    </div>
  )
}
