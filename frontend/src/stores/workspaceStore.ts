import { create } from 'zustand';
import type {
  WorkspaceMode,
  PipelineStageConfig,
  Tool,
  SystemMetrics,
  WSMessage,
  AIModel,
  PageRoute,
  StageModelConfig
} from '../types';

// Pipeline configurations for each workspace mode
const PIPELINES: Record<WorkspaceMode, PipelineStageConfig[]> = {
  storytelling: [
    { id: 'ideate', name: 'Ideate', icon: '💡', order: 1 },
    { id: 'outline', name: 'Outline', icon: '📋', order: 2 },
    { id: 'draft', name: 'Draft', icon: '✏️', order: 3 },
    { id: 'edit', name: 'Edit', icon: '🔧', order: 4 },
    { id: 'publish', name: 'Publish', icon: '🚀', order: 5 },
  ],
  filmmaking: [
    { id: 'concept', name: 'Concept', icon: '🎬', order: 1 },
    { id: 'script', name: 'Script', icon: '📝', order: 2 },
    { id: 'preprod', name: 'Pre-Prod', icon: '📐', order: 3 },
    { id: 'production', name: 'Production', icon: '🎥', order: 4 },
    { id: 'post', name: 'Post', icon: '🎞️', order: 5 },
  ],
  podcast: [
    { id: 'topic', name: 'Topic', icon: '🎯', order: 1 },
    { id: 'script', name: 'Script', icon: '📝', order: 2 },
    { id: 'record', name: 'Record', icon: '🎙️', order: 3 },
    { id: 'edit', name: 'Edit', icon: '🔧', order: 4 },
    { id: 'publish', name: 'Publish', icon: '📡', order: 5 },
  ],
  soundscape: [
    { id: 'concept', name: 'Concept', icon: '🎨', order: 1 },
    { id: 'compose', name: 'Compose', icon: '🎵', order: 2 },
    { id: 'layer', name: 'Layer', icon: '📚', order: 3 },
    { id: 'mix', name: 'Mix', icon: '🎚️', order: 4 },
    { id: 'master', name: 'Master', icon: '💎', order: 5 },
  ],
  audiobook: [
    { id: 'select', name: 'Select', icon: '📖', order: 1 },
    { id: 'prepare', name: 'Prepare', icon: '📋', order: 2 },
    { id: 'record', name: 'Record', icon: '🎙️', order: 3 },
    { id: 'edit', name: 'Edit', icon: '🔧', order: 4 },
    { id: 'publish', name: 'Publish', icon: '📚', order: 5 },
  ],
  multi: [
    { id: 'plan', name: 'Plan', icon: '📊', order: 1 },
    { id: 'create', name: 'Create', icon: '🎨', order: 2 },
    { id: 'integrate', name: 'Integrate', icon: '🔗', order: 3 },
    { id: 'review', name: 'Review', icon: '👁️', order: 4 },
    { id: 'deploy', name: 'Deploy', icon: '🚀', order: 5 },
  ],
};

// Default available models
const DEFAULT_MODELS: AIModel[] = [
  { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', icon: '♊', contextWindow: '1M', type: 'text', category: 'text', apiKeyEnv: 'GOOGLE_AI_STUDIO_API_KEY', isAvailable: true },
  { id: 'claude-sonnet', name: 'Claude Sonnet', provider: 'Anthropic', icon: '🎭', contextWindow: '200k', type: 'text', category: 'text', apiKeyEnv: 'ANTHROPIC_API_KEY', isAvailable: true },
  { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', icon: '🤖', contextWindow: '128k', type: 'text', category: 'text', apiKeyEnv: 'OPENAI_API_KEY', isAvailable: true },
  { id: 'grok-2', name: 'Grok 2', provider: 'xAI', icon: '🚀', contextWindow: '128k', type: 'text', category: 'text', apiKeyEnv: 'XAI_API_KEY', isAvailable: false },
  { id: 'mistral-large', name: 'Mistral Large', provider: 'Mistral', icon: '🇫🇷', contextWindow: '256k', type: 'text', category: 'text', apiKeyEnv: 'MISTRAL_API_KEY', isAvailable: false },
  { id: 'dall-e-3', name: 'DALL-E 3', provider: 'OpenAI', icon: '🎨', contextWindow: 'N/A', type: 'image', category: 'image', apiKeyEnv: 'OPENAI_API_KEY', isAvailable: true },
  { id: 'midjourney', name: 'Midjourney', provider: 'Midjourney', icon: '🖼️', contextWindow: 'N/A', type: 'image', category: 'image', apiKeyEnv: 'MIDJOURNEY_API_KEY', isAvailable: false },
  { id: 'leonardo', name: 'Leonardo AI', provider: 'Leonardo', icon: '🎭', contextWindow: 'N/A', type: 'image', category: 'image', apiKeyEnv: 'LEONARDO_API_KEY', isAvailable: false },
  { id: 'stable-diffusion', name: 'Stable Diffusion', provider: 'Stability AI', icon: '🌀', contextWindow: 'N/A', type: 'image', category: 'image', apiKeyEnv: 'STABILITY_API_KEY', isAvailable: false },
  { id: 'elevenlabs', name: 'ElevenLabs', provider: 'ElevenLabs', icon: '🔊', contextWindow: 'N/A', type: 'voice', category: 'voice', apiKeyEnv: 'ELEVENLABS_API_KEY', isAvailable: false },
  { id: 'whisper', name: 'Whisper', provider: 'OpenAI', icon: '👂', contextWindow: 'N/A', type: 'speech-to-text', category: 'voice', apiKeyEnv: 'OPENAI_API_KEY', isAvailable: true },
];

interface WorkspaceState {
  // Navigation
  currentPage: PageRoute;

  // Current selections
  currentMode: WorkspaceMode;
  currentStage: string;
  selectedTool: Tool | null;

  // Model selection
  globalModel: string;
  stageModels: StageModelConfig[];
  availableModels: AIModel[];

  // Data
  tools: Tool[];
  messages: WSMessage[];
  metrics: SystemMetrics | null;

  // UI State
  isToolPanelOpen: boolean;
  isConnected: boolean;
  isLoading: boolean;

  // Navigation actions
  setPage: (page: PageRoute) => void;

  // Actions
  setMode: (mode: WorkspaceMode) => void;
  setStage: (stage: string) => void;
  selectTool: (tool: Tool | null) => void;
  setTools: (tools: Tool[]) => void;
  addMessage: (message: WSMessage) => void;
  clearMessages: () => void;
  setMetrics: (metrics: SystemMetrics) => void;
  setConnected: (connected: boolean) => void;
  setLoading: (loading: boolean) => void;
  toggleToolPanel: () => void;

  // Model actions
  setGlobalModel: (modelId: string) => void;
  setStageModel: (stageId: string, modelId: string | null) => void;
  setAvailableModels: (models: AIModel[]) => void;

  // Getters
  getPipelineStages: () => PipelineStageConfig[];
  getFilteredTools: () => Tool[];
  getModelForStage: (stageId: string) => AIModel | null;
  getModelsByCategory: (category: string) => AIModel[];
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  // Initial state
  currentPage: 'home',
  currentMode: 'storytelling',
  currentStage: 'ideate',
  selectedTool: null,
  globalModel: 'gemini-pro',
  stageModels: [],
  availableModels: DEFAULT_MODELS,
  tools: [],
  messages: [],
  metrics: null,
  isToolPanelOpen: false,
  isConnected: false,
  isLoading: false,

  // Navigation
  setPage: (page) => set({ currentPage: page }),

  // Actions
  setMode: (mode) => {
    const stages = PIPELINES[mode];
    set({
      currentMode: mode,
      currentStage: stages[0]?.id || '',
      selectedTool: null,
    });
  },

  setStage: (stage) => set({ currentStage: stage }),

  selectTool: (tool) => set({
    selectedTool: tool,
    isToolPanelOpen: tool !== null
  }),

  setTools: (tools) => set({ tools }),

  addMessage: (message) => set((state) => ({
    messages: [...state.messages.slice(-99), message]
  })),

  clearMessages: () => set({ messages: [] }),

  setMetrics: (metrics) => set({ metrics }),

  setConnected: (connected) => set({ isConnected: connected }),

  setLoading: (loading) => set({ isLoading: loading }),

  toggleToolPanel: () => set((state) => ({
    isToolPanelOpen: !state.isToolPanelOpen
  })),

  // Model actions
  setGlobalModel: (modelId) => set({ globalModel: modelId }),

  setStageModel: (stageId, modelId) => set((state) => {
    const existing = state.stageModels.filter(sm => sm.stageId !== stageId);
    if (modelId === null) {
      return { stageModels: existing };
    }
    return { stageModels: [...existing, { stageId, modelId }] };
  }),

  setAvailableModels: (models) => set({ availableModels: models }),

  // Getters
  getPipelineStages: () => {
    const { currentMode } = get();
    return PIPELINES[currentMode] || [];
  },

  getFilteredTools: () => {
    const { tools, currentMode, currentStage } = get();
    return tools.filter(tool =>
      tool.modes.includes(currentMode) &&
      tool.stages.includes(currentStage)
    );
  },

  getModelForStage: (stageId) => {
    const { stageModels, globalModel, availableModels } = get();
    const stageConfig = stageModels.find(sm => sm.stageId === stageId);
    const modelId = stageConfig?.modelId || globalModel;
    return availableModels.find(m => m.id === modelId) || null;
  },

  getModelsByCategory: (category) => {
    const { availableModels } = get();
    return availableModels.filter(m => m.category === category);
  },
}));

export { PIPELINES, DEFAULT_MODELS };
