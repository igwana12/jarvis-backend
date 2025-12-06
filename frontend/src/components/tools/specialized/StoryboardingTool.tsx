import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkspaceStore } from '../../../stores/workspaceStore';
import { generateVideo, generateContent } from '../../../services/api';

interface StoryboardPanel {
  id: string;
  sceneNumber: number;
  shotType: string;
  description: string;
  dialogue?: string;
  cameraMovement?: string;
  duration?: string;
  imagePrompt?: string;
  generatedImageUrl?: string;
  isGenerating?: boolean;
}

interface ImageModelOption {
  id: string;
  name: string;
  icon: string;
}

const IMAGE_MODELS: ImageModelOption[] = [
  { id: 'midjourney', name: 'Midjourney', icon: '🖼️' },
  { id: 'leonardo', name: 'Leonardo AI', icon: '🎭' },
  { id: 'dalle', name: 'DALL-E 3', icon: '🤖' },
  { id: 'flux', name: 'Flux', icon: '🌀' },
  { id: 'stable-diffusion', name: 'Stable Diffusion', icon: '🎨' },
];

const SHOT_TYPES = [
  'Extreme Wide Shot (EWS)',
  'Wide Shot (WS)',
  'Full Shot (FS)',
  'Medium Shot (MS)',
  'Medium Close-Up (MCU)',
  'Close-Up (CU)',
  'Extreme Close-Up (ECU)',
  'Over-the-Shoulder (OTS)',
  'Point of View (POV)',
  'Two Shot',
  'Insert Shot',
  'Aerial Shot',
];

const CAMERA_MOVEMENTS = [
  'Static',
  'Pan Left',
  'Pan Right',
  'Tilt Up',
  'Tilt Down',
  'Dolly In',
  'Dolly Out',
  'Tracking Shot',
  'Crane Up',
  'Crane Down',
  'Handheld',
  'Steadicam',
];

// Gwenn Magic Prompt Generator
function generateGwennPrompt(panel: StoryboardPanel, style: string): string {
  const basePrompt = panel.description;

  // Gwenn Magic Prompt format for Midjourney
  const gwennPrompt = `${basePrompt}, ${panel.shotType.toLowerCase()}, cinematic lighting, professional cinematography, ${style}, 8k resolution, highly detailed, dramatic composition --ar 16:9 --v 6 --style raw`;

  return gwennPrompt;
}

interface StoryboardingToolProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function StoryboardingTool({ isOpen: propIsOpen, onClose: propOnClose }: StoryboardingToolProps = {}) {
  const { selectTool, isToolPanelOpen, selectedTool, availableModels, globalModel } = useWorkspaceStore();

  // Support both prop-based and store-based control
  const isOpen = propIsOpen !== undefined ? propIsOpen : (isToolPanelOpen && selectedTool?.id === 'storyboard-generator');
  const handleClose = propOnClose || (() => selectTool(null));
  const [panels, setPanels] = useState<StoryboardPanel[]>([]);
  const [sceneDescription, setSceneDescription] = useState('');
  const [selectedImageModel, setSelectedImageModel] = useState('midjourney');
  const [visualStyle, setVisualStyle] = useState('cinematic film look');
  const [isGeneratingPanels, setIsGeneratingPanels] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const modelDropdownRef = useRef<HTMLDivElement>(null);

  const textModels = availableModels.filter(m => m.category === 'text' && m.isAvailable);
  const currentTextModel = textModels.find(m => m.id === globalModel) || textModels[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
        setShowModelDropdown(false);
      }
    };
    if (showModelDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showModelDropdown]);

  // Only show if open
  if (!isOpen) {
    return null;
  }

  const generateStoryboardPanels = async () => {
    if (!sceneDescription.trim()) return;

    setIsGeneratingPanels(true);

    try {
      // Call backend API to queue video/storyboard generation
      const videoResponse = await generateVideo(sceneDescription, visualStyle);
      console.log('Video generation queued:', videoResponse);

      // Also use content generation for detailed scene breakdown
      const contentResponse = await generateContent(
        `Break down this scene into 3 storyboard panels with shot types and descriptions: ${sceneDescription}`,
        'storyboard-generator'
      );
      console.log('Scene breakdown:', contentResponse);
    } catch (error) {
      console.error('Failed to generate storyboard via API:', error);
    }

    // Generate sample panels from the description
    const newPanels: StoryboardPanel[] = [
      {
        id: `panel-${Date.now()}-1`,
        sceneNumber: 1,
        shotType: 'Wide Shot (WS)',
        description: `Establishing shot - ${sceneDescription.split('.')[0]}`,
        cameraMovement: 'Static',
        duration: '3s',
      },
      {
        id: `panel-${Date.now()}-2`,
        sceneNumber: 2,
        shotType: 'Medium Shot (MS)',
        description: sceneDescription.split('.')[1] || 'Character introduction',
        dialogue: '',
        cameraMovement: 'Dolly In',
        duration: '4s',
      },
      {
        id: `panel-${Date.now()}-3`,
        sceneNumber: 3,
        shotType: 'Close-Up (CU)',
        description: 'Emotional reaction shot',
        cameraMovement: 'Static',
        duration: '2s',
      },
    ];

    // Generate Gwenn prompts for each panel
    newPanels.forEach(panel => {
      panel.imagePrompt = generateGwennPrompt(panel, visualStyle);
    });

    setPanels(prev => [...prev, ...newPanels]);
    setIsGeneratingPanels(false);
    setSceneDescription('');
  };

  const generatePanelImage = async (panelId: string) => {
    const panelIndex = panels.findIndex(p => p.id === panelId);
    if (panelIndex === -1) return;

    // Update panel to show generating state
    setPanels(prev => prev.map(p =>
      p.id === panelId ? { ...p, isGenerating: true } : p
    ));

    // Simulate image generation
    // In production, this would call the image generation API
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Update with placeholder image
    setPanels(prev => prev.map(p =>
      p.id === panelId ? {
        ...p,
        isGenerating: false,
        generatedImageUrl: `https://via.placeholder.com/640x360/1a1a2e/00ff00?text=Panel+${p.sceneNumber}`
      } : p
    ));
  };

  const updatePanel = (panelId: string, updates: Partial<StoryboardPanel>) => {
    setPanels(prev => prev.map(p =>
      p.id === panelId ? { ...p, ...updates } : p
    ));
  };

  const removePanel = (panelId: string) => {
    setPanels(prev => prev.filter(p => p.id !== panelId));
  };

  const regeneratePrompt = (panelId: string) => {
    const panel = panels.find(p => p.id === panelId);
    if (panel) {
      const newPrompt = generateGwennPrompt(panel, visualStyle);
      updatePanel(panelId, { imagePrompt: newPrompt });
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          className="bg-bg-secondary rounded-xl border border-border w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎬</span>
              <div>
                <h2 className="text-lg font-semibold text-text-primary">
                  Storyboard Generator
                </h2>
                <p className="text-sm text-text-secondary">
                  Create visual storyboards with AI-powered image generation
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Image Model Selector */}
              <div className="relative" ref={modelDropdownRef}>
                <button
                  onClick={() => setShowModelDropdown(!showModelDropdown)}
                  className="flex items-center gap-2 px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm hover:border-accent/50 transition-colors"
                >
                  <span>{IMAGE_MODELS.find(m => m.id === selectedImageModel)?.icon}</span>
                  <span className="text-text-primary">{IMAGE_MODELS.find(m => m.id === selectedImageModel)?.name}</span>
                  <span className="text-text-secondary text-xs">▼</span>
                </button>

                <AnimatePresence>
                  {showModelDropdown && (
                    <motion.div
                      className="absolute right-0 top-full mt-2 min-w-[180px] bg-bg-secondary border border-border rounded-lg shadow-lg overflow-hidden z-50"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="px-3 py-2 text-xs text-text-secondary border-b border-border">
                        Image Generation Model
                      </div>
                      {IMAGE_MODELS.map(model => (
                        <button
                          key={model.id}
                          onClick={() => {
                            setSelectedImageModel(model.id);
                            setShowModelDropdown(false);
                          }}
                          className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
                            selectedImageModel === model.id
                              ? 'text-accent bg-accent/10'
                              : 'text-text-primary hover:bg-bg-primary'
                          }`}
                        >
                          <span>{model.icon}</span>
                          <span>{model.name}</span>
                          {selectedImageModel === model.id && <span className="ml-auto text-accent text-xs">✓</span>}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={handleClose}
                className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-primary rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left - Input Panel */}
            <div className="w-80 p-4 border-r border-border flex flex-col gap-4 overflow-y-auto">
              <div>
                <label className="block text-sm text-text-secondary mb-2">
                  Scene Description
                </label>
                <textarea
                  value={sceneDescription}
                  onChange={(e) => setSceneDescription(e.target.value)}
                  placeholder="Describe your scene in detail. Include characters, setting, mood, and key actions..."
                  className="w-full h-32 px-3 py-2 bg-bg-primary border border-border rounded-lg text-text-primary placeholder-text-secondary resize-none focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-2">
                  Visual Style
                </label>
                <input
                  type="text"
                  value={visualStyle}
                  onChange={(e) => setVisualStyle(e.target.value)}
                  placeholder="e.g., cinematic film look, anime style, noir..."
                  className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-2">
                  Text Model
                </label>
                <div className="px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm text-text-primary flex items-center gap-2">
                  <span>{currentTextModel?.icon}</span>
                  <span>{currentTextModel?.name}</span>
                </div>
              </div>

              <button
                onClick={generateStoryboardPanels}
                disabled={!sceneDescription.trim() || isGeneratingPanels}
                className="mt-auto px-4 py-3 bg-accent text-bg-primary font-medium rounded-lg hover:bg-accent-dim disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isGeneratingPanels ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Generating Panels...
                  </span>
                ) : (
                  'Generate Storyboard Panels'
                )}
              </button>

              {/* Quick Templates */}
              <div className="mt-4">
                <h3 className="text-sm font-medium text-text-primary mb-2">Quick Templates</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSceneDescription('A hero walks through a dark forest at night. Moonlight filters through the trees. They hear a mysterious sound and stop, looking around cautiously.')}
                    className="w-full text-left text-xs px-3 py-2 bg-bg-primary border border-border rounded-lg text-text-secondary hover:border-accent/50 transition-colors"
                  >
                    🌙 Hero in Dark Forest
                  </button>
                  <button
                    onClick={() => setSceneDescription('Two characters sit across from each other in a busy coffee shop. The first character reveals shocking news. Close-up on the second character\'s reaction.')}
                    className="w-full text-left text-xs px-3 py-2 bg-bg-primary border border-border rounded-lg text-text-secondary hover:border-accent/50 transition-colors"
                  >
                    ☕ Coffee Shop Revelation
                  </button>
                  <button
                    onClick={() => setSceneDescription('An epic battle scene. Armies clash on a vast battlefield. Focus on the commander rallying their troops, then cut to the chaos of combat.')}
                    className="w-full text-left text-xs px-3 py-2 bg-bg-primary border border-border rounded-lg text-text-secondary hover:border-accent/50 transition-colors"
                  >
                    ⚔️ Epic Battle Scene
                  </button>
                </div>
              </div>
            </div>

            {/* Right - Storyboard Panels */}
            <div className="flex-1 p-4 overflow-y-auto">
              {panels.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center h-full text-center">
                  <span className="text-6xl mb-4">🎬</span>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    No Panels Yet
                  </h3>
                  <p className="text-text-secondary max-w-md">
                    Describe your scene and click "Generate Storyboard Panels" to create visual panels with AI-generated prompts.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {panels.map((panel) => (
                    <motion.div
                      key={panel.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-bg-primary border border-border rounded-lg overflow-hidden"
                    >
                      {/* Panel Image Area */}
                      <div className="aspect-video bg-bg-secondary relative">
                        {panel.generatedImageUrl ? (
                          <img
                            src={panel.generatedImageUrl}
                            alt={`Panel ${panel.sceneNumber}`}
                            className="w-full h-full object-cover"
                          />
                        ) : panel.isGenerating ? (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <span className="text-4xl animate-pulse">🎨</span>
                              <p className="text-text-secondary text-sm mt-2">Generating image...</p>
                            </div>
                          </div>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <button
                              onClick={() => generatePanelImage(panel.id)}
                              className="px-4 py-2 bg-accent text-bg-primary text-sm font-medium rounded-lg hover:bg-accent-dim transition-colors"
                            >
                              🖼️ Generate Image
                            </button>
                          </div>
                        )}

                        {/* Panel Number Badge */}
                        <div className="absolute top-2 left-2 px-2 py-1 bg-accent text-bg-primary text-xs font-bold rounded">
                          #{panel.sceneNumber}
                        </div>
                      </div>

                      {/* Panel Details */}
                      <div className="p-3 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <select
                            value={panel.shotType}
                            onChange={(e) => updatePanel(panel.id, { shotType: e.target.value })}
                            className="px-2 py-1 bg-bg-secondary border border-border rounded text-xs text-text-primary focus:outline-none focus:border-accent"
                          >
                            {SHOT_TYPES.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>

                          <select
                            value={panel.cameraMovement || 'Static'}
                            onChange={(e) => updatePanel(panel.id, { cameraMovement: e.target.value })}
                            className="px-2 py-1 bg-bg-secondary border border-border rounded text-xs text-text-primary focus:outline-none focus:border-accent"
                          >
                            {CAMERA_MOVEMENTS.map(movement => (
                              <option key={movement} value={movement}>{movement}</option>
                            ))}
                          </select>

                          <input
                            type="text"
                            value={panel.duration || ''}
                            onChange={(e) => updatePanel(panel.id, { duration: e.target.value })}
                            placeholder="Duration"
                            className="w-16 px-2 py-1 bg-bg-secondary border border-border rounded text-xs text-text-primary focus:outline-none focus:border-accent"
                          />
                        </div>

                        <textarea
                          value={panel.description}
                          onChange={(e) => updatePanel(panel.id, { description: e.target.value })}
                          className="w-full px-2 py-1 bg-bg-secondary border border-border rounded text-xs text-text-primary resize-none focus:outline-none focus:border-accent"
                          rows={2}
                        />

                        {/* Image Prompt */}
                        {panel.imagePrompt && (
                          <div className="mt-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-accent font-medium">Gwenn Magic Prompt:</span>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => regeneratePrompt(panel.id)}
                                  className="text-xs px-2 py-0.5 text-text-secondary hover:text-accent transition-colors"
                                  title="Regenerate prompt"
                                >
                                  🔄
                                </button>
                                <button
                                  onClick={() => navigator.clipboard.writeText(panel.imagePrompt || '')}
                                  className="text-xs px-2 py-0.5 text-text-secondary hover:text-accent transition-colors"
                                  title="Copy prompt"
                                >
                                  📋
                                </button>
                              </div>
                            </div>
                            <div className="text-xs text-text-secondary bg-bg-secondary p-2 rounded font-mono">
                              {panel.imagePrompt}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-end gap-2 pt-2 border-t border-border">
                          <button
                            onClick={() => removePanel(panel.id)}
                            className="text-xs px-2 py-1 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          {panels.length > 0 && (
            <div className="p-4 border-t border-border flex items-center justify-between">
              <div className="text-sm text-text-secondary">
                {panels.length} panel{panels.length !== 1 ? 's' : ''} created
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const prompts = panels.map(p => p.imagePrompt).filter(Boolean).join('\n\n---\n\n');
                    navigator.clipboard.writeText(prompts);
                  }}
                  className="px-4 py-2 bg-bg-primary border border-border rounded-lg text-sm text-text-primary hover:border-accent/50 transition-colors"
                >
                  📋 Copy All Prompts
                </button>
                <button
                  className="px-4 py-2 bg-accent text-bg-primary text-sm font-medium rounded-lg hover:bg-accent-dim transition-colors"
                >
                  💾 Export Storyboard
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default StoryboardingTool;
