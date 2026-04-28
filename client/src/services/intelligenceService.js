import { api } from './api';

export const intelligenceService = {
  getOverview: async () => {
    const { data } = await api.get('/intelligence/overview');
    return data.payload;
  },
  analyzeDocument: async (text) => {
    const { data } = await api.post('/intelligence/document-insights', { text });
    return data.analysis;
  },
  simulateInvestment: async (payload) => {
    const { data } = await api.post('/intelligence/simulate', payload);
    return data.result;
  },
};


