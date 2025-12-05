import { motion } from 'framer-motion';
import { useWorkspaceStore } from '../../stores/workspaceStore';

export function PipelineStageNavigator() {
  const { currentStage, setStage, getPipelineStages } = useWorkspaceStore();
  const stages = getPipelineStages();

  const currentIndex = stages.findIndex((s) => s.id === currentStage);
  const progressPercent = stages.length > 1
    ? (currentIndex / (stages.length - 1)) * 100
    : 0;

  return (
    <div className="relative p-4 bg-bg-secondary rounded-lg">
      {/* Progress bar background */}
      <div className="absolute top-1/2 left-8 right-8 h-1 bg-border -translate-y-1/2 rounded-full" />

      {/* Active progress bar */}
      <motion.div
        className="absolute top-1/2 left-8 h-1 bg-accent -translate-y-1/2 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `calc(${progressPercent}% * (100% - 64px) / 100)` }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{ boxShadow: '0 0 10px rgba(0, 255, 0, 0.5)' }}
      />

      {/* Stage buttons */}
      <nav
        className="relative flex items-center justify-between"
        role="tablist"
        aria-label="Pipeline Stage Navigation"
      >
        {stages.map((stage, index) => {
          const isActive = currentStage === stage.id;
          const isPast = index < currentIndex;

          return (
            <motion.button
              key={stage.id}
              role="tab"
              aria-selected={isActive}
              aria-label={`Stage ${index + 1}: ${stage.name}`}
              onClick={() => setStage(stage.id)}
              className={`
                relative flex flex-col items-center gap-2 p-2 rounded-lg
                transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent
                ${isActive
                  ? 'text-accent'
                  : isPast
                    ? 'text-accent/60'
                    : 'text-text-secondary hover:text-text-primary'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Stage circle */}
              <motion.div
                className={`
                  relative w-10 h-10 rounded-full flex items-center justify-center
                  text-xl transition-colors
                  ${isActive
                    ? 'bg-accent text-bg-primary'
                    : isPast
                      ? 'bg-accent/20 border-2 border-accent/40'
                      : 'bg-bg-primary border-2 border-border'
                  }
                `}
                animate={isActive ? {
                  boxShadow: ['0 0 10px rgba(0,255,0,0.3)', '0 0 20px rgba(0,255,0,0.5)', '0 0 10px rgba(0,255,0,0.3)'],
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span aria-hidden="true">{stage.icon}</span>
              </motion.div>

              {/* Stage name */}
              <span className={`
                text-xs font-medium
                ${isActive ? 'text-accent' : 'text-text-secondary'}
              `}>
                {stage.name}
              </span>

              {/* Active indicator dot */}
              {isActive && (
                <motion.div
                  className="absolute -bottom-1 left-1/2 w-2 h-2 bg-accent rounded-full"
                  style={{ transform: 'translateX(-50%)' }}
                  layoutId="activeStageIndicator"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
}

export default PipelineStageNavigator;
