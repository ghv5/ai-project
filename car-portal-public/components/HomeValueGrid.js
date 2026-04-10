'use client';

const VALUE_ITEMS = [
  {
    title: '数据汇聚',
    desc: '汇聚汽车标注、仿真、案例与新闻内容资产，构建统一的数据展示入口。'
  },
  {
    title: '工具链协同',
    desc: '把标注平台、仿真平台和运营能力收敛到同一个门户体系中。'
  },
  {
    title: '统一展示',
    desc: '面向客户和合作方提供一致的品牌表达、能力说明和内容传播载体。'
  }
];

export default function HomeValueGrid() {
  return (
    <section className="value-section">
      <h2>平台定位 / 核心价值</h2>
      <div className="value-grid">
        {VALUE_ITEMS.map(item => (
          <article className="value-card" key={item.title}>
            <div className="value-icon" />
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
