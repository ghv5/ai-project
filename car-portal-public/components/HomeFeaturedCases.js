'use client';

import Link from 'next/link';

export default function HomeFeaturedCases({ cases = [] }) {
  return (
    <section className="case-section">
      <div className="section-head">
        <h2>案例精选</h2>
        <Link className="section-more" href="/cases">
          查看更多
        </Link>
      </div>
      <div className="case-grid">
        {cases.map(item => (
          <article className="case-card" key={item.caseId}>
            <div className="case-cover" />
            <h3>{item.title}</h3>
            <p>{item.description || ''}</p>
            <Link href={`/cases/${item.caseId}`}>播放详情</Link>
          </article>
        ))}
      </div>
    </section>
  );
}
