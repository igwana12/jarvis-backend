import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWorkspaceStore } from '../../stores/workspaceStore';

export function TradingDashboardWorkflow() {
  const { setPage, addMessage } = useWorkspaceStore();
  const [isGenerating, setIsGenerating] = useState(false);

  // Form state
  const [dashboardName, setDashboardName] = useState('');
  const [markets, setMarkets] = useState<string[]>(['crypto']);
  const [timeframe, setTimeframe] = useState('1h');
  const [indicators, setIndicators] = useState<string[]>(['rsi', 'macd']);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [autoTrade, setAutoTrade] = useState(false);
  const [riskLevel, setRiskLevel] = useState('medium');
  const [theme, setTheme] = useState('dark');

  const handleGenerate = async () => {
    if (!dashboardName) {
      addMessage({
        id: `trading-error-${Date.now()}`,
        timestamp: new Date().toISOString(),
        source: 'TRADING_DASHBOARD',
        message: 'Please provide a dashboard name',
        level: 'error',
      });
      return;
    }

    setIsGenerating(true);
    addMessage({
      id: `trading-start-${Date.now()}`,
      timestamp: new Date().toISOString(),
      source: 'TRADING_DASHBOARD',
      message: `Creating dashboard: ${dashboardName}`,
      level: 'info',
    });

    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      addMessage({
        id: `trading-success-${Date.now()}`,
        timestamp: new Date().toISOString(),
        source: 'TRADING_DASHBOARD',
        message: 'Trading dashboard created successfully!',
        level: 'success',
      });
    }, 2500);
  };

  const toggleMarket = (market: string) => {
    setMarkets(prev =>
      prev.includes(market)
        ? prev.filter(m => m !== market)
        : [...prev, market]
    );
  };

  const toggleIndicator = (indicator: string) => {
    setIndicators(prev =>
      prev.includes(indicator)
        ? prev.filter(i => i !== indicator)
        : [...prev, indicator]
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">📊 Trading Dashboard</h1>
          <p className="text-text-secondary">Configure your custom trading analytics dashboard</p>
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
          {/* Basic Settings */}
          <motion.div
            className="p-6 bg-bg-secondary rounded-lg border border-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-lg font-semibold text-text-primary mb-4">Dashboard Settings</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Dashboard Name *
                </label>
                <input
                  type="text"
                  value={dashboardName}
                  onChange={(e) => setDashboardName(e.target.value)}
                  placeholder="My Trading Dashboard"
                  className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Timeframe
                  </label>
                  <select
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
                  >
                    <option value="1m">1 Minute</option>
                    <option value="5m">5 Minutes</option>
                    <option value="15m">15 Minutes</option>
                    <option value="1h">1 Hour</option>
                    <option value="4h">4 Hours</option>
                    <option value="1d">1 Day</option>
                    <option value="1w">1 Week</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Risk Level
                  </label>
                  <select
                    value={riskLevel}
                    onChange={(e) => setRiskLevel(e.target.value)}
                    className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
                  >
                    <option value="conservative">Conservative</option>
                    <option value="medium">Medium</option>
                    <option value="aggressive">Aggressive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Markets to Track
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['crypto', 'stocks', 'forex', 'commodities', 'futures', 'options'].map(market => (
                    <button
                      key={market}
                      onClick={() => toggleMarket(market)}
                      className={`px-3 py-2 text-sm rounded transition-colors ${
                        markets.includes(market)
                          ? 'bg-accent text-bg-primary'
                          : 'bg-bg-primary text-text-secondary border border-border hover:border-accent'
                      }`}
                    >
                      {market.charAt(0).toUpperCase() + market.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Technical Indicators */}
          <motion.div
            className="p-6 bg-bg-secondary rounded-lg border border-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-lg font-semibold text-text-primary mb-4">Technical Indicators</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Select Indicators to Display
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'rsi', name: 'RSI' },
                    { id: 'macd', name: 'MACD' },
                    { id: 'bollinger', name: 'Bollinger Bands' },
                    { id: 'ema', name: 'EMA' },
                    { id: 'sma', name: 'SMA' },
                    { id: 'stochastic', name: 'Stochastic' },
                    { id: 'fibonacci', name: 'Fibonacci' },
                    { id: 'volume', name: 'Volume' },
                  ].map(indicator => (
                    <button
                      key={indicator.id}
                      onClick={() => toggleIndicator(indicator.id)}
                      className={`px-3 py-2 text-sm rounded transition-colors ${
                        indicators.includes(indicator.id)
                          ? 'bg-accent text-bg-primary'
                          : 'bg-bg-primary text-text-secondary border border-border hover:border-accent'
                      }`}
                    >
                      {indicator.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Advanced Features */}
          <motion.div
            className="p-6 bg-bg-secondary rounded-lg border border-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-lg font-semibold text-text-primary mb-4">Advanced Features</h2>

            <div className="space-y-4">
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={alertsEnabled}
                    onChange={(e) => setAlertsEnabled(e.target.checked)}
                    className="w-5 h-5 accent-accent"
                  />
                  <span className="text-sm text-text-secondary">Price Alerts</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={autoTrade}
                    onChange={(e) => setAutoTrade(e.target.checked)}
                    className="w-5 h-5 accent-accent"
                  />
                  <span className="text-sm text-text-secondary">Auto Trading (⚠️ Risky)</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Dashboard Theme
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
                >
                  <option value="dark">Dark Mode</option>
                  <option value="light">Light Mode</option>
                  <option value="midnight">Midnight</option>
                  <option value="forest">Forest Green</option>
                  <option value="ocean">Ocean Blue</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  API Key (Optional for Live Data)
                </label>
                <input
                  type="password"
                  placeholder="Enter exchange API key..."
                  className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:border-accent focus:outline-none"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Preview & Actions */}
        <div className="space-y-6">
          {/* Configuration Summary */}
          <motion.div
            className="p-6 bg-bg-secondary rounded-lg border border-accent"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3 className="text-lg font-semibold text-text-primary mb-4">Dashboard Preview</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Timeframe:</span>
                <span className="text-accent">{timeframe}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Markets:</span>
                <span className="text-accent">{markets.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Indicators:</span>
                <span className="text-accent">{indicators.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Risk Level:</span>
                <span className="text-accent">{riskLevel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Alerts:</span>
                <span className="text-accent">{alertsEnabled ? 'On' : 'Off'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Auto Trade:</span>
                <span className={autoTrade ? 'text-red-500' : 'text-accent'}>
                  {autoTrade ? '⚠️ On' : 'Off'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !dashboardName}
            className="w-full px-6 py-4 bg-accent text-bg-primary font-bold text-lg rounded-lg hover:bg-accent-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⚙️</span>
                Creating Dashboard...
              </span>
            ) : (
              '📊 Create Dashboard'
            )}
          </button>

          {/* Quick Presets */}
          <motion.div
            className="p-4 bg-bg-secondary rounded-lg border border-border"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-sm font-semibold text-text-primary mb-3">Quick Setups</h3>
            <div className="space-y-2">
              <button className="w-full px-3 py-2 text-sm bg-bg-primary text-text-secondary rounded hover:text-accent hover:border-accent border border-border transition-colors text-left">
                🚀 Day Trader
              </button>
              <button className="w-full px-3 py-2 text-sm bg-bg-primary text-text-secondary rounded hover:text-accent hover:border-accent border border-border transition-colors text-left">
                📈 Swing Trader
              </button>
              <button className="w-full px-3 py-2 text-sm bg-bg-primary text-text-secondary rounded hover:text-accent hover:border-accent border border-border transition-colors text-left">
                💎 HODL Portfolio
              </button>
              <button className="w-full px-3 py-2 text-sm bg-bg-primary text-text-secondary rounded hover:text-accent hover:border-accent border border-border transition-colors text-left">
                🤖 Bot Trader
              </button>
            </div>
          </motion.div>

          {/* Warning for Auto Trade */}
          {autoTrade && (
            <motion.div
              className="p-4 bg-red-500/10 border border-red-500 rounded-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p className="text-sm text-red-500 font-medium">
                ⚠️ Auto trading enabled. Only use with funds you can afford to lose.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TradingDashboardWorkflow;
