'use client';

import { useEffect, useState } from 'react';
import HomeFeaturedCases from '../components/HomeFeaturedCases';
import HomeHero from '../components/HomeHero';
import HomeMetrics from '../components/HomeMetrics';
import HomeNewsBoard from '../components/HomeNewsBoard';
import HomeServicePanel from '../components/HomeServicePanel';
import HomeValueGrid from '../components/HomeValueGrid';
import PortalHeader from '../components/PortalHeader';
import { fetchHomeContent, getToken, listPortalCases, logoutAll } from '../lib/api';

export default function HomePage() {
  const [homeData, setHomeData] = useState({});
  const [cases, setCases] = useState([]);
  const [message, setMessage] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(Boolean(getToken()));
    Promise.all([fetchHomeContent(), listPortalCases()])
      .then(([home, caseList]) => {
        setHomeData(home || {});
        setCases(caseList || []);
      })
      .catch(error => setMessage(error.message));
  }, []);

  async function handleLogout(event) {
    if (event) event.preventDefault();
    await logoutAll();
    setLoggedIn(false);
  }

  return (
    <main className="portal-root portal-home">
      <PortalHeader active="home" loggedIn={loggedIn} onLogout={handleLogout} />
      <HomeHero
        subtitle={homeData.heroSubtitle || '面向汽车仿真、标注与案例运营的一体化品牌门户'}
        title={homeData.heroTitle || '汽车数据门户平台'}
      />
      <HomeMetrics stats={homeData.stats || []} />
      <HomeValueGrid />
      <HomeNewsBoard news={homeData.news || []} />
      <HomeServicePanel services={homeData.services || []} />
      <HomeFeaturedCases cases={cases.slice(0, 3)} />
      {message ? <p className="error-text">{message}</p> : null}
    </main>
  );
}
