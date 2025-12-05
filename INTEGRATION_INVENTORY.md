# JARVIS Integration Inventory

**Last Updated**: 2025-12-05
**Status**: Discovery Complete from Phase 3
**Discovery Source**: /Volumes/AI_WORKSPACE (macOS)

---

## Summary Statistics

| Category | Count | Status |
|----------|-------|--------|
| AI Services | 9 | Configured |
| Anthropic Skills | 21 | Discovered |
| Sacred Circuits Tools | 300+ | Mapped |
| Council API Agents | 37 | Documented |

---

## Configured AI Services

### Text Generation
| Service | API Key Env Var | Status | Context Window | Notes |
|---------|-----------------|--------|----------------|-------|
| OpenAI GPT-4 | `OPENAI_API_KEY` | ✅ Configured | 128k | Primary text generation |
| Google Gemini Pro | `GOOGLE_AI_STUDIO_API_KEY` | ✅ Configured | 1M | Default in frontend |
| Anthropic Claude | `ANTHROPIC_API_KEY` | ✅ Configured | 200k | Claude Sonnet/Opus |
| Mistral Large | `MISTRAL_API_KEY` | ⏳ Available | 256k | Not yet connected |
| Grok 2 (xAI) | `XAI_API_KEY` | ⏳ Available | 128k | Not yet connected |

### Image Generation
| Service | API Key Env Var | Status | Notes |
|---------|-----------------|--------|-------|
| DALL-E 3 | `OPENAI_API_KEY` | ✅ Configured | Shares key with GPT-4 |
| Leonardo AI | `LEONARDO_API_KEY` | ✅ Configured | High-quality artistic images |
| Midjourney | `MIDJOURNEY_API_KEY` | ✅ Configured | Via proxy service |
| Stable Diffusion | `STABILITY_API_KEY` | ✅ Configured | Via Stability AI |
| Flux | `REPLICATE_API_TOKEN` | ✅ Configured | Via Replicate |
| Ideogram | `IDEOGRAM_API_KEY` | ⏳ Available | Text-in-image specialty |

### Voice & Speech
| Service | API Key Env Var | Status | Type | Notes |
|---------|-----------------|--------|------|-------|
| ElevenLabs | `ELEVENLABS_API_KEY` | ✅ Configured | TTS | Premium voice synthesis |
| OpenAI Whisper | `OPENAI_API_KEY` | ✅ Configured | STT | Speech transcription |
| Play.ht | `PLAYHT_API_KEY` | ⏳ Available | TTS | Alternative TTS |
| Murf AI | `MURF_API_KEY` | ⏳ Available | TTS | Studio-quality voices |

### Video Generation
| Service | API Key Env Var | Status | Notes |
|---------|-----------------|--------|-------|
| RunwayML | `RUNWAY_API_KEY` | ✅ Configured | Gen-2 video generation |
| Pika | `PIKA_API_KEY` | ⏳ Available | Quick video clips |
| HeyGen | `HEYGEN_API_KEY` | ⏳ Available | Avatar videos |
| Synthesia | `SYNTHESIA_API_KEY` | ⏳ Available | AI presenter videos |

### Audio & Music
| Service | API Key Env Var | Status | Notes |
|---------|-----------------|--------|-------|
| Suno | `SUNO_API_KEY` | ⏳ Available | AI music generation |
| Udio | `UDIO_API_KEY` | ⏳ Available | AI music generation |

### Automation Platforms
| Service | API Key Env Var | Status | Notes |
|---------|-----------------|--------|-------|
| Replicate | `REPLICATE_API_TOKEN` | ✅ Configured | Model hosting/API |
| Hugging Face | `HUGGINGFACE_API_KEY` | ✅ Configured | Model hub access |

---

## Sacred Circuits Tools (300+)

### 7 Pillars Structure

#### 1. Story Pillar
| Tool | Description | Mode |
|------|-------------|------|
| Premise Builder | Create story premises | Storytelling |
| Character Arc Designer | Map character journeys | Storytelling |
| Theme Weaver | Integrate thematic elements | Storytelling |
| Plot Structure Generator | Generate plot frameworks | Storytelling |
| Dialogue Enhancer | Polish dialogue | Storytelling |
| World Builder | Create story worlds | Storytelling |
| Conflict Escalator | Build tension | Storytelling |
| Resolution Crafter | Write satisfying endings | Storytelling |

#### 2. Visual Pillar
| Tool | Description | Mode |
|------|-------------|------|
| Storyboard Generator | Create visual storyboards | Filmmaking |
| Shot Composer | Plan camera shots | Filmmaking |
| Color Palette Designer | Design color schemes | Filmmaking |
| Lighting Planner | Plan lighting setups | Filmmaking |
| Visual Effects Designer | Plan VFX sequences | Filmmaking |
| Gwenn Magic Prompt | Midjourney prompt generator | Image |
| Leonardo Styler | Leonardo AI styling | Image |
| Flux Enhancer | Flux model prompts | Image |

#### 3. Audio Pillar
| Tool | Description | Mode |
|------|-------------|------|
| Voice Cloner | Clone voice profiles | Podcast/Audiobook |
| Sound Designer | Create soundscapes | Soundscape |
| Music Composer | Generate music | Soundscape |
| SFX Generator | Create sound effects | Soundscape |
| Audio Mixer | Mix audio tracks | Soundscape |
| Podcast Editor | Edit podcast audio | Podcast |
| Audiobook Narrator | Generate narration | Audiobook |

#### 4. Production Pillar
| Tool | Description | Mode |
|------|-------------|------|
| Script Formatter | Format screenplays | Filmmaking |
| Shot List Generator | Create shot lists | Filmmaking |
| Call Sheet Creator | Generate call sheets | Filmmaking |
| Budget Calculator | Estimate costs | Multi |
| Schedule Builder | Plan production schedule | Multi |
| Location Scout | Find locations | Filmmaking |
| Casting Assistant | Suggest casting | Filmmaking |

#### 5. Distribution Pillar
| Tool | Description | Mode |
|------|-------------|------|
| Platform Optimizer | Optimize for platforms | Multi |
| Thumbnail Generator | Create thumbnails | Multi |
| Description Writer | Write descriptions | Multi |
| Tag Generator | Generate tags | Multi |
| Schedule Publisher | Schedule posts | Multi |
| Analytics Tracker | Track performance | Multi |

#### 6. Enhancement Pillar
| Tool | Description | Mode |
|------|-------------|------|
| Mythic Structure | Apply mythic framework | Storytelling |
| Hero's Journey | Map hero's journey | Storytelling |
| Save the Cat | Beat sheet generator | Storytelling |
| Three Act Structure | Structure stories | Storytelling |
| Condenser | Condense text | Multi |
| Expander | Expand concepts | Multi |
| Style Transfer | Apply writing styles | Multi |

#### 7. Integration Pillar
| Tool | Description | Mode |
|------|-------------|------|
| API Connector | Connect to APIs | Multi |
| Workflow Builder | Build workflows | Multi |
| Data Transformer | Transform data | Multi |
| Export Manager | Manage exports | Multi |
| Import Handler | Handle imports | Multi |
| Sync Manager | Sync across tools | Multi |

---

## Anthropic Skills Library (21 Skills)

| Skill | Category | Description |
|-------|----------|-------------|
| code_review | Development | Code review and suggestions |
| documentation | Development | Generate documentation |
| refactoring | Development | Refactor code |
| testing | Development | Generate tests |
| debugging | Development | Debug issues |
| content_writing | Content | Write marketing content |
| blog_posts | Content | Generate blog posts |
| social_media | Content | Social media content |
| email_writing | Content | Professional emails |
| creative_writing | Creative | Fiction/creative content |
| poetry | Creative | Generate poetry |
| storytelling | Creative | Story generation |
| research | Analysis | Research assistance |
| summarization | Analysis | Summarize content |
| data_analysis | Analysis | Analyze data |
| translation | Language | Translate content |
| grammar | Language | Grammar checking |
| style_editing | Language | Style improvements |
| brainstorming | Ideation | Generate ideas |
| problem_solving | Ideation | Solve problems |
| planning | Ideation | Plan projects |

---

## Council API Agents (37 Agents)

### Creative Council
| Agent | Role | Specialty |
|-------|------|-----------|
| Narrative Master | Story Architect | Plot and structure |
| Character Designer | Character Expert | Character development |
| Dialogue Coach | Dialogue Specialist | Natural conversation |
| World Builder | Setting Expert | World creation |
| Theme Analyst | Thematic Expert | Theme integration |

### Production Council
| Agent | Role | Specialty |
|-------|------|-----------|
| Director | Creative Lead | Overall vision |
| Cinematographer | Visual Expert | Camera and lighting |
| Editor | Post-Production | Editing and pacing |
| Sound Designer | Audio Expert | Sound and music |
| VFX Supervisor | Effects Expert | Visual effects |

### Technical Council
| Agent | Role | Specialty |
|-------|------|-----------|
| Code Architect | Tech Lead | System design |
| API Specialist | Integration Expert | API connections |
| Data Engineer | Data Expert | Data handling |
| Security Analyst | Security Expert | Security review |
| Performance Optimizer | Optimization Expert | Performance tuning |

### Business Council
| Agent | Role | Specialty |
|-------|------|-----------|
| Marketing Strategist | Marketing Lead | Marketing plans |
| Content Strategist | Content Lead | Content planning |
| Analytics Expert | Data Analyst | Performance analysis |
| Distribution Manager | Distribution Lead | Platform optimization |
| Monetization Expert | Revenue Expert | Revenue strategy |

### Research Council
| Agent | Role | Specialty |
|-------|------|-----------|
| Fact Checker | Accuracy Expert | Fact verification |
| Trend Analyst | Trends Expert | Trend analysis |
| Audience Researcher | Audience Expert | Audience insights |
| Competitive Analyst | Competition Expert | Competitive analysis |
| Industry Expert | Domain Expert | Industry knowledge |

*(Additional agents available for specialized tasks)*

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

## Frontend Model Configuration

The frontend (`/frontend/src/stores/workspaceStore.ts`) includes these models:

### Text Models
| Model | Provider | Context | Status |
|-------|----------|---------|--------|
| Gemini Pro | Google | 1M | ✅ Available |
| Claude Sonnet | Anthropic | 200k | ✅ Available |
| GPT-4 | OpenAI | 128k | ✅ Available |
| Grok 2 | xAI | 128k | ⏳ Pending API |
| Mistral Large | Mistral | 256k | ⏳ Pending API |

### Image Models
| Model | Provider | Status |
|-------|----------|--------|
| DALL-E 3 | OpenAI | ✅ Available |
| Midjourney | Midjourney | ✅ Available |
| Leonardo AI | Leonardo | ✅ Available |
| Stable Diffusion | Stability AI | ✅ Available |
| Flux | Replicate | ✅ Available |

### Voice Models
| Model | Provider | Type | Status |
|-------|----------|------|--------|
| ElevenLabs | ElevenLabs | TTS | ✅ Available |
| Whisper | OpenAI | STT | ✅ Available |

---

## Environment Variables Required

```bash
# Text Generation
OPENAI_API_KEY=sk-...
GOOGLE_AI_STUDIO_API_KEY=...
ANTHROPIC_API_KEY=sk-ant-...

# Image Generation
STABILITY_API_KEY=sk-...
LEONARDO_API_KEY=...
MIDJOURNEY_API_KEY=...
REPLICATE_API_TOKEN=r8_...

# Voice
ELEVENLABS_API_KEY=...

# Video
RUNWAY_API_KEY=...

# Automation
HUGGINGFACE_API_KEY=hf_...
```

---

## Next Steps

1. **Backend**: Configure all API keys in Railway environment variables
2. **Frontend**: Connect tools to backend endpoints
3. **Testing**: Test each integration end-to-end
4. **Documentation**: Add usage examples for each tool
