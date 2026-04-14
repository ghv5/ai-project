'use client';

import Link from 'next/link';

export default function HomeHero({ title, subtitle }) {
  return (
    <section className="hero">
      <div className="hero-tech-grid" />
      <div className="hero-tech-glow hero-tech-glow-left" />
      <div className="hero-tech-glow hero-tech-glow-right" />
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="hero-kicker">AUTOMOTIVE DATA PORTAL</p>
          <h1>{title}</h1>
          <p>{subtitle}</p>
          <div className="hero-actions">
            <Link className="hero-primary-btn" href="/cases">
              进入案例库
            </Link>
            <Link className="hero-secondary-btn" href="/third-party/annotate">
              体验工具平台
            </Link>
          </div>
        </div>
        <div className="hero-visual-shell" aria-label="三层环形层级结构图">
          <div className="hero-ring hero-ring-outer">
            <span>统一展示</span>
          </div>
          <div className="hero-ring hero-ring-middle">
            <span>工具协同</span>
          </div>
          <div className="hero-ring hero-ring-inner">
            <span>数据汇聚</span>
          </div>
        </div>
      </div>
    </section>
  );
}
