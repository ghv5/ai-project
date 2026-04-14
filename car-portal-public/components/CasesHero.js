'use client';

export default function CasesHero() {
  return (
    <section className="cases-banner">
      <div className="cases-banner-copy">
        <p className="hero-kicker">VIDEO LIBRARY</p>
        <h1>视频案例库</h1>
        <p>汇聚汽车标注、仿真、数据处理相关视频案例，支持检索、分类浏览与置顶推荐展示。</p>
      </div>
      <div className="cases-banner-visual">
        <div className="cases-banner-grid" />
        <div className="cases-banner-orb cases-banner-orb-primary" />
        <div className="cases-banner-orb cases-banner-orb-secondary" />
        <div className="cases-banner-frame">
          <span>精选视频案例</span>
          <span>标注 / 仿真 / 数据</span>
        </div>
      </div>
    </section>
  );
}
