import { api } from './api';

export const parkingService = {
  getSlots: async () => {
    const { data } = await api.get('/parking/slots');
    return data;
  },
  getPasses: async () => {
    const { data } = await api.get('/parking/passes');
    return data.passes;
  },
  createPass: async (payload) => {
    const { data } = await api.post('/parking/passes', payload);
    return data.pass;
  },
  verifyPass: async (payload) => {
    const { data } = await api.post('/parking/verify', payload);
    return data;
  },
  markExit: async (id) => {
    const { data } = await api.patch(`/parking/passes/${id}/exit`);
    return data.pass;
  },
};


