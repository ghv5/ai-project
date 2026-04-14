(function () {
  const API_BASE_URL = window.localStorage.getItem('portal-api-base-url') || 'http://localhost:8080';
  const CLIENT_ID = 'e5cd7e4891bf95d1d19206ce24a7b32e';
  const DEFAULT_TENANT_ID = '000000';
  const HEADER_FLAG = 'encrypt-key';
  const RSA_PUBLIC_KEY = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKoR8mX0rGKLqzcWmOzbfj64K8ZIgOdHnzkXSOVOZbFu/TJhZ7rFAN+eaGkl3C4buccQd/EjEsj9ir7ijT7h96MCAwEAAQ==';

  function getToken() {
    return window.localStorage.getItem('portal-token');
  }

  function setToken(token) {
    window.localStorage.setItem('portal-token', token);
  }

  function clearToken() {
    window.localStorage.removeItem('portal-token');
  }

  function getAuthorization() {
    const token = getToken();
    return token ? `Bearer ${token}` : '';
  }

  function generateAesKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i += 1) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return window.CryptoJS.enc.Utf8.parse(result);
  }

  function encryptPayload(data) {
    const aesKey = generateAesKey();
    const encryptor = new window.JSEncrypt();
    encryptor.setPublicKey(RSA_PUBLIC_KEY);
    const headerValue = encryptor.encrypt(window.CryptoJS.enc.Base64.stringify(aesKey));
    const body = window.CryptoJS.AES.encrypt(JSON.stringify(data), aesKey, {
      mode: window.CryptoJS.mode.ECB,
      padding: window.CryptoJS.pad.Pkcs7
    }).toString();
    return { body, headerValue };
  }

  function decryptResponse(text, encryptKey) {
    if (encryptKey) {
      throw new Error('浏览器静态门户不支持解密加密响应');
    }
    return JSON.parse(text);
  }

  async function request(path, options) {
    const opts = options || {};
    const headers = new Headers(opts.headers || {});
    headers.set('Content-Language', 'zh_CN');
    headers.set('Clientid', CLIENT_ID);
    if (opts.auth !== false && getToken()) {
      headers.set('Authorization', getAuthorization());
    }

    let body = opts.body;
    if (opts.encrypt === true && body) {
      const payload = encryptPayload(body);
      headers.set(HEADER_FLAG, payload.headerValue);
      body = payload.body;
    } else if (body && typeof body !== 'string') {
      headers.set('Content-Type', 'application/json');
      body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: opts.method || 'GET',
      headers,
      body
    });

    const encryptKey = response.headers.get(HEADER_FLAG);
    const text = await response.text();
    const result = decryptResponse(text, encryptKey);
    if (String(result.code) !== '200') {
      throw new Error(result.msg || '请求失败');
    }
    return result.data;
  }

  function renderAuthAction() {
    const authAction = document.getElementById('authAction');
    if (!authAction) return;
    if (getToken()) {
      authAction.textContent = '退出';
      authAction.href = '#';
      authAction.onclick = async event => {
        event.preventDefault();
        try {
          await request('/portal/sso/logout', { method: 'POST' });
        } catch {}
        try {
          await request('/auth/logout', { method: 'POST' });
        } catch {}
        clearToken();
        window.location.href = './index.html';
      };
    }
  }

  async function initHomePage() {
    const [homeData, caseData] = await Promise.all([
      request('/portal/home', { auth: false }),
      request('/portal/cases', { auth: false })
    ]);

    document.getElementById('heroTitle').textContent = homeData.heroTitle || '汽车门户平台';
    document.getElementById('heroSubtitle').textContent = homeData.heroSubtitle || '';

    const statsWrap = document.getElementById('statsWrap');
    statsWrap.innerHTML = (homeData.stats || [])
      .map(
        stat => `
          <article class="stat-card">
            <div class="stat-icon"></div>
            <div class="stat-meta"><div class="stat-label">${stat.label}</div></div>
            <div class="stat-value">${stat.value}</div>
          </article>
        `
      )
      .join('');

    const flowSteps = document.getElementById('flowSteps');
    flowSteps.innerHTML = (homeData.flowSteps || [])
      .map(
        (step, index) => `
          <div class="flow-step">
            <span>${index + 1}</span>
            <em>${step}</em>
          </div>
        `
      )
      .join('');

    const services = homeData.services || [];
    const currentService = services[0] || { title: '数据合规服务', description: '', partnerNames: [] };
    document.getElementById('serviceTitle').textContent = currentService.title || '';
    document.getElementById('serviceDescription').textContent = currentService.description || '';
    document.getElementById('serviceTabs').innerHTML = services
      .map(
        (service, index) => `
          <button class="${index === 0 ? 'active' : ''}" type="button">${service.category || service.title}</button>
        `
      )
      .join('');
    document.getElementById('partnerList').innerHTML = (currentService.partnerNames || [])
      .map(name => `<div class="partner-item">${name}</div>`)
      .join('');

    const news = homeData.news || [];
    const highlight = news.find(item => item.highlight) || news[0];
    document.getElementById('highlightNews').innerHTML = highlight
      ? `<h3>${highlight.title}</h3><p>${highlight.summary || ''}</p>`
      : '<h3>暂无资讯</h3>';
    document.getElementById('newsList').innerHTML = news
      .filter(item => !highlight || item.id !== highlight.id)
      .map(item => `<article>${item.title}</article>`)
      .join('');

    document.getElementById('caseGrid').innerHTML = (caseData || [])
      .map(
        item => `
          <article class="case-card">
            <div class="case-cover"></div>
            <h3>${item.title}</h3>
            <p>${item.description || ''}</p>
          </article>
        `
      )
      .join('');
  }

  async function initLoginPage() {
    const loginMessage = document.getElementById('loginMessage');
    const captchaBtn = document.getElementById('captchaBtn');
    let captchaState = { uuid: '', enabled: false };

    async function loadCaptcha() {
      const data = await request('/auth/code', { auth: false });
      captchaState = { uuid: data.uuid || '', enabled: data.captchaEnabled === true };
      if (captchaState.enabled && data.img) {
        captchaBtn.innerHTML = `<img src="data:image/gif;base64,${data.img}" alt="captcha" />`;
      } else {
        captchaBtn.textContent = '无验证码';
      }
    }

    captchaBtn.addEventListener('click', loadCaptcha);

    document.getElementById('loginForm').addEventListener('submit', async event => {
      event.preventDefault();
      loginMessage.textContent = '';
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;
      const code = document.getElementById('code').value.trim();
      try {
        const data = await request('/auth/login', {
          method: 'POST',
          auth: false,
          encrypt: true,
          body: {
            clientId: CLIENT_ID,
            grantType: 'password',
            tenantId: DEFAULT_TENANT_ID,
            username,
            password,
            code,
            uuid: captchaState.uuid
          }
        });
        setToken(data.accessToken || data.access_token || '');
        window.location.href = './index.html';
      } catch (error) {
        loginMessage.textContent = error.message;
        await loadCaptcha();
      }
    });

    await loadCaptcha();
  }

  async function initThirdPartyPage() {
    const statusEl = document.getElementById('thirdPartyStatus');
    const frameEl = document.getElementById('thirdPartyFrame');
    const params = new URLSearchParams(window.location.search);
    const platform = params.get('platform') || 'annotate';

    document.getElementById('thirdPartyTitle').textContent = platform === 'annotate' ? '标注平台' : '仿真平台';

    if (!getToken()) {
      window.location.href = './login.html';
      return;
    }

    try {
      const data = await request('/portal/sso/ticket', {
        method: 'POST',
        body: { platform }
      });
      frameEl.src = data.entryUrl;
      statusEl.textContent = '统一登录已建立，正在加载平台...';
    } catch (error) {
      statusEl.textContent = error.message;
    }
  }

  async function bootstrap() {
    renderAuthAction();
    const page = document.body.dataset.page;
    try {
      if (page === 'home') {
        await initHomePage();
      } else if (page === 'login') {
        await initLoginPage();
      } else if (page === 'third-party') {
        await initThirdPartyPage();
      }
    } catch (error) {
      console.error(error);
    }
  }

  bootstrap();
})();
