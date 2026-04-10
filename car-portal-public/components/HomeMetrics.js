'use client';

export default function HomeMetrics({ stats = [] }) {
  return (
    <section className="stats">
      {stats.map(item => (
        <article className="stat-card" key={item.label}>
          <div className="stat-icon" />
          <div className="stat-copy">
            <div className="stat-label">{item.label}</div>
          </div>
          <div className="stat-value">{item.value}</div>
        </article>
      ))}
    </section>
  );
}
