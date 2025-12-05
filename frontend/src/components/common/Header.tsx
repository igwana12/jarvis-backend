import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkspaceStore } from '../../stores/workspaceStore';
import type { PageRoute } from '../../types';

interface HeaderProps {
  onMenuToggle?: () => void;
}

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function Dropdown({ isOpen, onClose, children }: DropdownProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={ref}
          className="absolute top-full left-0 mt-2 min-w-[200px] bg-bg-secondary border border-border rounded-lg shadow-lg overflow-hidden z-50"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { setPage, globalModel, setGlobalModel, availableModels, currentPage } = useWorkspaceStore();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const textModels = availableModels.filter(m => m.category === 'text' && m.isAvailable);
  const currentModel = availableModels.find(m => m.id === globalModel);

  const handleNavClick = (page: PageRoute) => {
    setPage(page);
    setOpenDropdown(null);
  };

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-bg-secondary border-b border-border">
      {/* Logo & Title */}
      <div className="flex items-center gap-4">
        <motion.div
          className="flex items-center gap-3 cursor-pointer"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => handleNavClick('home')}
        >
          {/* Logo */}
          <motion.div
            className="w-10 h-10 rounded-lg bg-accent/10 border border-accent flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            animate={{
              boxShadow: [
                '0 0 10px rgba(0,255,0,0.2)',
                '0 0 20px rgba(0,255,0,0.4)',
                '0 0 10px rgba(0,255,0,0.2)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-xl">🤖</span>
          </motion.div>

          {/* Title */}
          <div>
            <h1 className="text-xl font-bold text-text-primary tracking-tight">
              JARVIS
            </h1>
            <p className="text-xs text-accent font-mono">
              Unified Mission Control
            </p>
          </div>
        </motion.div>
      </div>

      {/* Center - Navigation with Dropdowns */}
      <nav className="hidden md:flex items-center gap-1">
        {/* Dashboard */}
        <div className="relative">
          <button
            onClick={() => handleNavClick('dashboard')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              currentPage === 'dashboard'
                ? 'text-accent bg-bg-primary'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-primary'
            }`}
          >
            Dashboard
          </button>
        </div>

        {/* Workflows */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('workflows')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-1 ${
              currentPage === 'workflows'
                ? 'text-accent bg-bg-primary'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-primary'
            }`}
          >
            Workflows
            <span className="text-xs">▼</span>
          </button>
          <Dropdown isOpen={openDropdown === 'workflows'} onClose={() => setOpenDropdown(null)}>
            <button
              onClick={() => handleNavClick('workflows')}
              className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-bg-primary transition-colors"
            >
              📋 All Workflows
            </button>
            <button className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-bg-primary transition-colors">
              ➕ New Workflow
            </button>
            <div className="border-t border-border my-1" />
            <button className="w-full px-4 py-2 text-left text-sm text-text-secondary hover:bg-bg-primary transition-colors">
              📖 Story to Video
            </button>
            <button className="w-full px-4 py-2 text-left text-sm text-text-secondary hover:bg-bg-primary transition-colors">
              🎙️ Podcast Episode
            </button>
            <button className="w-full px-4 py-2 text-left text-sm text-text-secondary hover:bg-bg-primary transition-colors">
              📚 Audiobook Creation
            </button>
          </Dropdown>
        </div>

        {/* Models */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('models')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-1 ${
              currentPage === 'models'
                ? 'text-accent bg-bg-primary'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-primary'
            }`}
          >
            {currentModel?.icon || '🤖'} Models
            <span className="text-xs">▼</span>
          </button>
          <Dropdown isOpen={openDropdown === 'models'} onClose={() => setOpenDropdown(null)}>
            <div className="px-4 py-2 text-xs text-text-secondary border-b border-border">
              Select Default Model
            </div>
            {textModels.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  setGlobalModel(model.id);
                  setOpenDropdown(null);
                }}
                className={`w-full px-4 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
                  globalModel === model.id
                    ? 'text-accent bg-accent/10'
                    : 'text-text-primary hover:bg-bg-primary'
                }`}
              >
                <span>{model.icon}</span>
                <span>{model.name}</span>
                {globalModel === model.id && <span className="ml-auto text-accent">✓</span>}
              </button>
            ))}
            <div className="border-t border-border my-1" />
            <button
              onClick={() => handleNavClick('models')}
              className="w-full px-4 py-2 text-left text-sm text-accent hover:bg-bg-primary transition-colors"
            >
              ⚙️ Manage All Models
            </button>
          </Dropdown>
        </div>

        {/* Settings */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('settings')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-1 ${
              currentPage === 'settings'
                ? 'text-accent bg-bg-primary'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-primary'
            }`}
          >
            Settings
            <span className="text-xs">▼</span>
          </button>
          <Dropdown isOpen={openDropdown === 'settings'} onClose={() => setOpenDropdown(null)}>
            <button
              onClick={() => handleNavClick('settings')}
              className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-bg-primary transition-colors"
            >
              ⚙️ General
            </button>
            <button
              onClick={() => handleNavClick('settings')}
              className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-bg-primary transition-colors"
            >
              🔑 API Keys
            </button>
            <button
              onClick={() => handleNavClick('settings')}
              className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-bg-primary transition-colors"
            >
              🎨 Appearance
            </button>
            <button
              onClick={() => handleNavClick('settings')}
              className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-bg-primary transition-colors"
            >
              🔗 Integrations
            </button>
          </Dropdown>
        </div>
      </nav>

      {/* Right - Current Model & User actions */}
      <div className="flex items-center gap-3">
        {/* Current Model Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-bg-primary rounded-lg border border-border">
          <span className="text-sm">{currentModel?.icon}</span>
          <span className="text-sm text-text-primary">{currentModel?.name}</span>
        </div>

        {/* Notifications */}
        <button
          className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-bg-primary rounded-lg transition-colors"
          aria-label="Notifications"
        >
          <span className="text-lg">🔔</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
        </button>

        {/* Help */}
        <button
          className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-primary rounded-lg transition-colors"
          aria-label="Help"
        >
          <span className="text-lg">❓</span>
        </button>

        {/* Menu toggle for mobile */}
        <button
          className="md:hidden p-2 text-text-secondary hover:text-text-primary hover:bg-bg-primary rounded-lg transition-colors"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <span className="text-lg">☰</span>
        </button>

        {/* User avatar */}
        <motion.div
          className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/30 to-neon-purple/30 border border-accent/50 flex items-center justify-center cursor-pointer"
          whileHover={{ scale: 1.1 }}
        >
          <span className="text-sm">👤</span>
        </motion.div>
      </div>
    </header>
  );
}

export default Header;
