import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useWorkspaceStore } from '../../stores/workspaceStore';
import { getSystemStatus } from '../../services/api';
import { wsService } from '../../services/websocket';

export function StatusBar() {
  const { metrics, setMetrics, isConnected, setConnected } = useWorkspaceStore();
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    // Fetch initial metrics
    const fetchMetrics = async () => {
      try {
        const status = await getSystemStatus();
        setMetrics(status.metrics);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000); // Refresh every 10s

    // Set up WebSocket connection
    wsService.connect();
    const unsubConnection = wsService.onConnectionChange(setConnected);
    const unsubMetrics = wsService.onMetrics((m) => {
      setMetrics(m);
      setLastUpdate(new Date());
    });

    return () => {
      clearInterval(interval);
      unsubConnection();
      unsubMetrics();
      wsService.disconnect();
    };
  }, [setMetrics, setConnected]);

  const getStatusColor = (value: number, thresholds: [number, number]) => {
    if (value < thresholds[0]) return 'text-green-400';
    if (value < thresholds[1]) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="flex items-center gap-6 px-4 py-2 bg-bg-secondary border-t border-border text-xs">
      {/* Connection status */}
      <div className="flex items-center gap-2">
        <motion.div
          className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}
          animate={isConnected ? { scale: [1, 1.2, 1] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
        />
        <span className="text-text-secondary">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-4 bg-border" />

      {/* Metrics */}
      {metrics ? (
        <>
          <div className="flex items-center gap-2">
            <span className="text-text-secondary">CPU:</span>
            <span className={getStatusColor(metrics.cpu_load, [50, 80])}>
              {metrics.cpu_load.toFixed(1)}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-text-secondary">RAM:</span>
            <span className={getStatusColor(metrics.memory_percent, [60, 85])}>
              {metrics.memory_used_gb.toFixed(1)}GB ({metrics.memory_percent.toFixed(0)}%)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-text-secondary">Disk:</span>
            <span className={getStatusColor(metrics.disk_percent, [70, 90])}>
              {metrics.disk_percent.toFixed(0)}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-text-secondary">Optimization:</span>
            <span className="text-accent">
              {metrics.optimization_level.toFixed(0)}%
            </span>
          </div>
        </>
      ) : (
        <span className="text-text-secondary">Loading metrics...</span>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Last update */}
      <span className="text-text-secondary">
        Last update: {lastUpdate.toLocaleTimeString()}
      </span>

      {/* Backend indicator */}
      <div className="flex items-center gap-2 px-2 py-1 bg-bg-primary rounded">
        <span className="text-text-secondary">Backend:</span>
        <span className="text-accent font-mono">Railway</span>
      </div>
    </div>
  );
}

export default StatusBar;
