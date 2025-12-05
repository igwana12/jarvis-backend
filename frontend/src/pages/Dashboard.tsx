import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useWorkspaceStore } from '../stores/workspaceStore';
import { getRecentVideos, getDrafts, getCurrentCosts } from '../services/api';

export function Dashboard() {
  const { metrics, availableModels, setPage } = useWorkspaceStore();
  const [recentVideos, setRecentVideos] = useState<any[]>([]);
  const [drafts, setDrafts] = useState<any[]>([]);
  const [costs, setCosts] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [videosRes, draftsRes, costsRes] = await Promise.all([
          getRecentVideos(),
          getDrafts(),
          getCurrentCosts(),
        ]);
        setRecentVideos(videosRes.videos || []);
        setDrafts(draftsRes.drafts || []);
        setCosts(costsRes);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };
    loadData();
  }, []);

  const configuredModels = availableModels.filter(m => m.isAvailable);
  const pendingModels = availableModels.filter(m => !m.isAvailable);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-text-secondary">System overview and quick actions</p>
        </div>
        <button
          onClick={() => setPage('home')}
          className="px-4 py-2 text-sm text-text-secondary hover:text-accent border border-border rounded-lg hover:border-accent transition-colors"
        >
          Back to Mission Control
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <motion.div
          className="p-4 bg-bg-secondary rounded-lg border border-border"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-3xl font-bold text-accent">{configuredModels.length}</div>
          <div className="text-sm text-text-secondary">Active Models</div>
        </motion.div>
        <motion.div
          className="p-4 bg-bg-secondary rounded-lg border border-border"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-3xl font-bold text-accent">{pendingModels.length}</div>
          <div className="text-sm text-text-secondary">Pending Setup</div>
        </motion.div>
        <motion.div
          className="p-4 bg-bg-secondary rounded-lg border border-border"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-3xl font-bold text-accent">{recentVideos.length}</div>
          <div className="text-sm text-text-secondary">Videos Generated</div>
        </motion.div>
        <motion.div
          className="p-4 bg-bg-secondary rounded-lg border border-border"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-3xl font-bold text-accent">${costs?.total_cost?.toFixed(4) || '0.00'}</div>
          <div className="text-sm text-text-secondary">Total Cost</div>
        </motion.div>
      </div>

      {/* System Metrics */}
      {metrics && (
        <div className="p-4 bg-bg-secondary rounded-lg border border-border">
          <h2 className="text-lg font-semibold text-text-primary mb-4">System Health</h2>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-text-secondary mb-1">CPU Load</div>
              <div className="h-2 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent"
                  style={{ width: `${metrics.cpu_load}%` }}
                />
              </div>
              <div className="text-xs text-text-secondary mt-1">{metrics.cpu_load.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-sm text-text-secondary mb-1">Memory</div>
              <div className="h-2 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent"
                  style={{ width: `${metrics.memory_percent}%` }}
                />
              </div>
              <div className="text-xs text-text-secondary mt-1">{metrics.memory_percent.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-sm text-text-secondary mb-1">Disk</div>
              <div className="h-2 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent"
                  style={{ width: `${metrics.disk_percent}%` }}
                />
              </div>
              <div className="text-xs text-text-secondary mt-1">{metrics.disk_percent.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-sm text-text-secondary mb-1">Optimization</div>
              <div className="h-2 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-neon-green"
                  style={{ width: `${metrics.optimization_level}%` }}
                />
              </div>
              <div className="text-xs text-text-secondary mt-1">{metrics.optimization_level.toFixed(1)}%</div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-bg-secondary rounded-lg border border-border">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Recent Videos</h2>
          {recentVideos.length > 0 ? (
            <div className="space-y-2">
              {recentVideos.slice(0, 5).map((video, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-text-primary">{video.title}</span>
                  <span className="text-accent">${video.cost?.toFixed(4)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-secondary text-sm">No videos generated yet</p>
          )}
        </div>

        <div className="p-4 bg-bg-secondary rounded-lg border border-border">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Recent Drafts</h2>
          {drafts.length > 0 ? (
            <div className="space-y-2">
              {drafts.slice(0, 5).map((draft, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-text-primary truncate max-w-[200px]">
                    {draft.content?.substring(0, 50)}...
                  </span>
                  <span className="text-text-secondary">{draft.word_count} words</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-secondary text-sm">No drafts saved yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
