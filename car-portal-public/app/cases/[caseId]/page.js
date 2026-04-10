'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PortalHeader from '../../../components/PortalHeader';
import { fetchCaseDetail, getToken, logoutAll } from '../../../lib/api';

export default function CaseDetailPage() {
  const { caseId } = useParams();
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(Boolean(getToken()));
  }, []);

  useEffect(() => {
    if (!caseId) return;
    fetchCaseDetail(caseId)
      .then(data => {
        setDetail(data || null);
        setError('');
      })
      .catch(e => setError(e.message));
  }, [caseId]);

  async function handleLogout(event) {
    if (event) event.preventDefault();
    await logoutAll();
    setLoggedIn(false);
  }

  return (
    <main className="portal-root case-detail-page">
      <PortalHeader active="cases" loggedIn={loggedIn} onLogout={handleLogout} />
      <section className="detail-shell">
        <Link className="back-link" href="/cases">
          返回视频案例库
        </Link>
        {detail ? (
          <article className="detail-card">
            <div className="detail-cover">
              <span className="video-play large">▶</span>
              <span className="video-duration detail-duration">
                {(detail.tags || '').includes('长视频') ? '18:30' : '09:45'}
              </span>
            </div>
            <div className="detail-main">
              <p className="detail-kicker">Video Case</p>
              <h1>{detail.title}</h1>
              <p>{detail.description || '暂无描述'}</p>
              <div className="detail-meta">
                <span>标签: {detail.tags || '未设置'}</span>
                <span>更新时间: {detail.updateTime ? String(detail.updateTime).slice(0, 19) : '-'}</span>
              </div>
              <div className="detail-actions">
                {detail.videoUrl ? (
                  <a href={detail.videoUrl} rel="noreferrer" target="_blank">
                    播放视频
                  </a>
                ) : (
                  <span className="muted-text">未配置视频地址</span>
                )}
                <Link href="/third-party/annotate">前往标注平台</Link>
                <Link href="/third-party/simulate">前往仿真平台</Link>
              </div>
            </div>
          </article>
        ) : (
          <p className="muted-text">正在加载案例详情...</p>
        )}
        {error ? <p className="error-text">{error}</p> : null}
      </section>
    </main>
  );
}
