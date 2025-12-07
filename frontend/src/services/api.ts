import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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

// ============================================================================
// Backward-compatible named exports for existing components
// ============================================================================

export const getSystemStatus = async () => {
  const response = await SystemAPI.getStatus();
  return response.data;
};

export const generateContent = async (prompt: string, persona?: string) => {
  const response = await ContentAPI.generate(prompt, persona);
  return response.data;
};

export const convertToPodcast = async (content: string) => {
  const response = await MediaAPI.convertPodcast({ text: content, hosts: 'default' });
  return response.data;
};

export const generateVideo = async (description: string, style?: string) => {
  const response = await MediaAPI.generateVideo({ description, style });
  return response.data;
};

export const createComic = async (description: string) => {
  const response = await MediaAPI.createComic({ title: 'Untitled', style: 'manga', panels: [description] });
  return response.data;
};

export const trackCost = async (category: string, amount: number) => {
  const response = await api.post('/api/costs/track', { category, amount });
  return response.data;
};

export const getCurrentCosts = async () => {
  const response = await api.get('/api/costs/current');
  return response.data;
};

export const getRecentVideos = async () => {
  const response = await api.get('/api/videos/recent');
  return response.data;
};

export const getDrafts = async () => {
  const response = await api.get('/api/content/drafts');
  return response.data;
};

export const getWorkflows = async () => {
  const response = await api.get('/api/workflows/list');
  return response.data;
};

export const executeWorkflow = async (workflowId: string) => {
  const response = await api.post('/api/workflows/execute', { workflow_id: workflowId });
  return response.data;
};

export default api;
