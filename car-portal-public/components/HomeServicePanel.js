'use client';

import { useState } from 'react';

export default function HomeServicePanel({ services = [] }) {
  const [activeService, setActiveService] = useState(0);
  const displayServices = Array.isArray(services) ? services : [];
  const current = displayServices[activeService] || displayServices[0];

  return (
    <section className="service-section" id="service-center">
      <div className="section-title-wrap">
        <p className="section-kicker">TOOLS & SERVICES</p>
        <h2>工具链与服务</h2>
      </div>
      <div className="service-layout">
        {displayServices.length ? (
          <>
            <aside className="service-tabs">
              {displayServices.map((service, index) => (
                <button
                  className={index === activeService ? 'active' : ''}
                  key={service.title || service.category || String(index)}
                  onClick={() => setActiveService(index)}
                  type="button"
                >
                  {service.category || service.title}
                </button>
              ))}
            </aside>
            <div className="service-content">
              <h3>{current?.title || ''}</h3>
              <p>{current?.description || ''}</p>
              <div className="partner-list">
                {(current?.partnerNames || []).map(name => (
                  <div className="partner-item" key={name}>
                    {name}
                  </div>
                ))}
              </div>
            </div>
            <div className="service-side-card">
              <span>协同能力矩阵</span>
              <small>统一门户下的标注、仿真、案例运营一体化协同展示</small>
            </div>
          </>
        ) : (
          <p className="empty-text">暂无服务数据</p>
        )}
      </div>
    </section>
  );
}
