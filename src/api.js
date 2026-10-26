const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3333';

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new Error('Não foi possível conectar ao servidor. O backend está rodando?');
  }

  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Erro inesperado.');
  return data;
}

export const api = {
  list: (search = '') => request(`/api/tasks?search=${encodeURIComponent(search)}`),
  create: (title, dueDate) =>
    request('/api/tasks', { method: 'POST', body: JSON.stringify({ title, dueDate: dueDate || null }) }),
  update: (id, body) => request(`/api/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  remove: (id) => request(`/api/tasks/${id}`, { method: 'DELETE' }),
};
