# JARVIS Mission Control - Backend Integration Specification

## Overview
This document specifies the backend API for the JARVIS Mission Control frontend. Use this spec to build React components that integrate with the Flask backend deployed on Railway.

**Backend URL:** `https://web-production-16fdb.up.railway.app`
**WebSocket:** `wss://web-production-16fdb.up.railway.app/ws`
**Frontend Framework:** React 18 + TypeScript + Vite + Tailwind CSS v4

---

## API Endpoints

### Health & Status

#### `GET /api/health`
Health check endpoint.
```json
{
  "status": "ok",
  "version": "1.0.0",
  "backend": "unified",
  "timestamp": "2024-12-06T10:30:00.000Z"
}
```

#### `GET /api/system/status`
Complete system status including metrics, services, and config.
```json
{
  "metrics": {
    "cpu_load": 23.5,
    "memory_used_gb": 4.2,
    "memory_percent": 52.3,
    "disk_used_gb": 120.5,
    "disk_percent": 45.2,
    "optimization_level": 76.5,
    "active_processes": 145
  },
  "services": {
    "workflow_studio": { "port": 8560, "status": "running" },
    "ultimate_hub": { "port": 8550, "status": "offline" },
    "ai_command_center": { "port": 3000, "status": "running" },
    "backend": { "port": 8000, "status": "running" }
  },
  "antigravity": {
    "antigravity_enabled": true,
    "weightless_mode": true,
    "optimization_level": "maximum",
    "gravity_level": 0.1,
    "performance_boost": 0.9
  },
  "timestamp": "2024-12-06T10:30:00.000Z"
}
```

#### `GET /api/antigravity/status`
V0 Cockpit compatibility endpoint.
```json
{
  "cpu_load": 23.5,
  "memory_used": 4.2,
  "optimization_level": 76.5,
  "active_processes": 145,
  "antigravity_enabled": true,
  "weightless_mode": true,
  "performance_boost": 0.9
}
```

#### `GET /api/metrics/history`
Historical metrics for charts (last 50 data points).
```json
{
  "history": [
    { "timestamp": "...", "cpu": 23.5, "memory": 52.3, "optimization": 76.5 }
  ],
  "count": 50
}
```

---

### AI Models

#### `GET /api/models/list`
Get all available AI models.
```json
{
  "models": [
    { "id": "claude", "name": "Claude Sonnet", "provider": "Anthropic", "icon": "🎭", "contextWindow": "200k", "type": "text" },
    { "id": "grok", "name": "Grok 2", "provider": "xAI", "icon": "🚀", "contextWindow": "128k", "type": "text" },
    { "id": "gemini", "name": "Gemini Pro", "provider": "Google", "icon": "♊", "contextWindow": "1M", "type": "text" },
    { "id": "chatgpt", "name": "ChatGPT 4", "provider": "OpenAI", "icon": "🤖", "contextWindow": "128k", "type": "text" },
    { "id": "mistral", "name": "Mistral Large 3", "provider": "Mistral", "icon": "🇫🇷", "contextWindow": "256k", "type": "text" }
  ],
  "count": 5
}
```

#### `POST /api/models/switch`
Switch active AI model.
```json
// Request
{ "model": "claude" }

// Response
{ "status": "success", "model": "claude", "message": "Switched to claude" }
```

---

### Workflows

#### `GET /api/workflows/list`
Get all saved workflows.
```json
{
  "workflows": [
    { "id": "content-pipeline", "name": "Content Pipeline", "description": "...", "steps": 5, "created": "..." }
  ],
  "count": 1
}
```

#### `GET /api/workflows/<workflow_id>`
Get specific workflow details.

#### `POST /api/workflows/execute`
Execute a workflow.
```json
// Request
{ "workflow_id": "content-pipeline" }

// Response
{ "status": "started", "workflow_id": "content-pipeline", "message": "Workflow execution started" }
```

#### `GET /api/workflows/active`
Get currently running workflows.

---

### Skills

#### `GET /api/skills/list`
Get available automation skills.
```json
{
  "skills": [
    { "id": "video-generator", "name": "Video Generator", "location": "...", "has_docs": true }
  ],
  "count": 21
}
```

---

### Dashboards

#### `GET /api/dashboards/list`
Get all available dashboards.
```json
{
  "dashboards": [
    { "id": "ai-command-center", "name": "AI Command Center", "url": "http://localhost:3000", "vercel_url": "https://jarvis.nikoskatsaounis.com", "status": "running", "type": "react" }
  ],
  "count": 3
}
```

---

### Content Generation

#### `POST /api/content/generate`
Generate AI content with selected persona.
```json
// Request
{
  "prompt": "Write a blog post about AI",
  "persona": "Technical Writer"  // Options: Technical Writer, Creative Storyteller, Academic Researcher, Marketing Copywriter, Journalist, Poet
}

// Response
{
  "generated_content": "...",
  "persona": "Technical Writer",
  "tokens_used": 500,
  "cost": 0.0234
}
```

#### `POST /api/content/save`
Save content draft.
```json
// Request
{ "content": "...", "persona": "Technical Writer" }

// Response
{ "status": "saved", "draft": { "id": 1, "content": "...", "persona": "...", "timestamp": "...", "word_count": 150 } }
```

#### `GET /api/content/drafts`
Get saved drafts (last 10).

---

### Creative Tools

#### `POST /api/tools/mythic`
Apply Hero's Journey structure to content.
```json
// Request
{ "content": "Your story content..." }

// Response
{ "transformed_content": "...", "structure": "Hero's Journey" }
```

#### `POST /api/tools/condense`
Condense text to key points.
```json
// Request
{ "content": "Long article text..." }

// Response
{ "condensed_content": "...", "original_words": 500, "condensed_words": 50 }
```

#### `POST /api/podcast/convert`
Convert article to podcast script.
```json
// Request
{ "content": "Article text..." }

// Response
{ "podcast_script": "...", "estimated_duration": "3 minutes" }
```

#### `POST /api/video/essay`
Create video essay script with scene breakdowns.
```json
// Request
{ "content": "Article text..." }

// Response
{ "video_essay_script": "...", "total_scenes": 4, "estimated_duration": "3:30" }
```

---

### Video Generation

#### `POST /api/video/generate`
Queue video generation.
```json
// Request
{ "description": "A cinematic scene of...", "style": "cinematic" }

// Response
{ "status": "queued", "job_id": "video_123456", "message": "Video generation queued" }
```

#### `GET /api/videos/recent`
Get recent video generation history (last 10).

#### `POST /api/videos/track`
Track video generation with cost calculation.
```json
// Request
{ "title": "My Video", "style": "Cinematic", "duration": 60 }

// Response
{
  "status": "generated",
  "video": { "title": "...", "duration": "1:00", "style": "Cinematic", "timestamp": "...", "cost": 0.22 },
  "cost_breakdown": { "script": 0.03, "images": 0.04, "voice": 0.15, "total": 0.22 }
}
```

---

### Comic Creation

#### `POST /api/comic/create`
Queue comic creation.
```json
// Request
{ "title": "My Comic", "style": "manga", "panels": 6 }

// Response
{ "status": "queued", "job_id": "comic_123456", "message": "Comic creation queued" }
```

---

### Cost Tracking

#### `GET /api/costs/current`
Get current cost breakdown.
```json
{
  "total_cost": 1.2345,
  "breakdown": { "infrastructure": 0.0, "ai_apis": 1.2345, "storage": 0.0 },
  "currency": "USD",
  "period": "current_month"
}
```

#### `POST /api/costs/track`
Track an API cost.
```json
// Request
{ "category": "ai_apis", "amount": 0.05 }

// Response
{ "status": "tracked", "category": "ai_apis", "amount": 0.05, "total_cost": 1.2845 }
```

---

## WebSocket Events

Connect to `wss://web-production-16fdb.up.railway.app/ws`

### Message Format
```typescript
interface WSMessage {
  id: string;
  timestamp: string;
  source: 'SYSTEM' | 'JARVIS' | 'MULTIMEDIA' | 'CREATIVE' | 'ECHO';
  message: string;
  level: 'info' | 'success' | 'warning' | 'error';
  metrics?: SystemMetrics;  // Optional, included in system updates
}
```

### Events Received
- **Connection:** Welcome message on connect
- **Metrics:** System metrics broadcast every 5 seconds
- **Workflow:** Workflow execution status updates
- **Model Switch:** Notifications when model changes

---

## Frontend Architecture

### Existing Components (Already Built)
```
frontend/src/
├── components/
│   ├── auth/AuthGate.tsx          # Password protection (code: XXX)
│   ├── common/Header.tsx          # Top navigation
│   ├── common/StatusBar.tsx       # Bottom status bar
│   ├── navigation/
│   │   ├── WorkspaceModeSelector  # 6 workspace modes
│   │   ├── PipelineStageNavigator # Pipeline stages
│   │   └── ToolPalette.tsx        # Tool sidebar
│   └── tools/
│       ├── UniversalToolPanel.tsx # Generic tool modal
│       └── specialized/
│           ├── StoryboardingTool.tsx
│           ├── ComicGeneratorTool.tsx
│           ├── PodcastStudioTool.tsx
│           ├── PromptCrafterTool.tsx
│           └── TradingDashboardTool.tsx
├── pages/
│   ├── Dashboard.tsx              # Main dashboard
│   ├── Workflows.tsx              # Workflow management
│   ├── Models.tsx                 # AI model selection
│   └── Settings.tsx               # App settings
├── stores/workspaceStore.ts       # Zustand state management
├── services/
│   ├── api.ts                     # API client functions
│   └── websocket.ts               # WebSocket handler
└── data/tools.ts                  # Tool definitions (60+ tools)
```

### Design System
- **Theme:** Cyberpunk dark (bg-primary: #0a0a0f, accent: #00d4ff)
- **Components:** Framer Motion animations
- **State:** Zustand store
- **Styling:** Tailwind CSS v4

### Workspace Modes
1. Storytelling (narrative, scripts)
2. Filmmaking (video, storyboards)
3. Podcast (audio, interviews)
4. Soundscape (music, ambience)
5. Audiobook (narration, chapters)
6. Multi-Platform (cross-format)

### Pipeline Stages
ideate → concept → topic → plan → script → storyboard → create → record → edit → draft → review → refine → mix → master → publish → deploy

---

## Multi-AI Collaboration Protocol

### Division of Work
| AI | Responsibilities |
|----|------------------|
| **Claude (Terminal)** | Backend integration, API calls, state management, complex logic, file operations, git |
| **Google AI Studio** | UI components, styling, animations, layout, visual design, prototyping |

### Handoff Protocol
1. **Spec First:** Share this document with both AIs
2. **Component Contracts:** Define props/interfaces before building
3. **API Types:** Use TypeScript interfaces from `frontend/src/types/index.ts`
4. **State Access:** Both use `useWorkspaceStore()` hook
5. **Naming Convention:** PascalCase components, camelCase functions

### File Ownership
- **Claude owns:** `services/`, `stores/`, `types/`, backend integration
- **Google AI Studio owns:** `components/` UI, `pages/` layouts, CSS
- **Shared:** `App.tsx`, `data/tools.ts`

### Communication Format
When handing off to the other AI, include:
```
## Component: [Name]
## Status: [New/Update/Bug Fix]
## Files Changed: [list]
## Dependencies: [what it needs]
## API Endpoints Used: [list]
## Next Steps: [what the other AI should do]
```

---

## Quick Start for New Components

```typescript
// 1. Import essentials
import { useWorkspaceStore } from '../stores/workspaceStore';
import { motion } from 'framer-motion';

// 2. Access state
const { selectTool, isToolPanelOpen, selectedTool, addMessage } = useWorkspaceStore();

// 3. Check if this tool is open
const isOpen = isToolPanelOpen && selectedTool?.id === 'your-tool-id';

// 4. Make API calls
import { checkHealth, generateContent } from '../services/api';

// 5. Use WebSocket for real-time
import { useWebSocket } from '../services/websocket';
```

---

## Environment Variables

Frontend (`.env`):
```
VITE_API_URL=https://web-production-16fdb.up.railway.app
VITE_WS_URL=wss://web-production-16fdb.up.railway.app/ws
```

Backend (Railway):
```
ALLOWED_ORIGINS=https://jarvis.nikoskatsaounis.com,https://ai-command.nikoskatsaounis.com
OPENAI_API_KEY=sk-...  # For content generation
PORT=8000  # Auto-set by Railway
```

---

## Deployment

- **Frontend:** Vercel at `jarvis.nikoskatsaounis.com`
- **Backend:** Railway at `web-production-16fdb.up.railway.app`
- **Auth:** Password gate with code `XXX`

---

*Last updated: December 6, 2024*
