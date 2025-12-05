import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWorkspaceStore } from '../stores/workspaceStore';
import type { ModelCategory } from '../types';

const CATEGORIES: { id: ModelCategory; name: string; icon: string }[] = [
  { id: 'text', name: 'Text Generation', icon: '📝' },
  { id: 'image', name: 'Image Generation', icon: '🖼️' },
  { id: 'voice', name: 'Voice & Speech', icon: '🔊' },
  { id: 'video', name: 'Video Generation', icon: '🎬' },
  { id: 'audio', name: 'Audio & Music', icon: '🎵' },
];

export function Models() {
  const { availableModels, globalModel, setGlobalModel, setPage } = useWorkspaceStore();
  const [selectedCategory, setSelectedCategory] = useState<ModelCategory | 'all'>('all');

  const filteredModels = selectedCategory === 'all'
    ? availableModels
    : availableModels.filter(m => m.category === selectedCategory);

  const configuredCount = availableModels.filter(m => m.isAvailable).length;
  const totalCount = availableModels.length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">AI Models</h1>
          <p className="text-text-secondary">
            {configuredCount} of {totalCount} models configured
          </p>
        </div>
        <button
          onClick={() => setPage('home')}
          className="px-4 py-2 text-sm text-text-secondary hover:text-accent border border-border rounded-lg hover:border-accent transition-colors"
        >
          Back
        </button>
      </div>

      {/* Global Model Selection */}
      <div className="p-4 bg-bg-secondary rounded-lg border border-accent">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Global Default Model</h2>
            <p className="text-sm text-text-secondary">Used when no stage-specific model is set</p>
          </div>
          <select
            value={globalModel}
            onChange={(e) => setGlobalModel(e.target.value)}
            className="px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
          >
            {availableModels.filter(m => m.isAvailable && m.category === 'text').map((model) => (
              <option key={model.id} value={model.id}>
                {model.icon} {model.name} ({model.provider})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-accent text-bg-primary'
              : 'bg-bg-secondary text-text-secondary hover:text-text-primary'
          }`}
        >
          All Models
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === cat.id
                ? 'bg-accent text-bg-primary'
                : 'bg-bg-secondary text-text-secondary hover:text-text-primary'
            }`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-3 gap-4">
        {filteredModels.map((model) => (
          <motion.div
            key={model.id}
            className={`p-4 rounded-lg border transition-colors ${
              model.isAvailable
                ? 'bg-bg-secondary border-accent/30 hover:border-accent'
                : 'bg-bg-secondary/50 border-border opacity-60'
            }`}
            whileHover={model.isAvailable ? { scale: 1.02 } : {}}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="text-3xl">{model.icon}</div>
              <div className={`px-2 py-1 rounded text-xs ${
                model.isAvailable
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {model.isAvailable ? 'Active' : 'Not Configured'}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-text-primary">{model.name}</h3>
            <p className="text-sm text-text-secondary mb-2">{model.provider}</p>
            <div className="flex justify-between text-xs text-text-secondary">
              <span>Context: {model.contextWindow}</span>
              <span className="uppercase">{model.category}</span>
            </div>
            {!model.isAvailable && model.apiKeyEnv && (
              <div className="mt-3 p-2 bg-bg-primary rounded text-xs text-text-secondary">
                Set <code className="text-accent">{model.apiKeyEnv}</code> to enable
              </div>
            )}
            {model.isAvailable && globalModel === model.id && (
              <div className="mt-3 p-2 bg-accent/20 rounded text-xs text-accent text-center">
                Current Default
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Add New Model */}
      <div className="p-4 bg-bg-secondary rounded-lg border border-dashed border-border hover:border-accent/50 transition-colors cursor-pointer">
        <div className="text-center">
          <span className="text-2xl">➕</span>
          <p className="text-text-secondary mt-2">Add New Model Integration</p>
        </div>
      </div>
    </div>
  );
}

export default Models;
