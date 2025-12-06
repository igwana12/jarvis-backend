import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SystemMetricsCard from './components/dashboard/SystemMetricsCard';
import CostTrackerWidget from './components/dashboard/CostTrackerWidget';
import ActiveWorkflowsWidget from './components/dashboard/ActiveWorkflowsWidget';
import ModelSelector from './components/models/ModelSelector';
import APIKeysTab from './components/settings/APIKeysTab';
import { AuthGate } from './components/auth/AuthGate';
import {
  StoryboardingTool,
  ComicGeneratorTool,
  PodcastStudioTool,
  PromptCrafterTool,
  TradingDashboardTool,
} from './components/tools/specialized';
import { Command, Settings as SettingsIcon, Home, Sparkles } from 'lucide-react';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      retry: 2,
    },
  },
});

// Tool launcher buttons
const QUICK_TOOLS = [
  { id: 'storyboard', name: 'Storyboard', icon: '🎬' },
  { id: 'comic-generator', name: 'Comic Gen', icon: '📚' },
  { id: 'podcast-studio', name: 'Podcast', icon: '🎙️' },
  { id: 'prompt-crafter', name: 'Prompts', icon: '🎯' },
  { id: 'trading-dashboard', name: 'Trading', icon: '📈' },
];

function MainApp() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'settings'>('dashboard');
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const openTool = (toolId: string) => {
    setActiveTool(toolId);
  };

  return (
    <div className="min-h-screen bg-[#050507] text-gray-200 selection:bg-[#00d4ff]/30 font-sans">
      {/* HEADER */}
      <header className="h-16 border-b border-[#00d4ff]/10 bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#00d4ff] rounded flex items-center justify-center shadow-[0_0_15px_#00d4ff]">
              <Command className="text-black" size={18} />
            </div>
            <h1 className="text-xl font-bold tracking-widest font-mono text-white">
              JARVIS <span className="text-[#00d4ff] text-xs align-top">PRO</span>
            </h1>
          </div>

          {/* Navigation Tabs */}
          <nav className="ml-10 flex gap-1 bg-[#1a1a23] p-1 rounded-lg border border-white/5">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                currentView === 'dashboard'
                  ? 'bg-[#00d4ff] text-black shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Home size={14} /> Mission Control
            </button>
            <button
              onClick={() => setCurrentView('settings')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                currentView === 'settings'
                  ? 'bg-[#00d4ff] text-black shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <SettingsIcon size={14} /> System Config
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ModelSelector />
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
        {currentView === 'dashboard' ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="w-1 h-8 bg-[#00d4ff] rounded-full inline-block shadow-[0_0_10px_#00d4ff]" />
                Mission Control Overview
              </h2>

              {/* Quick Tool Launcher */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 mr-2">Quick Launch:</span>
                {QUICK_TOOLS.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => openTool(tool.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1a23] hover:bg-[#00d4ff]/20 border border-white/5 hover:border-[#00d4ff]/30 rounded-lg text-xs transition-all"
                    title={tool.name}
                  >
                    <span>{tool.icon}</span>
                    <span className="hidden lg:inline text-gray-400">{tool.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <SystemMetricsCard />
                <CostTrackerWidget />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <ActiveWorkflowsWidget />

                {/* Creative Tools Quick Access */}
                <div className="rounded-xl border border-white/5 bg-[#0a0a0f] p-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                    <Sparkles className="text-[#00d4ff]" size={20} />
                    Creative Tools
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {QUICK_TOOLS.map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => openTool(tool.id)}
                        className="flex items-center gap-3 p-4 bg-[#1a1a23] hover:bg-[#00d4ff]/10 border border-white/5 hover:border-[#00d4ff]/30 rounded-lg transition-all text-left"
                      >
                        <span className="text-2xl">{tool.icon}</span>
                        <div>
                          <div className="text-sm font-medium text-white">{tool.name}</div>
                          <div className="text-xs text-gray-500">Click to launch</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* SETTINGS VIEW */
          <APIKeysTab />
        )}
      </main>

      {/* Specialized Tool Panels (Modals) */}
      <StoryboardingTool
        isOpen={activeTool === 'storyboard'}
        onClose={() => setActiveTool(null)}
      />
      <ComicGeneratorTool
        isOpen={activeTool === 'comic-generator'}
        onClose={() => setActiveTool(null)}
      />
      <PodcastStudioTool
        isOpen={activeTool === 'podcast-studio'}
        onClose={() => setActiveTool(null)}
      />
      <PromptCrafterTool
        isOpen={activeTool === 'prompt-crafter'}
        onClose={() => setActiveTool(null)}
      />
      <TradingDashboardTool
        isOpen={activeTool === 'trading-dashboard'}
        onClose={() => setActiveTool(null)}
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthGate>
        <MainApp />
      </AuthGate>
    </QueryClientProvider>
  );
}

export default App;
