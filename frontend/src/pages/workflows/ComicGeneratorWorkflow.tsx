import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWorkspaceStore } from '../../stores/workspaceStore';
import { createComic } from '../../services/api';

export function ComicGeneratorWorkflow() {
  const { setPage, addMessage } = useWorkspaceStore();
  const [isGenerating, setIsGenerating] = useState(false);

  // Form state
  const [comicTitle, setComicTitle] = useState('');
  const [comicDescription, setComicDescription] = useState('');
  const [artStyle, setArtStyle] = useState('realistic');
  const [colorScheme, setColorScheme] = useState('vibrant');
  const [panelLayout, setPanelLayout] = useState('4-panel');
  const [characterCount, setCharacterCount] = useState('2');
  const [mood, setMood] = useState('adventurous');
  const [targetAudience, setTargetAudience] = useState('teens');

  const handleGenerate = async () => {
    if (!comicTitle || !comicDescription) {
      addMessage({
        id: `comic-error-${Date.now()}`,
        timestamp: new Date().toISOString(),
        source: 'COMIC_GENERATOR',
        message: 'Please provide both title and description',
        level: 'error',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await createComic(comicDescription);
      addMessage({
        id: `comic-success-${Date.now()}`,
        timestamp: new Date().toISOString(),
        source: 'COMIC_GENERATOR',
        message: `Comic generation started: ${comicTitle}`,
        level: 'success',
      });
    } catch (error) {
      addMessage({
        id: `comic-fail-${Date.now()}`,
        timestamp: new Date().toISOString(),
        source: 'COMIC_GENERATOR',
        message: 'Failed to generate comic',
        level: 'error',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">🎨 Comic Generator</h1>
          <p className="text-text-secondary">Create stunning comic panels with AI</p>
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
            <h2 className="text-lg font-semibold text-text-primary mb-4">Basic Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Comic Title *
                </label>
                <input
                  type="text"
                  value={comicTitle}
                  onChange={(e) => setComicTitle(e.target.value)}
                  placeholder="Enter your comic title..."
                  className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Story Description *
                </label>
                <textarea
                  value={comicDescription}
                  onChange={(e) => setComicDescription(e.target.value)}
                  placeholder="Describe your comic story..."
                  rows={6}
                  className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:border-accent focus:outline-none resize-none"
                />
              </div>
            </div>
          </motion.div>

          {/* Visual Style */}
          <motion.div
            className="p-6 bg-bg-secondary rounded-lg border border-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-lg font-semibold text-text-primary mb-4">Visual Style</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Art Style
                </label>
                <select
                  value={artStyle}
                  onChange={(e) => setArtStyle(e.target.value)}
                  className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
                >
                  <option value="realistic">Realistic</option>
                  <option value="anime">Anime</option>
                  <option value="cartoon">Cartoon</option>
                  <option value="manga">Manga</option>
                  <option value="comic-book">Classic Comic Book</option>
                  <option value="watercolor">Watercolor</option>
                  <option value="pencil-sketch">Pencil Sketch</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Color Scheme
                </label>
                <select
                  value={colorScheme}
                  onChange={(e) => setColorScheme(e.target.value)}
                  className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
                >
                  <option value="vibrant">Vibrant</option>
                  <option value="muted">Muted</option>
                  <option value="monochrome">Monochrome</option>
                  <option value="pastel">Pastel</option>
                  <option value="dark">Dark & Moody</option>
                  <option value="neon">Neon</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Panel Layout
                </label>
                <select
                  value={panelLayout}
                  onChange={(e) => setPanelLayout(e.target.value)}
                  className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
                >
                  <option value="4-panel">4 Panel Classic</option>
                  <option value="6-panel">6 Panel Grid</option>
                  <option value="8-panel">8 Panel Grid</option>
                  <option value="dynamic">Dynamic Layout</option>
                  <option value="single-page">Single Page Splash</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Character Count
                </label>
                <select
                  value={characterCount}
                  onChange={(e) => setCharacterCount(e.target.value)}
                  className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
                >
                  <option value="1">1 Character</option>
                  <option value="2">2 Characters</option>
                  <option value="3">3 Characters</option>
                  <option value="4">4 Characters</option>
                  <option value="5+">5+ Characters</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Tone & Audience */}
          <motion.div
            className="p-6 bg-bg-secondary rounded-lg border border-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-lg font-semibold text-text-primary mb-4">Tone & Audience</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Mood
                </label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
                >
                  <option value="adventurous">Adventurous</option>
                  <option value="mysterious">Mysterious</option>
                  <option value="humorous">Humorous</option>
                  <option value="dramatic">Dramatic</option>
                  <option value="romantic">Romantic</option>
                  <option value="dark">Dark</option>
                  <option value="uplifting">Uplifting</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Target Audience
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
                >
                  <option value="kids">Kids (6-12)</option>
                  <option value="teens">Teens (13-17)</option>
                  <option value="young-adult">Young Adult</option>
                  <option value="adult">Adult</option>
                  <option value="all-ages">All Ages</option>
                </select>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Preview & Actions */}
        <div className="space-y-6">
          {/* Generation Settings Summary */}
          <motion.div
            className="p-6 bg-bg-secondary rounded-lg border border-accent"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3 className="text-lg font-semibold text-text-primary mb-4">Settings Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Art Style:</span>
                <span className="text-accent">{artStyle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Colors:</span>
                <span className="text-accent">{colorScheme}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Layout:</span>
                <span className="text-accent">{panelLayout}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Characters:</span>
                <span className="text-accent">{characterCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Mood:</span>
                <span className="text-accent">{mood}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Audience:</span>
                <span className="text-accent">{targetAudience}</span>
              </div>
            </div>
          </motion.div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !comicTitle || !comicDescription}
            className="w-full px-6 py-4 bg-accent text-bg-primary font-bold text-lg rounded-lg hover:bg-accent-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⚙️</span>
                Generating Comic...
              </span>
            ) : (
              '🎨 Generate Comic'
            )}
          </button>

          {/* Presets */}
          <motion.div
            className="p-4 bg-bg-secondary rounded-lg border border-border"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-sm font-semibold text-text-primary mb-3">Quick Presets</h3>
            <div className="space-y-2">
              <button className="w-full px-3 py-2 text-sm bg-bg-primary text-text-secondary rounded hover:text-accent hover:border-accent border border-border transition-colors text-left">
                ⚡ Superhero Action
              </button>
              <button className="w-full px-3 py-2 text-sm bg-bg-primary text-text-secondary rounded hover:text-accent hover:border-accent border border-border transition-colors text-left">
                🌸 Slice of Life
              </button>
              <button className="w-full px-3 py-2 text-sm bg-bg-primary text-text-secondary rounded hover:text-accent hover:border-accent border border-border transition-colors text-left">
                🦇 Dark & Gritty
              </button>
              <button className="w-full px-3 py-2 text-sm bg-bg-primary text-text-secondary rounded hover:text-accent hover:border-accent border border-border transition-colors text-left">
                😂 Comedy Strip
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ComicGeneratorWorkflow;
