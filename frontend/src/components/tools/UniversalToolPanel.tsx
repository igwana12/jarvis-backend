import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkspaceStore } from '../../stores/workspaceStore';

interface ToolOutput {
  id: string;
  type: 'text' | 'image' | 'audio' | 'video';
  content: string;
  timestamp: string;
}

export function UniversalToolPanel() {
  const { selectedTool, selectTool, isToolPanelOpen } = useWorkspaceStore();
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [outputs, setOutputs] = useState<ToolOutput[]>([]);

  if (!selectedTool || !isToolPanelOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;

    setIsProcessing(true);
    setProgress(0);
    setLogs([`Starting ${selectedTool.name}...`]);

    // Simulate processing with progress updates
    for (let i = 1; i <= 10; i++) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setProgress(i * 10);
      setLogs((prev) => [...prev, `Processing step ${i}/10...`]);
    }

    // Add output
    setOutputs((prev) => [
      {
        id: Date.now().toString(),
        type: 'text',
        content: `Generated output for: "${inputValue}"`,
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);

    setLogs((prev) => [...prev, 'Complete!']);
    setIsProcessing(false);
    setInputValue('');
  };

  const handleClose = () => {
    selectTool(null);
  };

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
          className="bg-bg-secondary rounded-xl border border-border w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selectedTool.icon}</span>
              <div>
                <h2 className="text-lg font-semibold text-text-primary">
                  {selectedTool.name}
                </h2>
                <p className="text-sm text-text-secondary">
                  {selectedTool.description}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-primary rounded-lg transition-colors"
              aria-label="Close panel"
            >
              ✕
            </button>
          </div>

          {/* Three-column layout */}
          <div className="flex-1 grid grid-cols-3 divide-x divide-border overflow-hidden">
            {/* Input Section */}
            <div className="flex flex-col p-4 overflow-y-auto">
              <h3 className="text-sm font-medium text-accent mb-4">
                📥 Input
              </h3>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label
                    htmlFor="toolInput"
                    className="block text-sm text-text-secondary mb-2"
                  >
                    Enter your prompt or input
                  </label>
                  <textarea
                    id="toolInput"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Describe what you want to create..."
                    className="w-full h-32 px-4 py-3 bg-bg-primary border border-border rounded-lg
                      text-text-primary placeholder-text-secondary resize-none
                      focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                    disabled={isProcessing}
                  />
                </div>

                {/* Configuration options */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-text-secondary mb-2">
                      Output Format
                    </label>
                    <select
                      className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg
                        text-text-primary focus:outline-none focus:border-accent"
                      disabled={isProcessing}
                    >
                      <option>Markdown</option>
                      <option>Plain Text</option>
                      <option>JSON</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-text-secondary mb-2">
                      Quality
                    </label>
                    <div className="flex gap-2">
                      {['Draft', 'Standard', 'Premium'].map((quality) => (
                        <button
                          key={quality}
                          type="button"
                          className="flex-1 px-3 py-2 bg-bg-primary border border-border rounded-lg
                            text-text-secondary hover:text-text-primary hover:border-accent/50
                            focus:outline-none focus:border-accent transition-colors"
                          disabled={isProcessing}
                        >
                          {quality}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!inputValue.trim() || isProcessing}
                  className="mt-auto px-4 py-3 bg-accent text-bg-primary font-medium rounded-lg
                    hover:bg-accent-dim disabled:opacity-50 disabled:cursor-not-allowed
                    transition-colors"
                >
                  {isProcessing ? 'Processing...' : 'Generate'}
                </button>
              </form>
            </div>

            {/* Progress Section */}
            <div className="flex flex-col p-4 overflow-y-auto bg-bg-primary/30">
              <h3 className="text-sm font-medium text-accent mb-4">
                ⚡ Progress
              </h3>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-text-secondary mb-2">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                    style={{ boxShadow: '0 0 10px rgba(0, 255, 0, 0.5)' }}
                  />
                </div>
              </div>

              {/* Status */}
              <div className="mb-4 p-3 bg-bg-primary rounded-lg border border-border">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isProcessing ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'
                    }`}
                  />
                  <span className="text-sm text-text-primary">
                    {isProcessing ? 'Processing...' : 'Ready'}
                  </span>
                </div>
              </div>

              {/* Logs */}
              <div className="flex-1 flex flex-col">
                <span className="text-xs text-text-secondary mb-2">Logs</span>
                <div className="flex-1 bg-bg-primary rounded-lg border border-border p-3 font-mono text-xs overflow-y-auto">
                  {logs.length > 0 ? (
                    logs.map((log, index) => (
                      <div
                        key={index}
                        className="text-text-secondary py-0.5"
                      >
                        <span className="text-accent">[{new Date().toLocaleTimeString()}]</span>{' '}
                        {log}
                      </div>
                    ))
                  ) : (
                    <span className="text-text-secondary">
                      Waiting for input...
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Output Section */}
            <div className="flex flex-col p-4 overflow-y-auto">
              <h3 className="text-sm font-medium text-accent mb-4">
                📤 Output
              </h3>

              {outputs.length > 0 ? (
                <div className="space-y-4">
                  {outputs.map((output) => (
                    <motion.div
                      key={output.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-bg-primary rounded-lg border border-border"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs text-text-secondary">
                          {new Date(output.timestamp).toLocaleString()}
                        </span>
                        <div className="flex gap-2">
                          <button
                            className="px-2 py-1 text-xs text-text-secondary hover:text-accent
                              bg-bg-secondary rounded transition-colors"
                            onClick={() => navigator.clipboard.writeText(output.content)}
                          >
                            Copy
                          </button>
                          <button
                            className="px-2 py-1 text-xs text-text-secondary hover:text-accent
                              bg-bg-secondary rounded transition-colors"
                          >
                            Download
                          </button>
                        </div>
                      </div>
                      <div className="text-text-primary text-sm whitespace-pre-wrap">
                        {output.content}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <span className="text-4xl mb-3">📭</span>
                  <p className="text-text-secondary">
                    No outputs yet.
                  </p>
                  <p className="text-text-secondary text-sm">
                    Submit an input to generate results.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default UniversalToolPanel;
