'use client';

import Link from 'next/link';

export default function PortalHeader({ active, loggedIn, onLogout }) {
  return (
    <header className="top-nav">
      <div className="top-nav-inner">
        <Link className="logo-wrap" href="/">
          <div className="logo-mark">A</div>
          <div className="logo-text-wrap">
            <div className="logo-text">汽车数据门户平台</div>
            <div className="logo-sub-text">AUTOMOTIVE DATA PORTAL</div>
          </div>
        </Link>
        <nav className="nav-links">
          <Link className={active === 'home' ? 'active' : ''} href="/">
            首页
          </Link>
          <Link className={active === 'cases' ? 'active' : ''} href="/cases">
            案例库
          </Link>
          <Link href="/third-party/annotate">标注平台</Link>
          <Link href="/third-party/simulate">仿真平台</Link>
        </nav>
        <div className="top-nav-actions">
          <span className="top-nav-chip">统一门户</span>
          {loggedIn ? (
            <button className="auth-btn" onClick={onLogout} type="button">
              退出
            </button>
          ) : (
            <Link className="auth-btn" href="/login">
              登录
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
