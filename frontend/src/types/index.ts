// Workspace Modes
export type WorkspaceMode =
  | 'storytelling'
  | 'filmmaking'
  | 'podcast'
  | 'soundscape'
  | 'audiobook'
  | 'multi';

export interface WorkspaceModeConfig {
  id: WorkspaceMode;
  name: string;
  icon: string;
  description: string;
  color: string;
}

// Pipeline Stages
export type PipelineStage = string;

export interface PipelineStageConfig {
  id: string;
  name: string;
  icon: string;
  order: number;
}

export type WorkspacePipelines = {
  [key in WorkspaceMode]: PipelineStageConfig[];
};

// Tools
export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  modes: WorkspaceMode[];
  stages: string[];
}

// System Status
export interface SystemMetrics {
  cpu_load: number;
  memory_used_gb: number;
  memory_percent: number;
  disk_used_gb: number;
  disk_percent: number;
  optimization_level: number;
  active_processes: number;
}

export interface ServiceStatus {
  port: number;
  status: 'running' | 'offline' | 'error' | 'unknown';
}

export interface SystemStatus {
  metrics: SystemMetrics;
  services: Record<string, ServiceStatus>;
  antigravity: {
    antigravity_enabled: boolean;
    weightless_mode: boolean;
    optimization_level: string;
    gravity_level: number;
    performance_boost: number;
  };
  timestamp: string;
}

// AI Models
export type ModelCategory = 'text' | 'image' | 'voice' | 'video' | 'audio';

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  icon: string;
  contextWindow: string;
  type: string;
  category: ModelCategory;
  apiKeyEnv?: string;
  isAvailable: boolean;
}

// Integration/Service
export interface Integration {
  id: string;
  name: string;
  provider: string;
  category: ModelCategory;
  icon: string;
  apiKeyEnv: string;
  isConfigured: boolean;
  description: string;
}

// Navigation
export type PageRoute = 'dashboard' | 'workflows' | 'models' | 'settings' | 'home';

// Stage Model Override
export interface StageModelConfig {
  stageId: string;
  modelId: string | null; // null means use global default
}

// Workflows
export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: number;
  created: string;
}

// Video Generation
export interface VideoEntry {
  title: string;
  duration: string;
  style: string;
  timestamp: string;
  cost: number;
}

// Content Drafts
export interface ContentDraft {
  id: number;
  content: string;
  persona: string;
  timestamp: string;
  word_count: number;
}

// API Responses
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: 'success' | 'error';
}

// WebSocket Message
export interface WSMessage {
  id: string;
  timestamp: string;
  source: string;
  message: string;
  level: 'info' | 'success' | 'warning' | 'error';
  metrics?: SystemMetrics;
}
