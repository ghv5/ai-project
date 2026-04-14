import CryptoJS from 'crypto-js';
import { JSEncrypt } from 'jsencrypt';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
const CLIENT_ID = 'e5cd7e4891bf95d1d19206ce24a7b32e';
const DEFAULT_TENANT_ID = '000000';
const HEADER_FLAG = 'encrypt-key';
const RSA_PUBLIC_KEY =
  'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKoR8mX0rGKLqzcWmOzbfj64K8ZIgOdHnzkXSOVOZbFu/TJhZ7rFAN+eaGkl3C4buccQd/EjEsj9ir7ijT7h96MCAwEAAQ==';

function generateAesKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i += 1) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return CryptoJS.enc.Utf8.parse(result);
}

function encryptPayload(data) {
  const aesKey = generateAesKey();
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(RSA_PUBLIC_KEY);
  const headerValue = encryptor.encrypt(CryptoJS.enc.Base64.stringify(aesKey));
  const body = CryptoJS.AES.encrypt(JSON.stringify(data), aesKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString();
  return { body, headerValue };
}

function decryptResponse(text, encryptKey) {
  if (!text) return {};
  if (encryptKey) {
    throw new Error('Encrypted portal responses are not supported in the browser client');
  }
  return JSON.parse(text);
}

export function getToken() {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem('portal-token') || '';
}

export function setToken(token) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('portal-token', token);
}

export function clearToken() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem('portal-token');
}

export async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Language', 'zh_CN');
  headers.set('Clientid', CLIENT_ID);

  const token = getToken();
  if (options.auth !== false && token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let body = options.body;
  if (options.encrypt === true && body) {
    const payload = encryptPayload(body);
    headers.set(HEADER_FLAG, payload.headerValue);
    body = payload.body;
  } else if (body && typeof body !== 'string') {
    headers.set('Content-Type', 'application/json');
    body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || 'GET',
    headers,
    body
  });

  const encryptKey = response.headers.get(HEADER_FLAG);
  const text = await response.text();
  const result = decryptResponse(text, encryptKey);
  if (String(result.code) !== '200') {
    throw new Error(result.msg || 'Request failed');
  }
  return result.data;
}

export async function fetchHomeContent() {
  return request('/portal/home', { auth: false });
}

export async function listPortalCases(keyword) {
  const query = keyword ? `?keyword=${encodeURIComponent(keyword)}` : '';
  return request(`/portal/cases${query}`, { auth: false });
}

export async function fetchCaseDetail(caseId) {
  return request(`/portal/cases/${caseId}`, { auth: false });
}

export async function createSsoTicket(platform) {
  return request('/portal/sso/ticket', {
    method: 'POST',
    body: { platform }
  });
}

export async function login(username, password, code, uuid) {
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
      uuid
    }
  });
  const token = data.accessToken || data.access_token || '';
  setToken(token);
  return token;
}

export async function logoutAll() {
  try {
    await request('/portal/sso/logout', { method: 'POST' });
  } catch (_e) {}
  try {
    await request('/auth/logout', { method: 'POST' });
  } catch (_e) {}
  clearToken();
}
