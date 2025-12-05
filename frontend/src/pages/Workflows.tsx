import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useWorkspaceStore } from '../stores/workspaceStore';
import { getWorkflows, executeWorkflow } from '../services/api';
import type { Workflow } from '../types';

export function Workflows() {
  const { setPage } = useWorkspaceStore();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWorkflows = async () => {
      try {
        const res = await getWorkflows();
        setWorkflows(res.workflows || []);
      } catch (error) {
        console.error('Failed to load workflows:', error);
      } finally {
        setLoading(false);
      }
    };
    loadWorkflows();
  }, []);

  const handleExecute = async (workflowId: string) => {
    try {
      await executeWorkflow(workflowId);
      alert(`Workflow ${workflowId} started!`);
    } catch (error) {
      console.error('Failed to execute workflow:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Workflows</h1>
          <p className="text-text-secondary">Manage and execute automation workflows</p>
        </div>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 text-sm bg-accent text-bg-primary font-medium rounded-lg hover:bg-accent-dim transition-colors"
          >
            + New Workflow
          </button>
          <button
            onClick={() => setPage('home')}
            className="px-4 py-2 text-sm text-text-secondary hover:text-accent border border-border rounded-lg hover:border-accent transition-colors"
          >
            Back
          </button>
        </div>
      </div>

      {/* Workflows List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-text-secondary">Loading workflows...</div>
        </div>
      ) : workflows.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {workflows.map((workflow) => (
            <motion.div
              key={workflow.id}
              className="p-4 bg-bg-secondary rounded-lg border border-border hover:border-accent/50 transition-colors"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-text-primary">{workflow.name}</h3>
                <span className="text-xs text-text-secondary bg-bg-primary px-2 py-1 rounded">
                  {workflow.steps} steps
                </span>
              </div>
              <p className="text-sm text-text-secondary mb-4">{workflow.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-text-secondary">Created: {workflow.created}</span>
                <button
                  onClick={() => handleExecute(workflow.id)}
                  className="px-3 py-1 text-sm bg-accent/20 text-accent rounded hover:bg-accent/30 transition-colors"
                >
                  Execute
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-bg-secondary rounded-lg border border-border">
          <span className="text-4xl mb-4">🔄</span>
          <h3 className="text-lg font-semibold text-text-primary mb-2">No Workflows Yet</h3>
          <p className="text-text-secondary text-sm mb-4">Create your first automation workflow</p>
          <button className="px-4 py-2 bg-accent text-bg-primary font-medium rounded-lg">
            Create Workflow
          </button>
        </div>
      )}

      {/* Preset Workflows */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Preset Workflows</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { name: 'Story to Video', icon: '📖➡️🎬', description: 'Convert a story into a video' },
            { name: 'Podcast Episode', icon: '🎙️', description: 'Full podcast production pipeline' },
            { name: 'Content Repurpose', icon: '♻️', description: 'Turn one piece into multiple formats' },
            { name: 'Image Generation Batch', icon: '🖼️', description: 'Generate multiple images' },
            { name: 'Audiobook Creation', icon: '📚🔊', description: 'Text to audiobook' },
            { name: 'Social Media Pack', icon: '📱', description: 'Create content for all platforms' },
          ].map((preset) => (
            <motion.button
              key={preset.name}
              className="p-4 bg-bg-secondary rounded-lg border border-border text-left hover:border-accent/50 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-2xl mb-2">{preset.icon}</div>
              <div className="font-medium text-text-primary">{preset.name}</div>
              <div className="text-xs text-text-secondary">{preset.description}</div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Workflows;
