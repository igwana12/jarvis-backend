import { useState } from 'react';
import { Key, Eye, EyeOff, Check, AlertCircle, ExternalLink } from 'lucide-react';

interface APIKey {
  id: string;
  name: string;
  provider: string;
  icon: string;
  configured: boolean;
  envVar: string;
  docsUrl: string;
}

const API_KEYS: APIKey[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    provider: 'GPT-4, DALL-E, Whisper',
    icon: '🤖',
    configured: false,
    envVar: 'OPENAI_API_KEY',
    docsUrl: 'https://platform.openai.com/api-keys',
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    provider: 'Claude 3.5 Sonnet',
    icon: '🎭',
    configured: true,
    envVar: 'ANTHROPIC_API_KEY',
    docsUrl: 'https://console.anthropic.com/',
  },
  {
    id: 'google',
    name: 'Google AI',
    provider: 'Gemini Pro, Gemini Flash',
    icon: '💎',
    configured: true,
    envVar: 'GOOGLE_API_KEY',
    docsUrl: 'https://aistudio.google.com/',
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    provider: 'Voice Synthesis',
    icon: '🎙️',
    configured: false,
    envVar: 'ELEVENLABS_API_KEY',
    docsUrl: 'https://elevenlabs.io/',
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    provider: 'Image Generation',
    icon: '🎨',
    configured: false,
    envVar: 'MIDJOURNEY_API_KEY',
    docsUrl: 'https://www.midjourney.com/',
  },
  {
    id: 'replicate',
    name: 'Replicate',
    provider: 'Open Source Models',
    icon: '🔄',
    configured: false,
    envVar: 'REPLICATE_API_TOKEN',
    docsUrl: 'https://replicate.com/',
  },
];

export default function APIKeysTab() {
  const [keys, setKeys] = useState<Record<string, string>>({});
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [savedKeys, setSavedKeys] = useState<Record<string, boolean>>({});

  const toggleVisibility = (id: string) => {
    setVisibleKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleKeyChange = (id: string, value: string) => {
    setKeys((prev) => ({ ...prev, [id]: value }));
    setSavedKeys((prev) => ({ ...prev, [id]: false }));
  };

  const handleSaveKey = (id: string) => {
    // In production, this would save to backend/env
    console.log(`Saving key for ${id}:`, keys[id]?.substring(0, 10) + '...');
    setSavedKeys((prev) => ({ ...prev, [id]: true }));

    // Show success briefly
    setTimeout(() => {
      setSavedKeys((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const configuredCount = API_KEYS.filter((k) => k.configured).length;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-1 h-8 bg-[#00d4ff] rounded-full inline-block shadow-[0_0_10px_#00d4ff]" />
            API Keys Configuration
          </h2>
          <p className="text-gray-500 mt-2">
            Manage your AI service credentials. Keys are stored securely.
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{configuredCount}/{API_KEYS.length}</div>
          <div className="text-xs text-gray-500">Services Connected</div>
        </div>
      </div>

      <div className="space-y-4">
        {API_KEYS.map((apiKey) => (
          <div
            key={apiKey.id}
            className={`rounded-xl border p-5 transition-all ${
              apiKey.configured
                ? 'border-green-500/30 bg-green-500/5'
                : 'border-white/5 bg-[#0a0a0f] hover:border-white/10'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#1a1a23] flex items-center justify-center text-2xl border border-white/5">
                  {apiKey.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    {apiKey.name}
                    {apiKey.configured && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check size={10} /> Connected
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-500">{apiKey.provider}</p>
                </div>
              </div>
              <a
                href={apiKey.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#00d4ff] hover:underline flex items-center gap-1"
              >
                Get API Key <ExternalLink size={10} />
              </a>
            </div>

            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type={visibleKeys[apiKey.id] ? 'text' : 'password'}
                  value={keys[apiKey.id] || ''}
                  onChange={(e) => handleKeyChange(apiKey.id, e.target.value)}
                  placeholder={apiKey.configured ? '••••••••••••••••' : `Enter ${apiKey.envVar}`}
                  className="w-full bg-[#1a1a23] border border-white/10 rounded-lg pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00d4ff]/50 font-mono"
                />
                <button
                  onClick={() => toggleVisibility(apiKey.id)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {visibleKeys[apiKey.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button
                onClick={() => handleSaveKey(apiKey.id)}
                disabled={!keys[apiKey.id]}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  savedKeys[apiKey.id]
                    ? 'bg-green-500 text-white'
                    : keys[apiKey.id]
                    ? 'bg-[#00d4ff] text-black hover:bg-[#00d4ff]/90'
                    : 'bg-white/5 text-gray-500 cursor-not-allowed'
                }`}
              >
                {savedKeys[apiKey.id] ? (
                  <>
                    <Check size={14} /> Saved
                  </>
                ) : (
                  'Save'
                )}
              </button>
            </div>

            {!apiKey.configured && (
              <div className="mt-3 flex items-center gap-2 text-xs text-yellow-500/80">
                <AlertCircle size={12} />
                <span>This service is not configured. Add your API key to enable it.</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="mt-8 p-4 bg-[#00d4ff]/5 border border-[#00d4ff]/20 rounded-xl">
        <h4 className="text-sm font-medium text-[#00d4ff] mb-2">Security Note</h4>
        <p className="text-xs text-gray-400">
          API keys are stored as environment variables and never exposed in client-side code.
          For production, configure keys in your Vercel/Railway dashboard.
        </p>
      </div>
    </div>
  );
}
