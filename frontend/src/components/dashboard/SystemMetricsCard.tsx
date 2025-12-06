import { useState, useEffect } from 'react';
import { Cpu, HardDrive, Activity, Zap } from 'lucide-react';

interface SystemMetrics {
  cpu_load: number;
  memory_percent: number;
  memory_used_gb: number;
  disk_percent: number;
  disk_used_gb: number;
  optimization_level: number;
  active_processes: number;
}

const API_URL = import.meta.env.VITE_API_URL || 'https://web-production-16fdb.up.railway.app';

export default function SystemMetricsCard() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(`${API_URL}/api/system/status`);
        if (!response.ok) throw new Error('Failed to fetch metrics');
        const data = await response.json();
        setMetrics(data.metrics);
        setError(null);
      } catch (err) {
        setError('Unable to connect to backend');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border border-white/5 bg-[#0a0a0f] p-6 animate-pulse">
        <div className="h-6 bg-white/10 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-20 bg-white/5 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-[#0a0a0f] p-6">
        <div className="text-red-400 text-sm">{error}</div>
      </div>
    );
  }

  const metricCards = [
    {
      label: 'CPU Load',
      value: `${metrics?.cpu_load?.toFixed(1)}%`,
      icon: Cpu,
      color: metrics?.cpu_load! > 80 ? 'text-red-400' : metrics?.cpu_load! > 50 ? 'text-yellow-400' : 'text-green-400',
      progress: metrics?.cpu_load || 0,
    },
    {
      label: 'Memory',
      value: `${metrics?.memory_used_gb?.toFixed(1)} GB`,
      subtext: `${metrics?.memory_percent?.toFixed(0)}%`,
      icon: Activity,
      color: metrics?.memory_percent! > 80 ? 'text-red-400' : metrics?.memory_percent! > 50 ? 'text-yellow-400' : 'text-green-400',
      progress: metrics?.memory_percent || 0,
    },
    {
      label: 'Storage',
      value: `${metrics?.disk_used_gb?.toFixed(0)} GB`,
      subtext: `${metrics?.disk_percent?.toFixed(0)}%`,
      icon: HardDrive,
      color: metrics?.disk_percent! > 80 ? 'text-red-400' : metrics?.disk_percent! > 50 ? 'text-yellow-400' : 'text-cyan-400',
      progress: metrics?.disk_percent || 0,
    },
    {
      label: 'Optimization',
      value: `${metrics?.optimization_level?.toFixed(0)}%`,
      subtext: `${metrics?.active_processes} procs`,
      icon: Zap,
      color: 'text-[#00d4ff]',
      progress: metrics?.optimization_level || 0,
    },
  ];

  return (
    <div className="rounded-xl border border-white/5 bg-[#0a0a0f] p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Activity className="text-[#00d4ff]" size={20} />
          System Status
        </h3>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span className="text-xs text-gray-500">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {metricCards.map((card) => (
          <div
            key={card.label}
            className="bg-[#1a1a23] rounded-lg p-4 border border-white/5 hover:border-[#00d4ff]/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 uppercase tracking-wider">{card.label}</span>
              <card.icon className={card.color} size={16} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold ${card.color}`}>{card.value}</span>
              {card.subtext && (
                <span className="text-xs text-gray-500">{card.subtext}</span>
              )}
            </div>
            <div className="mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  card.progress > 80 ? 'bg-red-500' : card.progress > 50 ? 'bg-yellow-500' : 'bg-[#00d4ff]'
                }`}
                style={{ width: `${Math.min(100, card.progress)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
