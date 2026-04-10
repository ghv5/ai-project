'use client';

import VideoCaseCard from './VideoCaseCard';

export default function PinnedVideoSection({ cases = [] }) {
  if (!cases.length) return null;

  return (
    <section className="pinned-block">
      <div className="section-head">
        <h2>置顶视频案例</h2>
      </div>
      <div className="case-grid compact">
        {cases.map(item => (
          <VideoCaseCard compact item={item} key={item.caseId} />
        ))}
      </div>
    </section>
  );
}
