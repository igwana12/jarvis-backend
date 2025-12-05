import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkspaceStore } from '../../stores/workspaceStore';
import type { Tool } from '../../types';

// Sample tools data - in production this would come from the API
const SAMPLE_TOOLS: Tool[] = [
  // Storytelling tools
  { id: 'story-generator', name: 'Story Generator', description: 'Generate story ideas with AI', category: 'Writing', icon: '✨', modes: ['storytelling', 'multi'], stages: ['ideate', 'plan'] },
  { id: 'character-creator', name: 'Character Creator', description: 'Create detailed characters', category: 'Writing', icon: '👤', modes: ['storytelling', 'multi'], stages: ['ideate', 'outline', 'plan'] },
  { id: 'plot-outliner', name: 'Plot Outliner', description: 'Structure your narrative', category: 'Writing', icon: '📋', modes: ['storytelling', 'multi'], stages: ['outline', 'plan'] },
  { id: 'dialogue-writer', name: 'Dialogue Writer', description: 'Craft natural dialogue', category: 'Writing', icon: '💬', modes: ['storytelling', 'filmmaking', 'multi'], stages: ['draft', 'script', 'create'] },
  { id: 'grammar-checker', name: 'Grammar Checker', description: 'Polish your prose', category: 'Editing', icon: '📝', modes: ['storytelling', 'podcast', 'multi'], stages: ['edit', 'review'] },
  { id: 'publisher', name: 'Publisher', description: 'Publish to platforms', category: 'Distribution', icon: '🚀', modes: ['storytelling', 'podcast', 'audiobook', 'multi'], stages: ['publish', 'deploy'] },

  // Filmmaking tools
  { id: 'scene-visualizer', name: 'Scene Visualizer', description: 'Visualize scenes with AI', category: 'Video', icon: '🎬', modes: ['filmmaking', 'multi'], stages: ['concept', 'plan'] },
  { id: 'storyboard-creator', name: 'Storyboard Creator', description: 'Create visual storyboards', category: 'Video', icon: '🎨', modes: ['filmmaking', 'multi'], stages: ['preprod', 'create'] },
  { id: 'video-editor', name: 'Video Editor', description: 'Edit video footage', category: 'Video', icon: '🎞️', modes: ['filmmaking', 'multi'], stages: ['production', 'post', 'create'] },
  { id: 'color-grader', name: 'Color Grader', description: 'Professional color grading', category: 'Video', icon: '🎨', modes: ['filmmaking', 'multi'], stages: ['post', 'review'] },

  // Podcast tools
  { id: 'topic-researcher', name: 'Topic Researcher', description: 'Research podcast topics', category: 'Audio', icon: '🔍', modes: ['podcast', 'multi'], stages: ['topic', 'plan'] },
  { id: 'script-generator', name: 'Script Generator', description: 'Generate podcast scripts', category: 'Audio', icon: '📝', modes: ['podcast', 'multi'], stages: ['script', 'create'] },
  { id: 'audio-recorder', name: 'Audio Recorder', description: 'Record high-quality audio', category: 'Audio', icon: '🎙️', modes: ['podcast', 'audiobook', 'multi'], stages: ['record', 'create'] },
  { id: 'audio-editor', name: 'Audio Editor', description: 'Edit and enhance audio', category: 'Audio', icon: '🎚️', modes: ['podcast', 'soundscape', 'audiobook', 'multi'], stages: ['edit', 'mix', 'review'] },

  // Soundscape tools
  { id: 'ambient-generator', name: 'Ambient Generator', description: 'Generate ambient sounds', category: 'Audio', icon: '🌊', modes: ['soundscape', 'multi'], stages: ['concept', 'compose', 'plan', 'create'] },
  { id: 'layer-mixer', name: 'Layer Mixer', description: 'Mix audio layers', category: 'Audio', icon: '📚', modes: ['soundscape', 'multi'], stages: ['layer', 'integrate'] },
  { id: 'mastering-tool', name: 'Mastering Tool', description: 'Master final audio', category: 'Audio', icon: '💎', modes: ['soundscape', 'podcast', 'audiobook', 'multi'], stages: ['master', 'deploy'] },

  // Audiobook tools
  { id: 'text-selector', name: 'Text Selector', description: 'Select and prepare text', category: 'Audio', icon: '📖', modes: ['audiobook', 'multi'], stages: ['select', 'plan'] },
  { id: 'tts-generator', name: 'TTS Generator', description: 'Text-to-speech generation', category: 'Audio', icon: '🔊', modes: ['audiobook', 'multi'], stages: ['record', 'create'] },
];

const CATEGORIES = ['All', 'Writing', 'Video', 'Audio', 'Editing', 'Distribution'];

export function ToolPalette() {
  const { currentMode, currentStage, selectTool, tools } = useWorkspaceStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Use sample tools if no tools loaded from API
  const availableTools = tools.length > 0 ? tools : SAMPLE_TOOLS;

  // Filter tools based on mode, stage, search, and category
  const filteredTools = useMemo(() => {
    return availableTools.filter((tool) => {
      // Filter by mode and stage
      const matchesMode = tool.modes.includes(currentMode);
      const matchesStage = tool.stages.includes(currentStage);

      // Filter by search query
      const matchesSearch = searchQuery === '' ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by category
      const matchesCategory = selectedCategory === 'All' ||
        tool.category === selectedCategory;

      return matchesMode && matchesStage && matchesSearch && matchesCategory;
    });
  }, [availableTools, currentMode, currentStage, searchQuery, selectedCategory]);

  return (
    <div className="flex flex-col h-full bg-bg-secondary rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-text-primary mb-3">
          Tool Palette
        </h2>

        {/* Search */}
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg
              text-text-primary placeholder-text-secondary
              focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            aria-label="Search tools"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary">
            🔍
          </span>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap
                transition-colors
                ${selectedCategory === category
                  ? 'bg-accent text-bg-primary'
                  : 'bg-bg-primary text-text-secondary hover:text-text-primary'
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Tool grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="popLayout">
          {filteredTools.length > 0 ? (
            <motion.div
              className="grid grid-cols-2 gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredTools.map((tool, index) => (
                <motion.button
                  key={tool.id}
                  onClick={() => selectTool(tool)}
                  className="flex flex-col items-start p-3 bg-bg-primary rounded-lg
                    border border-border hover:border-accent/50
                    transition-colors text-left
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(0,255,0,0.2)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-2xl mb-2" aria-hidden="true">
                    {tool.icon}
                  </span>
                  <span className="text-sm font-medium text-text-primary">
                    {tool.name}
                  </span>
                  <span className="text-xs text-text-secondary line-clamp-2">
                    {tool.description}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center h-full text-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className="text-4xl mb-3">🔧</span>
              <p className="text-text-secondary">
                No tools match your current filters.
              </p>
              <p className="text-text-secondary text-sm mt-1">
                Try adjusting the search or category.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer with count */}
      <div className="p-3 border-t border-border text-xs text-text-secondary">
        {filteredTools.length} tools available
      </div>
    </div>
  );
}

export default ToolPalette;
