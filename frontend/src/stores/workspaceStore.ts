import { create } from 'zustand';
import { ModelsAPI } from '../services/api';

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  icon: string;
  context_window: number;
  category: string;
  api_key_configured?: boolean;
}

interface WorkspaceState {
  globalModel: string | null;
  availableModels: AIModel[];
  validationStatus: Record<string, boolean>;
  isLoading: boolean;
  fetchRegistry: () => Promise<void>;
  fetchValidation: () => Promise<void>;
  setGlobalModel: (modelId: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  globalModel: null,
  availableModels: [],
  validationStatus: {},
  isLoading: false,

  fetchRegistry: async () => {
    set({ isLoading: true });
    try {
      const response = await ModelsAPI.getRegistry();
      const models = response.data.models || response.data;
      set({
        availableModels: models,
        globalModel: get().globalModel || models[0]?.id || null,
        isLoading: false,
      });
    } catch (err) {
      console.error('Failed to fetch model registry:', err);
      set({ isLoading: false });
    }
  },

  fetchValidation: async () => {
    try {
      const response = await ModelsAPI.validateKeys();
      set({ validationStatus: response.data.validation });
    } catch (err) {
      console.error('Failed to fetch validation status:', err);
    }
  },

  setGlobalModel: (modelId) => {
    set({ globalModel: modelId });
    ModelsAPI.switchModel(modelId).catch(console.error);
  },
}));
