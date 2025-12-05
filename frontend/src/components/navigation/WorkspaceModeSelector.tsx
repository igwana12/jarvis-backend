import { motion } from 'framer-motion';
import { useWorkspaceStore } from '../../stores/workspaceStore';
import type { WorkspaceModeConfig } from '../../types';

const WORKSPACE_MODES: WorkspaceModeConfig[] = [
  {
    id: 'storytelling',
    name: 'Storytelling',
    icon: '📖',
    description: 'Create compelling narratives',
    color: '#00ff00',
  },
  {
    id: 'filmmaking',
    name: 'Filmmaking',
    icon: '🎬',
    description: 'Video production pipeline',
    color: '#ff6b6b',
  },
  {
    id: 'podcast',
    name: 'Podcast',
    icon: '🎙️',
    description: 'Audio content creation',
    color: '#4ecdc4',
  },
  {
    id: 'soundscape',
    name: 'Soundscape',
    icon: '🎵',
    description: 'Ambient audio design',
    color: '#a855f7',
  },
  {
    id: 'audiobook',
    name: 'Audiobook',
    icon: '📚',
    description: 'Narrated content',
    color: '#f59e0b',
  },
  {
    id: 'multi',
    name: 'Multi-Mode',
    icon: '🔮',
    description: 'Combined workflows',
    color: '#ec4899',
  },
];

export function WorkspaceModeSelector() {
  const { currentMode, setMode } = useWorkspaceStore();

  return (
    <nav
      className="flex items-center gap-2 p-4 bg-bg-secondary rounded-lg"
      role="tablist"
      aria-label="Workspace Mode Selection"
    >
      {WORKSPACE_MODES.map((mode) => {
        const isActive = currentMode === mode.id;

        return (
          <motion.button
            key={mode.id}
            role="tab"
            aria-selected={isActive}
            aria-label={`${mode.name}: ${mode.description}`}
            onClick={() => setMode(mode.id)}
            className={`
              relative flex items-center gap-2 px-4 py-2 rounded-lg
              font-medium text-sm transition-colors
              focus:outline-none focus-visible:ring-2 focus-visible:ring-accent
              ${isActive
                ? 'bg-bg-primary text-accent'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-primary/50'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Neon border for active state */}
            {isActive && (
              <motion.div
                layoutId="activeModeBorder"
                className="absolute inset-0 rounded-lg border-2 border-accent"
                style={{ boxShadow: `0 0 15px ${mode.color}40` }}
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}

            {/* Icon */}
            <span className="text-lg relative z-10" aria-hidden="true">
              {mode.icon}
            </span>

            {/* Name */}
            <span className="relative z-10 hidden sm:inline">
              {mode.name}
            </span>
          </motion.button>
        );
      })}
    </nav>
  );
}

export default WorkspaceModeSelector;
