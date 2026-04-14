'use client';

import Link from 'next/link';

function deriveDuration(item) {
  if (item.duration) return item.duration;
  if (item.tags?.includes('长视频')) return '18:30';
  if (item.tags?.includes('短视频')) return '05:20';
  return '09:45';
}

export default function VideoCaseCard({ item, compact = false }) {
  return (
    <article className={`video-case-card${compact ? ' compact' : ''}`}>
      <div className="video-cover">
        {item.videoUrl ? (
          <video className="video-cover-player" controls preload="metadata" src={item.videoUrl} />
        ) : (
          <>
            <span className="video-play">▶</span>
            <span className="video-duration">{deriveDuration(item)}</span>
          </>
        )}
      </div>
      <h3>{item.title}</h3>
      <p>{item.description || ''}</p>
      <div className="case-meta">
        <span>{item.updateTime ? String(item.updateTime).slice(0, 10) : '未更新时间'}</span>
        <span>{item.tags || '未设置标签'}</span>
      </div>
      <Link href={`/cases/${item.caseId}`}>查看详情</Link>
    </article>
  );
}
