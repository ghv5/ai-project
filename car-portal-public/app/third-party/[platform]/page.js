'use client';

import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PortalHeader from '../../../components/PortalHeader';
import { createSsoTicket, getToken, logoutAll } from '../../../lib/api';

export default function ThirdPartyPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const ticket = searchParams.get('ticket') || '';
  const [entryUrl, setEntryUrl] = useState('');
  const [status, setStatus] = useState(ticket ? '正在消费统一登录票据...' : '正在建立统一登录...');
  const [loggedIn, setLoggedIn] = useState(false);
  const [exchangeData, setExchangeData] = useState(null);
  const platform = params.platform === 'simulate' ? 'simulate' : 'annotate';
  const isConsumer = Boolean(ticket);

  useEffect(() => {
    setLoggedIn(Boolean(getToken()));

    if (isConsumer) {
      fetch('/api/portal-sso/exchange', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          platform,
          ticket
        })
      })
        .then(async response => {
          const result = await response.json();
          if (!response.ok || String(result.code) !== '200') {
            throw new Error(result.msg || '票据交换失败');
          }
          setExchangeData(result.data || null);
          setStatus('统一登录完成，第三方平台会话已建立。');
        })
        .catch(error => setStatus(error.message));
      return;
    }

    if (!getToken()) {
      router.replace('/login');
      return;
    }

    createSsoTicket(platform)
      .then(data => {
        setEntryUrl(data.entryUrl || '');
        setStatus('统一登录已建立，正在加载平台...');
      })
      .catch(error => setStatus(error.message));
  }, [isConsumer, platform, router, ticket]);

  async function handleLogout(event) {
    if (event) event.preventDefault();
    await logoutAll();
    setLoggedIn(false);
    router.replace('/login');
  }

  if (isConsumer) {
    return (
      <main className="third-consumer-shell">
        <section className="third-consumer-card">
          <div className="third-consumer-kicker">
            {platform === 'annotate' ? 'ANNOTATE WORKSPACE' : 'SIMULATION WORKSPACE'}
          </div>
          <h1>{platform === 'annotate' ? '标注平台工作台' : '仿真平台工作台'}</h1>
          <p className="third-status">{status}</p>
          {exchangeData ? (
            <>
              <div className="third-consumer-grid">
                <div>
                  <span>平台类型</span>
                  <strong>{exchangeData.platform}</strong>
                </div>
                <div>
                  <span>第三方账号</span>
                  <strong>{exchangeData.thirdPartyAccount}</strong>
                </div>
                <div>
                  <span>会话时长</span>
                  <strong>{exchangeData.expireIn}s</strong>
                </div>
                <div>
                  <span>门户用户ID</span>
                  <strong>{exchangeData.userId}</strong>
                </div>
              </div>
              <div className="third-consumer-token">
                <span>sessionToken</span>
                <code>{exchangeData.sessionToken}</code>
              </div>
              <div className="third-consumer-panel">
                <div className="third-consumer-dot" />
                <div>
                  <h2>本地联调说明</h2>
                  <p>当前 iframe 已完成 ticket exchange。这里是第三方平台的本地占位页面，后续可替换为真实系统首页。</p>
                </div>
              </div>
            </>
          ) : null}
        </section>
      </main>
    );
  }

  return (
    <main className="portal-root third-page">
      <PortalHeader active="" loggedIn={loggedIn} onLogout={handleLogout} />
      <section className="third-shell">
        <header className="third-header">
          <h1 id="thirdPartyTitle">{platform === 'annotate' ? '标注平台' : '仿真平台'}</h1>
          <div className="third-links">
            <Link href="/third-party/annotate">标注平台</Link>
            <Link href="/third-party/simulate">仿真平台</Link>
            <Link href="/">返回门户</Link>
          </div>
        </header>
        <p id="thirdPartyStatus" className="third-status">
          {status}
        </p>
        {entryUrl ? <iframe id="thirdPartyFrame" src={entryUrl} title="third-party-platform" /> : null}
      </section>
    </main>
  );
}
