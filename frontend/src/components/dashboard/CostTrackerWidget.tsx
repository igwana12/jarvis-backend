import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Server, Brain, Database } from 'lucide-react';

interface CostBreakdown {
  total_cost: number;
  breakdown: {
    infrastructure: number;
    ai_apis: number;
    storage: number;
  };
  currency: string;
  period: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'https://web-production-16fdb.up.railway.app';

export default function CostTrackerWidget() {
  const [costs, setCosts] = useState<CostBreakdown | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCosts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/costs/current`);
        if (!response.ok) throw new Error('Failed to fetch costs');
        const data = await response.json();
        setCosts(data);
      } catch (err) {
        // Use mock data if API fails
        setCosts({
          total_cost: 0,
          breakdown: { infrastructure: 0, ai_apis: 0, storage: 0 },
          currency: 'USD',
          period: 'current_month',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCosts();
    const interval = setInterval(fetchCosts, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border border-white/5 bg-[#0a0a0f] p-6 animate-pulse">
        <div className="h-6 bg-white/10 rounded w-1/3 mb-4"></div>
        <div className="h-16 bg-white/5 rounded-lg"></div>
      </div>
    );
  }

  const breakdown = [
    {
      label: 'Infrastructure',
      value: costs?.breakdown.infrastructure || 0,
      icon: Server,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
    },
    {
      label: 'AI APIs',
      value: costs?.breakdown.ai_apis || 0,
      icon: Brain,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
    },
    {
      label: 'Storage',
      value: costs?.breakdown.storage || 0,
      icon: Database,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400/10',
    },
  ];

  const total = costs?.total_cost || 0;

  return (
    <div className="rounded-xl border border-white/5 bg-[#0a0a0f] p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <DollarSign className="text-green-400" size={20} />
          Cost Tracker
        </h3>
        <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">
          {costs?.period === 'current_month' ? 'This Month' : costs?.period}
        </span>
      </div>

      {/* Total Cost */}
      <div className="bg-gradient-to-r from-[#00d4ff]/10 to-transparent rounded-lg p-4 mb-6 border border-[#00d4ff]/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Spend</div>
            <div className="text-3xl font-bold text-white">
              ${total.toFixed(4)}
              <span className="text-sm text-gray-500 ml-2">USD</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#00d4ff]/20 flex items-center justify-center">
            <TrendingUp className="text-[#00d4ff]" size={24} />
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-3">
        {breakdown.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between p-3 bg-[#1a1a23] rounded-lg border border-white/5"
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${item.bgColor} flex items-center justify-center`}>
                <item.icon className={item.color} size={16} />
              </div>
              <span className="text-sm text-gray-400">{item.label}</span>
            </div>
            <span className={`font-mono font-medium ${item.color}`}>
              ${item.value.toFixed(4)}
            </span>
          </div>
        ))}
      </div>

      {/* Budget indicator */}
      <div className="mt-6 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-gray-500">Budget Usage</span>
          <span className="text-gray-400">${total.toFixed(2)} / $100.00</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-[#00d4ff] rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (total / 100) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
