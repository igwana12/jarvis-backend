import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://web-production-16fdb.up.railway.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// CRITICAL: Interceptor to handle backend field naming discrepancies
api.interceptors.response.use(
  (response) => {
    if (response.data && response.data.generated_content && !response.data.content) {
      response.data.content = response.data.generated_content;
    }
    return response;
  },
  (error) => {
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

export const SystemAPI = {
  getStatus: () => api.get('/api/system/status'),
  getHealth: () => api.get('/api/health'),
};

export const ModelsAPI = {
  getRegistry: () => api.get('/api/models/registry'),
  validateKeys: () => api.get('/api/models/validate-keys'),
  switchModel: (modelId: string) => api.post('/api/models/switch', { model: modelId }),
};

export const ContentAPI = {
  generate: (prompt: string, tone?: string, model?: string) =>
    api.post('/api/content/generate', { prompt, tone, model }),
  saveDraft: (content: any) => api.post('/api/content/save', content),
};

export const MediaAPI = {
  createComic: (data: { title: string; style: string; panels: string[] }) =>
    api.post('/api/comic/create', data),
  getJobStatus: (jobId: string) => api.get(`/api/job/${jobId}/status`),
  convertPodcast: (data: { text: string; hosts: string }) =>
    api.post('/api/podcast/convert', data),
  generateVideo: (data: any) => api.post('/api/video/generate', data),
};

export const SettingsAPI = {
  saveKey: (keyName: string, keyValue: string) =>
    api.post('/api/settings/keys', { key_name: keyName, key_value: keyValue }),
};

export default api;
