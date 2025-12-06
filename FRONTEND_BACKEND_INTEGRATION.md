# JARVIS Frontend-Backend Integration Guide

## For: Google AI Studio, Claude Desktop, Claude Code Terminal

**Date:** December 6, 2024
**Status:** Frontend styled, needs backend wiring

---

## Current Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                        │
│                  http://localhost:5173                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │SystemMetrics│  │CostTracker  │  │ModelSelector│         │
│  │    Card     │  │   Widget    │  │  Dropdown   │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                 │
└─────────┼────────────────┼────────────────┼─────────────────┘
          │                │                │
          ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND (Flask)                         │
│          https://web-production-16fdb.up.railway.app         │
│                  (or http://localhost:8000)                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │/api/system/ │  │/api/costs/  │  │/api/models/ │         │
│  │   status    │  │  current    │  │    list     │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

---

## Backend API Endpoints (All Working)

### Base URL
- **Production:** `https://web-production-16fdb.up.railway.app`
- **Local:** `http://localhost:8000`

### 1. System & Health
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/system/status` | GET | CPU, RAM, disk, optimization |
| `/api/metrics/history` | GET | Historical metrics for charts |

### 2. AI Models
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/models/list` | GET | List all available AI models |
| `/api/models/switch` | POST | Switch active model `{model: "claude"}` |

### 3. Workflows
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/workflows/list` | GET | List all workflows |
| `/api/workflows/active` | GET | Currently running workflows |
| `/api/workflows/execute` | POST | Execute workflow `{workflow_id: "..."}` |

### 4. Cost Tracking
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/costs/current` | GET | Current spend breakdown |
| `/api/costs/track` | POST | Track API cost `{category, amount}` |

### 5. Content Generation
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/content/generate` | POST | Generate with AI `{prompt, persona}` |
| `/api/content/save` | POST | Save draft |
| `/api/content/drafts` | GET | Get saved drafts |

### 6. Creative Tools
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/video/generate` | POST | Queue video generation |
| `/api/comic/create` | POST | Queue comic creation |
| `/api/podcast/convert` | POST | Convert to podcast script |
| `/api/tools/mythic` | POST | Apply Hero's Journey structure |

### 7. Knowledge Pipeline (NEW)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/knowledge/upload-document` | POST | Upload PDF/EPUB/TXT |
| `/api/knowledge/analyze-document` | POST | Gemini AI analysis |
| `/api/knowledge/create-note` | POST | Create knowledge note |
| `/api/knowledge/search` | GET | Search notes |
| `/api/knowledge/tags` | GET | Get all tags |

---

## Frontend Components That Need Backend Wiring

### 1. SystemMetricsCard (`src/components/dashboard/SystemMetricsCard.tsx`)
**Status:** ✅ Already connected
**Endpoint:** `GET /api/system/status`
**Refresh:** Every 5 seconds

### 2. CostTrackerWidget (`src/components/dashboard/CostTrackerWidget.tsx`)
**Status:** ✅ Already connected
**Endpoint:** `GET /api/costs/current`
**Refresh:** Every 30 seconds

### 3. ActiveWorkflowsWidget (`src/components/dashboard/ActiveWorkflowsWidget.tsx`)
**Status:** ⚠️ Uses mock data when API returns empty
**Endpoint:** `GET /api/workflows/active`
**Needs:** Real workflow execution tracking

### 4. ModelSelector (`src/components/models/ModelSelector.tsx`)
**Status:** ✅ Connected
**Endpoints:**
- `GET /api/models/list` - Fetch models
- `POST /api/models/switch` - Switch model

### 5. APIKeysTab (`src/components/settings/APIKeysTab.tsx`)
**Status:** ❌ Not connected (UI only)
**Needs:** Backend endpoint to store/retrieve API keys securely

### 6. Creative Tools (Storyboard, Comic, Podcast, Prompts, Trading)
**Status:** ❌ UI only, no backend integration
**Location:** `src/components/tools/specialized/`

---

## What Needs To Be Done

### Priority 1: Wire Up Creative Tools

Each tool in `src/components/tools/specialized/` needs to call the corresponding API:

```typescript
// Example: ComicGeneratorTool.tsx
// Add this import
import { createComic } from '../../../services/api';

// In the generate function:
const handleGenerate = async () => {
  setIsGenerating(true);
  try {
    const response = await fetch(`${API_URL}/api/comic/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: project.title,
        style: selectedStyle,
        panels: project.panels,
      }),
    });
    const data = await response.json();
    // Handle response
  } catch (error) {
    console.error('Failed to create comic:', error);
  } finally {
    setIsGenerating(false);
  }
};
```

### Priority 2: Add WebSocket for Real-Time Updates

```typescript
// src/services/websocket.ts - Already exists, needs to be used

import { useEffect } from 'react';

export function useWebSocket(onMessage: (data: any) => void) {
  useEffect(() => {
    const ws = new WebSocket('wss://web-production-16fdb.up.railway.app/ws');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    return () => ws.close();
  }, [onMessage]);
}
```

### Priority 3: API Keys Management

Create backend endpoint to securely store API keys:

```python
# Backend: Add to unified_backend.py
@app.route('/api/settings/keys', methods=['POST'])
def save_api_key():
    data = request.json
    key_name = data.get('key_name')
    key_value = data.get('key_value')
    # Store securely (environment variable or encrypted storage)
    return jsonify({"status": "saved"})
```

---

## Environment Variables

### Frontend (.env.local)
```
VITE_API_URL=https://web-production-16fdb.up.railway.app
VITE_WS_URL=wss://web-production-16fdb.up.railway.app/ws
VITE_GOOGLE_AI_KEY=AIzaSyBldrc1YfE3Z5JtDtyZh__uVlpOeUhUSIc
```

### Backend (Railway)
```
ALLOWED_ORIGINS=https://jarvis.nikoskatsaounis.com
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=AIzaSy...
PORT=8000
```

---

## File Structure

```
frontend/src/
├── App.tsx                     # Main app with routing
├── index.css                   # Tailwind CSS imports
├── components/
│   ├── auth/
│   │   └── AuthGate.tsx       # Password protection (XXX)
│   ├── dashboard/
│   │   ├── SystemMetricsCard.tsx    # ✅ Connected
│   │   ├── CostTrackerWidget.tsx    # ✅ Connected
│   │   └── ActiveWorkflowsWidget.tsx # ⚠️ Mock data
│   ├── models/
│   │   └── ModelSelector.tsx        # ✅ Connected
│   ├── settings/
│   │   └── APIKeysTab.tsx           # ❌ UI only
│   └── tools/specialized/
│       ├── StoryboardingTool.tsx    # ❌ Needs wiring
│       ├── ComicGeneratorTool.tsx   # ❌ Needs wiring
│       ├── PodcastStudioTool.tsx    # ❌ Needs wiring
│       ├── PromptCrafterTool.tsx    # ❌ Needs wiring
│       └── TradingDashboardTool.tsx # ❌ Needs wiring
├── services/
│   ├── api.ts                  # API client (has functions)
│   ├── googleAI.ts             # Google Gemini integration
│   └── websocket.ts            # WebSocket handler
└── stores/
    └── workspaceStore.ts       # Zustand state management
```

---

## Design System

### Colors
- Background: `#050507` (darkest), `#0a0a0f` (dark), `#1a1a23` (cards)
- Accent: `#00d4ff` (cyan glow)
- Text: `white`, `gray-200`, `gray-400`, `gray-500`

### Components
- Cards: `rounded-xl border border-white/5 bg-[#0a0a0f] p-6`
- Buttons: `px-3 py-1.5 rounded-lg bg-[#00d4ff] text-black`
- Inputs: `bg-[#1a1a23] border border-white/10 rounded-lg`

### Icons
- Use `lucide-react` for all icons
- Emojis for tool indicators

---

## Testing the Connection

### Quick Test from Browser Console:
```javascript
// Open DevTools console at http://localhost:5173

// Test system status
fetch('https://web-production-16fdb.up.railway.app/api/system/status')
  .then(r => r.json())
  .then(console.log)

// Test models list
fetch('https://web-production-16fdb.up.railway.app/api/models/list')
  .then(r => r.json())
  .then(console.log)
```

---

## Coordination Between Tools

| Tool | Role |
|------|------|
| **Claude Code (Terminal)** | Backend changes, API endpoints, git operations |
| **Google AI Studio** | UI components, styling, layout, design tweaks |
| **Claude Desktop** | Documentation, planning, architecture decisions |

### Handoff Format
When passing work between tools, include:
```
## Component: [Name]
## Status: [Complete/In Progress/Needs Work]
## Files Changed: [list]
## API Endpoints Used: [list]
## What's Working: [list]
## What's Broken: [list]
## Next Steps: [specific tasks]
```

---

## Immediate Next Steps

1. **Google AI Studio:** Fix any broken buttons in the dashboard UI
2. **Claude Code:** Wire up the 5 creative tools to their API endpoints
3. **Both:** Add real-time WebSocket updates for workflow status

---

*Document created: December 6, 2024*
*Last commit: acd755d*
