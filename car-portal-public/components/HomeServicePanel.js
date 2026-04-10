'use client';

import { useState } from 'react';

export default function HomeServicePanel({ services = [] }) {
  const [activeService, setActiveService] = useState(0);
  const current = services[activeService] || services[0];

  return (
    <section className="service-section" id="service-center">
      <h2>工具链与服务</h2>
      <div className="service-layout">
        <aside className="service-tabs">
          {services.map((service, index) => (
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
          <h3>{current?.title || '平台能力矩阵'}</h3>
          <p>{current?.description || '围绕标注、仿真和内容运营形成统一门户能力。'}</p>
          <div className="partner-list">
            {(current?.partnerNames || []).map(name => (
              <div className="partner-item" key={name}>
                {name}
              </div>
            ))}
          </div>
        </div>
        <div className="service-side-card">
          <span>平台能力矩阵</span>
          <small>统一门户下的工具链协同展示</small>
        </div>
      </div>
    </section>
  );
}
