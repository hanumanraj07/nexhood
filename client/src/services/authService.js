import { api } from './api';

export const authService = {
  register: async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    return data;
  },
  login: async (payload) => {
    const { data } = await api.post('/auth/login', payload);
    return data;
  },
  loginWithGoogle: async (credential) => {
    const { data } = await api.post('/auth/google', { credential });
    return data;
  },
  me: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },
  updateLocation: async (payload) => {
    const { data } = await api.put('/auth/location', payload);
    return data;
  },
};


