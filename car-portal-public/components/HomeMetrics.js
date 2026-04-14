'use client';

export default function HomeMetrics({ stats = [] }) {
  const displayStats = Array.isArray(stats) ? stats : [];

  return (
    <section className="stats">
      {displayStats.length ? (
        displayStats.map((item, index) => (
          <article className="stat-card" key={`${item.label || 'stat'}-${index}`}>
            <div className={`stat-icon stat-icon-${index % 3}`} />
            <div className="stat-copy">
              <div className="stat-label">{item.label}</div>
            </div>
            <div className="stat-value-wrap">
              <div className="stat-value">{item.value}</div>
              {item.unit ? <span className="stat-unit">{item.unit}</span> : null}
            </div>
          </article>
        ))
      ) : (
        <p className="empty-text">暂无统计数据</p>
      )}
    </section>
  );
}
