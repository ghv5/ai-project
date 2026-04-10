'use client';

import Link from 'next/link';

export default function HomeHero({ title, subtitle }) {
  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="hero-kicker">AUTOMOTIVE DATA PORTAL</p>
          <h1>{title}</h1>
          <p>{subtitle}</p>
          <div className="hero-actions">
            <Link className="ghost-btn" href="/cases">
              查看案例库
            </Link>
            <Link className="solid-btn" href="/third-party/annotate">
              进入标注平台
            </Link>
          </div>
        </div>
        <div className="hero-visual-shell">
          <div className="hero-visual-orbit" />
          <div className="hero-visual-core">
            <span>数据汇聚</span>
            <span>工具协同</span>
            <span>统一展示</span>
          </div>
        </div>
      </div>
    </section>
  );
}
