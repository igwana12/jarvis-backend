import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWorkspaceStore } from '../../stores/workspaceStore';

export function PromptCrafterWorkflow() {
  const { setPage, addMessage } = useWorkspaceStore();
  const [isGenerating, setIsGenerating] = useState(false);

  // Form state
  const [promptTitle, setPromptTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [aiModel, setAiModel] = useState('gpt-4');
  const [promptStyle, setPromptStyle] = useState('structured');
  const [outputFormat, setOutputFormat] = useState('markdown');
  const [complexity, setComplexity] = useState('intermediate');
  const [includeExamples, setIncludeExamples] = useState(true);
  const [includeConstraints, setIncludeConstraints] = useState(true);
  const [tone, setTone] = useState('professional');

  const handleGenerate = async () => {
    if (!promptTitle || !taskDescription) {
      addMessage({
        id: `prompt-error-${Date.now()}`,
        timestamp: new Date().toISOString(),
        source: 'PROMPT_CRAFTER',
        message: 'Please provide both title and task description',
        level: 'error',
      });
      return;
    }

    setIsGenerating(true);
    addMessage({
      id: `prompt-start-${Date.now()}`,
      timestamp: new Date().toISOString(),
      source: 'PROMPT_CRAFTER',
      message: `Crafting prompt: ${promptTitle}`,
      level: 'info',
    });

    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      addMessage({
        id: `prompt-success-${Date.now()}`,
        timestamp: new Date().toISOString(),
        source: 'PROMPT_CRAFTER',
        message: 'Prompt crafted successfully!',
        level: 'success',
      });
    }, 2000);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">✨ Prompt Crafter</h1>
          <p className="text-text-secondary">Create optimized prompts for any AI model</p>
        </div>
        <button
          onClick={() => setPage('workflows')}
          className="px-4 py-2 text-sm text-text-secondary hover:text-accent border border-border rounded-lg hover:border-accent transition-colors"
        >
          ← Back to Workflows
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="col-span-2 space-y-6">
          {/* Basic Info */}
          <motion.div
            className="p-6 bg-bg-secondary rounded-lg border border-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-lg font-semibold text-text-primary mb-4">Prompt Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Prompt Title *
                </label>
                <input
                  type="text"
                  value={promptTitle}
                  onChange={(e) => setPromptTitle(e.target.value)}
                  placeholder="e.g., Code Review Assistant"
                  className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Task Description *
                </label>
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Describe what you want the AI to do..."
                  rows={6}
                  className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:border-accent focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Target AI Model
                  </label>
                  <select
                    value={aiModel}
                    onChange={(e) => setAiModel(e.target.value)}
                    className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
                  >
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-3.5">GPT-3.5</option>
                    <option value="claude">Claude</option>
                    <option value="gemini">Gemini Pro</option>
                    <option value="llama">Llama 2</option>
                    <option value="mistral">Mistral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Complexity Level
                  </label>
                  <select
                    value={complexity}
                    onChange={(e) => setComplexity(e.target.value)}
                    className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
                  >
                    <option value="beginner">Beginner Friendly</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert Level</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Prompt Structure */}
          <motion.div
            className="p-6 bg-bg-secondary rounded-lg border border-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-lg font-semibold text-text-primary mb-4">Prompt Structure</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Prompt Style
                </label>
                <select
                  value={promptStyle}
                  onChange={(e) => setPromptStyle(e.target.value)}
                  className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
                >
                  <option value="structured">Structured (Role-Task-Format)</option>
                  <option value="conversational">Conversational</option>
                  <option value="step-by-step">Step-by-Step Instructions</option>
                  <option value="chain-of-thought">Chain of Thought</option>
                  <option value="few-shot">Few-Shot Examples</option>
                  <option value="zero-shot">Zero-Shot Direct</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Output Format
                </label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
                >
                  <option value="markdown">Markdown</option>
                  <option value="json">JSON</option>
                  <option value="plain-text">Plain Text</option>
                  <option value="code">Code Block</option>
                  <option value="bullet-points">Bullet Points</option>
                  <option value="numbered-list">Numbered List</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual & Friendly</option>
                  <option value="technical">Technical & Precise</option>
                  <option value="creative">Creative & Engaging</option>
                  <option value="educational">Educational</option>
                  <option value="concise">Concise & Direct</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Advanced Options */}
          <motion.div
            className="p-6 bg-bg-secondary rounded-lg border border-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-lg font-semibold text-text-primary mb-4">Advanced Options</h2>

            <div className="space-y-4">
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeExamples}
                    onChange={(e) => setIncludeExamples(e.target.checked)}
                    className="w-5 h-5 accent-accent"
                  />
                  <span className="text-sm text-text-secondary">Include Examples</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeConstraints}
                    onChange={(e) => setIncludeConstraints(e.target.checked)}
                    className="w-5 h-5 accent-accent"
                  />
                  <span className="text-sm text-text-secondary">Include Constraints</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Additional Instructions
                </label>
                <textarea
                  placeholder="Any specific requirements, constraints, or preferences..."
                  rows={3}
                  className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:border-accent focus:outline-none resize-none"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Preview & Actions */}
        <div className="space-y-6">
          {/* Settings Summary */}
          <motion.div
            className="p-6 bg-bg-secondary rounded-lg border border-accent"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3 className="text-lg font-semibold text-text-primary mb-4">Configuration</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">AI Model:</span>
                <span className="text-accent">{aiModel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Style:</span>
                <span className="text-accent text-xs">{promptStyle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Format:</span>
                <span className="text-accent">{outputFormat}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Complexity:</span>
                <span className="text-accent">{complexity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Tone:</span>
                <span className="text-accent">{tone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Examples:</span>
                <span className="text-accent">{includeExamples ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </motion.div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !promptTitle || !taskDescription}
            className="w-full px-6 py-4 bg-accent text-bg-primary font-bold text-lg rounded-lg hover:bg-accent-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⚙️</span>
                Crafting Prompt...
              </span>
            ) : (
              '✨ Craft Prompt'
            )}
          </button>

          {/* Quick Templates */}
          <motion.div
            className="p-4 bg-bg-secondary rounded-lg border border-border"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-sm font-semibold text-text-primary mb-3">Quick Templates</h3>
            <div className="space-y-2">
              <button className="w-full px-3 py-2 text-sm bg-bg-primary text-text-secondary rounded hover:text-accent hover:border-accent border border-border transition-colors text-left">
                📝 Content Writer
              </button>
              <button className="w-full px-3 py-2 text-sm bg-bg-primary text-text-secondary rounded hover:text-accent hover:border-accent border border-border transition-colors text-left">
                💻 Code Assistant
              </button>
              <button className="w-full px-3 py-2 text-sm bg-bg-primary text-text-secondary rounded hover:text-accent hover:border-accent border border-border transition-colors text-left">
                🔍 Research Helper
              </button>
              <button className="w-full px-3 py-2 text-sm bg-bg-primary text-text-secondary rounded hover:text-accent hover:border-accent border border-border transition-colors text-left">
                📊 Data Analyst
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default PromptCrafterWorkflow;
