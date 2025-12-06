import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkspaceStore } from '../../../stores/workspaceStore';
import { trackCost, getCurrentCosts } from '../../../services/api';

interface Asset {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  holdings: number;
  avgCost: number;
}

interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  total: number;
  timestamp: Date;
}

interface AIInsight {
  id: string;
  symbol: string;
  type: 'bullish' | 'bearish' | 'neutral';
  insight: string;
  confidence: number;
}

const INITIAL_PORTFOLIO: Asset[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: 97245.32, change: 2341.56, changePercent: 2.47, volume: '32.4B', marketCap: '1.92T', holdings: 0.5, avgCost: 65000 },
  { symbol: 'ETH', name: 'Ethereum', price: 3654.89, change: -45.23, changePercent: -1.22, volume: '18.7B', marketCap: '439.2B', holdings: 5.2, avgCost: 2800 },
  { symbol: 'SOL', name: 'Solana', price: 234.67, change: 12.45, changePercent: 5.60, volume: '4.2B', marketCap: '111.3B', holdings: 25, avgCost: 150 },
  { symbol: 'NVDA', name: 'NVIDIA', price: 142.56, change: 3.21, changePercent: 2.30, volume: '45.2M', marketCap: '3.51T', holdings: 50, avgCost: 120 },
  { symbol: 'AAPL', name: 'Apple', price: 234.89, change: -1.45, changePercent: -0.61, volume: '52.1M', marketCap: '3.58T', holdings: 30, avgCost: 185 },
  { symbol: 'TSLA', name: 'Tesla', price: 352.67, change: 8.92, changePercent: 2.59, volume: '89.3M', marketCap: '1.13T', holdings: 15, avgCost: 280 },
];

const WATCHLIST_ASSETS: Asset[] = [
  { symbol: 'MSFT', name: 'Microsoft', price: 432.15, change: 5.67, changePercent: 1.33, volume: '22.1M', marketCap: '3.21T', holdings: 0, avgCost: 0 },
  { symbol: 'GOOGL', name: 'Alphabet', price: 175.23, change: -2.34, changePercent: -1.32, volume: '18.5M', marketCap: '2.15T', holdings: 0, avgCost: 0 },
  { symbol: 'AMZN', name: 'Amazon', price: 205.78, change: 4.12, changePercent: 2.04, volume: '35.6M', marketCap: '2.17T', holdings: 0, avgCost: 0 },
  { symbol: 'XRP', name: 'Ripple', price: 2.34, change: 0.15, changePercent: 6.85, volume: '8.9B', marketCap: '134.2B', holdings: 0, avgCost: 0 },
  { symbol: 'DOGE', name: 'Dogecoin', price: 0.42, change: 0.03, changePercent: 7.69, volume: '4.5B', marketCap: '62.1B', holdings: 0, avgCost: 0 },
];

const AI_INSIGHTS: AIInsight[] = [
  { id: '1', symbol: 'BTC', type: 'bullish', insight: 'Institutional adoption continues with ETF inflows reaching $2.4B this week. RSI shows room for continued upside.', confidence: 78 },
  { id: '2', symbol: 'SOL', type: 'bullish', insight: 'Network activity at all-time highs. DeFi TVL growth outpacing competitors. Strong momentum expected.', confidence: 82 },
  { id: '3', symbol: 'ETH', type: 'neutral', insight: 'Layer 2 scaling solutions driving adoption, but near-term pressure from profit-taking. Watch for support at $3,500.', confidence: 65 },
  { id: '4', symbol: 'NVDA', type: 'bullish', insight: 'AI chip demand remains strong. Data center revenue growth exceeds expectations. Maintain position.', confidence: 85 },
  { id: '5', symbol: 'TSLA', type: 'neutral', insight: 'FSD progress impressive but EV competition intensifying. Valuation stretched but momentum traders active.', confidence: 60 },
];

interface TradingDashboardToolProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function TradingDashboardTool({ isOpen: propIsOpen, onClose: propOnClose }: TradingDashboardToolProps = {}) {
  const { selectTool, isToolPanelOpen, selectedTool } = useWorkspaceStore();

  // Support both prop-based and store-based control
  const isOpen = propIsOpen !== undefined ? propIsOpen : (isToolPanelOpen && selectedTool?.id === 'trading-dashboard');
  const handleClose = propOnClose || (() => selectTool(null));

  const [activeTab, setActiveTab] = useState<'portfolio' | 'watchlist' | 'trade' | 'insights'>('portfolio');
  const [portfolio, setPortfolio] = useState<Asset[]>(INITIAL_PORTFOLIO);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [tradeQuantity, setTradeQuantity] = useState('');
  const [showTradeConfirm, setShowTradeConfirm] = useState(false);

  // Fetch current costs on mount
  useEffect(() => {
    if (!isOpen) return;

    const fetchCosts = async () => {
      try {
        const costs = await getCurrentCosts();
        console.log('Current costs:', costs);
      } catch (error) {
        console.error('Failed to fetch costs:', error);
      }
    };
    fetchCosts();
  }, [isOpen]);

  // Simulate real-time price updates
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setPortfolio(prev =>
        prev.map(asset => {
          const priceChange = (Math.random() - 0.5) * asset.price * 0.002;
          const newPrice = asset.price + priceChange;
          const newChange = asset.change + priceChange;
          const newChangePercent = (newChange / (newPrice - newChange)) * 100;
          return {
            ...asset,
            price: newPrice,
            change: newChange,
            changePercent: newChangePercent,
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate portfolio stats
  const totalValue = portfolio.reduce((sum, asset) => sum + asset.price * asset.holdings, 0);
  const totalCost = portfolio.reduce((sum, asset) => sum + asset.avgCost * asset.holdings, 0);
  const totalPnL = totalValue - totalCost;
  const totalPnLPercent = (totalPnL / totalCost) * 100;

  const executeTrade = async () => {
    if (!selectedAsset || !tradeQuantity) return;

    const quantity = parseFloat(tradeQuantity);
    const total = quantity * selectedAsset.price;

    // Track trade cost via backend API
    try {
      await trackCost('trading', total * 0.001); // Track 0.1% trading fee
      console.log('Trade cost tracked successfully');
    } catch (error) {
      console.error('Failed to track trade cost:', error);
    }

    const trade: Trade = {
      id: `trade-${Date.now()}`,
      symbol: selectedAsset.symbol,
      type: tradeType,
      quantity,
      price: selectedAsset.price,
      total,
      timestamp: new Date(),
    };

    setTrades(prev => [trade, ...prev]);

    // Update portfolio
    setPortfolio(prev =>
      prev.map(asset => {
        if (asset.symbol !== selectedAsset.symbol) return asset;
        const newHoldings = tradeType === 'buy'
          ? asset.holdings + quantity
          : Math.max(0, asset.holdings - quantity);
        const newAvgCost = tradeType === 'buy'
          ? ((asset.avgCost * asset.holdings) + (selectedAsset.price * quantity)) / (asset.holdings + quantity)
          : asset.avgCost;
        return { ...asset, holdings: newHoldings, avgCost: newAvgCost };
      })
    );

    setShowTradeConfirm(true);
    setTimeout(() => setShowTradeConfirm(false), 3000);
    setTradeQuantity('');
    setSelectedAsset(null);
    setActiveTab('portfolio');
  };

  const formatCurrency = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1000) return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    return `$${value.toFixed(2)}`;
  };

  const formatPrice = (price: number) => {
    if (price < 1) return `$${price.toFixed(4)}`;
    if (price < 100) return `$${price.toFixed(2)}`;
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-bg-secondary border border-border rounded-xl w-full max-w-7xl max-h-[90vh] overflow-hidden shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-4xl">📈</span>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">Trading Dashboard</h2>
                  <p className="text-text-secondary">Real-time portfolio tracking with AI analysis</p>
                </div>
              </div>

              {/* Portfolio Summary */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-sm text-text-secondary">Portfolio Value</div>
                  <div className="text-2xl font-bold text-text-primary">{formatCurrency(totalValue)}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-text-secondary">Total P&L</div>
                  <div className={`text-xl font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {totalPnL >= 0 ? '+' : ''}{formatCurrency(totalPnL)} ({totalPnLPercent.toFixed(2)}%)
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <span className="text-2xl">✕</span>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mt-6">
              {[
                { id: 'portfolio', label: 'Portfolio', icon: '💼' },
                { id: 'watchlist', label: 'Watchlist', icon: '👁️' },
                { id: 'trade', label: 'Trade', icon: '💱' },
                { id: 'insights', label: 'AI Insights', icon: '🤖' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-accent text-black'
                      : 'bg-white/5 text-text-secondary hover:bg-white/10'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                {/* Asset Table */}
                <div className="bg-bg-primary rounded-lg border border-border overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 text-text-secondary font-medium">Asset</th>
                        <th className="text-right p-4 text-text-secondary font-medium">Price</th>
                        <th className="text-right p-4 text-text-secondary font-medium">24h Change</th>
                        <th className="text-right p-4 text-text-secondary font-medium">Holdings</th>
                        <th className="text-right p-4 text-text-secondary font-medium">Value</th>
                        <th className="text-right p-4 text-text-secondary font-medium">P&L</th>
                        <th className="text-right p-4 text-text-secondary font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolio.map(asset => {
                        const value = asset.price * asset.holdings;
                        const pnl = value - (asset.avgCost * asset.holdings);
                        const pnlPercent = ((asset.price - asset.avgCost) / asset.avgCost) * 100;

                        return (
                          <tr key={asset.symbol} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center font-bold text-accent">
                                  {asset.symbol.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-medium text-text-primary">{asset.symbol}</div>
                                  <div className="text-sm text-text-secondary">{asset.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              <div className="font-mono text-text-primary">{formatPrice(asset.price)}</div>
                            </td>
                            <td className="p-4 text-right">
                              <div className={`font-mono ${asset.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {asset.change >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              <div className="font-mono text-text-primary">{asset.holdings}</div>
                              <div className="text-sm text-text-secondary">@ {formatPrice(asset.avgCost)}</div>
                            </td>
                            <td className="p-4 text-right">
                              <div className="font-mono text-text-primary">{formatCurrency(value)}</div>
                            </td>
                            <td className="p-4 text-right">
                              <div className={`font-mono ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {pnl >= 0 ? '+' : ''}{formatCurrency(pnl)}
                              </div>
                              <div className={`text-sm ${pnl >= 0 ? 'text-green-400/70' : 'text-red-400/70'}`}>
                                {pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex gap-2 justify-end">
                                <button
                                  onClick={() => { setSelectedAsset(asset); setTradeType('buy'); setActiveTab('trade'); }}
                                  className="px-3 py-1 text-sm bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors"
                                >
                                  Buy
                                </button>
                                <button
                                  onClick={() => { setSelectedAsset(asset); setTradeType('sell'); setActiveTab('trade'); }}
                                  className="px-3 py-1 text-sm bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                                >
                                  Sell
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Recent Trades */}
                {trades.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-text-primary mb-3">Recent Trades</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {trades.slice(0, 6).map(trade => (
                        <div key={trade.id} className="bg-bg-primary rounded-lg border border-border p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              trade.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                              {trade.type.toUpperCase()}
                            </span>
                            <span className="text-xs text-text-secondary">
                              {trade.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="font-medium text-text-primary">{trade.symbol}</div>
                          <div className="text-sm text-text-secondary">
                            {trade.quantity} @ {formatPrice(trade.price)}
                          </div>
                          <div className="text-sm font-medium text-text-primary mt-1">
                            Total: {formatCurrency(trade.total)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'watchlist' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-text-primary">Watchlist</h3>
                  <button className="px-4 py-2 bg-white/10 rounded-lg text-text-primary hover:bg-white/20 transition-colors">
                    + Add Asset
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {WATCHLIST_ASSETS.map(asset => (
                    <div key={asset.symbol} className="bg-bg-primary rounded-lg border border-border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center font-bold text-accent text-lg">
                            {asset.symbol.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-text-primary">{asset.symbol}</div>
                            <div className="text-sm text-text-secondary">{asset.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-lg text-text-primary">{formatPrice(asset.price)}</div>
                          <div className={`font-mono text-sm ${asset.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {asset.change >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => { setSelectedAsset(asset); setTradeType('buy'); setActiveTab('trade'); }}
                          className="flex-1 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors text-sm font-medium"
                        >
                          Buy
                        </button>
                        <button className="flex-1 py-2 bg-white/10 text-text-primary rounded-lg hover:bg-white/20 transition-colors text-sm font-medium">
                          Set Alert
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'trade' && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-bg-primary rounded-lg border border-border p-6">
                  <h3 className="text-lg font-medium text-text-primary mb-6">Execute Trade</h3>

                  {/* Asset Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-text-secondary mb-2">Select Asset</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[...portfolio, ...WATCHLIST_ASSETS].slice(0, 9).map(asset => (
                        <button
                          key={asset.symbol}
                          onClick={() => setSelectedAsset(asset)}
                          className={`p-3 rounded-lg border transition-all ${
                            selectedAsset?.symbol === asset.symbol
                              ? 'border-accent bg-accent/10'
                              : 'border-border hover:border-accent/50'
                          }`}
                        >
                          <div className="font-medium text-text-primary">{asset.symbol}</div>
                          <div className="text-sm text-text-secondary">{formatPrice(asset.price)}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedAsset && (
                    <>
                      {/* Trade Type */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-text-secondary mb-2">Trade Type</label>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            onClick={() => setTradeType('buy')}
                            className={`py-3 rounded-lg font-medium transition-all ${
                              tradeType === 'buy'
                                ? 'bg-green-500 text-white'
                                : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            }`}
                          >
                            Buy
                          </button>
                          <button
                            onClick={() => setTradeType('sell')}
                            className={`py-3 rounded-lg font-medium transition-all ${
                              tradeType === 'sell'
                                ? 'bg-red-500 text-white'
                                : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                            }`}
                          >
                            Sell
                          </button>
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-text-secondary mb-2">Quantity</label>
                        <input
                          type="number"
                          value={tradeQuantity}
                          onChange={e => setTradeQuantity(e.target.value)}
                          placeholder="0.00"
                          className="w-full bg-bg-secondary border border-border rounded-lg px-4 py-3 text-text-primary text-lg font-mono focus:outline-none focus:border-accent"
                        />
                        {selectedAsset.holdings > 0 && tradeType === 'sell' && (
                          <div className="text-sm text-text-secondary mt-2">
                            Available: {selectedAsset.holdings} {selectedAsset.symbol}
                          </div>
                        )}
                      </div>

                      {/* Order Summary */}
                      {tradeQuantity && (
                        <div className="bg-bg-secondary rounded-lg p-4 mb-6">
                          <div className="flex justify-between mb-2">
                            <span className="text-text-secondary">Price per unit</span>
                            <span className="text-text-primary font-mono">{formatPrice(selectedAsset.price)}</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-text-secondary">Quantity</span>
                            <span className="text-text-primary font-mono">{tradeQuantity}</span>
                          </div>
                          <div className="border-t border-border my-3"></div>
                          <div className="flex justify-between">
                            <span className="text-text-primary font-medium">Total</span>
                            <span className="text-text-primary font-mono font-bold">
                              {formatCurrency(parseFloat(tradeQuantity) * selectedAsset.price)}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Execute Button */}
                      <button
                        onClick={executeTrade}
                        disabled={!tradeQuantity || parseFloat(tradeQuantity) <= 0}
                        className={`w-full py-4 rounded-lg font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                          tradeType === 'buy'
                            ? 'bg-green-500 hover:bg-green-600 text-white'
                            : 'bg-red-500 hover:bg-red-600 text-white'
                        }`}
                      >
                        {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedAsset.symbol}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'insights' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-text-primary">AI Market Insights</h3>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Live Analysis
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {AI_INSIGHTS.map(insight => (
                    <div key={insight.id} className="bg-bg-primary rounded-lg border border-border p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-text-primary">{insight.symbol}</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            insight.type === 'bullish'
                              ? 'bg-green-500/20 text-green-400'
                              : insight.type === 'bearish'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {insight.type.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-sm text-text-secondary">
                          {insight.confidence}% confidence
                        </div>
                      </div>
                      <p className="text-text-secondary text-sm">{insight.insight}</p>
                      <div className="mt-3">
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              insight.type === 'bullish' ? 'bg-green-500' : insight.type === 'bearish' ? 'bg-red-500' : 'bg-yellow-500'
                            }`}
                            style={{ width: `${insight.confidence}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Market Overview */}
                <div className="bg-bg-primary rounded-lg border border-border p-6">
                  <h4 className="font-medium text-text-primary mb-4">Market Overview</h4>
                  <div className="grid grid-cols-4 gap-6">
                    {[
                      { label: 'Fear & Greed', value: '72', status: 'Greed', color: 'text-green-400' },
                      { label: 'BTC Dominance', value: '54.2%', status: 'Stable', color: 'text-blue-400' },
                      { label: 'Total Market Cap', value: '$3.42T', status: '+2.3%', color: 'text-green-400' },
                      { label: '24h Volume', value: '$142B', status: 'High', color: 'text-yellow-400' },
                    ].map(stat => (
                      <div key={stat.label} className="text-center">
                        <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
                        <div className="text-sm text-text-secondary">{stat.label}</div>
                        <div className={`text-sm ${stat.color}`}>{stat.status}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Trade Confirmation Toast */}
          <AnimatePresence>
            {showTradeConfirm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg font-medium"
              >
                Trade executed successfully!
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
