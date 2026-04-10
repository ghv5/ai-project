'use client';

import { useEffect, useMemo, useState } from 'react';
import CasesFilters from '../../components/CasesFilters';
import CasesHero from '../../components/CasesHero';
import PinnedVideoSection from '../../components/PinnedVideoSection';
import PortalHeader from '../../components/PortalHeader';
import VideoCaseCard from '../../components/VideoCaseCard';
import { getToken, listPortalCases, logoutAll } from '../../lib/api';

function inferCategory(item) {
  const text = `${item.title || ''} ${item.description || ''} ${item.tags || ''}`;
  if (text.includes('标注')) return '标注案例';
  if (text.includes('仿真')) return '仿真案例';
  if (text.includes('工具')) return '工具链案例';
  if (text.includes('数据')) return '数据案例';
  return '全部';
}

function matchTag(item, activeTag) {
  if (activeTag === '全部') return true;
  if (activeTag === '最新') return true;
  return (item.tags || '').includes(activeTag);
}

export default function CasesPage() {
  const [cases, setCases] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');
  const [activeTag, setActiveTag] = useState('热门');
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(Boolean(getToken()));
  }, []);

  useEffect(() => {
    listPortalCases(query)
      .then(data => {
        setCases(data || []);
        setError('');
      })
      .catch(e => setError(e.message));
  }, [query]);

  const pinnedCases = useMemo(() => cases.filter(item => item.pinned), [cases]);

  const filteredCases = useMemo(() => {
    return cases.filter(item => {
      const categoryMatched =
        activeCategory === '全部' ? true : inferCategory(item) === activeCategory;
      const tagMatched = matchTag(item, activeTag);
      return categoryMatched && tagMatched;
    });
  }, [activeCategory, activeTag, cases]);

  async function handleLogout(event) {
    if (event) event.preventDefault();
    await logoutAll();
    setLoggedIn(false);
  }

  function onSearch(event) {
    event.preventDefault();
    setQuery(keyword.trim());
  }

  function onReset() {
    setKeyword('');
    setQuery('');
    setActiveCategory('全部');
    setActiveTag('热门');
  }

  return (
    <main className="portal-root portal-cases">
      <PortalHeader active="cases" loggedIn={loggedIn} onLogout={handleLogout} />
      <CasesHero />
      <PinnedVideoSection cases={pinnedCases.slice(0, 3)} />
      <CasesFilters
        activeCategory={activeCategory}
        activeTag={activeTag}
        keyword={keyword}
        onReset={onReset}
        onSearch={onSearch}
        setActiveCategory={setActiveCategory}
        setActiveTag={setActiveTag}
        setKeyword={setKeyword}
      />
      <section className="all-case-block">
        <div className="section-head">
          <h2>全部视频案例</h2>
        </div>
        <div className="case-grid">
          {filteredCases.map(item => (
            <VideoCaseCard item={item} key={item.caseId} />
          ))}
        </div>
      </section>

      {error ? <p className="error-text">{error}</p> : null}
    </main>
  );
}
