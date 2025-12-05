import axios from 'axios';
import type {
  SystemStatus,
  SystemMetrics,
  AIModel,
  Workflow,
  Tool,
  VideoEntry,
  ContentDraft
} from '../types';

// Flask backend URL - Railway deployment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://web-production-16fdb.up.railway.app';

// Create axios instance with defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API Error]', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ============================================================================
// Health & System
// ============================================================================

export const checkHealth = async () => {
  const response = await api.get('/api/health');
  return response.data;
};

export const getSystemStatus = async (): Promise<SystemStatus> => {
  const response = await api.get('/api/system/status');
  return response.data;
};

export const getAntigravityStatus = async (): Promise<SystemMetrics & { antigravity_enabled: boolean }> => {
  const response = await api.get('/api/antigravity/status');
  return response.data;
};

export const getMetricsHistory = async () => {
  const response = await api.get('/api/metrics/history');
  return response.data;
};

// ============================================================================
// AI Models
// ============================================================================

export const getModels = async (): Promise<{ models: AIModel[]; count: number }> => {
  const response = await api.get('/api/models/list');
  return response.data;
};

export const switchModel = async (modelId: string) => {
  const response = await api.post('/api/models/switch', { model: modelId });
  return response.data;
};

// ============================================================================
// Workflows
// ============================================================================

export const getWorkflows = async (): Promise<{ workflows: Workflow[]; count: number }> => {
  const response = await api.get('/api/workflows/list');
  return response.data;
};

export const getWorkflow = async (workflowId: string): Promise<Workflow> => {
  const response = await api.get(`/api/workflows/${workflowId}`);
  return response.data;
};

export const executeWorkflow = async (workflowId: string) => {
  const response = await api.post('/api/workflows/execute', { workflow_id: workflowId });
  return response.data;
};

export const getActiveWorkflows = async () => {
  const response = await api.get('/api/workflows/active');
  return response.data;
};

// ============================================================================
// Skills
// ============================================================================

export const getSkills = async (): Promise<{ skills: Tool[]; count: number }> => {
  const response = await api.get('/api/skills/list');
  return response.data;
};

// ============================================================================
// Dashboards
// ============================================================================

export const getDashboards = async () => {
  const response = await api.get('/api/dashboards/list');
  return response.data;
};

// ============================================================================
// Video Generation
// ============================================================================

export const generateVideo = async (description: string, style?: string) => {
  const response = await api.post('/api/video/generate', { description, style });
  return response.data;
};

export const trackVideoGeneration = async (title: string, style: string, duration: number) => {
  const response = await api.post('/api/videos/track', { title, style, duration });
  return response.data;
};

export const getRecentVideos = async (): Promise<{ videos: VideoEntry[]; count: number }> => {
  const response = await api.get('/api/videos/recent');
  return response.data;
};

// ============================================================================
// Content Creation
// ============================================================================

export const generateContent = async (prompt: string, persona: string) => {
  const response = await api.post('/api/content/generate', { prompt, persona });
  return response.data;
};

export const saveDraft = async (content: string, persona: string) => {
  const response = await api.post('/api/content/save', { content, persona });
  return response.data;
};

export const getDrafts = async (): Promise<{ drafts: ContentDraft[]; count: number }> => {
  const response = await api.get('/api/content/drafts');
  return response.data;
};

// ============================================================================
// Creative Tools
// ============================================================================

export const applyMythicStructure = async (content: string) => {
  const response = await api.post('/api/tools/mythic', { content });
  return response.data;
};

export const condenseText = async (content: string) => {
  const response = await api.post('/api/tools/condense', { content });
  return response.data;
};

export const convertToPodcast = async (content: string) => {
  const response = await api.post('/api/podcast/convert', { content });
  return response.data;
};

export const createVideoEssay = async (content: string) => {
  const response = await api.post('/api/video/essay', { content });
  return response.data;
};

// ============================================================================
// Costs
// ============================================================================

export const getCurrentCosts = async () => {
  const response = await api.get('/api/costs/current');
  return response.data;
};

export const trackCost = async (category: string, amount: number) => {
  const response = await api.post('/api/costs/track', { category, amount });
  return response.data;
};

// ============================================================================
// Comics
// ============================================================================

export const createComic = async (description: string) => {
  const response = await api.post('/api/comic/create', { description });
  return response.data;
};

// New Models API
export const getModelsWithStatus = async () => {
  const response = await api.get('/api/models');
  return response.data;
};

// Settings - API Keys
export const getAPIKeysStatus = async () => {
  const response = await api.get('/api/settings/api-keys');
  return response.data;
};

// Settings - Integrations
export const getIntegrationsStatus = async () => {
  const response = await api.get('/api/settings/integrations');
  return response.data;
};

export const toggleIntegration = async (integrationName: string) => {
  const response = await api.post(`/api/settings/integrations/${integrationName}/toggle`);
  return response.data;
};

// Export the api instance for custom requests
export default api;
