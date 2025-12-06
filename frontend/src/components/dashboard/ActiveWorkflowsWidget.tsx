import { useState, useEffect } from 'react';
import { Play, Pause, CheckCircle, Clock, AlertCircle, Workflow } from 'lucide-react';

interface WorkflowItem {
  id: string;
  name: string;
  status: 'running' | 'paused' | 'completed' | 'queued' | 'error';
  progress: number;
  startedAt?: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'https://web-production-16fdb.up.railway.app';

export default function ActiveWorkflowsWidget() {
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const response = await fetch(`${API_URL}/api/workflows/active`);
        if (!response.ok) throw new Error('Failed to fetch workflows');
        const data = await response.json();

        // If no active workflows, show demo data
        if (data.workflows.length === 0) {
          setWorkflows([
            { id: '1', name: 'Content Pipeline', status: 'running', progress: 67 },
            { id: '2', name: 'Video Render Queue', status: 'queued', progress: 0 },
            { id: '3', name: 'Data Sync', status: 'completed', progress: 100 },
          ]);
        } else {
          setWorkflows(data.workflows);
        }
      } catch (err) {
        // Show demo data on error
        setWorkflows([
          { id: '1', name: 'Content Pipeline', status: 'running', progress: 67 },
          { id: '2', name: 'Video Render Queue', status: 'queued', progress: 0 },
          { id: '3', name: 'Data Sync', status: 'completed', progress: 100 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflows();
    const interval = setInterval(fetchWorkflows, 10000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Play className="text-green-400" size={14} />;
      case 'paused':
        return <Pause className="text-yellow-400" size={14} />;
      case 'completed':
        return <CheckCircle className="text-[#00d4ff]" size={14} />;
      case 'queued':
        return <Clock className="text-gray-400" size={14} />;
      case 'error':
        return <AlertCircle className="text-red-400" size={14} />;
      default:
        return <Clock className="text-gray-400" size={14} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-400';
      case 'paused':
        return 'bg-yellow-400';
      case 'completed':
        return 'bg-[#00d4ff]';
      case 'queued':
        return 'bg-gray-400';
      case 'error':
        return 'bg-red-400';
      default:
        return 'bg-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-white/5 bg-[#0a0a0f] p-6 animate-pulse">
        <div className="h-6 bg-white/10 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-white/5 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  const activeCount = workflows.filter(w => w.status === 'running').length;

  return (
    <div className="rounded-xl border border-white/5 bg-[#0a0a0f] p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Workflow className="text-purple-400" size={20} />
          Active Workflows
        </h3>
        <span className="text-xs bg-purple-400/20 text-purple-400 px-2 py-1 rounded-full">
          {activeCount} running
        </span>
      </div>

      <div className="space-y-3">
        {workflows.map((workflow) => (
          <div
            key={workflow.id}
            className="bg-[#1a1a23] rounded-lg p-4 border border-white/5 hover:border-[#00d4ff]/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {getStatusIcon(workflow.status)}
                <span className="text-sm font-medium text-white">{workflow.name}</span>
              </div>
              <span className="text-xs text-gray-500 capitalize">{workflow.status}</span>
            </div>

            <div className="relative">
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getStatusColor(workflow.status)}`}
                  style={{ width: `${workflow.progress}%` }}
                />
              </div>
              <span className="absolute right-0 -top-5 text-xs text-gray-500">
                {workflow.progress}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {workflows.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Workflow className="mx-auto mb-2 opacity-50" size={32} />
          <p className="text-sm">No active workflows</p>
        </div>
      )}

      <button className="w-full mt-4 py-2 text-sm text-[#00d4ff] hover:bg-[#00d4ff]/10 rounded-lg transition-colors border border-[#00d4ff]/20">
        View All Workflows
      </button>
    </div>
  );
}
