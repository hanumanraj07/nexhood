import { api } from './api';

export const neighborhoodService = {
  list: async () => {
    const { data } = await api.get('/neighborhoods');
    return data.neighborhoods;
  },
  getDetails: async (id) => {
    const { data } = await api.get(`/neighborhoods/${id}`);
    return data.neighborhood;
  },
  compare: async (localityIds) => {
    const { data } = await api.post('/neighborhoods/compare', { localityIds });
    return data.neighborhoods;
  },
  exploreLocation: async ({ query, lat, lng, radiusMeters = 3000 }) => {
    const params = { radiusMeters };

    if (query) params.query = query;
    if (Number.isFinite(lat)) params.lat = lat;
    if (Number.isFinite(lng)) params.lng = lng;

    const { data } = await api.get('/neighborhoods/explore', { params });
    return data;
  },
  suggestLocations: async (query) => {
    const value = String(query || '').trim();
    if (value.length < 2) return [];
    const { data } = await api.get('/neighborhoods/suggest', {
      params: { query: value },
    });
    return data.suggestions || [];
  },
};


