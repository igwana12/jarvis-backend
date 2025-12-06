import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkspaceStore } from '../../../stores/workspaceStore';

interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  duration: string;
  hosts: string[];
  style: string;
  segments: PodcastSegment[];
  status: 'draft' | 'generating' | 'complete';
  audioUrl?: string;
  transcriptUrl?: string;
  showNotesUrl?: string;
}

interface PodcastSegment {
  id: string;
  type: 'intro' | 'discussion' | 'interview' | 'music' | 'ad' | 'outro';
  title: string;
  duration: string;
  content: string;
  speaker?: string;
  isGenerated?: boolean;
}

const PODCAST_STYLES = [
  { id: 'conversational', name: 'Conversational', icon: '💬', description: 'Casual, friendly discussion format' },
  { id: 'interview', name: 'Interview', icon: '🎤', description: 'Host interviews guest experts' },
  { id: 'storytelling', name: 'Storytelling', icon: '📖', description: 'Narrative-driven content' },
  { id: 'educational', name: 'Educational', icon: '📚', description: 'Informative, teaching focused' },
  { id: 'news', name: 'News & Commentary', icon: '📰', description: 'Current events analysis' },
  { id: 'comedy', name: 'Comedy', icon: '😂', description: 'Humorous, entertainment focused' },
];

const VOICE_OPTIONS = [
  { id: 'rachel', name: 'Rachel', gender: 'female', style: 'warm', icon: '👩' },
  { id: 'drew', name: 'Drew', gender: 'male', style: 'professional', icon: '👨' },
  { id: 'clyde', name: 'Clyde', gender: 'male', style: 'casual', icon: '🧔' },
  { id: 'bella', name: 'Bella', gender: 'female', style: 'energetic', icon: '👧' },
  { id: 'adam', name: 'Adam', gender: 'male', style: 'deep', icon: '🧑' },
  { id: 'domi', name: 'Domi', gender: 'female', style: 'assertive', icon: '👩‍💼' },
];

const SEGMENT_TYPES = [
  { id: 'intro', name: 'Introduction', icon: '🎬', duration: '1-2 min' },
  { id: 'discussion', name: 'Main Discussion', icon: '💬', duration: '5-15 min' },
  { id: 'interview', name: 'Interview Segment', icon: '🎤', duration: '10-20 min' },
  { id: 'music', name: 'Music Break', icon: '🎵', duration: '30 sec' },
  { id: 'ad', name: 'Ad Read', icon: '📢', duration: '1-2 min' },
  { id: 'outro', name: 'Outro', icon: '👋', duration: '1-2 min' },
];

interface PodcastStudioToolProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function PodcastStudioTool({ isOpen: propIsOpen, onClose: propOnClose }: PodcastStudioToolProps = {}) {
  const { selectTool, isToolPanelOpen, selectedTool } = useWorkspaceStore();

  // Support both prop-based and store-based control
  const isOpen = propIsOpen !== undefined ? propIsOpen : (isToolPanelOpen && selectedTool?.id === 'podcast-studio');
  const handleClose = propOnClose || (() => selectTool(null));

  const [episode, setEpisode] = useState<PodcastEpisode | null>(null);
  const [topic, setTopic] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('conversational');
  const [selectedHosts, setSelectedHosts] = useState<string[]>(['rachel', 'drew']);
  const [targetDuration, setTargetDuration] = useState(30);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'setup' | 'script' | 'audio' | 'export'>('setup');
  const [showStyleDropdown, setShowStyleDropdown] = useState(false);
  const styleDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (styleDropdownRef.current && !styleDropdownRef.current.contains(event.target as Node)) {
        setShowStyleDropdown(false);
      }
    };
    if (showStyleDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showStyleDropdown]);

  // Only show if open
  if (!isOpen) {
    return null;
  }

  const generateEpisode = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);

    // Simulate AI generating episode structure
    await new Promise(resolve => setTimeout(resolve, 2500));

    const segments: PodcastSegment[] = [
      {
        id: `seg-${Date.now()}-1`,
        type: 'intro',
        title: 'Welcome & Introduction',
        duration: '2:00',
        content: `Welcome to the show! Today we're discussing: ${topic}`,
        speaker: selectedHosts[0],
      },
      {
        id: `seg-${Date.now()}-2`,
        type: 'discussion',
        title: 'Main Topic Deep Dive',
        duration: `${Math.floor(targetDuration * 0.6)}:00`,
        content: `In-depth discussion about ${topic}...`,
        speaker: 'both',
      },
      {
        id: `seg-${Date.now()}-3`,
        type: 'discussion',
        title: 'Audience Questions',
        duration: `${Math.floor(targetDuration * 0.2)}:00`,
        content: 'Answering questions from our listeners...',
        speaker: selectedHosts[1] || selectedHosts[0],
      },
      {
        id: `seg-${Date.now()}-4`,
        type: 'outro',
        title: 'Wrap-up & Goodbye',
        duration: '2:00',
        content: 'Thanks for listening! Subscribe and leave a review.',
        speaker: selectedHosts[0],
      },
    ];

    setEpisode({
      id: `episode-${Date.now()}`,
      title: topic,
      description: `A ${selectedStyle} podcast episode about ${topic}`,
      duration: `${targetDuration}:00`,
      hosts: selectedHosts,
      style: selectedStyle,
      segments,
      status: 'draft',
    });

    setActiveTab('script');
    setIsGenerating(false);
  };

  const toggleHost = (hostId: string) => {
    if (selectedHosts.includes(hostId)) {
      if (selectedHosts.length > 1) {
        setSelectedHosts(selectedHosts.filter(h => h !== hostId));
      }
    } else {
      setSelectedHosts([...selectedHosts, hostId]);
    }
  };

  const updateSegment = (segmentId: string, updates: Partial<PodcastSegment>) => {
    if (!episode) return;
    setEpisode({
      ...episode,
      segments: episode.segments.map(s =>
        s.id === segmentId ? { ...s, ...updates } : s
      ),
    });
  };

  const addSegment = (type: PodcastSegment['type']) => {
    if (!episode) return;
    const segmentInfo = SEGMENT_TYPES.find(s => s.id === type);
    const newSegment: PodcastSegment = {
      id: `seg-${Date.now()}`,
      type,
      title: segmentInfo?.name || 'New Segment',
      duration: segmentInfo?.duration.split('-')[0] + ':00' || '5:00',
      content: '',
      speaker: selectedHosts[0],
    };
    setEpisode({
      ...episode,
      segments: [...episode.segments, newSegment],
    });
  };

  const removeSegment = (segmentId: string) => {
    if (!episode) return;
    setEpisode({
      ...episode,
      segments: episode.segments.filter(s => s.id !== segmentId),
    });
  };

  const generateAudio = async () => {
    if (!episode) return;
    setEpisode({ ...episode, status: 'generating' });

    // Simulate audio generation
    await new Promise(resolve => setTimeout(resolve, 3000));

    setEpisode({
      ...episode,
      status: 'complete',
      audioUrl: 'https://example.com/audio.mp3',
      transcriptUrl: 'https://example.com/transcript.txt',
      showNotesUrl: 'https://example.com/shownotes.md',
    });

    setActiveTab('export');
  };

  const selectedStyleInfo = PODCAST_STYLES.find(s => s.id === selectedStyle);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          className="bg-bg-secondary rounded-xl border border-border w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎙️</span>
              <div>
                <h2 className="text-lg font-semibold text-text-primary">
                  Podcast Studio
                </h2>
                <p className="text-sm text-text-secondary">
                  Create professional podcasts with AI hosts
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Style Selector */}
              <div className="relative" ref={styleDropdownRef}>
                <button
                  onClick={() => setShowStyleDropdown(!showStyleDropdown)}
                  className="flex items-center gap-2 px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm hover:border-accent/50 transition-colors"
                >
                  <span>{selectedStyleInfo?.icon}</span>
                  <span className="text-text-primary">{selectedStyleInfo?.name}</span>
                  <span className="text-text-secondary text-xs">▼</span>
                </button>

                <AnimatePresence>
                  {showStyleDropdown && (
                    <motion.div
                      className="absolute right-0 top-full mt-2 min-w-[250px] bg-bg-secondary border border-border rounded-lg shadow-lg overflow-hidden z-50"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="px-3 py-2 text-xs text-text-secondary border-b border-border">
                        Podcast Style
                      </div>
                      {PODCAST_STYLES.map(style => (
                        <button
                          key={style.id}
                          onClick={() => {
                            setSelectedStyle(style.id);
                            setShowStyleDropdown(false);
                          }}
                          className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                            selectedStyle === style.id
                              ? 'text-accent bg-accent/10'
                              : 'text-text-primary hover:bg-bg-primary'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{style.icon}</span>
                            <span>{style.name}</span>
                            {selectedStyle === style.id && <span className="ml-auto text-accent text-xs">✓</span>}
                          </div>
                          <p className="text-xs text-text-secondary mt-1 ml-6">{style.description}</p>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={handleClose}
                className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-primary rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border">
            {(['setup', 'script', 'audio', 'export'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-accent border-b-2 border-accent'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
                disabled={tab !== 'setup' && !episode}
              >
                {tab === 'setup' && '📝 Setup'}
                {tab === 'script' && '📜 Script'}
                {tab === 'audio' && '🔊 Audio'}
                {tab === 'export' && '📤 Export'}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'setup' && (
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Topic */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Episode Topic
                  </label>
                  <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="What is this episode about? Include key points you want to cover..."
                    className="w-full h-32 px-4 py-3 bg-bg-primary border border-border rounded-lg text-text-primary placeholder-text-secondary resize-none focus:outline-none focus:border-accent"
                  />
                </div>

                {/* Host Selection */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Select Hosts (AI Voices)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {VOICE_OPTIONS.map(voice => (
                      <button
                        key={voice.id}
                        onClick={() => toggleHost(voice.id)}
                        className={`p-3 rounded-lg border text-left transition-colors ${
                          selectedHosts.includes(voice.id)
                            ? 'border-accent bg-accent/10'
                            : 'border-border hover:border-accent/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{voice.icon}</span>
                          <div>
                            <p className="text-sm font-medium text-text-primary">{voice.name}</p>
                            <p className="text-xs text-text-secondary capitalize">{voice.style}</p>
                          </div>
                          {selectedHosts.includes(voice.id) && (
                            <span className="ml-auto text-accent">✓</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-text-secondary mt-2">
                    Selected: {selectedHosts.map(h => VOICE_OPTIONS.find(v => v.id === h)?.name).join(' & ')}
                  </p>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Target Duration: {targetDuration} minutes
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    step="5"
                    value={targetDuration}
                    onChange={(e) => setTargetDuration(parseInt(e.target.value))}
                    className="w-full accent-accent"
                  />
                  <div className="flex justify-between text-xs text-text-secondary mt-1">
                    <span>10 min</span>
                    <span>60 min</span>
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={generateEpisode}
                  disabled={!topic.trim() || isGenerating}
                  className="w-full px-4 py-3 bg-accent text-bg-primary font-medium rounded-lg hover:bg-accent-dim disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span>
                      Generating Episode Structure...
                    </span>
                  ) : (
                    '🎙️ Generate Episode'
                  )}
                </button>

                {/* Quick Templates */}
                <div>
                  <h3 className="text-sm font-medium text-text-primary mb-3">Quick Templates</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setTopic('The latest developments in AI technology and how they impact everyday life');
                        setSelectedStyle('educational');
                      }}
                      className="text-left p-3 bg-bg-primary border border-border rounded-lg hover:border-accent/50"
                    >
                      <span className="text-lg">🤖</span>
                      <p className="text-sm text-text-primary mt-1">AI Tech Talk</p>
                      <p className="text-xs text-text-secondary">Educational</p>
                    </button>
                    <button
                      onClick={() => {
                        setTopic('Interview with an expert about productivity tips and work-life balance');
                        setSelectedStyle('interview');
                      }}
                      className="text-left p-3 bg-bg-primary border border-border rounded-lg hover:border-accent/50"
                    >
                      <span className="text-lg">💼</span>
                      <p className="text-sm text-text-primary mt-1">Productivity Interview</p>
                      <p className="text-xs text-text-secondary">Interview</p>
                    </button>
                    <button
                      onClick={() => {
                        setTopic('Weekly news roundup: The biggest stories and what they mean');
                        setSelectedStyle('news');
                      }}
                      className="text-left p-3 bg-bg-primary border border-border rounded-lg hover:border-accent/50"
                    >
                      <span className="text-lg">📰</span>
                      <p className="text-sm text-text-primary mt-1">News Roundup</p>
                      <p className="text-xs text-text-secondary">News</p>
                    </button>
                    <button
                      onClick={() => {
                        setTopic('A true crime mystery that shocked the nation');
                        setSelectedStyle('storytelling');
                      }}
                      className="text-left p-3 bg-bg-primary border border-border rounded-lg hover:border-accent/50"
                    >
                      <span className="text-lg">🔍</span>
                      <p className="text-sm text-text-primary mt-1">True Crime Story</p>
                      <p className="text-xs text-text-secondary">Storytelling</p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'script' && episode && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-text-primary">{episode.title}</h3>
                    <p className="text-sm text-text-secondary">
                      {episode.segments.length} segments • {episode.duration}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative group">
                      <button className="px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm text-text-primary hover:border-accent/50">
                        + Add Segment
                      </button>
                      <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-bg-secondary border border-border rounded-lg shadow-lg z-10">
                        {SEGMENT_TYPES.map(type => (
                          <button
                            key={type.id}
                            onClick={() => addSegment(type.id as PodcastSegment['type'])}
                            className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-bg-primary flex items-center gap-2"
                          >
                            <span>{type.icon}</span>
                            <span>{type.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {episode.segments.map((segment, index) => (
                    <motion.div
                      key={segment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-bg-primary border border-border rounded-lg p-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span>{SEGMENT_TYPES.find(t => t.id === segment.type)?.icon}</span>
                            <input
                              type="text"
                              value={segment.title}
                              onChange={(e) => updateSegment(segment.id, { title: e.target.value })}
                              className="flex-1 bg-transparent text-text-primary font-medium focus:outline-none"
                            />
                            <input
                              type="text"
                              value={segment.duration}
                              onChange={(e) => updateSegment(segment.id, { duration: e.target.value })}
                              className="w-16 px-2 py-1 bg-bg-secondary border border-border rounded text-xs text-text-secondary focus:outline-none focus:border-accent text-center"
                            />
                            <select
                              value={segment.speaker || ''}
                              onChange={(e) => updateSegment(segment.id, { speaker: e.target.value })}
                              className="px-2 py-1 bg-bg-secondary border border-border rounded text-xs text-text-primary focus:outline-none focus:border-accent"
                            >
                              {selectedHosts.map(hostId => {
                                const host = VOICE_OPTIONS.find(v => v.id === hostId);
                                return (
                                  <option key={hostId} value={hostId}>{host?.name}</option>
                                );
                              })}
                              <option value="both">Both</option>
                            </select>
                            <button
                              onClick={() => removeSegment(segment.id)}
                              className="p-1 text-red-400 hover:bg-red-400/10 rounded"
                            >
                              ✕
                            </button>
                          </div>
                          <textarea
                            value={segment.content}
                            onChange={(e) => updateSegment(segment.id, { content: e.target.value })}
                            placeholder="Segment script/notes..."
                            className="w-full px-3 py-2 bg-bg-secondary border border-border rounded text-sm text-text-primary resize-none focus:outline-none focus:border-accent"
                            rows={3}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={generateAudio}
                    className="px-6 py-3 bg-accent text-bg-primary font-medium rounded-lg hover:bg-accent-dim transition-colors"
                  >
                    🔊 Generate Audio
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'audio' && episode && (
              <div className="max-w-2xl mx-auto text-center py-12">
                {episode.status === 'generating' ? (
                  <div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="text-6xl mb-4"
                    >
                      🎙️
                    </motion.div>
                    <h3 className="text-xl font-semibold text-text-primary mb-2">
                      Generating Audio...
                    </h3>
                    <p className="text-text-secondary">
                      AI is synthesizing voices and mixing your podcast
                    </p>
                    <div className="mt-6 h-2 bg-border rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-accent"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 10 }}
                      />
                    </div>
                  </div>
                ) : episode.status === 'complete' ? (
                  <div>
                    <span className="text-6xl mb-4 block">✅</span>
                    <h3 className="text-xl font-semibold text-text-primary mb-2">
                      Audio Generated!
                    </h3>
                    <p className="text-text-secondary mb-6">
                      Your podcast is ready for export
                    </p>
                    <button
                      onClick={() => setActiveTab('export')}
                      className="px-6 py-3 bg-accent text-bg-primary font-medium rounded-lg hover:bg-accent-dim transition-colors"
                    >
                      Go to Export →
                    </button>
                  </div>
                ) : (
                  <div>
                    <span className="text-6xl mb-4 block">🎧</span>
                    <h3 className="text-xl font-semibold text-text-primary mb-2">
                      Ready to Generate
                    </h3>
                    <p className="text-text-secondary mb-6">
                      Review your script then generate audio
                    </p>
                    <button
                      onClick={generateAudio}
                      className="px-6 py-3 bg-accent text-bg-primary font-medium rounded-lg hover:bg-accent-dim transition-colors"
                    >
                      🔊 Generate Audio
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'export' && episode && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center mb-8">
                  <span className="text-6xl mb-4 block">🎉</span>
                  <h3 className="text-2xl font-bold text-text-primary">
                    {episode.title}
                  </h3>
                  <p className="text-text-secondary">
                    Your podcast episode is ready!
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 bg-bg-primary border border-border rounded-lg hover:border-accent/50 text-left">
                    <span className="text-2xl">🎵</span>
                    <p className="text-sm font-medium text-text-primary mt-2">Download Audio</p>
                    <p className="text-xs text-text-secondary">MP3 format, {episode.duration}</p>
                  </button>
                  <button className="p-4 bg-bg-primary border border-border rounded-lg hover:border-accent/50 text-left">
                    <span className="text-2xl">📝</span>
                    <p className="text-sm font-medium text-text-primary mt-2">Download Transcript</p>
                    <p className="text-xs text-text-secondary">Full text transcript</p>
                  </button>
                  <button className="p-4 bg-bg-primary border border-border rounded-lg hover:border-accent/50 text-left">
                    <span className="text-2xl">📋</span>
                    <p className="text-sm font-medium text-text-primary mt-2">Show Notes</p>
                    <p className="text-xs text-text-secondary">Markdown format</p>
                  </button>
                  <button className="p-4 bg-bg-primary border border-border rounded-lg hover:border-accent/50 text-left">
                    <span className="text-2xl">🎬</span>
                    <p className="text-sm font-medium text-text-primary mt-2">Video Version</p>
                    <p className="text-xs text-text-secondary">With waveform visualization</p>
                  </button>
                </div>

                <div className="border-t border-border pt-6">
                  <h4 className="text-sm font-medium text-text-primary mb-4">Publish To</h4>
                  <div className="flex gap-3">
                    <button className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      Spotify
                    </button>
                    <button className="flex-1 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                      Apple Podcasts
                    </button>
                    <button className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                      YouTube
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default PodcastStudioTool;
