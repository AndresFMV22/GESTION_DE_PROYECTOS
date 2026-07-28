import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000/api';
// En producción: 'https://tu-backend-deployed.railway.app/api'

async function getHeaders() {
  const token = await AsyncStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request(method, path, body = null) {
  const headers = await getHeaders();
  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  const response = await fetch(`${API_URL}${path}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error en la petición');
  }

  return data;
}

export const api = {
  auth: {
    register: (data) => request('POST', '/auth/register', data),
    login: (data) => request('POST', '/auth/login', data),
    getProfile: () => request('GET', '/auth/profile'),
  },
  modules: {
    getAll: () => request('GET', '/modules'),
    toggle: (moduleId) => request('POST', `/modules/${moduleId}/toggle`),
    getCategories: (moduleId) => request('GET', `/modules/${moduleId}/categories`),
  },
  reminders: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request('GET', `/reminders${query ? '?' + query : ''}`);
    },
    getUpcoming: () => request('GET', '/reminders/upcoming'),
    create: (data) => request('POST', '/reminders', data),
    update: (id, data) => request('PUT', `/reminders/${id}`, data),
    delete: (id) => request('DELETE', `/reminders/${id}`),
  },
};
