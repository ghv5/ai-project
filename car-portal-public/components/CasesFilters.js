'use client';

export default function CasesFilters({
  activeCategory,
  activeTag,
  categoryOptions,
  tagOptions,
  keyword,
  onReset,
  onSearch,
  setActiveCategory,
  setActiveTag,
  setKeyword
}) {
  return (
    <section className="filters-block">
      <div className="filter-panel">
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
          {categoryOptions.map(label => (
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
          {tagOptions.map(label => (
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
      </div>
    </section>
  );
}
