import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkspaceStore } from '../../../stores/workspaceStore';

interface PromptTemplate {
  id: string;
  name: string;
  category: string;
  template: string;
  variables: string[];
}

interface CraftedPrompt {
  id: string;
  targetModel: string;
  category: string;
  prompt: string;
  optimized: string;
  timestamp: Date;
}

const TARGET_MODELS = [
  { id: 'gpt4', name: 'GPT-4', icon: '🧠', type: 'text' },
  { id: 'claude', name: 'Claude', icon: '🎭', type: 'text' },
  { id: 'gemini', name: 'Gemini', icon: '💎', type: 'text' },
  { id: 'midjourney', name: 'Midjourney', icon: '🎨', type: 'image' },
  { id: 'dalle', name: 'DALL-E 3', icon: '🖼️', type: 'image' },
  { id: 'stable', name: 'Stable Diffusion', icon: '🌀', type: 'image' },
  { id: 'suno', name: 'Suno', icon: '🎵', type: 'audio' },
  { id: 'elevenlabs', name: 'ElevenLabs', icon: '🎙️', type: 'audio' },
];

const PROMPT_CATEGORIES = [
  { id: 'creative', name: 'Creative Writing', icon: '✍️' },
  { id: 'coding', name: 'Code Generation', icon: '💻' },
  { id: 'analysis', name: 'Analysis & Research', icon: '🔬' },
  { id: 'image', name: 'Image Generation', icon: '🖼️' },
  { id: 'business', name: 'Business & Marketing', icon: '📊' },
  { id: 'education', name: 'Education & Learning', icon: '📚' },
];

const TONES = [
  { id: 'professional', name: 'Professional', color: 'text-blue-400' },
  { id: 'casual', name: 'Casual', color: 'text-green-400' },
  { id: 'formal', name: 'Formal', color: 'text-purple-400' },
  { id: 'creative', name: 'Creative', color: 'text-pink-400' },
  { id: 'technical', name: 'Technical', color: 'text-cyan-400' },
  { id: 'persuasive', name: 'Persuasive', color: 'text-orange-400' },
];

const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'story',
    name: 'Story Writer',
    category: 'creative',
    template: 'Write a {genre} story about {subject} set in {setting}. The tone should be {tone} and approximately {length} words.',
    variables: ['genre', 'subject', 'setting', 'tone', 'length'],
  },
  {
    id: 'code-review',
    name: 'Code Review',
    category: 'coding',
    template: 'Review the following {language} code for {focus}. Provide specific suggestions for improvement:\n\n```{language}\n{code}\n```',
    variables: ['language', 'focus', 'code'],
  },
  {
    id: 'image-art',
    name: 'Artistic Image',
    category: 'image',
    template: '{subject}, {style} style, {lighting} lighting, {mood} mood, {colors} color palette, highly detailed, 8k resolution',
    variables: ['subject', 'style', 'lighting', 'mood', 'colors'],
  },
  {
    id: 'analysis',
    name: 'Data Analysis',
    category: 'analysis',
    template: 'Analyze the following {dataType} and provide insights on {focus}. Include {deliverables}:\n\n{data}',
    variables: ['dataType', 'focus', 'deliverables', 'data'],
  },
  {
    id: 'marketing',
    name: 'Marketing Copy',
    category: 'business',
    template: 'Create {contentType} for {product} targeting {audience}. Key benefits: {benefits}. Tone: {tone}. CTA: {cta}',
    variables: ['contentType', 'product', 'audience', 'benefits', 'tone', 'cta'],
  },
  {
    id: 'lesson',
    name: 'Lesson Plan',
    category: 'education',
    template: 'Create a {duration} lesson plan on {topic} for {audience} level. Include {components}. Learning objectives: {objectives}',
    variables: ['duration', 'topic', 'audience', 'components', 'objectives'],
  },
];

const OPTIMIZATION_TIPS = {
  text: [
    'Be specific about the desired output format',
    'Include context and constraints',
    'Use clear, unambiguous language',
    'Specify the target audience',
    'Request step-by-step reasoning for complex tasks',
  ],
  image: [
    'Include art style references (e.g., "oil painting", "digital art")',
    'Specify lighting conditions',
    'Add quality modifiers (e.g., "highly detailed", "8k")',
    'Include mood and atmosphere descriptors',
    'Use negative prompts to exclude unwanted elements',
  ],
  audio: [
    'Specify voice characteristics clearly',
    'Include pacing and emphasis instructions',
    'Note any pronunciation requirements',
    'Describe the emotional tone',
    'Reference similar styles or voices',
  ],
};

interface PromptCrafterToolProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function PromptCrafterTool({ isOpen: propIsOpen, onClose: propOnClose }: PromptCrafterToolProps = {}) {
  const { selectTool, isToolPanelOpen, selectedTool } = useWorkspaceStore();

  // Support both prop-based and store-based control
  const isOpen = propIsOpen !== undefined ? propIsOpen : (isToolPanelOpen && selectedTool?.id === 'prompt-crafter');
  const handleClose = propOnClose || (() => selectTool(null));

  const [activeTab, setActiveTab] = useState<'craft' | 'templates' | 'history' | 'optimize'>('craft');
  const [targetModel, setTargetModel] = useState(TARGET_MODELS[0]);
  const [category, setCategory] = useState(PROMPT_CATEGORIES[0]);
  const [tone, setTone] = useState(TONES[0]);
  const [rawPrompt, setRawPrompt] = useState('');
  const [optimizedPrompt, setOptimizedPrompt] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [templateVars, setTemplateVars] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<CraftedPrompt[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);

  if (!isOpen) return null;

  const getModelType = () => {
    return targetModel.type as 'text' | 'image' | 'audio';
  };

  const optimizePrompt = async () => {
    if (!rawPrompt.trim()) return;

    setIsOptimizing(true);

    // Simulate optimization with model-specific enhancements
    await new Promise(resolve => setTimeout(resolve, 1500));

    let enhanced = rawPrompt;
    const modelType = getModelType();

    if (modelType === 'image') {
      // Add image-specific enhancements
      if (!enhanced.includes('detailed')) {
        enhanced += ', highly detailed';
      }
      if (!enhanced.includes('8k') && !enhanced.includes('4k')) {
        enhanced += ', 8k resolution';
      }
      if (!enhanced.includes('lighting')) {
        enhanced += ', professional lighting';
      }
    } else if (modelType === 'text') {
      // Add text-specific enhancements
      if (!enhanced.toLowerCase().includes('please')) {
        enhanced = `Please ${enhanced.charAt(0).toLowerCase()}${enhanced.slice(1)}`;
      }
      if (!enhanced.includes('step') && category.id === 'coding') {
        enhanced += '\n\nProvide your response in a clear, step-by-step format.';
      }
    } else if (modelType === 'audio') {
      // Add audio-specific enhancements
      if (!enhanced.includes('speak')) {
        enhanced = `Speak the following naturally: ${enhanced}`;
      }
    }

    setOptimizedPrompt(enhanced);
    setIsOptimizing(false);
  };

  const applyTemplate = (template: PromptTemplate) => {
    setSelectedTemplate(template);
    setTemplateVars({});
  };

  const generateFromTemplate = () => {
    if (!selectedTemplate) return;

    let result = selectedTemplate.template;
    for (const variable of selectedTemplate.variables) {
      result = result.replace(`{${variable}}`, templateVars[variable] || `[${variable}]`);
    }
    setRawPrompt(result);
    setActiveTab('craft');
  };

  const saveToHistory = () => {
    const crafted: CraftedPrompt = {
      id: `prompt-${Date.now()}`,
      targetModel: targetModel.name,
      category: category.name,
      prompt: rawPrompt,
      optimized: optimizedPrompt || rawPrompt,
      timestamp: new Date(),
    };
    setHistory(prev => [crafted, ...prev]);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 2000);
  };

  const loadFromHistory = (item: CraftedPrompt) => {
    setRawPrompt(item.prompt);
    setOptimizedPrompt(item.optimized);
    setActiveTab('craft');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-bg-secondary border border-border rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-4xl">🎯</span>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">AI Prompt Crafter</h2>
                  <p className="text-text-secondary">Craft optimized prompts for any AI model</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <span className="text-2xl">✕</span>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mt-6">
              {[
                { id: 'craft', label: 'Craft', icon: '✨' },
                { id: 'templates', label: 'Templates', icon: '📋' },
                { id: 'optimize', label: 'Optimize', icon: '🚀' },
                { id: 'history', label: 'History', icon: '📜' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-accent text-black'
                      : 'bg-white/5 text-text-secondary hover:bg-white/10'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            {activeTab === 'craft' && (
              <div className="grid grid-cols-3 gap-6">
                {/* Left: Settings */}
                <div className="space-y-6">
                  {/* Target Model */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-3">
                      Target Model
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {TARGET_MODELS.map(model => (
                        <button
                          key={model.id}
                          onClick={() => setTargetModel(model)}
                          className={`p-3 rounded-lg border transition-all text-left ${
                            targetModel.id === model.id
                              ? 'border-accent bg-accent/10'
                              : 'border-border hover:border-accent/50'
                          }`}
                        >
                          <span className="text-xl">{model.icon}</span>
                          <div className="text-sm font-medium text-text-primary mt-1">{model.name}</div>
                          <div className="text-xs text-text-secondary">{model.type}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-3">
                      Prompt Category
                    </label>
                    <div className="space-y-2">
                      {PROMPT_CATEGORIES.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setCategory(cat)}
                          className={`w-full p-3 rounded-lg border transition-all flex items-center gap-3 ${
                            category.id === cat.id
                              ? 'border-accent bg-accent/10'
                              : 'border-border hover:border-accent/50'
                          }`}
                        >
                          <span className="text-xl">{cat.icon}</span>
                          <span className="text-text-primary">{cat.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tone */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-3">
                      Tone
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {TONES.map(t => (
                        <button
                          key={t.id}
                          onClick={() => setTone(t)}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                            tone.id === t.id
                              ? `${t.color} bg-white/10 border-2 border-current`
                              : 'text-text-secondary border border-border hover:border-accent/50'
                          }`}
                        >
                          {t.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Center: Prompt Editor */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Your Prompt
                    </label>
                    <textarea
                      value={rawPrompt}
                      onChange={e => setRawPrompt(e.target.value)}
                      placeholder="Enter your prompt here..."
                      className="w-full h-48 bg-bg-primary border border-border rounded-lg p-4 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent resize-none"
                    />
                    <div className="flex justify-between items-center mt-2 text-xs text-text-secondary">
                      <span>{rawPrompt.length} characters</span>
                      <span>{rawPrompt.split(/\s+/).filter(Boolean).length} words</span>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={optimizePrompt}
                      disabled={!rawPrompt.trim() || isOptimizing}
                      className="flex-1 py-2 bg-accent text-black rounded-lg font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isOptimizing ? (
                        <>
                          <span className="animate-spin">⚡</span>
                          Optimizing...
                        </>
                      ) : (
                        <>
                          <span>🚀</span>
                          Optimize
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => copyToClipboard(optimizedPrompt || rawPrompt)}
                      disabled={!rawPrompt.trim()}
                      className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      📋 Copy
                    </button>
                    <button
                      onClick={saveToHistory}
                      disabled={!rawPrompt.trim()}
                      className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      💾 Save
                    </button>
                  </div>

                  {/* Optimized Output */}
                  {optimizedPrompt && (
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Optimized Prompt
                      </label>
                      <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                        <p className="text-text-primary whitespace-pre-wrap">{optimizedPrompt}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Tips & Preview */}
                <div className="space-y-6">
                  {/* Model-Specific Tips */}
                  <div className="bg-bg-primary rounded-lg border border-border p-4">
                    <h3 className="font-medium text-text-primary mb-3 flex items-center gap-2">
                      <span>💡</span>
                      Tips for {targetModel.name}
                    </h3>
                    <ul className="space-y-2">
                      {OPTIMIZATION_TIPS[getModelType()].map((tip, idx) => (
                        <li key={idx} className="text-sm text-text-secondary flex items-start gap-2">
                          <span className="text-accent">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Prompt Stats */}
                  <div className="bg-bg-primary rounded-lg border border-border p-4">
                    <h3 className="font-medium text-text-primary mb-3 flex items-center gap-2">
                      <span>📊</span>
                      Prompt Analysis
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Clarity</span>
                        <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full transition-all"
                            style={{ width: `${Math.min(100, rawPrompt.length / 2)}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Specificity</span>
                        <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all"
                            style={{ width: `${Math.min(100, rawPrompt.split(',').length * 20)}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Context</span>
                        <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500 rounded-full transition-all"
                            style={{ width: `${Math.min(100, rawPrompt.split(/\s+/).length * 5)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Insert */}
                  <div className="bg-bg-primary rounded-lg border border-border p-4">
                    <h3 className="font-medium text-text-primary mb-3 flex items-center gap-2">
                      <span>⚡</span>
                      Quick Insert
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {getModelType() === 'image' ? (
                        <>
                          <button onClick={() => setRawPrompt(p => p + ', cinematic lighting')} className="px-2 py-1 text-xs bg-white/5 rounded hover:bg-white/10">cinematic</button>
                          <button onClick={() => setRawPrompt(p => p + ', 8k resolution')} className="px-2 py-1 text-xs bg-white/5 rounded hover:bg-white/10">8k</button>
                          <button onClick={() => setRawPrompt(p => p + ', highly detailed')} className="px-2 py-1 text-xs bg-white/5 rounded hover:bg-white/10">detailed</button>
                          <button onClick={() => setRawPrompt(p => p + ', professional photography')} className="px-2 py-1 text-xs bg-white/5 rounded hover:bg-white/10">photo</button>
                          <button onClick={() => setRawPrompt(p => p + ', digital art')} className="px-2 py-1 text-xs bg-white/5 rounded hover:bg-white/10">digital</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => setRawPrompt(p => p + '\n\nPlease be detailed and specific.')} className="px-2 py-1 text-xs bg-white/5 rounded hover:bg-white/10">detailed</button>
                          <button onClick={() => setRawPrompt(p => p + '\n\nProvide step-by-step instructions.')} className="px-2 py-1 text-xs bg-white/5 rounded hover:bg-white/10">step-by-step</button>
                          <button onClick={() => setRawPrompt(p => p + '\n\nInclude examples where helpful.')} className="px-2 py-1 text-xs bg-white/5 rounded hover:bg-white/10">examples</button>
                          <button onClick={() => setRawPrompt(p => p + '\n\nExplain your reasoning.')} className="px-2 py-1 text-xs bg-white/5 rounded hover:bg-white/10">reasoning</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'templates' && (
              <div className="grid grid-cols-2 gap-6">
                {/* Template List */}
                <div className="space-y-4">
                  <h3 className="font-medium text-text-primary">Available Templates</h3>
                  <div className="space-y-3">
                    {PROMPT_TEMPLATES.map(template => (
                      <button
                        key={template.id}
                        onClick={() => applyTemplate(template)}
                        className={`w-full p-4 rounded-lg border text-left transition-all ${
                          selectedTemplate?.id === template.id
                            ? 'border-accent bg-accent/10'
                            : 'border-border hover:border-accent/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-text-primary">{template.name}</span>
                          <span className="text-xs px-2 py-1 bg-white/10 rounded-full text-text-secondary">
                            {template.category}
                          </span>
                        </div>
                        <p className="text-sm text-text-secondary line-clamp-2">{template.template}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Template Editor */}
                <div className="space-y-4">
                  {selectedTemplate ? (
                    <>
                      <h3 className="font-medium text-text-primary">
                        Configure: {selectedTemplate.name}
                      </h3>
                      <div className="bg-bg-primary rounded-lg border border-border p-4">
                        <p className="text-sm text-text-secondary mb-4">{selectedTemplate.template}</p>
                        <div className="space-y-3">
                          {selectedTemplate.variables.map(variable => (
                            <div key={variable}>
                              <label className="block text-sm font-medium text-text-secondary mb-1 capitalize">
                                {variable}
                              </label>
                              <input
                                type="text"
                                value={templateVars[variable] || ''}
                                onChange={e => setTemplateVars(prev => ({ ...prev, [variable]: e.target.value }))}
                                className="w-full bg-bg-secondary border border-border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-accent"
                                placeholder={`Enter ${variable}...`}
                              />
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={generateFromTemplate}
                          className="w-full mt-4 py-2 bg-accent text-black rounded-lg font-medium hover:bg-accent/90 transition-colors"
                        >
                          Generate Prompt
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-text-secondary">
                      Select a template to configure
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'optimize' && (
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="text-center mb-8">
                  <span className="text-6xl">🚀</span>
                  <h3 className="text-xl font-bold text-text-primary mt-4">Prompt Optimization Guide</h3>
                  <p className="text-text-secondary mt-2">Learn how to craft prompts that get better results</p>
                </div>

                {/* Optimization Principles */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { title: 'Be Specific', icon: '🎯', desc: 'Clearly state what you want, including format, length, and style.' },
                    { title: 'Provide Context', icon: '📖', desc: 'Give background information that helps the AI understand your needs.' },
                    { title: 'Use Examples', icon: '💡', desc: 'Show the AI what good output looks like with concrete examples.' },
                    { title: 'Iterate', icon: '🔄', desc: 'Refine your prompts based on the results you receive.' },
                  ].map(principle => (
                    <div key={principle.title} className="bg-bg-primary rounded-lg border border-border p-4">
                      <span className="text-2xl">{principle.icon}</span>
                      <h4 className="font-medium text-text-primary mt-2">{principle.title}</h4>
                      <p className="text-sm text-text-secondary mt-1">{principle.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Model-Specific Guides */}
                <div className="bg-bg-primary rounded-lg border border-border p-6">
                  <h4 className="font-medium text-text-primary mb-4">Model-Specific Optimization</h4>
                  <div className="space-y-4">
                    {TARGET_MODELS.slice(0, 6).map(model => (
                      <div key={model.id} className="flex items-start gap-3">
                        <span className="text-2xl">{model.icon}</span>
                        <div>
                          <h5 className="font-medium text-text-primary">{model.name}</h5>
                          <p className="text-sm text-text-secondary">
                            {model.type === 'image'
                              ? 'Focus on visual descriptors, art styles, and composition elements.'
                              : model.type === 'audio'
                              ? 'Specify voice characteristics, pacing, and emotional tone.'
                              : 'Structure requests clearly with context, constraints, and desired output format.'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                {history.length > 0 ? (
                  history.map(item => (
                    <div key={item.id} className="bg-bg-primary rounded-lg border border-border p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded">
                            {item.targetModel}
                          </span>
                          <span className="text-xs px-2 py-1 bg-white/10 text-text-secondary rounded">
                            {item.category}
                          </span>
                        </div>
                        <span className="text-xs text-text-secondary">
                          {item.timestamp.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-text-primary text-sm mb-3 line-clamp-2">{item.prompt}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => loadFromHistory(item)}
                          className="px-3 py-1 text-sm bg-white/10 rounded hover:bg-white/20 transition-colors"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => copyToClipboard(item.optimized)}
                          className="px-3 py-1 text-sm bg-white/10 rounded hover:bg-white/20 transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-text-secondary">
                    <span className="text-4xl block mb-4">📜</span>
                    No prompts saved yet. Create and save prompts to build your history.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Copy Toast */}
          <AnimatePresence>
            {showCopyToast && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg"
              >
                Copied to clipboard!
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
