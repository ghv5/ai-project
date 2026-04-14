'use client';

import { useEffect, useState } from 'react';
import HomeFeaturedCases from '../components/HomeFeaturedCases';
import HomeHero from '../components/HomeHero';
import HomeMetrics from '../components/HomeMetrics';
import HomeNewsBoard from '../components/HomeNewsBoard';
import HomeProcessFlow from '../components/HomeProcessFlow';
import HomeServicePanel from '../components/HomeServicePanel';
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
        subtitle={homeData.heroSubtitle || ''}
        title={homeData.heroTitle || ''}
      />
      <HomeMetrics stats={homeData.stats || []} />
      <HomeProcessFlow steps={homeData.flowSteps || []} />
      <HomeNewsBoard news={homeData.news || []} />
      <HomeServicePanel services={homeData.services || []} />
      <HomeFeaturedCases cases={cases.slice(0, 3)} />
      {message ? <p className="error-text">{message}</p> : null}
    </main>
  );
}
