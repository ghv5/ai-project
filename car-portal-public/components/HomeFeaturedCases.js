'use client';

import Link from 'next/link';
import VideoCaseCard from './VideoCaseCard';

export default function HomeFeaturedCases({ cases = [] }) {
  const displayCases = Array.isArray(cases) ? cases : [];

  return (
    <section className="case-section">
      <div className="section-head">
        <div className="section-title-wrap">
          <p className="section-kicker">VIDEO CASES</p>
          <h2>案例精选</h2>
        </div>
        <Link className="section-more" href="/cases">
          查看更多
        </Link>
      </div>
      <div className="case-grid">
        {displayCases.length ? (
          displayCases.map(item => <VideoCaseCard item={item} key={item.caseId} compact />)
        ) : (
          <p className="empty-text">暂无案例数据</p>
        )}
      </div>
    </section>
  );
}
