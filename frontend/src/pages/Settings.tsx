import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWorkspaceStore } from '../stores/workspaceStore';

export function Settings() {
  const { setPage } = useWorkspaceStore();
  const [activeTab, setActiveTab] = useState<'general' | 'api-keys' | 'appearance' | 'integrations'>('general');

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'api-keys', name: 'API Keys', icon: '🔑' },
    { id: 'appearance', name: 'Appearance', icon: '🎨' },
    { id: 'integrations', name: 'Integrations', icon: '🔗' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
          <p className="text-text-secondary">Configure your Mission Control preferences</p>
        </div>
        <button
          onClick={() => setPage('home')}
          className="px-4 py-2 text-sm text-text-secondary hover:text-accent border border-border rounded-lg hover:border-accent transition-colors"
        >
          Back
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-bg-secondary text-accent border-b-2 border-accent'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-bg-secondary rounded-lg border border-border p-6">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-text-primary">General Settings</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-bg-primary rounded-lg">
                <div>
                  <div className="font-medium text-text-primary">Auto-save drafts</div>
                  <div className="text-sm text-text-secondary">Automatically save your work</div>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-accent" />
              </div>

              <div className="flex items-center justify-between p-4 bg-bg-primary rounded-lg">
                <div>
                  <div className="font-medium text-text-primary">Show system metrics</div>
                  <div className="text-sm text-text-secondary">Display CPU/RAM in status bar</div>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-accent" />
              </div>

              <div className="flex items-center justify-between p-4 bg-bg-primary rounded-lg">
                <div>
                  <div className="font-medium text-text-primary">Enable WebSocket</div>
                  <div className="text-sm text-text-secondary">Real-time updates from backend</div>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-accent" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'api-keys' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-text-primary">API Keys</h2>
            <p className="text-sm text-text-secondary">
              API keys are stored in environment variables on the server. Update them in your Railway/Vercel dashboard.
            </p>

            <div className="space-y-3">
              {[
                { name: 'OpenAI', env: 'OPENAI_API_KEY', status: true },
                { name: 'Anthropic', env: 'ANTHROPIC_API_KEY', status: false },
                { name: 'Google AI Studio', env: 'GOOGLE_AI_STUDIO_API_KEY', status: false },
                { name: 'ElevenLabs', env: 'ELEVENLABS_API_KEY', status: false },
                { name: 'Replicate', env: 'REPLICATE_API_TOKEN', status: false },
                { name: 'Leonardo AI', env: 'LEONARDO_API_KEY', status: false },
                { name: 'Stability AI', env: 'STABILITY_API_KEY', status: false },
                { name: 'Midjourney', env: 'MIDJOURNEY_API_KEY', status: false },
              ].map((key) => (
                <div key={key.env} className="flex items-center justify-between p-4 bg-bg-primary rounded-lg">
                  <div>
                    <div className="font-medium text-text-primary">{key.name}</div>
                    <code className="text-xs text-text-secondary">{key.env}</code>
                  </div>
                  <div className={`px-3 py-1 rounded text-sm ${
                    key.status
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {key.status ? 'Configured' : 'Not Set'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-text-primary">Appearance</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-text-secondary mb-2">Theme</label>
                <div className="flex gap-2">
                  {['Cyberpunk Dark', 'Midnight Blue', 'Neon Purple', 'Matrix Green'].map((theme) => (
                    <button
                      key={theme}
                      className={`px-4 py-2 rounded-lg text-sm ${
                        theme === 'Cyberpunk Dark'
                          ? 'bg-accent text-bg-primary'
                          : 'bg-bg-primary text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-2">Accent Color</label>
                <div className="flex gap-2">
                  {['#00ff00', '#00ffff', '#ff00ff', '#ff6b6b', '#f59e0b'].map((color) => (
                    <button
                      key={color}
                      className="w-10 h-10 rounded-lg border-2 border-border hover:border-white"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-2">Font Size</label>
                <select className="px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary">
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-text-primary">Integrations</h2>

            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'Sacred Circuits', status: 'connected', icon: '⚡' },
                { name: 'Council API', status: 'disconnected', icon: '👥' },
                { name: 'Railway Backend', status: 'connected', icon: '🚂' },
                { name: 'Vercel Deployment', status: 'connected', icon: '▲' },
                { name: 'GitHub', status: 'connected', icon: '🐙' },
                { name: 'Discord Webhook', status: 'disconnected', icon: '💬' },
              ].map((integration) => (
                <motion.div
                  key={integration.name}
                  className="p-4 bg-bg-primary rounded-lg border border-border"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{integration.icon}</span>
                      <span className="font-medium text-text-primary">{integration.name}</span>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${
                      integration.status === 'connected'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {integration.status}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Settings;
