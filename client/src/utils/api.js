const API_BASE = import.meta.env.VITE_API_URL || '';

const api = {
  get(url, options = {}) {
    return fetch(`${API_BASE}${url}`, { ...options });
  },
  post(url, body, token) {
    return fetch(`${API_BASE}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(body)
    });
  },
  put(url, body, token) {
    return fetch(`${API_BASE}${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(body)
    });
  },
  delete(url, token) {
    return fetch(`${API_BASE}${url}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};

export default api;
