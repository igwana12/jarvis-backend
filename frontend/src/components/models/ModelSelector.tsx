import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check, Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkspaceStore, AIModel } from '../../stores/workspaceStore';

const CATEGORY_TABS = [
  { id: 'all', label: 'All', icon: '🌐' },
  { id: 'text', label: 'Text', icon: '📝' },
  { id: 'image', label: 'Image', icon: '🖼️' },
  { id: 'voice', label: 'Voice', icon: '🎙️' },
  { id: 'video', label: 'Video', icon: '🎬' },
];

export default function ModelSelector() {
  const {
    availableModels,
    globalModel,
    validationStatus,
    isLoading,
    fetchRegistry,
    fetchValidation,
    setGlobalModel,
  } = useWorkspaceStore();

  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchRegistry();
    fetchValidation();
  }, [fetchRegistry, fetchValidation]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectModel = (model: AIModel) => {
    setGlobalModel(model.id);
    setIsOpen(false);
  };

  // Filter models by category
  const filteredModels =
    activeCategory === 'all'
      ? availableModels
      : availableModels.filter((m) => m.category === activeCategory);

  // Get selected model object
  const selectedModel = availableModels.find((m) => m.id === globalModel);

  // Format context window for display
  const formatContextWindow = (context: number | undefined): string => {
    if (!context) return 'N/A';
    if (context >= 1000000) return `${(context / 1000000).toFixed(0)}M`;
    if (context >= 1000) return `${(context / 1000).toFixed(0)}k`;
    return String(context);
  };

  // Count ready models (those with configured API keys)
  const readyCount = availableModels.filter(
    (m) => m.api_key_configured || validationStatus[m.provider?.toLowerCase()]
  ).length;

  if (isLoading && availableModels.length === 0) {
    return <div className="h-9 w-40 bg-white/5 rounded-lg animate-pulse"></div>;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-[#1a1a23] hover:bg-[#1a1a23]/80 border border-white/10 hover:border-[#00d4ff]/30 rounded-lg transition-all"
      >
        <Sparkles className="text-[#00d4ff]" size={14} />
        <span className="text-sm font-medium text-white">
          {selectedModel?.icon} {selectedModel?.name || 'Select Model'}
        </span>
        <ChevronDown
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          size={14}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 bg-[#0a0a0f] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Category Tabs */}
            <div className="p-2 border-b border-white/5 flex gap-1 overflow-x-auto">
              {CATEGORY_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-2 py-1 text-xs rounded-lg whitespace-nowrap transition-colors ${
                    activeCategory === tab.id
                      ? 'bg-[#00d4ff]/20 text-[#00d4ff]'
                      : 'text-gray-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Model Count */}
            <div className="px-3 py-2 border-b border-white/5 flex items-center justify-between">
              <span className="text-xs text-gray-500 uppercase tracking-wider">
                {filteredModels.length} Models
              </span>
              <span className="text-xs text-green-400 flex items-center gap-1">
                <Zap size={10} /> {readyCount} Ready
              </span>
            </div>

            <div className="max-h-80 overflow-y-auto py-2">
              {filteredModels.map((model) => {
                const isConfigured =
                  model.api_key_configured || validationStatus[model.provider?.toLowerCase()];
                return (
                  <motion.button
                    key={model.id}
                    onClick={() => handleSelectModel(model)}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors ${
                      globalModel === model.id ? 'bg-[#00d4ff]/10' : ''
                    }`}
                  >
                    <span className="text-xl">{model.icon}</span>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium text-white flex items-center gap-2">
                        {model.name}
                        {isConfigured && (
                          <span
                            className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_#22c55e]"
                            title="API Key Configured"
                          />
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {model.provider} • {formatContextWindow(model.context_window)}
                      </div>
                    </div>
                    {globalModel === model.id && <Check className="text-[#00d4ff]" size={16} />}
                  </motion.button>
                );
              })}

              {filteredModels.length === 0 && (
                <div className="px-4 py-6 text-center text-gray-500 text-sm">
                  No models in this category
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
