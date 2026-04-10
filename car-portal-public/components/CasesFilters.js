'use client';

const CATEGORY_OPTIONS = ['全部', '标注案例', '仿真案例', '数据案例', '工具链案例'];
const TAG_OPTIONS = ['热门', '推荐', '最新', '长视频', '短视频'];

export default function CasesFilters({
  activeCategory,
  activeTag,
  keyword,
  onReset,
  onSearch,
  setActiveCategory,
  setActiveTag,
  setKeyword
}) {
  return (
    <section className="filters-block">
      <form className="cases-search" onSubmit={onSearch}>
        <input
          onChange={e => setKeyword(e.target.value)}
          placeholder="请输入视频案例关键词"
          value={keyword}
        />
        <button type="submit">查询</button>
        <button className="secondary-btn" onClick={onReset} type="button">
          重置
        </button>
      </form>
      <div className="filter-row">
        <span>分类筛选</span>
        {CATEGORY_OPTIONS.map(label => (
          <button
            className={label === activeCategory ? 'active' : ''}
            key={label}
            onClick={() => setActiveCategory(label)}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>
      <div className="filter-row">
        <span>标签筛选</span>
        {TAG_OPTIONS.map(label => (
          <button
            className={label === activeTag ? 'active' : ''}
            key={label}
            onClick={() => setActiveTag(label)}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}
