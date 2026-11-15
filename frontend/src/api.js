const BASE = process.env.REACT_APP_API_URL || '';

function getToken() { return localStorage.getItem('token'); }

async function request(path, opts = {}) {
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  const t = getToken();
  if (t) headers.Authorization = `Bearer ${t}`;
  const res = await fetch(`${BASE}${path}`, { ...opts, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const api = {
  login: (email, password) => request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  getPlayers: () => request('/api/players'),
  addPlayer: (data) => request('/api/players', { method: 'POST', body: JSON.stringify(data) }),
  updatePlayer: (id, data) => request(`/api/players/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePlayer: (id) => request(`/api/players/${id}`, { method: 'DELETE' })
};