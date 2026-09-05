import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Skeleton, Empty, Tag } from 'antd';
import PageLayout from '../components/PageLayout';
import RevealWrapper from '../components/RevealWrapper';
import { videoAPI } from '../api';
import { fileUrl } from '../utils/fileUrl';

const categoryMeta: Record<string, { color: string; icon: string }> = {
  '总结视频': { color: 'linear-gradient(135deg, #FFF3E0, #FFE0B2)', icon: '📝' },
  '示范课堂': { color: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)', icon: '📚' },
};
const defaultMeta = { color: 'linear-gradient(135deg, #E3F2FD, #BBDEFB)', icon: '🎬' };

interface VideoItem {
  id: number;
  title: string;
  file_key?: string | null;
  iframe_src?: string;
  category?: string;
  created_at?: string;
}

export default function VideoDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState<VideoItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const meta = video ? categoryMeta[video.category || ''] || defaultMeta : defaultMeta;

  useEffect(() => {
    if (!id) {
      setError(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(false);
    videoAPI.get(id)
      .then((res: any) => {
        if (res?.data) {
          setVideo(res.data);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <PageLayout
      title="示范课程"
      backTo="/videos"
      backLabel="返回课程列表"
      background="linear-gradient(180deg, #FAF9F6 0%, #E8F5E9 100%)"
    >
      {loading ? (
        <div className="glow-card" style={{ padding: 0, overflow: 'hidden', maxWidth: 900, margin: '0 auto' }}>
          <Skeleton.Image style={{ width: '100%', aspectRatio: '16 / 9' }} active />
          <div style={{ padding: 32 }}>
            <Skeleton active paragraph={{ rows: 2 }} />
          </div>
        </div>
      ) : error || !video ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <Empty description="视频不存在或已下架" />
          <button onClick={() => navigate('/videos')} className="btn-primary" style={{ marginTop: 24 }}>
            返回课程列表
          </button>
        </div>
      ) : (
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <RevealWrapper>
            {fileUrl(video.file_key) ? (
              <div className="glow-card" style={{ padding: 0, overflow: 'hidden', background: '#000' }}>
                <video
                  key={video.file_key}
                  src={fileUrl(video.file_key)}
                  title={video.title}
                  controls
                  autoPlay
                  playsInline
                  style={{ width: '100%', aspectRatio: '16 / 9', display: 'block', background: '#000', objectFit: 'contain' }}
                />
              </div>
            ) : (
              <div className="glow-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
                <Empty description="视频文件尚未上传，请稍后再来或联系管理员" />
              </div>
            )}
          </RevealWrapper>

          <RevealWrapper delay={1}>
            <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: meta.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  flexShrink: 0,
                }}
              >
                {meta.icon}
              </div>
              <h1
                style={{
                  fontSize: 'clamp(22px, 3.5vw, 32px)',
                  fontWeight: 700,
                  color: '#2C3E33',
                  margin: 0,
                  letterSpacing: '-0.01em',
                  flex: 1,
                  minWidth: 220,
                }}
              >
                {video.title}
              </h1>
            </div>
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <Tag color="green">{video.category || '示范课堂'}</Tag>
              {video.created_at && (
                <span style={{ fontSize: 13, color: '#8A9E8F' }}>发布于 {String(video.created_at).slice(0, 10)}</span>
              )}
            </div>
          </RevealWrapper>
        </div>
      )}
    </PageLayout>
  );
}
