import axios from 'axios';

const configuredBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const fallbackBaseURLs = Array.from(
  new Set([
    configuredBaseURL,
    'http://127.0.0.1:4001/api',
    'http://localhost:4001/api',
    'http://127.0.0.1:4000/api',
    'http://localhost:4000/api',
  ])
);

export const api = axios.create({
  baseURL: configuredBaseURL,
});

const setApiBaseURL = (url) => {
  api.defaults.baseURL = url;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nexhood_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    const status = error?.response?.status;
    const canRetry =
      originalRequest &&
      !originalRequest.__retryWithFallback &&
      !String(originalRequest.url || '').includes('/health') &&
      (!error?.response || status === 404 || status === 502 || status === 503);

    if (!canRetry) {
      throw error;
    }

    const currentBase = api.defaults.baseURL;
    const candidates = fallbackBaseURLs.filter((url) => url !== currentBase);

    for (const candidate of candidates) {
      try {
        await axios.get(`${candidate}/health`, { timeout: 1800 });
        setApiBaseURL(candidate);
        originalRequest.__retryWithFallback = true;
        originalRequest.baseURL = candidate;
        return api.request(originalRequest);
      } catch {
        // keep trying remaining candidates
      }
    }

    throw error;
  }
);

export const extractErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || 'Something went wrong.';
