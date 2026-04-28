import { api } from './api';

export const adminService = {
  getResidents: async () => {
    const { data } = await api.get('/admin/residents');
    return data;
  },
  getOverview: async () => {
    const { data } = await api.get('/admin/overview');
    return data.stats;
  },
};


