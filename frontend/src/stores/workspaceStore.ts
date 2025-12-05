import { create } from 'zustand';
import type {
  WorkspaceMode,
  PipelineStageConfig,
  Tool,
  SystemMetrics,
  WSMessage
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

interface WorkspaceState {
  // Current selections
  currentMode: WorkspaceMode;
  currentStage: string;
  selectedTool: Tool | null;

  // Data
  tools: Tool[];
  messages: WSMessage[];
  metrics: SystemMetrics | null;

  // UI State
  isToolPanelOpen: boolean;
  isConnected: boolean;
  isLoading: boolean;

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

  // Getters
  getPipelineStages: () => PipelineStageConfig[];
  getFilteredTools: () => Tool[];
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  // Initial state
  currentMode: 'storytelling',
  currentStage: 'ideate',
  selectedTool: null,
  tools: [],
  messages: [],
  metrics: null,
  isToolPanelOpen: false,
  isConnected: false,
  isLoading: false,

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
}));

export { PIPELINES };
