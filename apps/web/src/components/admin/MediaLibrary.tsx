import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Alert, Button, Empty, Input, Modal, Popconfirm, Progress, Select, Space, Spin, Tag, Upload, message,
} from 'antd'
import {
  CloudUploadOutlined, CopyOutlined, DeleteOutlined, PictureOutlined,
  SearchOutlined, AudioOutlined, FileTextOutlined, VideoCameraOutlined,
} from '@ant-design/icons'
import { mediaAPI } from '../../api'
import { dirOfKey, fileUrl, fmtSize, isAudioKey, isDocKey, isImageKey, isVideoKey } from '../../utils/fileUrl'
import { COMPRESS_ADVICE_THRESHOLD, uploadAny } from '../../utils/uploadLarge'

export type Asset = { key: string; size: number; uploaded?: string }
export type MediaKind = 'image' | 'audio' | 'doc' | 'video'

/** 后台可上传目录（素材库分组；键与后端 lib/files ALLOWED_DIRS 对应） */
export const UPLOAD_DIRS = ['videos', 'docs', 'artworks', 'audios', 'voices', 'moments', 'images', 'misc']
export const DIR_HINTS: Record<string, string> = {
  videos: '课程/童声视频',
  docs: '推普资料',
  artworks: '儿童画展',
  audios: '朗诵音频',
  voices: '童声童语配图',
  moments: '支教拾光照片',
  images: '通用图片',
  misc: '其他',
}

/** 素材类型 → 上传默认目录 */
export const dirForKind: Record<MediaKind, string> = {
  image: 'images',
  audio: 'audios',
  video: 'videos',
  doc: 'docs',
}

export const kindOfAsset = (k: string): MediaKind | 'other' => {
  if (isImageKey(k)) return 'image'
  if (isAudioKey(k)) return 'audio'
  if (isVideoKey(k)) return 'video'
  if (isDocKey(k)) return 'doc'
  return 'other'
}

function useAssets() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
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
  }, [])
  return { assets, loading, reload }
}

/** 上传子窗口：选择目录 + 选择文件（图片/音频/视频/文档可预览） */
function UploadMediaModal({ open, onCancel, onDone, initialDir }: {
  open: boolean
  onCancel: () => void
  onDone: () => void
  initialDir?: string
}) {
  const [dir, setDir] = useState(initialDir && UPLOAD_DIRS.includes(initialDir) ? initialDir : UPLOAD_DIRS[0])
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [busy, setBusy] = useState(false)
  const [percent, setPercent] = useState(0)
  const [meta, setMeta] = useState<{ part: number; parts: number } | null>(null)

  const reset = () => { setFile(null); setPreview(''); setBusy(false); setPercent(0); setMeta(null) }
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
    setMeta(null)
    try {
      await uploadAny(file, dir, (pct, m) => {
        setPercent(pct)
        if (m) setMeta({ part: m.part, parts: m.parts })
      })
      message.success('上传成功')
      reset()
      onDone()
      onCancel()
    } catch (e: any) {
      message.error(e?.error || '上传失败')
    } finally {
      setBusy(false)
    }
  }
  const isAudio = file ? /\.(mp3|wav|m4a|aac)$/i.test(file.name) : false
  const isImage = file ? /\.(jpe?g|png|webp|gif)$/i.test(file.name) : false
  const isVideo = file ? /\.(mp4|webm|mov)$/i.test(file.name) : false
  const isBigVideo = file ? (isVideo && file.size >= COMPRESS_ADVICE_THRESHOLD) : false

  return (
    <Modal
      title="上传素材"
      open={open}
      onCancel={() => { reset(); onCancel() }}
      onOk={doUpload}
      okText={busy ? `上传中 ${percent}%` : '确认上传'}
      confirmLoading={busy}
      okButtonProps={{ disabled: !file }}
      closable={!busy}
      maskClosable={!busy}
      keyboard={!busy}
      destroyOnClose
    >
      <Space direction="vertical" style={{ width: '100%' }} size={14}>
        <div>
          <div style={{ marginBottom: 6, fontWeight: 600 }}>1. 选择素材文件夹</div>
          <Select
            value={dir} onChange={setDir} style={{ width: '100%' }}
            options={UPLOAD_DIRS.map((d) => ({ value: d, label: `${d}（${DIR_HINTS[d] || ''}）` }))}
          />
        </div>
        <div>
          <div style={{ marginBottom: 6, fontWeight: 600 }}>2. 选择文件（可预览）</div>
          <Upload
            beforeUpload={beforeUpload}
            showUploadList={false}
            accept="image/jpeg,image/png,image/webp,image/gif,audio/mpeg,audio/wav,audio/mp4,video/mp4,video/webm,video/quicktime,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          >
            <Button icon={<PictureOutlined />} block>选择图片 / 音频 / 视频 / 文档</Button>
          </Upload>
        </div>
        {file && (
          <div style={{ border: '1px dashed #ddd', borderRadius: 10, padding: 10, textAlign: 'center', background: '#fafafa' }}>
            {isAudio ? (
              <audio src={preview} controls style={{ width: '100%' }} />
            ) : isVideo ? (
              <video src={preview} controls muted style={{ maxWidth: '100%', maxHeight: 220, borderRadius: 8, background: '#000' }} />
            ) : isImage ? (
              <img src={preview} alt="预览" style={{ maxWidth: '100%', maxHeight: 220, borderRadius: 8 }} />
            ) : (
              <FileTextOutlined style={{ fontSize: 42, color: '#bbb' }} />
            )}
            <div style={{ marginTop: 6, color: '#666', fontSize: 13 }}>{file.name} · {fmtSize(file.size)}</div>
          </div>
        )}
        {isBigVideo && (
          <Alert
            type="warning"
            showIcon
            message="大视频提示：800MB 级原片建议先压缩再传"
            description={<span>推荐 H.264、≤1080p、码率 2–3Mbps（CRF 20–23），画质几乎无差、上传更快；继续直传也可以，将自动分片直传 R2（约 64MB/片）。<a href="/compress-guide" target="_blank" rel="noreferrer" style={{ marginLeft: 6 }}>查看压缩教程 →</a></span>}
          />
        )}
        {busy && (
          <div>
            <Progress percent={percent} status="active" strokeColor="#7CB342" />
            <div style={{ textAlign: 'center', color: '#999', fontSize: 12 }}>
              {meta && meta.parts > 1 ? `已完成 ${meta.part}/${meta.parts} 片 · ` : ''}正在直传 R2… {percent}%
            </div>
          </div>
        )}
      </Space>
    </Modal>
  )
}

function AssetCard({ asset, onCopy, onDelete, onSelect }: {
  asset: Asset
  onCopy?: (k: string) => void
  onDelete?: (k: string) => void
  onSelect?: (k: string) => void
}) {
  const k = asset.key
  const url = fileUrl(k)
  const kind = kindOfAsset(k)
  return (
    <div style={{
      border: '1px solid #eee', borderRadius: 10, overflow: 'hidden', background: '#fff',
      cursor: onSelect ? 'pointer' : 'default', display: 'flex', flexDirection: 'column',
      transition: 'all .2s', boxShadow: '0 1px 4px rgba(0,0,0,.04)',
    }}>
      <div
        style={{ height: 112, background: '#f6f4ee', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
        onClick={() => onSelect?.(k)}
      >
        {kind === 'image' ? (
          <img src={url} alt={k} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : kind === 'video' ? (
          <video src={url} muted preload="metadata" style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#000' }} />
        ) : kind === 'audio' ? (
          <div style={{ textAlign: 'center', color: '#999' }}><AudioOutlined style={{ fontSize: 36 }} /><div style={{ fontSize: 12 }}>音频</div></div>
        ) : kind === 'doc' ? (
          <div style={{ textAlign: 'center', color: '#999' }}><FileTextOutlined style={{ fontSize: 36 }} /><div style={{ fontSize: 12 }}>文档</div></div>
        ) : (
          <Tag>文件</Tag>
        )}
      </div>
      <div style={{ padding: '6px 8px', fontSize: 11, color: '#666' }}>
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }} title={k}>{k}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{fmtSize(asset.size)}</span>
          <span onClick={(e) => e.stopPropagation()}>
            {onCopy && <Button size="small" type="text" icon={<CopyOutlined />} onClick={() => onCopy(k)} />}
            {onDelete && (
              <Popconfirm title="删除该素材？" description="被内容引用的图片/文件将无法显示" onConfirm={() => onDelete(k)}>
                <Button size="small" type="text" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            )}
          </span>
        </div>
      </div>
    </div>
  )
}

/** 通用素材网格：目录过滤 + 关键词搜索；固定高度内滚动 */
function AssetGrid({ assets, kw, dir, height, onCopy, onDelete, onSelect, kinds }: {
  assets: Asset[]
  kw: string
  dir: string
  height?: string
  onCopy?: (k: string) => void
  onDelete?: (k: string) => void
  onSelect?: (k: string) => void
  kinds?: MediaKind[]
}) {
  const list = useMemo(() => assets.filter((a) => {
    if (dir !== '全部' && dirOfKey(a.key) !== dir) return false
    if (kinds && kinds.length && !kinds.includes(kindOfAsset(a.key) as MediaKind)) return false
    if (kw && !a.key.toLowerCase().includes(kw.toLowerCase())) return false
    return true
  }), [assets, kw, dir, kinds])

  if (list.length === 0) return <Empty description="暂无素材，点「上传素材」添加" style={{ padding: 40 }} />
  return (
    <div style={{ maxHeight: height || 'calc(100vh - 340px)', overflowY: 'auto', paddingRight: 6 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(170px, 100%), 1fr))', gap: 12 }}>
        {list.map((a) => <AssetCard key={a.key} asset={a} onCopy={onCopy} onDelete={onDelete} onSelect={onSelect} />)}
      </div>
    </div>
  )
}

function dirOptions(assets: Asset[]) {
  const dirs = new Set<string>(['全部'])
  assets.forEach((a) => dirs.add(dirOfKey(a.key)))
  return [...dirs].map((d) => ({ value: d, label: `${d}${DIR_HINTS[d] ? `（${DIR_HINTS[d]}）` : ''}` }))
}

/** 素材选择弹窗：内容表单「素材库」按钮使用；kinds 限定可选类型；onSelect 返回 R2 key */
export function MediaPickerModal({ open, onCancel, onSelect, kinds, title, initialDir }: {
  open: boolean
  onCancel: () => void
  onSelect: (key: string) => void
  kinds?: MediaKind[]
  title?: string
  /** 上传素材弹窗的默认目录 */
  initialDir?: string
}) {
  const { assets, loading, reload } = useAssets()
  const [kw, setKw] = useState('')
  const [dir, setDir] = useState('全部')
  const [uploadOpen, setUploadOpen] = useState(false)

  const defaultUploadDir = initialDir || (kinds && kinds.length === 1 ? dirForKind[kinds[0]] : undefined)

  return (
    <Modal
      title={title || '从素材库选择'}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={860}
      destroyOnClose
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <Select style={{ width: 190 }} value={dir} onChange={setDir} options={dirOptions(assets)} />
        <Input allowClear prefix={<SearchOutlined />} placeholder="搜索文件名" value={kw} onChange={(e) => setKw(e.target.value)} style={{ maxWidth: 200 }} />
        <Button icon={<CloudUploadOutlined />} onClick={() => setUploadOpen(true)}>上传素材</Button>
      </div>
      <Spin spinning={loading}>
        <AssetGrid
          assets={assets} kw={kw} dir={dir} kinds={kinds} height="55vh"
          onSelect={(k) => { onSelect(k); onCancel() }}
        />
      </Spin>
      <UploadMediaModal open={uploadOpen} onCancel={() => setUploadOpen(false)} onDone={reload} initialDir={defaultUploadDir} />
    </Modal>
  )
}
