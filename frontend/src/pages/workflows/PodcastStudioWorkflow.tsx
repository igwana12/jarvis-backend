import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWorkspaceStore } from '../../stores/workspaceStore';

export function PodcastStudioWorkflow() {
  const { setPage, addMessage } = useWorkspaceStore();
  const [isGenerating, setIsGenerating] = useState(false);

  // Form state
  const [episodeTitle, setEpisodeTitle] = useState('');
  const [episodeTopic, setEpisodeTopic] = useState('');
  const [format, setFormat] = useState('interview');
  const [duration, setDuration] = useState('30');
  const [hostVoice, setHostVoice] = useState('professional-male');
  const [guestVoice, setGuestVoice] = useState('friendly-female');
  const [music, setMusic] = useState('upbeat');
  const [includeIntro, setIncludeIntro] = useState(true);
  const [includeOutro, setIncludeOutro] = useState(true);
  const [transcriptFormat, setTranscriptFormat] = useState('timestamped');

  const handleGenerate = async () => {
    if (!episodeTitle || !episodeTopic) {
      addMessage({
        id: `podcast-error-${Date.now()}`,
        timestamp: new Date().toISOString(),
        source: 'PODCAST_STUDIO',
        message: 'Please provide episode title and topic',
        level: 'error',
      });
      return;
    }

    setIsGenerating(true);
    addMessage({
      id: `podcast-start-${Date.now()}`,
      timestamp: new Date().toISOString(),
      source: 'PODCAST_STUDIO',
      message: `Generating podcast: ${episodeTitle}`,
      level: 'info',
    });

    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      addMessage({
        id: `podcast-success-${Date.now()}`,
        timestamp: new Date().toISOString(),
        source: 'PODCAST_STUDIO',
        message: 'Podcast episode generated successfully!',
        level: 'success',
      });
    }, 3000);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">🎙️ Podcast Studio</h1>
          <p className="text-text-secondary">Create full podcast episodes with AI voices</p>
        </div>
        <button
          onClick={() => setPage('workflows')}
          className="px-4 py-2 text-sm text-text-secondary hover:text-accent border border-border rounded-lg hover:border-accent transition-colors"
        >
          ← Back to Workflows
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="col-span-2 space-y-6">
          {/* Episode Info */}
          <motion.div
            className="p-6 bg-bg-secondary rounded-lg border border-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-lg font-semibold text-text-primary mb-4">Episode Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Episode Title *
                </label>
                <input
                  type="text"
                  value={episodeTitle}
                  onChange={(e) => setEpisodeTitle(e.target.value)}
                  placeholder="Episode 1: The Future of AI"
                  className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Topic / Script *
                </label>
                <textarea
                  value={episodeTopic}
                  onChange={(e) => setEpisodeTopic(e.target.value)}
                  placeholder="Describe your episode topic or paste your script..."
                  rows={6}
                  className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:border-accent focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Format
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
                  >
                    <option value="interview">Interview</option>
                    <option value="solo">Solo Commentary</option>
                    <option value="co-hosted">Co-Hosted Discussion</option>
                    <option value="panel">Panel Discussion</option>
                    <option value="narrative">Narrative Story</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Duration (minutes)
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Voice Settings */}
          <motion.div
            className="p-6 bg-bg-secondary rounded-lg border border-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-lg font-semibold text-text-primary mb-4">Voice Settings</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Host Voice
                </label>
                <select
                  value={hostVoice}
                  onChange={(e) => setHostVoice(e.target.value)}
                  className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
                >
                  <option value="professional-male">Professional Male</option>
                  <option value="professional-female">Professional Female</option>
                  <option value="casual-male">Casual Male</option>
                  <option value="casual-female">Casual Female</option>
                  <option value="energetic-male">Energetic Male</option>
                  <option value="energetic-female">Energetic Female</option>
                  <option value="warm-male">Warm & Friendly Male</option>
                  <option value="warm-female">Warm & Friendly Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Guest Voice
                </label>
                <select
                  value={guestVoice}
                  onChange={(e) => setGuestVoice(e.target.value)}
                  className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
                >
                  <option value="friendly-female">Friendly Female</option>
                  <option value="friendly-male">Friendly Male</option>
                  <option value="expert-male">Expert Male</option>
                  <option value="expert-female">Expert Female</option>
                  <option value="young-male">Young Enthusiastic Male</option>
                  <option value="young-female">Young Enthusiastic Female</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Production Settings */}
          <motion.div
            className="p-6 bg-bg-secondary rounded-lg border border-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-lg font-semibold text-text-primary mb-4">Production Settings</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Background Music
                </label>
                <select
                  value={music}
                  onChange={(e) => setMusic(e.target.value)}
                  className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
                >
                  <option value="upbeat">Upbeat & Energetic</option>
                  <option value="chill">Chill & Relaxed</option>
                  <option value="corporate">Corporate Professional</option>
                  <option value="ambient">Ambient Atmospheric</option>
                  <option value="none">No Music</option>
                </select>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeIntro}
                    onChange={(e) => setIncludeIntro(e.target.checked)}
                    className="w-5 h-5 accent-accent"
                  />
                  <span className="text-sm text-text-secondary">Include Intro</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeOutro}
                    onChange={(e) => setIncludeOutro(e.target.checked)}
                    className="w-5 h-5 accent-accent"
                  />
                  <span className="text-sm text-text-secondary">Include Outro</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Transcript Format
                </label>
                <select
                  value={transcriptFormat}
                  onChange={(e) => setTranscriptFormat(e.target.value)}
                  className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
                >
                  <option value="timestamped">Timestamped</option>
                  <option value="speaker-labeled">Speaker Labeled</option>
                  <option value="plain">Plain Text</option>
                  <option value="srt">SRT Subtitles</option>
                </select>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Preview & Actions */}
        <div className="space-y-6">
          {/* Settings Summary */}
          <motion.div
            className="p-6 bg-bg-secondary rounded-lg border border-accent"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3 className="text-lg font-semibold text-text-primary mb-4">Episode Preview</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Format:</span>
                <span className="text-accent">{format}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Duration:</span>
                <span className="text-accent">{duration} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Host Voice:</span>
                <span className="text-accent text-xs">{hostVoice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Guest Voice:</span>
                <span className="text-accent text-xs">{guestVoice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Music:</span>
                <span className="text-accent">{music}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Intro/Outro:</span>
                <span className="text-accent">{includeIntro && includeOutro ? 'Both' : includeIntro ? 'Intro only' : includeOutro ? 'Outro only' : 'None'}</span>
              </div>
            </div>
          </motion.div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !episodeTitle || !episodeTopic}
            className="w-full px-6 py-4 bg-accent text-bg-primary font-bold text-lg rounded-lg hover:bg-accent-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⚙️</span>
                Generating...
              </span>
            ) : (
              '🎙️ Generate Podcast'
            )}
          </button>

          {/* Quick Templates */}
          <motion.div
            className="p-4 bg-bg-secondary rounded-lg border border-border"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-sm font-semibold text-text-primary mb-3">Templates</h3>
            <div className="space-y-2">
              <button className="w-full px-3 py-2 text-sm bg-bg-primary text-text-secondary rounded hover:text-accent hover:border-accent border border-border transition-colors text-left">
                🎤 Tech Interview
              </button>
              <button className="w-full px-3 py-2 text-sm bg-bg-primary text-text-secondary rounded hover:text-accent hover:border-accent border border-border transition-colors text-left">
                📰 News Commentary
              </button>
              <button className="w-full px-3 py-2 text-sm bg-bg-primary text-text-secondary rounded hover:text-accent hover:border-accent border border-border transition-colors text-left">
                🧠 Educational
              </button>
              <button className="w-full px-3 py-2 text-sm bg-bg-primary text-text-secondary rounded hover:text-accent hover:border-accent border border-border transition-colors text-left">
                📖 Story Narration
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default PodcastStudioWorkflow;
