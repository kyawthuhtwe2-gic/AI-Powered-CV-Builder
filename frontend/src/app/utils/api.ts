export const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || '';

type Json = Record<string, any>;

function getTokenFromStorage() {
  return (
    localStorage.getItem('token') ||
    ''
  );
}

export function setAuthToken(token: string | null) {
  if (token) localStorage.setItem('token', token);
  else localStorage.removeItem('token');
}

async function request(path: string, opts: RequestInit = {}) {
  const url = API_BASE ? `${API_BASE.replace(/\/$/, '')}/${path.replace(/^\//, '')}` : path;

  const token = getTokenFromStorage();

  const baseHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) baseHeaders['Authorization'] = `Bearer ${token}`;

  const mergedHeaders = { ...(opts.headers as Record<string, string> || {}), ...baseHeaders };

  const res = await fetch(url, {
    ...opts,
    headers: mergedHeaders,
    credentials: (opts.credentials as RequestCredentials) || 'include',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed ${res.status}: ${text}`);
  }
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return res.text();
}

export async function getMe() {
  return request('api/me', { method: 'GET' });
}

export async function getCVs() {
  return request('api/cvs', { method: 'GET' });
}

export async function getCV(id: string) {
  return request(`api/cvs/${id}`, { method: 'GET' });
}

export async function createCV(data: Json) {
  return request('api/cvs', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateCV(id: string, data: Json) {
  return request(`api/cvs/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteCV(id: string) {
  return request(`api/cvs/${id}`, { method: 'DELETE' });
}

export async function assistAI(payload: { cvData: Json; apiKey?: string; instruction?: string }) {
  return request('api/ai/assist', { method: 'POST', body: JSON.stringify(payload) });
}

// AI config (backend /api/ais) helpers
export async function getAIs() {
  return request('api/ais', { method: 'GET' });
}

export async function getAI(id: number) {
  return request(`api/ais/${id}`, { method: 'GET' });
}

export async function createAI(data: Json) {
  return request('api/ais', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateAI(id: number, data: Json) {
  return request(`api/ais/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteAI(id: number) {
  return request(`api/ais/${id}`, { method: 'DELETE' });
}

export async function getSharedCV(id: string) {
  const path = `cv/share/${id}`;
  const url = API_BASE ? `${API_BASE.replace(/\/$/, '')}/${path}` : path;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    credentials: 'include',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const msg = text || res.statusText || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return res.json();
}
