'use client';

import { useEffect, useMemo, useState } from 'react';
import CasesFilters from '../../components/CasesFilters';
import CasesHero from '../../components/CasesHero';
import PinnedVideoSection from '../../components/PinnedVideoSection';
import PortalHeader from '../../components/PortalHeader';
import VideoCaseCard from '../../components/VideoCaseCard';
import { getToken, listPortalCases, logoutAll } from '../../lib/api';

function inferCategory(item) {
  return item.industry || item.scenario || '未分类';
}

function matchTag(item, activeTag) {
  if (activeTag === '全部') return true;
  return (item.tags || '').includes(activeTag);
}

export default function CasesPage() {
  const [cases, setCases] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');
  const [activeTag, setActiveTag] = useState('全部');
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

  const categoryOptions = useMemo(() => {
    const categories = Array.from(new Set(cases.map(inferCategory).filter(Boolean)));
    return ['全部', ...categories];
  }, [cases]);

  const tagOptions = useMemo(() => {
    const tags = cases.flatMap(item =>
      String(item.tags || '')
        .split(/[，,]/)
        .map(tag => tag.trim())
        .filter(Boolean)
    );
    return ['全部', ...Array.from(new Set(tags))];
  }, [cases]);

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
    setActiveTag('全部');
  }

  return (
    <main className="portal-root portal-cases">
      <PortalHeader active="cases" loggedIn={loggedIn} onLogout={handleLogout} />
      <CasesHero />
      <PinnedVideoSection cases={pinnedCases.slice(0, 3)} />
      <CasesFilters
        activeCategory={activeCategory}
        activeTag={activeTag}
        categoryOptions={categoryOptions}
        keyword={keyword}
        onReset={onReset}
        onSearch={onSearch}
        setActiveCategory={setActiveCategory}
        setActiveTag={setActiveTag}
        setKeyword={setKeyword}
        tagOptions={tagOptions}
      />
      <section className="all-case-block">
        <div className="section-head">
          <div className="section-title-wrap">
            <p className="section-kicker">ALL CASE VIDEOS</p>
            <h2>全部视频案例</h2>
          </div>
        </div>
        <div className="case-grid">
          {filteredCases.length ? (
            filteredCases.map(item => <VideoCaseCard item={item} key={item.caseId} />)
          ) : (
            <p className="empty-text">暂无案例数据</p>
          )}
        </div>
      </section>

      {error ? <p className="error-text">{error}</p> : null}
    </main>
  );
}
