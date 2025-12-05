import { motion } from 'framer-motion';

interface HeaderProps {
  onMenuToggle?: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-bg-secondary border-b border-border">
      {/* Logo & Title */}
      <div className="flex items-center gap-4">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
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

      {/* Center - Quick actions */}
      <div className="hidden md:flex items-center gap-2">
        <button className="px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-primary rounded-lg transition-colors">
          Dashboard
        </button>
        <button className="px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-primary rounded-lg transition-colors">
          Workflows
        </button>
        <button className="px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-primary rounded-lg transition-colors">
          Models
        </button>
        <button className="px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-primary rounded-lg transition-colors">
          Settings
        </button>
      </div>

      {/* Right - User actions */}
      <div className="flex items-center gap-3">
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
