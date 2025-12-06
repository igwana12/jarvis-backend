import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkspaceStore } from '../../../stores/workspaceStore';
import { createComic } from '../../../services/api';

interface ComicPanel {
  id: string;
  panelNumber: number;
  description: string;
  dialogue: string;
  characters: string[];
  mood: string;
  cameraAngle: string;
  imagePrompt?: string;
  generatedImageUrl?: string;
  isGenerating?: boolean;
}

interface ComicProject {
  id: string;
  title: string;
  genre: string;
  style: string;
  panels: ComicPanel[];
  createdAt: string;
}

const COMIC_STYLES = [
  { id: 'manga', name: 'Manga', icon: '🇯🇵', description: 'Japanese comic style with expressive characters' },
  { id: 'american', name: 'American Comic', icon: '🦸', description: 'Bold colors, dynamic action poses' },
  { id: 'euro', name: 'European BD', icon: '🇫🇷', description: 'Detailed linework, sophisticated narratives' },
  { id: 'webtoon', name: 'Webtoon', icon: '📱', description: 'Vertical scroll, vibrant colors' },
  { id: 'noir', name: 'Noir', icon: '🌙', description: 'High contrast, dramatic shadows' },
  { id: 'chibi', name: 'Chibi/Cute', icon: '🎀', description: 'Adorable, exaggerated proportions' },
];

const COMIC_GENRES = [
  'Action/Adventure',
  'Fantasy',
  'Sci-Fi',
  'Romance',
  'Horror',
  'Comedy',
  'Slice of Life',
  'Mystery',
  'Superhero',
  'Historical',
];

const CAMERA_ANGLES = [
  'Wide Shot',
  'Medium Shot',
  'Close-Up',
  'Extreme Close-Up',
  'Bird\'s Eye',
  'Worm\'s Eye',
  'Dutch Angle',
  'Over-the-Shoulder',
];

const MOODS = [
  'Dramatic',
  'Comedic',
  'Romantic',
  'Tense',
  'Peaceful',
  'Mysterious',
  'Action-packed',
  'Melancholic',
];

// Generate Midjourney prompt for comic panel
function generateComicPrompt(panel: ComicPanel, style: string): string {
  const styleMap: Record<string, string> = {
    manga: 'manga style, anime aesthetic, screentone shading, dynamic speed lines',
    american: 'american comic book style, bold ink lines, vibrant colors, halftone dots',
    euro: 'european bande dessinée style, detailed linework, watercolor textures',
    webtoon: 'webtoon style, soft gradients, pastel colors, clean lines',
    noir: 'noir comic style, high contrast black and white, dramatic shadows, film noir aesthetic',
    chibi: 'chibi style, cute kawaii characters, big eyes, pastel colors',
  };

  const prompt = `${panel.description}, ${panel.cameraAngle.toLowerCase()}, ${panel.mood.toLowerCase()} mood, ${styleMap[style] || styleMap.american}, comic panel, professional illustration, masterful composition --ar 3:4 --v 6 --style raw`;

  return prompt;
}

interface ComicGeneratorToolProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function ComicGeneratorTool({ isOpen: propIsOpen, onClose: propOnClose }: ComicGeneratorToolProps = {}) {
  const { selectTool, isToolPanelOpen, selectedTool } = useWorkspaceStore();

  // Support both prop-based and store-based control
  const isOpen = propIsOpen !== undefined ? propIsOpen : (isToolPanelOpen && selectedTool?.id === 'comic-generator');
  const handleClose = propOnClose || (() => selectTool(null));
  const [project, setProject] = useState<ComicProject | null>(null);
  const [storyDescription, setStoryDescription] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('manga');
  const [selectedGenre, setSelectedGenre] = useState('Action/Adventure');
  const [panelCount, setPanelCount] = useState(6);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [activeTab, setActiveTab] = useState<'setup' | 'panels' | 'preview'>('setup');
  const [showStyleDropdown, setShowStyleDropdown] = useState(false);
  const styleDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (styleDropdownRef.current && !styleDropdownRef.current.contains(event.target as Node)) {
        setShowStyleDropdown(false);
      }
    };
    if (showStyleDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showStyleDropdown]);

  // Only show if open
  if (!isOpen) {
    return null;
  }

  const generateStoryPanels = async () => {
    if (!storyDescription.trim()) return;

    setIsGeneratingStory(true);

    try {
      // Call backend API
      await createComic(storyDescription);

      // Simulate AI generating panel breakdown
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate sample panels from the description
      const panels: ComicPanel[] = Array.from({ length: panelCount }, (_, i) => ({
        id: `panel-${Date.now()}-${i + 1}`,
        panelNumber: i + 1,
        description: i === 0
          ? `Opening shot: ${storyDescription.split('.')[0]}`
          : i === panelCount - 1
          ? 'Closing panel with dramatic reveal'
          : `Scene ${i + 1}: Continuation of the story`,
        dialogue: '',
        characters: [],
        mood: MOODS[i % MOODS.length],
        cameraAngle: CAMERA_ANGLES[i % CAMERA_ANGLES.length],
      }));

      // Generate prompts for each panel
      panels.forEach(panel => {
        panel.imagePrompt = generateComicPrompt(panel, selectedStyle);
      });

      setProject({
        id: `comic-${Date.now()}`,
        title: storyDescription.slice(0, 50) + '...',
        genre: selectedGenre,
        style: selectedStyle,
        panels,
        createdAt: new Date().toISOString(),
      });

      setActiveTab('panels');
    } catch (error) {
      console.error('Failed to generate comic:', error);
    } finally {
      setIsGeneratingStory(false);
    }
  };

  const updatePanel = (panelId: string, updates: Partial<ComicPanel>) => {
    if (!project) return;
    setProject({
      ...project,
      panels: project.panels.map(p =>
        p.id === panelId ? { ...p, ...updates } : p
      ),
    });
  };

  const regeneratePrompt = (panelId: string) => {
    if (!project) return;
    const panel = project.panels.find(p => p.id === panelId);
    if (panel) {
      const newPrompt = generateComicPrompt(panel, project.style);
      updatePanel(panelId, { imagePrompt: newPrompt });
    }
  };

  const generatePanelImage = async (panelId: string) => {
    if (!project) return;

    updatePanel(panelId, { isGenerating: true });

    // Simulate image generation
    await new Promise(resolve => setTimeout(resolve, 3000));

    const panelIndex = project.panels.findIndex(p => p.id === panelId);
    updatePanel(panelId, {
      isGenerating: false,
      generatedImageUrl: `https://via.placeholder.com/400x533/1a1a2e/00ff00?text=Panel+${panelIndex + 1}`,
    });
  };

  const generateAllImages = async () => {
    if (!project) return;
    for (const panel of project.panels) {
      if (!panel.generatedImageUrl) {
        await generatePanelImage(panel.id);
      }
    }
  };

  const selectedStyleInfo = COMIC_STYLES.find(s => s.id === selectedStyle);

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
              <span className="text-2xl">📚</span>
              <div>
                <h2 className="text-lg font-semibold text-text-primary">
                  Comic/Graphic Novel Generator
                </h2>
                <p className="text-sm text-text-secondary">
                  Create stunning comic panels with AI-powered visuals
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Style Selector */}
              <div className="relative" ref={styleDropdownRef}>
                <button
                  onClick={() => setShowStyleDropdown(!showStyleDropdown)}
                  className="flex items-center gap-2 px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm hover:border-accent/50 transition-colors"
                >
                  <span>{selectedStyleInfo?.icon}</span>
                  <span className="text-text-primary">{selectedStyleInfo?.name}</span>
                  <span className="text-text-secondary text-xs">▼</span>
                </button>

                <AnimatePresence>
                  {showStyleDropdown && (
                    <motion.div
                      className="absolute right-0 top-full mt-2 min-w-[250px] bg-bg-secondary border border-border rounded-lg shadow-lg overflow-hidden z-50"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="px-3 py-2 text-xs text-text-secondary border-b border-border">
                        Comic Style
                      </div>
                      {COMIC_STYLES.map(style => (
                        <button
                          key={style.id}
                          onClick={() => {
                            setSelectedStyle(style.id);
                            setShowStyleDropdown(false);
                          }}
                          className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                            selectedStyle === style.id
                              ? 'text-accent bg-accent/10'
                              : 'text-text-primary hover:bg-bg-primary'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{style.icon}</span>
                            <span>{style.name}</span>
                            {selectedStyle === style.id && <span className="ml-auto text-accent text-xs">✓</span>}
                          </div>
                          <p className="text-xs text-text-secondary mt-1 ml-6">{style.description}</p>
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

          {/* Tabs */}
          <div className="flex border-b border-border">
            {(['setup', 'panels', 'preview'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-accent border-b-2 border-accent'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
                disabled={tab !== 'setup' && !project}
              >
                {tab === 'setup' && '📝 Setup'}
                {tab === 'panels' && '🎨 Panels'}
                {tab === 'preview' && '👁️ Preview'}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'setup' && (
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Story Description */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Story Description
                  </label>
                  <textarea
                    value={storyDescription}
                    onChange={(e) => setStoryDescription(e.target.value)}
                    placeholder="Describe your comic story... Include main characters, setting, and key plot points."
                    className="w-full h-40 px-4 py-3 bg-bg-primary border border-border rounded-lg text-text-primary placeholder-text-secondary resize-none focus:outline-none focus:border-accent"
                  />
                </div>

                {/* Genre */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Genre
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COMIC_GENRES.map(genre => (
                      <button
                        key={genre}
                        onClick={() => setSelectedGenre(genre)}
                        className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                          selectedGenre === genre
                            ? 'border-accent bg-accent/10 text-accent'
                            : 'border-border text-text-secondary hover:border-accent/50'
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Panel Count */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Number of Panels: {panelCount}
                  </label>
                  <input
                    type="range"
                    min="4"
                    max="12"
                    value={panelCount}
                    onChange={(e) => setPanelCount(parseInt(e.target.value))}
                    className="w-full accent-accent"
                  />
                  <div className="flex justify-between text-xs text-text-secondary mt-1">
                    <span>4 panels</span>
                    <span>12 panels</span>
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={generateStoryPanels}
                  disabled={!storyDescription.trim() || isGeneratingStory}
                  className="w-full px-4 py-3 bg-accent text-bg-primary font-medium rounded-lg hover:bg-accent-dim disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isGeneratingStory ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span>
                      Generating Story Panels...
                    </span>
                  ) : (
                    '✨ Generate Comic Panels'
                  )}
                </button>

                {/* Quick Templates */}
                <div>
                  <h3 className="text-sm font-medium text-text-primary mb-3">Quick Templates</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setStoryDescription('A young hero discovers they have magical powers. They must learn to control their abilities while facing an ancient evil threatening their village.');
                        setSelectedGenre('Fantasy');
                      }}
                      className="text-left p-3 bg-bg-primary border border-border rounded-lg hover:border-accent/50 transition-colors"
                    >
                      <span className="text-lg">🧙</span>
                      <p className="text-sm text-text-primary mt-1">Hero\'s Awakening</p>
                      <p className="text-xs text-text-secondary">Fantasy adventure</p>
                    </button>
                    <button
                      onClick={() => {
                        setStoryDescription('In a dystopian future, a rebel hacker must infiltrate a mega-corporation to expose their dark secrets and save the resistance.');
                        setSelectedGenre('Sci-Fi');
                      }}
                      className="text-left p-3 bg-bg-primary border border-border rounded-lg hover:border-accent/50 transition-colors"
                    >
                      <span className="text-lg">🤖</span>
                      <p className="text-sm text-text-primary mt-1">Cyber Rebellion</p>
                      <p className="text-xs text-text-secondary">Sci-fi thriller</p>
                    </button>
                    <button
                      onClick={() => {
                        setStoryDescription('Two rival students are forced to work together on a project. Through their conflicts, they discover unexpected feelings for each other.');
                        setSelectedGenre('Romance');
                      }}
                      className="text-left p-3 bg-bg-primary border border-border rounded-lg hover:border-accent/50 transition-colors"
                    >
                      <span className="text-lg">💕</span>
                      <p className="text-sm text-text-primary mt-1">Rivals to Lovers</p>
                      <p className="text-xs text-text-secondary">Romantic comedy</p>
                    </button>
                    <button
                      onClick={() => {
                        setStoryDescription('A detective investigates a series of mysterious disappearances in a small town, uncovering supernatural forces at work.');
                        setSelectedGenre('Mystery');
                      }}
                      className="text-left p-3 bg-bg-primary border border-border rounded-lg hover:border-accent/50 transition-colors"
                    >
                      <span className="text-lg">🔍</span>
                      <p className="text-sm text-text-primary mt-1">Dark Secrets</p>
                      <p className="text-xs text-text-secondary">Mystery horror</p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'panels' && project && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-text-primary">
                    {project.panels.length} Panels - {selectedStyleInfo?.name} Style
                  </h3>
                  <button
                    onClick={generateAllImages}
                    className="px-4 py-2 bg-accent text-bg-primary text-sm font-medium rounded-lg hover:bg-accent-dim transition-colors"
                  >
                    🎨 Generate All Images
                  </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.panels.map((panel) => (
                    <motion.div
                      key={panel.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-bg-primary border border-border rounded-lg overflow-hidden"
                    >
                      {/* Panel Image */}
                      <div className="aspect-[3/4] bg-bg-secondary relative">
                        {panel.generatedImageUrl ? (
                          <img
                            src={panel.generatedImageUrl}
                            alt={`Panel ${panel.panelNumber}`}
                            className="w-full h-full object-cover"
                          />
                        ) : panel.isGenerating ? (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <span className="text-4xl animate-pulse">🎨</span>
                              <p className="text-text-secondary text-sm mt-2">Generating...</p>
                            </div>
                          </div>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <button
                              onClick={() => generatePanelImage(panel.id)}
                              className="px-3 py-2 bg-accent text-bg-primary text-sm font-medium rounded-lg hover:bg-accent-dim transition-colors"
                            >
                              Generate
                            </button>
                          </div>
                        )}

                        {/* Panel Number */}
                        <div className="absolute top-2 left-2 px-2 py-1 bg-accent text-bg-primary text-xs font-bold rounded">
                          #{panel.panelNumber}
                        </div>
                      </div>

                      {/* Panel Details */}
                      <div className="p-3 space-y-2">
                        <div className="flex gap-2">
                          <select
                            value={panel.cameraAngle}
                            onChange={(e) => updatePanel(panel.id, { cameraAngle: e.target.value })}
                            className="flex-1 px-2 py-1 bg-bg-secondary border border-border rounded text-xs text-text-primary focus:outline-none focus:border-accent"
                          >
                            {CAMERA_ANGLES.map(angle => (
                              <option key={angle} value={angle}>{angle}</option>
                            ))}
                          </select>
                          <select
                            value={panel.mood}
                            onChange={(e) => updatePanel(panel.id, { mood: e.target.value })}
                            className="flex-1 px-2 py-1 bg-bg-secondary border border-border rounded text-xs text-text-primary focus:outline-none focus:border-accent"
                          >
                            {MOODS.map(mood => (
                              <option key={mood} value={mood}>{mood}</option>
                            ))}
                          </select>
                        </div>

                        <textarea
                          value={panel.description}
                          onChange={(e) => updatePanel(panel.id, { description: e.target.value })}
                          placeholder="Panel description..."
                          className="w-full px-2 py-1 bg-bg-secondary border border-border rounded text-xs text-text-primary resize-none focus:outline-none focus:border-accent"
                          rows={2}
                        />

                        <textarea
                          value={panel.dialogue}
                          onChange={(e) => updatePanel(panel.id, { dialogue: e.target.value })}
                          placeholder="Dialogue (optional)..."
                          className="w-full px-2 py-1 bg-bg-secondary border border-border rounded text-xs text-text-primary resize-none focus:outline-none focus:border-accent"
                          rows={1}
                        />

                        {/* Prompt */}
                        {panel.imagePrompt && (
                          <div className="pt-2 border-t border-border">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-accent">AI Prompt:</span>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => regeneratePrompt(panel.id)}
                                  className="text-xs px-1 text-text-secondary hover:text-accent"
                                  title="Regenerate"
                                >
                                  🔄
                                </button>
                                <button
                                  onClick={() => navigator.clipboard.writeText(panel.imagePrompt || '')}
                                  className="text-xs px-1 text-text-secondary hover:text-accent"
                                  title="Copy"
                                >
                                  📋
                                </button>
                              </div>
                            </div>
                            <p className="text-xs text-text-secondary bg-bg-secondary p-2 rounded font-mono line-clamp-3">
                              {panel.imagePrompt}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'preview' && project && (
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-text-primary">{project.title}</h3>
                    <p className="text-text-secondary">{project.genre} • {selectedStyleInfo?.name}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const prompts = project.panels.map(p => p.imagePrompt).filter(Boolean).join('\n\n---\n\n');
                        navigator.clipboard.writeText(prompts);
                      }}
                      className="px-4 py-2 bg-bg-primary border border-border rounded-lg text-sm text-text-primary hover:border-accent/50"
                    >
                      📋 Copy All Prompts
                    </button>
                    <button className="px-4 py-2 bg-accent text-bg-primary text-sm font-medium rounded-lg hover:bg-accent-dim">
                      💾 Export Comic
                    </button>
                  </div>
                </div>

                {/* Comic Preview Grid */}
                <div className="grid grid-cols-3 gap-2 bg-white p-4 rounded-lg">
                  {project.panels.map((panel) => (
                    <div key={panel.id} className="border-2 border-black">
                      <div className="aspect-[3/4] bg-gray-100 relative">
                        {panel.generatedImageUrl ? (
                          <img
                            src={panel.generatedImageUrl}
                            alt={`Panel ${panel.panelNumber}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                            Panel {panel.panelNumber}
                          </div>
                        )}
                        {panel.dialogue && (
                          <div className="absolute bottom-2 left-2 right-2 bg-white border-2 border-black rounded-lg px-2 py-1">
                            <p className="text-xs text-black font-comic">{panel.dialogue}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ComicGeneratorTool;
