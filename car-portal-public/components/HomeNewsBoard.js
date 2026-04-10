'use client';

export default function HomeNewsBoard({ news = [] }) {
  const featured = news.find(item => item.highlight) || news[0];
  const rest = news.filter(item => !featured || item.id !== featured.id);

  return (
    <section className="news-section" id="news-board">
      <h2>新闻资讯</h2>
      <div className="news-layout">
        <article className="news-highlight">
          <p className="news-badge">重点资讯</p>
          <h3>{featured?.title || '暂无资讯'}</h3>
          <p>{featured?.summary || ''}</p>
          <small>{featured?.publishDate || ''}</small>
        </article>
        <div className="news-list">
          {rest.length ? (
            rest.map(item => (
              <article key={item.id}>
                <h4>{item.title}</h4>
                <p>{item.summary || ''}</p>
              </article>
            ))
          ) : (
            <article>
              <h4>更多资讯待更新</h4>
              <p>当前没有更多资讯内容。</p>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
