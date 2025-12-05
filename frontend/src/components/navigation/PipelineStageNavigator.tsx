import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkspaceStore } from '../../stores/workspaceStore';

interface ModelDropdownProps {
  stageId: string;
  isOpen: boolean;
  onClose: () => void;
  anchorEl: HTMLButtonElement | null;
}

function ModelDropdown({ stageId, isOpen, onClose, anchorEl }: ModelDropdownProps) {
  const { availableModels, getModelForStage, setStageModel, globalModel } = useWorkspaceStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const textModels = availableModels.filter(m => m.category === 'text' && m.isAvailable);
  const currentModel = getModelForStage(stageId);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        anchorEl &&
        !anchorEl.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, anchorEl]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[180px] bg-bg-secondary border border-border rounded-lg shadow-lg overflow-hidden z-50"
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.15 }}
        >
          <div className="px-3 py-2 text-xs text-text-secondary border-b border-border">
            Model for this stage
          </div>
          <button
            onClick={() => {
              setStageModel(stageId, null);
              onClose();
            }}
            className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
              currentModel?.id === globalModel
                ? 'text-accent bg-accent/10'
                : 'text-text-primary hover:bg-bg-primary'
            }`}
          >
            <span>🌐</span>
            <span>Use Global Default</span>
            {currentModel?.id === globalModel && <span className="ml-auto text-accent text-xs">✓</span>}
          </button>
          <div className="border-t border-border" />
          {textModels.map((model) => (
            <button
              key={model.id}
              onClick={() => {
                setStageModel(stageId, model.id);
                onClose();
              }}
              className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
                currentModel?.id === model.id
                  ? 'text-accent bg-accent/10'
                  : 'text-text-primary hover:bg-bg-primary'
              }`}
            >
              <span>{model.icon}</span>
              <span>{model.name}</span>
              {currentModel?.id === model.id && <span className="ml-auto text-accent text-xs">✓</span>}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function PipelineStageNavigator() {
  const { currentStage, setStage, getPipelineStages, getModelForStage } = useWorkspaceStore();
  const stages = getPipelineStages();
  const [openModelDropdown, setOpenModelDropdown] = useState<string | null>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const currentIndex = stages.findIndex((s) => s.id === currentStage);
  const progressPercent = stages.length > 1
    ? (currentIndex / (stages.length - 1)) * 100
    : 0;

  return (
    <div className="relative p-4 bg-bg-secondary rounded-lg">
      {/* Progress bar background */}
      <div className="absolute top-1/2 left-8 right-8 h-1 bg-border -translate-y-1/2 rounded-full" style={{ marginTop: '-12px' }} />

      {/* Active progress bar */}
      <motion.div
        className="absolute top-1/2 left-8 h-1 bg-accent -translate-y-1/2 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `calc(${progressPercent}% * (100% - 64px) / 100)` }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{ boxShadow: '0 0 10px rgba(0, 255, 0, 0.5)', marginTop: '-12px' }}
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
          const stageModel = getModelForStage(stage.id);

          return (
            <div key={stage.id} className="relative flex flex-col items-center">
              <motion.button
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

              {/* Model selector button */}
              <button
                ref={(el) => {
                  buttonRefs.current[stage.id] = el;
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenModelDropdown(openModelDropdown === stage.id ? null : stage.id);
                }}
                className={`
                  mt-1 px-2 py-1 text-xs rounded flex items-center gap-1
                  transition-colors border
                  ${isActive
                    ? 'border-accent/30 bg-accent/10 text-accent hover:bg-accent/20'
                    : 'border-border bg-bg-primary text-text-secondary hover:text-text-primary hover:border-accent/30'
                  }
                `}
                title={`Model: ${stageModel?.name || 'Global'}`}
              >
                <span>{stageModel?.icon || '🤖'}</span>
                <span className="max-w-[60px] truncate">{stageModel?.name?.split(' ')[0] || 'Model'}</span>
                <span className="text-[10px]">▼</span>
              </button>

              {/* Model dropdown */}
              <ModelDropdown
                stageId={stage.id}
                isOpen={openModelDropdown === stage.id}
                onClose={() => setOpenModelDropdown(null)}
                anchorEl={buttonRefs.current[stage.id]}
              />
            </div>
          );
        })}
      </nav>
    </div>
  );
}

export default PipelineStageNavigator;
