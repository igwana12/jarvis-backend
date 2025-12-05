import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Header,
  StatusBar,
  WorkspaceModeSelector,
  PipelineStageNavigator,
  ToolPalette,
  UniversalToolPanel,
} from './components';
import { useWorkspaceStore } from './stores/workspaceStore';
import { checkHealth } from './services/api';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      retry: 2,
    },
  },
});

function Dashboard() {
  const { currentMode, currentStage, addMessage } = useWorkspaceStore();

  useEffect(() => {
    // Check backend health on mount
    const checkBackend = async () => {
      try {
        const health = await checkHealth();
        addMessage({
          id: `health-${Date.now()}`,
          timestamp: new Date().toISOString(),
          source: 'SYSTEM',
          message: `Backend connected: ${health.backend} v${health.version}`,
          level: 'success',
        });
      } catch (error) {
        addMessage({
          id: `health-error-${Date.now()}`,
          timestamp: new Date().toISOString(),
          source: 'SYSTEM',
          message: 'Failed to connect to backend',
          level: 'error',
        });
      }
    };

    checkBackend();
  }, [addMessage]);

  return (
    <div className="flex flex-col h-screen bg-bg-primary">
      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden p-4 gap-4">
        {/* Layer 1: Workspace Mode Selector */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <WorkspaceModeSelector />
        </motion.section>

        {/* Layer 2: Pipeline Stage Navigator */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <PipelineStageNavigator />
        </motion.section>

        {/* Main workspace area */}
        <motion.div
          className="flex-1 flex gap-4 min-h-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Layer 3: Tool Palette (Sidebar) */}
          <aside className="w-80 flex-shrink-0">
            <ToolPalette />
          </aside>

          {/* Main content area */}
          <div className="flex-1 bg-bg-secondary rounded-lg border border-border p-6 overflow-y-auto">
            <div className="text-center py-12">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <span className="text-6xl mb-4 block">🎯</span>
                <h2 className="text-2xl font-bold text-text-primary mb-2">
                  Welcome to JARVIS Mission Control
                </h2>
                <p className="text-text-secondary max-w-md mx-auto mb-6">
                  Select a tool from the palette to get started. Your current workspace
                  is <span className="text-accent font-medium">{currentMode}</span> in
                  the <span className="text-accent font-medium">{currentStage}</span> stage.
                </p>

                {/* Quick stats */}
                <div className="flex justify-center gap-6 mt-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent">35+</div>
                    <div className="text-xs text-text-secondary">Dashboards</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent">300+</div>
                    <div className="text-xs text-text-secondary">Tools</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent">6</div>
                    <div className="text-xs text-text-secondary">Workspace Modes</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Status Bar */}
      <StatusBar />

      {/* Universal Tool Panel (Modal) */}
      <UniversalToolPanel />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}

export default App;
