import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check, Sparkles } from 'lucide-react';

interface AIModel {
  id: string;
  name: string;
  provider: string;
  icon: string;
  contextWindow: string;
  type: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'https://web-production-16fdb.up.railway.app';

export default function ModelSelector() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch(`${API_URL}/api/models/list`);
        if (!response.ok) throw new Error('Failed to fetch models');
        const data = await response.json();
        setModels(data.models);
        if (data.models.length > 0) {
          setSelectedModel(data.models[0]);
        }
      } catch (err) {
        // Fallback models
        const fallback = [
          { id: 'claude', name: 'Claude Sonnet', provider: 'Anthropic', icon: '🎭', contextWindow: '200k', type: 'text' },
          { id: 'gpt4', name: 'GPT-4 Turbo', provider: 'OpenAI', icon: '🤖', contextWindow: '128k', type: 'text' },
          { id: 'gemini', name: 'Gemini Pro', provider: 'Google', icon: '💎', contextWindow: '1M', type: 'text' },
        ];
        setModels(fallback);
        setSelectedModel(fallback[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectModel = async (model: AIModel) => {
    setSelectedModel(model);
    setIsOpen(false);

    try {
      await fetch(`${API_URL}/api/models/switch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: model.id }),
      });
    } catch (err) {
      console.error('Failed to switch model:', err);
    }
  };

  if (loading) {
    return (
      <div className="h-9 w-40 bg-white/5 rounded-lg animate-pulse"></div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-[#1a1a23] hover:bg-[#1a1a23]/80 border border-white/10 hover:border-[#00d4ff]/30 rounded-lg transition-all"
      >
        <Sparkles className="text-[#00d4ff]" size={14} />
        <span className="text-sm font-medium text-white">
          {selectedModel?.icon} {selectedModel?.name}
        </span>
        <ChevronDown
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          size={14}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-[#0a0a0f] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="p-2 border-b border-white/5">
            <span className="text-xs text-gray-500 uppercase tracking-wider px-2">Select Model</span>
          </div>
          <div className="max-h-80 overflow-y-auto py-2">
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => handleSelectModel(model)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors ${
                  selectedModel?.id === model.id ? 'bg-[#00d4ff]/10' : ''
                }`}
              >
                <span className="text-xl">{model.icon}</span>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-white">{model.name}</div>
                  <div className="text-xs text-gray-500">
                    {model.provider} • {model.contextWindow} context
                  </div>
                </div>
                {selectedModel?.id === model.id && (
                  <Check className="text-[#00d4ff]" size={16} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
