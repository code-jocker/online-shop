const API_URL = 'http://localhost:5000/api';

export const saveToken = (t) => localStorage.setItem('token', t);
export const getToken = () => localStorage.getItem('token');
export const clearAuth = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); };

export function decodeToken(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')));
  } catch { return null; }
}

export const saveUser = (u) => localStorage.setItem('user', JSON.stringify(u));
export const getUser = () => { const u = localStorage.getItem('user'); return u ? JSON.parse(u) : null; };
export const getUserType = () => { const u = getUser(); return u ? u.type : null; };

export async function login(email, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Invalid credentials');
  saveToken(data.token);
  const payload = decodeToken(data.token);
  saveUser({ email, username: email.split('@')[0], type: payload?.type || 'customer' });
  return getUserType();
}

export async function register(fields) {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fields),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registration failed');
  return data;
}
