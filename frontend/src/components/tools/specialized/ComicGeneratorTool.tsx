import { useState } from 'react';
import { Loader2, Image, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { MediaAPI } from '../../../services/api';

interface JobStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  result?: {
    panels: string[];
    title: string;
  };
  error?: string;
}

export default function ComicGeneratorTool() {
  const [title, setTitle] = useState('');
  const [style, setStyle] = useState('manga');
  const [panels, setPanels] = useState(['', '', '', '']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const STYLES = [
    { id: 'manga', label: 'Manga', icon: '🎌' },
    { id: 'american', label: 'American', icon: '🦸' },
    { id: 'european', label: 'European', icon: '🎨' },
    { id: 'webcomic', label: 'Webcomic', icon: '💻' },
  ];

  const updatePanel = (index: number, value: string) => {
    const newPanels = [...panels];
    newPanels[index] = value;
    setPanels(newPanels);
  };

  const pollJobStatus = async (jobId: string): Promise<JobStatus> => {
    const MAX_ATTEMPTS = 60; // 2 minutes with 2-second intervals
    const POLL_INTERVAL = 2000;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      try {
        const response = await MediaAPI.getJobStatus(jobId);
        const status = response.data as JobStatus;

        setJobStatus(status);

        if (status.status === 'completed' || status.status === 'failed') {
          return status;
        }

        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
      } catch (err) {
        console.error('Poll error:', err);
        // Continue polling on transient errors
      }
    }

    throw new Error('Job timed out after 2 minutes');
  };

  const handleGenerate = async () => {
    if (!title.trim() || panels.every((p) => !p.trim())) {
      setError('Please provide a title and at least one panel description');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setJobStatus({ status: 'pending' });

    try {
      // Submit the job
      const response = await MediaAPI.createComic({
        title,
        style,
        panels: panels.filter((p) => p.trim()),
      });

      const jobId = response.data.job_id;

      if (!jobId) {
        throw new Error('No job ID returned from server');
      }

      // Poll for completion
      const finalStatus = await pollJobStatus(jobId);

      if (finalStatus.status === 'failed') {
        throw new Error(finalStatus.error || 'Comic generation failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate comic');
      setJobStatus(null);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
          <Image className="text-purple-400" size={20} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Comic Generator</h2>
          <p className="text-sm text-gray-500">Create AI-powered comic panels</p>
        </div>
      </div>

      {/* Title Input */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Comic Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your comic title..."
          className="w-full bg-[#1a1a23] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00d4ff]/50"
          disabled={isGenerating}
        />
      </div>

      {/* Style Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Art Style</label>
        <div className="grid grid-cols-4 gap-2">
          {STYLES.map((s) => (
            <button
              key={s.id}
              onClick={() => setStyle(s.id)}
              disabled={isGenerating}
              className={`p-3 rounded-lg border transition-all ${
                style === s.id
                  ? 'border-[#00d4ff] bg-[#00d4ff]/10 text-[#00d4ff]'
                  : 'border-white/10 bg-[#1a1a23] text-gray-400 hover:border-white/20'
              }`}
            >
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="text-xs">{s.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Panel Descriptions */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Panel Descriptions (up to 4)
        </label>
        <div className="space-y-3">
          {panels.map((panel, index) => (
            <div key={index} className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-lg bg-[#1a1a23] flex items-center justify-center text-sm text-gray-500 shrink-0">
                {index + 1}
              </div>
              <textarea
                value={panel}
                onChange={(e) => updatePanel(index, e.target.value)}
                placeholder={`Describe panel ${index + 1}...`}
                rows={2}
                className="flex-1 bg-[#1a1a23] border border-white/10 rounded-lg px-4 py-2 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#00d4ff]/50 resize-none"
                disabled={isGenerating}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
        >
          <AlertCircle size={16} />
          {error}
        </motion.div>
      )}

      {/* Job Status */}
      {jobStatus && isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-[#1a1a23] rounded-lg border border-white/10"
        >
          <div className="flex items-center gap-3 mb-2">
            {jobStatus.status === 'completed' ? (
              <CheckCircle2 className="text-green-400" size={18} />
            ) : (
              <Loader2 className="text-[#00d4ff] animate-spin" size={18} />
            )}
            <span className="text-sm text-white capitalize">{jobStatus.status}...</span>
          </div>
          {jobStatus.progress !== undefined && (
            <div className="w-full bg-white/5 rounded-full h-2">
              <div
                className="bg-[#00d4ff] h-2 rounded-full transition-all duration-300"
                style={{ width: `${jobStatus.progress}%` }}
              />
            </div>
          )}
        </motion.div>
      )}

      {/* Result Display */}
      {jobStatus?.status === 'completed' && jobStatus.result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
        >
          <div className="flex items-center gap-2 text-green-400 mb-3">
            <CheckCircle2 size={18} />
            <span className="font-medium">Comic Generated!</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {jobStatus.result.panels.map((panelUrl, index) => (
              <div key={index} className="aspect-square bg-[#1a1a23] rounded-lg overflow-hidden">
                <img
                  src={panelUrl}
                  alt={`Panel ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || !title.trim()}
        className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
          isGenerating || !title.trim()
            ? 'bg-white/5 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90'
        }`}
      >
        {isGenerating ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Generating...
          </>
        ) : (
          <>
            <Image size={18} />
            Generate Comic
          </>
        )}
      </button>
    </div>
  );
}
