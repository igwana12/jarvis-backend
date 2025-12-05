import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AUTH_KEY = 'jarvis_authenticated';
const PASSWORD = 'XXX';

interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if already authenticated
    const auth = localStorage.getItem(AUTH_KEY);
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password === PASSWORD) {
      localStorage.setItem(AUTH_KEY, 'true');
      setIsAuthenticated(true);
    } else {
      setError('Invalid access code');
      setPassword('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
    setPassword('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-accent text-2xl animate-pulse">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <>
        {children}
        {/* Logout button in corner */}
        <button
          onClick={handleLogout}
          className="fixed bottom-4 right-4 px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 text-text-secondary rounded-lg transition-colors z-50"
        >
          Logout
        </button>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', damping: 10 }}
            className="text-6xl mb-4"
          >
            🎯
          </motion.div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            JARVIS Mission Control
          </h1>
          <p className="text-text-secondary">
            Enter access code to continue
          </p>
        </div>

        {/* Login Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-bg-secondary border border-border rounded-xl p-6 shadow-2xl"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
        >
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Access Code
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter code..."
              className="w-full bg-bg-primary border border-border rounded-lg px-4 py-3 text-text-primary text-center text-2xl tracking-widest focus:outline-none focus:border-accent transition-colors"
              autoFocus
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-accent text-black font-bold rounded-lg hover:bg-accent/90 transition-colors"
          >
            Access Dashboard
          </button>
        </motion.form>

        {/* Footer */}
        <p className="text-center text-text-secondary/50 text-xs mt-6">
          Unified AI Command Center
        </p>
      </motion.div>
    </div>
  );
}
