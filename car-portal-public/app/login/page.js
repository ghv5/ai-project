'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { login, request } from '../../lib/api';

export default function LoginPage() {
  const [captcha, setCaptcha] = useState({ uuid: '', enabled: false, img: '' });
  const [form, setForm] = useState({ username: '', password: '', code: '' });
  const [error, setError] = useState('');

  async function loadCaptcha() {
    const data = await request('/auth/code', { auth: false });
    setCaptcha({
      uuid: data.uuid || '',
      enabled: data.captchaEnabled === true,
      img: data.img || ''
    });
  }

  useEffect(() => {
    loadCaptcha().catch(e => setError(e.message));
  }, []);

  async function onSubmit(event) {
    event.preventDefault();
    setError('');
    try {
      await login(form.username.trim(), form.password, form.code.trim(), captcha.uuid);
      window.location.href = '/';
    } catch (e) {
      setError(e.message);
      loadCaptcha().catch(() => {});
    }
  }

  return (
    <main className="login-page">
      <div className="login-bg" />
      <Link className="login-home-link" href="/">
        返回门户首页
      </Link>
      <section className="login-shell">
        <aside className="login-brand-panel">
          <p className="login-brand-kicker">AUTOMOTIVE DATA PORTAL</p>
          <h1>统一身份认证</h1>
          <p>面向汽车数据门户、案例库与工具平台的统一登录入口，保障跨平台访问体验一致。</p>
        </aside>
        <div className="login-card">
          <div className="login-tabs">
            <span className="active">账号登录</span>
            <span>手机号登录</span>
          </div>
          <form id="loginForm" onSubmit={onSubmit}>
            <input
              id="username"
              placeholder="请输入账号"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
            />
            <input
              id="password"
              type="password"
              placeholder="请输入密码"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
            <div className="captcha-row">
              <input
                id="code"
                placeholder="请输入验证码"
                value={form.code}
                onChange={e => setForm({ ...form, code: e.target.value })}
              />
              <button className="captcha-btn" id="captchaBtn" onClick={loadCaptcha} type="button">
                {captcha.enabled && captcha.img ? (
                  <img alt="captcha" src={`data:image/gif;base64,${captcha.img}`} />
                ) : (
                  '无验证码'
                )}
              </button>
            </div>
            {error ? <p id="loginMessage" className="error-text">{error}</p> : null}
            <button className="submit-btn" type="submit">
              登 录
            </button>
            <p className="register-tip">
              还没有账号? <Link href="#">立即注册</Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
