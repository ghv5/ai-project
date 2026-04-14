'use client';

export default function HomeProcessFlow({ steps = [] }) {
  const flowSteps = Array.isArray(steps) ? steps : [];

  return (
    <section className="process-section">
      <div className="section-title-wrap">
        <p className="section-kicker">SERVICE WORKFLOW</p>
        <h2>业务流程</h2>
      </div>
      {flowSteps.length ? (
        <div className="process-row">
          {flowSteps.map((step, index) => (
            <div className="process-item" key={`${step}-${index}`}>
              <div className="process-node">
                <span className="process-index">{index + 1}</span>
                <span className="process-label">{step}</span>
              </div>
              {index < flowSteps.length - 1 ? <div className="process-connector" /> : null}
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-text">暂无流程数据</p>
      )}
    </section>
  );
}
