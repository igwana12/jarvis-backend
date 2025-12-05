# JARVIS Integration Inventory

**Last Updated**: 2025-12-05
**Status**: Partial - Awaiting full discovery from local Mac

---

## Currently Configured (Backend)

### Text Generation
| Service | API Key Env Var | Status | Notes |
|---------|-----------------|--------|-------|
| OpenAI GPT-4 | `OPENAI_API_KEY` | ✅ Configured | Used for content generation |
| Google Gemini Pro | `GOOGLE_AI_STUDIO_API_KEY` | ⏳ Pending | Set as default in frontend |
| Anthropic Claude | `ANTHROPIC_API_KEY` | ⏳ Pending | Available in model list |
| Mistral | `MISTRAL_API_KEY` | ⏳ Pending | Available in model list |
| Grok (xAI) | `XAI_API_KEY` | ⏳ Pending | Available in model list |

### Image Generation
| Service | API Key Env Var | Status | Notes |
|---------|-----------------|--------|-------|
| DALL-E 3 | `OPENAI_API_KEY` | ⏳ Pending | Shares key with GPT-4 |
| Midjourney | `MIDJOURNEY_API_KEY` | ❌ Not Set | Needs API proxy |
| Leonardo AI | `LEONARDO_API_KEY` | ❌ Not Set | |
| Stable Diffusion | `STABILITY_API_KEY` | ❌ Not Set | |
| Ideogram | `IDEOGRAM_API_KEY` | ❌ Not Set | |
| Flux | `REPLICATE_API_TOKEN` | ❌ Not Set | Via Replicate |

### Voice & Speech
| Service | API Key Env Var | Status | Notes |
|---------|-----------------|--------|-------|
| ElevenLabs | `ELEVENLABS_API_KEY` | ❌ Not Set | Text-to-speech |
| OpenAI Whisper | `OPENAI_API_KEY` | ⏳ Pending | Speech-to-text |
| Play.ht | `PLAYHT_API_KEY` | ❌ Not Set | |
| Murf AI | `MURF_API_KEY` | ❌ Not Set | |

### Video Generation
| Service | API Key Env Var | Status | Notes |
|---------|-----------------|--------|-------|
| Runway | `RUNWAY_API_KEY` | ❌ Not Set | |
| Pika | `PIKA_API_KEY` | ❌ Not Set | |
| HeyGen | `HEYGEN_API_KEY` | ❌ Not Set | |
| Synthesia | `SYNTHESIA_API_KEY` | ❌ Not Set | |

### Audio & Music
| Service | API Key Env Var | Status | Notes |
|---------|-----------------|--------|-------|
| Suno | `SUNO_API_KEY` | ❌ Not Set | Music generation |
| Udio | `UDIO_API_KEY` | ❌ Not Set | Music generation |

---

## Pending Discovery (Local Mac)

The following need to be discovered from `/Volumes/AI_WORKSPACE`:

### Voice-to-Text Tools
- [ ] Proprietary software for podcast transcription
- [ ] Local Whisper installation
- [ ] Other speech recognition tools

### Sound Effects Libraries
- [ ] Open-source SFX collections
- [ ] Purchased sound effect packs
- [ ] Music libraries

### Sacred Circuits Skills
- [ ] Full inventory of `/Volumes/AI_WORKSPACE/SKILLS_LIBRARY/anthropic-skills/`

### JARVIS Config
- [ ] AI driver configurations from `/Volumes/AI_WORKSPACE/CORE/jarvis/config/`

---

## Backend Endpoints Available

The Flask backend at `https://web-production-16fdb.up.railway.app` provides:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/system/status` | GET | System metrics |
| `/api/models/list` | GET | Available AI models |
| `/api/models/switch` | POST | Switch active model |
| `/api/workflows/list` | GET | List workflows |
| `/api/workflows/execute` | POST | Execute workflow |
| `/api/skills/list` | GET | List skills |
| `/api/content/generate` | POST | Generate content |
| `/api/video/generate` | POST | Generate video |
| `/api/video/essay` | POST | Create video essay |
| `/api/podcast/convert` | POST | Convert to podcast |
| `/api/tools/mythic` | POST | Apply mythic structure |
| `/api/tools/condense` | POST | Condense text |

---

## To Complete This Inventory

Run on local Mac:

```bash
# 1. List all API keys in environment
printenv | grep -iE "(api|key|token)" | sort

# 2. Check AI_WORKSPACE config
cat "/Volumes/AI_WORKSPACE/CORE/jarvis/config/ai_driver_config.json"

# 3. List Sacred Circuits skills
ls "/Volumes/AI_WORKSPACE/SKILLS_LIBRARY/anthropic-skills/"

# 4. Find voice/audio tools
find "/Volumes/AI_WORKSPACE" -iname "*voice*" -o -iname "*whisper*" -o -iname "*speech*" 2>/dev/null

# 5. Find sound effects
find "/Volumes/AI_WORKSPACE" -iname "*sfx*" -o -iname "*sound*" -o -iname "*effect*" 2>/dev/null
```

Then update this file with findings.

---

## Frontend Model Configuration

The frontend (`/frontend/src/stores/workspaceStore.ts`) includes these models:

```typescript
// Text Models
- Gemini Pro (Google) - 1M context
- Claude Sonnet (Anthropic) - 200k context
- GPT-4 (OpenAI) - 128k context
- Grok 2 (xAI) - 128k context
- Mistral Large (Mistral) - 256k context

// Image Models
- DALL-E 3 (OpenAI)
- Midjourney
- Leonardo AI
- Stable Diffusion

// Voice Models
- ElevenLabs (TTS)
- Whisper (STT)
```

Add more models as discovered.
