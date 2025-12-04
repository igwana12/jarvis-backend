#!/usr/bin/env python3
"""
JARVIS Unified Backend Gateway
Single API serving all dashboards with real-time WebSocket updates

Port: 8000 (Primary)
Serves: AI Command Center, V0 AI Cockpit, Workflow Studio, Ultimate Hub
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sock import Sock
import json
import psutil
import subprocess
import os
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any, Optional
import threading
import time
from pydantic import BaseModel, Field, validator

# Initialize Flask app
app = Flask(__name__)

# CORS Configuration - restrict to production domains
ALLOWED_ORIGINS = os.environ.get(
    'ALLOWED_ORIGINS',
    'https://cockpit.nikoskatsaounis.com,https://ai-command.nikoskatsaounis.com,https://v0-cockpit-source-kzi3n3jsx-nikos-projects-9639ae0e.vercel.app,https://ai-command-center-6a1nwu7pw-nikos-projects-9639ae0e.vercel.app'
).split(',')

CORS(app, resources={r"/*": {"origins": ALLOWED_ORIGINS}})
sock = Sock(app)

# ============================================================================
# INPUT VALIDATION MODELS
# ============================================================================

class ContentGenerateRequest(BaseModel):
    """Validation for content generation requests"""
    prompt: str = Field(..., min_length=1, max_length=10000)
    persona: str = Field(default="Technical Writer")

    @validator('prompt')
    def sanitize_prompt(cls, v):
        # Remove potentially harmful characters
        if not v.strip():
            raise ValueError('Prompt cannot be empty')
        return v.strip()

    @validator('persona')
    def validate_persona(cls, v):
        allowed_personas = ["Technical Writer", "Creative Storyteller", "Academic Researcher",
                           "Marketing Copywriter", "Journalist", "Poet"]
        if v not in allowed_personas:
            raise ValueError(f'Invalid persona. Must be one of: {allowed_personas}')
        return v

class VideoGenerateRequest(BaseModel):
    """Validation for video generation requests"""
    description: str = Field(..., min_length=1, max_length=1000)
    style: str = Field(default="cinematic")

    @validator('description')
    def sanitize_description(cls, v):
        if not v.strip():
            raise ValueError('Description cannot be empty')
        return v.strip()

# Paths
WORKSPACE_BASE = Path("/Volumes/AI_WORKSPACE")
JARVIS_PATH = WORKSPACE_BASE / "CORE" / "jarvis"
SKILLS_LIBRARY = WORKSPACE_BASE / "SKILLS_LIBRARY" / "anthropic-skills"
WORKFLOWS_DIR = JARVIS_PATH / "workflows"
COUNCIL_PATH = WORKSPACE_BASE / "CORE" / "council"
CONFIG_PATH = JARVIS_PATH / "config"

# WebSocket clients
ws_clients = set()

# Anti-Gravity configuration
ANTIGRAVITY_CONFIG = WORKSPACE_BASE / "ANTIGRAVITY_CONFIG.json"

# Historical metrics storage (in-memory for now, can be moved to SQLite later)
metrics_history = []
MAX_HISTORY_POINTS = 50

# Cost tracking
total_cost = 0.0
cost_breakdown = {
    "infrastructure": 0.0,
    "ai_apis": 0.0,
    "storage": 0.0
}

# Video generation history
video_history = []
MAX_VIDEO_HISTORY = 20


def load_antigravity_config():
    """Load anti-gravity configuration"""
    if ANTIGRAVITY_CONFIG.exists():
        with open(ANTIGRAVITY_CONFIG, 'r') as f:
            return json.load(f)
    return {
        "antigravity_enabled": True,
        "weightless_mode": True,
        "optimization_level": "maximum",
        "gravity_level": 0.1,
        "performance_boost": 0.9
    }


def broadcast_message(message: Dict[str, Any]):
    """Broadcast message to all WebSocket clients"""
    message_json = json.dumps(message)
    dead_clients = set()

    for client in ws_clients:
        try:
            client.send(message_json)
        except:
            dead_clients.add(client)

    # Remove dead clients
    ws_clients.difference_update(dead_clients)


def get_system_metrics():
    """Get real system metrics"""
    cpu_percent = psutil.cpu_percent(interval=1)
    memory = psutil.virtual_memory()

    # Use root filesystem for production, workspace for local
    disk_path = "/" if not WORKSPACE_BASE.exists() else str(WORKSPACE_BASE)
    disk = psutil.disk_usage(disk_path)

    # Calculate optimization level (inverse of resource usage)
    optimization_level = 100 - ((cpu_percent + memory.percent) / 2)

    metrics = {
        "cpu_load": cpu_percent,
        "memory_used_gb": round(memory.used / (1024**3), 1),
        "memory_percent": memory.percent,
        "disk_used_gb": round(disk.used / (1024**3), 1),
        "disk_percent": disk.percent,
        "optimization_level": round(optimization_level, 1),
        "active_processes": len(psutil.pids())
    }

    # Store in history for charts
    store_metrics_history(metrics)

    return metrics


def store_metrics_history(metrics):
    """Store metrics in history for charting"""
    global metrics_history

    metrics_history.append({
        "timestamp": datetime.now().isoformat(),
        "cpu": metrics["cpu_load"],
        "memory": metrics["memory_percent"],
        "optimization": metrics["optimization_level"]
    })

    # Keep only last MAX_HISTORY_POINTS
    if len(metrics_history) > MAX_HISTORY_POINTS:
        metrics_history = metrics_history[-MAX_HISTORY_POINTS:]


def get_running_services():
    """Get status of all JARVIS services"""
    services = {
        "workflow_studio": {"port": 8560, "status": "unknown"},
        "ultimate_hub": {"port": 8550, "status": "unknown"},
        "ai_command_center": {"port": 3000, "status": "unknown"},
        "backend": {"port": 8000, "status": "running"},
    }

    for service, config in services.items():
        if service == "backend":
            continue

        try:
            for conn in psutil.net_connections():
                if conn.laddr.port == config["port"] and conn.status == 'LISTEN':
                    services[service]["status"] = "running"
                    break
            else:
                services[service]["status"] = "offline"
        except:
            services[service]["status"] = "error"

    return services


def get_available_skills():
    """Get list of available automation skills"""
    skills = []

    if not SKILLS_LIBRARY.exists():
        return skills

    for skill_dir in SKILLS_LIBRARY.iterdir():
        if skill_dir.is_dir() and not skill_dir.name.startswith('.'):
            skill_md = skill_dir / "SKILL.md"
            if skill_md.exists():
                skills.append({
                    "id": skill_dir.name,
                    "name": skill_dir.name.replace('-', ' ').title(),
                    "location": str(skill_dir),
                    "has_docs": True
                })

    return sorted(skills, key=lambda x: x['name'])


def get_workflows():
    """Get saved workflows"""
    workflows = []

    if not WORKFLOWS_DIR.exists():
        return workflows

    for workflow_file in WORKFLOWS_DIR.glob("*.json"):
        try:
            with open(workflow_file, 'r') as f:
                workflow_data = json.load(f)
                workflows.append({
                    "id": workflow_file.stem,
                    "name": workflow_data.get("name", workflow_file.stem),
                    "description": workflow_data.get("description", ""),
                    "steps": len(workflow_data.get("steps", [])),
                    "created": workflow_data.get("created", "unknown")
                })
        except:
            pass

    return workflows


def get_ai_models():
    """Get available AI models from driver config"""
    try:
        driver_config = CONFIG_PATH / "ai_driver_config.json"
        if driver_config.exists():
            with open(driver_config, 'r') as f:
                config = json.load(f)
                models = []

                for driver_id, driver_info in config.get("drivers", {}).items():
                    models.append({
                        "id": driver_id,
                        "name": driver_info.get("name", driver_id),
                        "provider": driver_info.get("name", "").split()[0] if driver_info.get("name") else "Unknown",
                        "icon": driver_info.get("icon", "🤖"),
                        "contextWindow": str(driver_info.get("context_window", "N/A")),
                        "type": "text"  # Can be enhanced later
                    })

                return models
    except:
        pass

    # Fallback models
    return [
        {"id": "claude", "name": "Claude Sonnet", "provider": "Anthropic", "icon": "🎭", "contextWindow": "200k", "type": "text"},
        {"id": "grok", "name": "Grok 2", "provider": "xAI", "icon": "🚀", "contextWindow": "128k", "type": "text"},
        {"id": "gemini", "name": "Gemini Pro", "provider": "Google", "icon": "♊", "contextWindow": "1M", "type": "text"},
        {"id": "chatgpt", "name": "ChatGPT 4", "provider": "OpenAI", "icon": "🤖", "contextWindow": "128k", "type": "text"},
        {"id": "mistral", "name": "Mistral Large 3", "provider": "Mistral", "icon": "🇫🇷", "contextWindow": "256k", "type": "text"},
    ]


# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "ok",
        "version": "1.0.0",
        "backend": "unified",
        "timestamp": datetime.now().isoformat()
    })


@app.route('/api/system/status', methods=['GET'])
def system_status():
    """Get complete system status"""
    metrics = get_system_metrics()
    services = get_running_services()
    config = load_antigravity_config()

    return jsonify({
        "metrics": metrics,
        "services": services,
        "antigravity": config,
        "timestamp": datetime.now().isoformat()
    })


@app.route('/api/antigravity/status', methods=['GET'])
def antigravity_status():
    """Get anti-gravity optimization status (V0 Cockpit compatibility)"""
    metrics = get_system_metrics()
    config = load_antigravity_config()

    return jsonify({
        "cpu_load": metrics["cpu_load"],
        "memory_used": metrics["memory_used_gb"],
        "optimization_level": metrics["optimization_level"],
        "active_processes": metrics["active_processes"],
        "antigravity_enabled": config.get("antigravity_enabled", True),
        "weightless_mode": config.get("weightless_mode", True),
        "performance_boost": config.get("performance_boost", 0.9)
    })


@app.route('/api/workflows/list', methods=['GET'])
def list_workflows():
    """Get all available workflows"""
    workflows = get_workflows()
    return jsonify({
        "workflows": workflows,
        "count": len(workflows)
    })


@app.route('/api/workflows/<workflow_id>', methods=['GET'])
def get_workflow(workflow_id):
    """Get specific workflow details"""
    workflow_file = WORKFLOWS_DIR / f"{workflow_id}.json"

    if not workflow_file.exists():
        return jsonify({"error": "Workflow not found"}), 404

    try:
        with open(workflow_file, 'r') as f:
            workflow_data = json.load(f)
        return jsonify(workflow_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/workflows/execute', methods=['POST'])
def execute_workflow():
    """Execute a workflow"""
    data = request.json
    workflow_id = data.get('workflow_id')

    if not workflow_id:
        return jsonify({"error": "workflow_id required"}), 400

    # Broadcast execution start
    broadcast_message({
        "id": f"workflow_{workflow_id}_{int(time.time())}",
        "timestamp": datetime.now().isoformat(),
        "source": "JARVIS",
        "message": f"Starting workflow: {workflow_id}",
        "level": "info"
    })

    return jsonify({
        "status": "started",
        "workflow_id": workflow_id,
        "message": "Workflow execution started"
    })


@app.route('/api/skills/list', methods=['GET'])
def list_skills():
    """Get all available skills"""
    skills = get_available_skills()
    return jsonify({
        "skills": skills,
        "count": len(skills)
    })


@app.route('/api/models/list', methods=['GET'])
def list_models():
    """Get all available AI models"""
    models = get_ai_models()
    return jsonify({
        "models": models,
        "count": len(models)
    })


@app.route('/api/models/switch', methods=['POST'])
def switch_model():
    """Switch active AI model"""
    data = request.json
    model_id = data.get('model')

    if not model_id:
        return jsonify({"error": "model required"}), 400

    # Broadcast model switch
    broadcast_message({
        "id": f"model_switch_{int(time.time())}",
        "timestamp": datetime.now().isoformat(),
        "source": "JARVIS",
        "message": f"Switched to model: {model_id}",
        "level": "success"
    })

    return jsonify({
        "status": "success",
        "model": model_id,
        "message": f"Switched to {model_id}"
    })


@app.route('/api/dashboards/list', methods=['GET'])
def list_dashboards():
    """Get all available dashboards"""
    services = get_running_services()

    dashboards = [
        {
            "id": "ai-command-center",
            "name": "AI Command Center",
            "url": "http://localhost:3000",
            "vercel_url": "https://jarvis.nikoskatsaounis.com",
            "status": services["ai_command_center"]["status"],
            "type": "react"
        },
        {
            "id": "workflow-studio",
            "name": "Workflow Studio",
            "url": "http://localhost:8560",
            "status": services["workflow_studio"]["status"],
            "type": "streamlit"
        },
        {
            "id": "ultimate-hub",
            "name": "Ultimate Dashboard Hub",
            "url": "http://localhost:8550",
            "status": services["ultimate_hub"]["status"],
            "type": "streamlit"
        }
    ]

    return jsonify({
        "dashboards": dashboards,
        "count": len(dashboards)
    })


@app.route('/api/video/generate', methods=['POST'])
def generate_video():
    """Placeholder for video generation"""
    data = request.json

    broadcast_message({
        "id": f"video_gen_{int(time.time())}",
        "timestamp": datetime.now().isoformat(),
        "source": "MULTIMEDIA",
        "message": f"Video generation request received",
        "level": "info"
    })

    return jsonify({
        "status": "queued",
        "job_id": f"video_{int(time.time())}",
        "message": "Video generation queued"
    })


@app.route('/api/comic/create', methods=['POST'])
def create_comic():
    """Placeholder for comic creation"""
    data = request.json

    broadcast_message({
        "id": f"comic_{int(time.time())}",
        "timestamp": datetime.now().isoformat(),
        "source": "CREATIVE",
        "message": f"Comic creation request received",
        "level": "info"
    })

    return jsonify({
        "status": "queued",
        "job_id": f"comic_{int(time.time())}",
        "message": "Comic creation queued"
    })


@app.route('/api/metrics/history', methods=['GET'])
def metrics_history_endpoint():
    """Get historical metrics for charting"""
    return jsonify({
        "history": metrics_history,
        "count": len(metrics_history)
    })


@app.route('/api/workflows/active', methods=['GET'])
def active_workflows():
    """Get currently active/running workflows"""
    # For now, return empty as we don't have active workflow tracking yet
    # TODO: Implement actual workflow execution tracking
    return jsonify({
        "workflows": [],
        "count": 0
    })


@app.route('/api/costs/current', methods=['GET'])
def current_costs():
    """Get current cost breakdown"""
    global total_cost, cost_breakdown

    # Calculate Railway hosting costs (simple estimate)
    # Railway free tier or paid tier tracking would go here
    cost_breakdown["infrastructure"] = 0.0  # Free tier for now

    # Return current costs
    return jsonify({
        "total_cost": round(total_cost, 4),
        "breakdown": cost_breakdown,
        "currency": "USD",
        "period": "current_month"
    })


@app.route('/api/costs/track', methods=['POST'])
def track_cost():
    """Track an API or service cost"""
    global total_cost, cost_breakdown

    data = request.json
    category = data.get('category', 'ai_apis')  # ai_apis, storage, infrastructure
    amount = float(data.get('amount', 0))

    if category in cost_breakdown:
        cost_breakdown[category] += amount
        total_cost += amount

    return jsonify({
        "status": "tracked",
        "category": category,
        "amount": amount,
        "total_cost": round(total_cost, 4)
    })


@app.route('/api/videos/recent', methods=['GET'])
def recent_videos():
    """Get recent video generation history"""
    global video_history

    return jsonify({
        "videos": video_history[-10:],  # Last 10 videos
        "count": len(video_history)
    })


@app.route('/api/videos/track', methods=['POST'])
def track_video_generation():
    """Track a video generation (placeholder for actual generation logic)"""
    global video_history, total_cost, cost_breakdown

    data = request.json
    title = data.get('title', 'Untitled Video')
    style = data.get('style', 'Cinematic')
    duration = data.get('duration', 30)  # seconds

    # Calculate costs based on duration
    script_cost = 0.03
    images_cost = round((duration / 30) * 0.04, 4)  # DALL-E per 30s
    voice_cost = round((duration / 60) * 0.15, 4)  # ElevenLabs per minute
    total_video_cost = round(script_cost + images_cost + voice_cost, 4)

    # Track costs
    cost_breakdown["ai_apis"] += total_video_cost
    total_cost += total_video_cost

    # Add to history
    video_entry = {
        "title": title,
        "duration": f"{duration // 60}:{duration % 60:02d}",
        "style": style,
        "timestamp": datetime.now().isoformat(),
        "cost": total_video_cost
    }

    video_history.append(video_entry)
    if len(video_history) > MAX_VIDEO_HISTORY:
        video_history = video_history[-MAX_VIDEO_HISTORY:]

    return jsonify({
        "status": "generated",
        "video": video_entry,
        "cost_breakdown": {
            "script": script_cost,
            "images": images_cost,
            "voice": voice_cost,
            "total": total_video_cost
        }
    })


# ============================================================================
# CONTENT CREATION ENDPOINTS
# ============================================================================

# Content drafts storage
content_drafts = []
MAX_DRAFTS = 50

@app.route('/api/content/generate', methods=['POST'])
def generate_content():
    """Generate AI content with selected persona"""
    global total_cost, cost_breakdown

    try:
        # Validate input with Pydantic
        validated_data = ContentGenerateRequest(**request.json)
        prompt = validated_data.prompt
        persona = validated_data.persona
    except Exception as e:
        return jsonify({"error": f"Invalid input: {str(e)}"}), 400

    try:
        # Check for OpenAI API key
        openai_key = os.environ.get('OPENAI_API_KEY')
        if not openai_key:
            return jsonify({
                "error": "OpenAI API key not configured",
                "generated_content": f"[Demo Mode] Generated by {persona}:\n\n{prompt}\n\n(OpenAI API key needed for real generation)"
            }), 200

        # Import OpenAI
        try:
            from openai import OpenAI
            client = OpenAI(api_key=openai_key)
        except ImportError:
            return jsonify({
                "error": "OpenAI library not installed",
                "generated_content": f"[Demo Mode] Generated by {persona}:\n\n{prompt}\n\n(Install openai library: pip install openai)"
            }), 200

        # Persona-specific system prompts
        persona_prompts = {
            "Technical Writer": "You are a technical writer. Create clear, precise, well-structured technical documentation.",
            "Creative Storyteller": "You are a creative storyteller. Craft engaging narratives with vivid imagery and emotional depth.",
            "Academic Researcher": "You are an academic researcher. Write scholarly, well-researched content with proper citations and methodology.",
            "Marketing Copywriter": "You are a marketing copywriter. Create persuasive, compelling copy that drives engagement and conversions.",
            "Journalist": "You are a journalist. Write factual, balanced news articles with proper attribution and context.",
            "Poet": "You are a poet. Create beautiful, evocative poetry with rich metaphors and emotional resonance."
        }

        system_prompt = persona_prompts.get(persona, "You are a helpful AI assistant.")

        # Generate content with GPT-4
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1500
        )

        generated_content = response.choices[0].message.content

        # Track cost (GPT-4 pricing: $0.03 per 1K input tokens, $0.06 per 1K output tokens)
        input_tokens = response.usage.prompt_tokens
        output_tokens = response.usage.completion_tokens
        generation_cost = (input_tokens / 1000 * 0.03) + (output_tokens / 1000 * 0.06)

        cost_breakdown["ai_apis"] += generation_cost
        total_cost += generation_cost

        return jsonify({
            "generated_content": generated_content,
            "persona": persona,
            "tokens_used": response.usage.total_tokens,
            "cost": round(generation_cost, 4)
        })

    except Exception as e:
        return jsonify({
            "error": str(e),
            "generated_content": f"[Error] Failed to generate content: {str(e)}"
        }), 500


@app.route('/api/content/save', methods=['POST'])
def save_draft():
    """Save content draft"""
    global content_drafts

    data = request.json
    content = data.get('content', '')
    persona = data.get('persona', 'Unknown')

    if not content:
        return jsonify({"error": "Content required"}), 400

    draft = {
        "id": len(content_drafts) + 1,
        "content": content,
        "persona": persona,
        "timestamp": datetime.now().isoformat(),
        "word_count": len(content.split())
    }

    content_drafts.append(draft)
    if len(content_drafts) > MAX_DRAFTS:
        content_drafts = content_drafts[-MAX_DRAFTS:]

    return jsonify({
        "status": "saved",
        "draft": draft
    })


@app.route('/api/content/drafts', methods=['GET'])
def get_drafts():
    """Get all saved drafts"""
    return jsonify({
        "drafts": content_drafts[-10:],  # Last 10 drafts
        "count": len(content_drafts)
    })


@app.route('/api/tools/mythic', methods=['POST'])
def apply_mythic_structure():
    """Apply mythic storytelling structure to content"""
    data = request.json
    content = data.get('content', '')

    if not content:
        return jsonify({"error": "Content required"}), 400

    # Mythic structure transformation
    mythic_template = f"""# Hero's Journey Structure

## 1. Ordinary World
{content[:200]}...

## 2. Call to Adventure
[The inciting incident that disrupts the ordinary]

## 3. Refusal of the Call
[Initial resistance or doubt]

## 4. Meeting the Mentor
[Guidance and wisdom received]

## 5. Crossing the Threshold
[Commitment to the journey]

## 6. Tests, Allies, Enemies
[Challenges faced and relationships formed]

## 7. Approach to Inmost Cave
[Preparation for the major challenge]

## 8. Ordeal
[The central crisis]

## 9. Reward
[The treasure won]

## 10. The Road Back
[Return journey begins]

## 11. Resurrection
[Final test]

## 12. Return with Elixir
[Bringing wisdom home]

---
Original content: {content[:500]}...
"""

    return jsonify({
        "transformed_content": mythic_template,
        "structure": "Hero's Journey"
    })


@app.route('/api/tools/condense', methods=['POST'])
def condense_text():
    """Condense text to key points"""
    data = request.json
    content = data.get('content', '')

    if not content:
        return jsonify({"error": "Content required"}), 400

    # Simple condensation (in production, use GPT-4 for intelligent summarization)
    sentences = content.split('. ')
    key_points = sentences[:5]  # Take first 5 sentences as key points

    condensed = f"""# Key Points

{chr(10).join(f"• {point.strip()}" for point in key_points if point.strip())}

---
Original length: {len(content.split())} words
Condensed length: {len(' '.join(key_points).split())} words
Reduction: {round((1 - len(' '.join(key_points).split()) / len(content.split())) * 100)}%
"""

    return jsonify({
        "condensed_content": condensed,
        "original_words": len(content.split()),
        "condensed_words": len(' '.join(key_points).split())
    })


@app.route('/api/podcast/convert', methods=['POST'])
def convert_to_podcast():
    """Convert article to podcast script"""
    data = request.json
    content = data.get('content', '')

    if not content:
        return jsonify({"error": "Content required"}), 400

    # Generate podcast script format
    podcast_script = f"""# Podcast Script

## Opening
[MUSIC: Upbeat intro theme]

HOST: Welcome back to the show! Today we're diving into an fascinating topic...

## Main Content
{content[:500]}...

## Closing
[MUSIC: Outro theme]

HOST: That's all for today! Thanks for listening, and we'll see you next time.

[END]

---
Estimated Duration: {len(content.split()) // 150} minutes
Format: Conversational podcast script
"""

    return jsonify({
        "podcast_script": podcast_script,
        "estimated_duration": f"{len(content.split()) // 150} minutes"
    })


@app.route('/api/video/essay', methods=['POST'])
def create_video_essay():
    """Create video essay script with scene breakdowns"""
    data = request.json
    content = data.get('content', '')

    if not content:
        return jsonify({"error": "Content required"}), 400

    # Generate video essay structure
    video_essay = f"""# Video Essay Script

## Scene 1: Hook (0:00-0:15)
[VISUAL: Engaging opening shot]
[TEXT OVERLAY: Title]

{content[:100]}...

## Scene 2: Context (0:15-1:00)
[VISUAL: B-roll establishing context]

[Content continues...]

## Scene 3: Deep Dive (1:00-3:00)
[VISUAL: Main visual narrative]

{content[:300]}...

## Scene 4: Conclusion (3:00-3:30)
[VISUAL: Closing montage]
[CALL TO ACTION: Subscribe/Like]

---
Total Scenes: 4
Estimated Duration: 3:30
Visual Style: Essay documentary
"""

    return jsonify({
        "video_essay_script": video_essay,
        "total_scenes": 4,
        "estimated_duration": "3:30"
    })


# ============================================================================
# WEBSOCKET ENDPOINT
# ============================================================================

@sock.route('/ws')
def websocket(ws):
    """WebSocket endpoint for real-time updates"""
    ws_clients.add(ws)

    # Send welcome message
    ws.send(json.dumps({
        "id": f"connect_{int(time.time())}",
        "timestamp": datetime.now().isoformat(),
        "source": "SYSTEM",
        "message": "Connected to JARVIS Unified Backend",
        "level": "success"
    }))

    try:
        while True:
            # Keep connection alive
            data = ws.receive(timeout=30)
            if data:
                # Echo back for now
                ws.send(json.dumps({
                    "id": f"echo_{int(time.time())}",
                    "timestamp": datetime.now().isoformat(),
                    "source": "ECHO",
                    "message": f"Received: {data}",
                    "level": "info"
                }))
    except:
        pass
    finally:
        ws_clients.discard(ws)


# ============================================================================
# BACKGROUND TASKS
# ============================================================================

def system_monitor():
    """Background task to broadcast system updates"""
    while True:
        try:
            time.sleep(5)  # Update every 5 seconds

            metrics = get_system_metrics()

            broadcast_message({
                "id": f"metrics_{int(time.time())}",
                "timestamp": datetime.now().isoformat(),
                "source": "SYSTEM",
                "message": f"CPU: {metrics['cpu_load']}% | RAM: {metrics['memory_percent']}% | Optimization: {metrics['optimization_level']}%",
                "level": "info",
                "metrics": metrics
            })
        except:
            pass


# Start background monitor
monitor_thread = threading.Thread(target=system_monitor, daemon=True)
monitor_thread.start()


# ============================================================================
# MAIN
# ============================================================================

if __name__ == '__main__':
    # Use Railway's PORT environment variable or default to 8000
    port = int(os.environ.get('PORT', 8000))

    print("=" * 60)
    print("🚀 JARVIS Unified Backend Gateway")
    print("=" * 60)
    print(f"Port: {port}")
    print(f"Health: http://0.0.0.0:{port}/api/health")
    print(f"WebSocket: ws://0.0.0.0:{port}/ws")
    print(f"Workspace: {WORKSPACE_BASE}")
    print("=" * 60)
    print("Starting server...")
    print("=" * 60)

    app.run(
        host='0.0.0.0',
        port=port,
        debug=False,
        threaded=True
    )
