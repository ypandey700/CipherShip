// api.js

const handleUnauthorized = () => {
  // Clear token and redirect to login page
  localStorage.removeItem('token');
  window.location.href = '/login';
};

const checkResponse = async (res) => {
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    if (res.status === 401) {
      handleUnauthorized();
      throw new Error('Unauthorized. Redirecting to login...');
    }
    throw new Error(errData.message || 'Request failed');
  }
  return res.json();
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const api = {
  post: async (url, data, includeAuth = true) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(includeAuth ? getAuthHeaders() : {}),
    };

    const res = await fetch(`/api${url}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    return checkResponse(res);
  },

  get: async (url, includeAuth = true) => {
    const headers = includeAuth ? getAuthHeaders() : {};

    const res = await fetch(`/api${url}`, { headers });

    return checkResponse(res);
  },

  put: async (url, data, includeAuth = true) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(includeAuth ? getAuthHeaders() : {}),
    };

    const res = await fetch(`/api${url}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    return checkResponse(res);
  },

  delete: async (url, includeAuth = true) => {
    const headers = includeAuth ? getAuthHeaders() : {};

    const res = await fetch(`/api${url}`, {
      method: 'DELETE',
      headers,
    });

    return checkResponse(res);
  },
};

export default api;
