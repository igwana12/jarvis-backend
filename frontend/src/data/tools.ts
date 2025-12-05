import type { Tool, WorkspaceMode } from '../types';

// Helper function to create tool
const createTool = (
  id: string,
  name: string,
  description: string,
  category: string,
  icon: string,
  modes: WorkspaceMode[],
  stages: string[]
): Tool => ({
  id,
  name,
  description,
  category,
  icon,
  modes,
  stages,
});

// ============================================
// STORY PILLAR TOOLS
// ============================================
export const STORY_TOOLS: Tool[] = [
  createTool(
    'premise-builder',
    'Premise Builder',
    'Create compelling story premises with genre, theme, and hook elements',
    'story',
    '💡',
    ['storytelling', 'filmmaking'],
    ['ideate', 'concept']
  ),
  createTool(
    'character-arc-designer',
    'Character Arc Designer',
    'Map character journeys from flaw to transformation',
    'story',
    '👤',
    ['storytelling', 'filmmaking', 'audiobook'],
    ['ideate', 'outline', 'concept', 'script']
  ),
  createTool(
    'theme-weaver',
    'Theme Weaver',
    'Integrate thematic elements throughout your narrative',
    'story',
    '🎭',
    ['storytelling', 'filmmaking'],
    ['ideate', 'outline', 'draft', 'script']
  ),
  createTool(
    'plot-structure-generator',
    'Plot Structure Generator',
    'Generate plot frameworks using classic story structures',
    'story',
    '📐',
    ['storytelling', 'filmmaking'],
    ['outline', 'script']
  ),
  createTool(
    'dialogue-enhancer',
    'Dialogue Enhancer',
    'Polish and improve dialogue for natural conversation',
    'story',
    '💬',
    ['storytelling', 'filmmaking', 'podcast', 'audiobook'],
    ['draft', 'edit', 'script']
  ),
  createTool(
    'world-builder',
    'World Builder',
    'Create rich, detailed story worlds and settings',
    'story',
    '🌍',
    ['storytelling', 'filmmaking'],
    ['ideate', 'concept', 'preprod']
  ),
  createTool(
    'conflict-escalator',
    'Conflict Escalator',
    'Build and escalate tension throughout your story',
    'story',
    '⚔️',
    ['storytelling', 'filmmaking'],
    ['outline', 'draft', 'script']
  ),
  createTool(
    'resolution-crafter',
    'Resolution Crafter',
    'Write satisfying story endings and resolutions',
    'story',
    '🏆',
    ['storytelling', 'filmmaking'],
    ['draft', 'edit', 'script', 'post']
  ),
];

// ============================================
// VISUAL PILLAR TOOLS
// ============================================
export const VISUAL_TOOLS: Tool[] = [
  createTool(
    'storyboard-generator',
    'Storyboard Generator',
    'Create visual storyboards with scene descriptions and shot compositions',
    'visual',
    '🎬',
    ['filmmaking', 'storytelling'],
    ['preprod', 'concept', 'outline']
  ),
  createTool(
    'shot-composer',
    'Shot Composer',
    'Plan and compose camera shots with framing suggestions',
    'visual',
    '📷',
    ['filmmaking'],
    ['preprod', 'production']
  ),
  createTool(
    'color-palette-designer',
    'Color Palette Designer',
    'Design cohesive color schemes for visual projects',
    'visual',
    '🎨',
    ['filmmaking', 'multi'],
    ['preprod', 'concept', 'create']
  ),
  createTool(
    'lighting-planner',
    'Lighting Planner',
    'Plan lighting setups for different moods and scenes',
    'visual',
    '💡',
    ['filmmaking'],
    ['preprod', 'production']
  ),
  createTool(
    'vfx-designer',
    'Visual Effects Designer',
    'Plan and describe VFX sequences and requirements',
    'visual',
    '✨',
    ['filmmaking'],
    ['preprod', 'post']
  ),
  createTool(
    'gwenn-magic-prompt',
    'Gwenn Magic Prompt',
    'Generate optimized Midjourney prompts for stunning visuals',
    'image',
    '🖼️',
    ['filmmaking', 'storytelling', 'multi'],
    ['concept', 'preprod', 'ideate', 'create']
  ),
  createTool(
    'leonardo-styler',
    'Leonardo Styler',
    'Create styled prompts for Leonardo AI image generation',
    'image',
    '🎭',
    ['filmmaking', 'storytelling', 'multi'],
    ['concept', 'preprod', 'create']
  ),
  createTool(
    'flux-enhancer',
    'Flux Enhancer',
    'Optimize prompts for Flux model via Replicate',
    'image',
    '🌀',
    ['filmmaking', 'storytelling', 'multi'],
    ['concept', 'preprod', 'create']
  ),
  createTool(
    'dalle-creator',
    'DALL-E Creator',
    'Generate images with DALL-E 3 using optimized prompts',
    'image',
    '🤖',
    ['filmmaking', 'storytelling', 'multi'],
    ['concept', 'preprod', 'create']
  ),
  createTool(
    'stable-diffusion',
    'Stable Diffusion',
    'Generate images using Stable Diffusion models',
    'image',
    '🎨',
    ['filmmaking', 'storytelling', 'multi'],
    ['concept', 'preprod', 'create']
  ),
];

// ============================================
// AUDIO PILLAR TOOLS
// ============================================
export const AUDIO_TOOLS: Tool[] = [
  createTool(
    'voice-cloner',
    'Voice Cloner',
    'Clone and customize voice profiles using ElevenLabs',
    'voice',
    '🎤',
    ['podcast', 'audiobook', 'filmmaking'],
    ['record', 'production', 'prepare']
  ),
  createTool(
    'sound-designer',
    'Sound Designer',
    'Create immersive soundscapes and ambient audio',
    'audio',
    '🔊',
    ['soundscape', 'filmmaking', 'podcast'],
    ['compose', 'layer', 'production', 'edit']
  ),
  createTool(
    'music-composer',
    'Music Composer',
    'Generate original music and scores for your projects',
    'audio',
    '🎵',
    ['soundscape', 'filmmaking', 'podcast'],
    ['compose', 'layer', 'production']
  ),
  createTool(
    'sfx-generator',
    'SFX Generator',
    'Create and find sound effects for your projects',
    'audio',
    '💥',
    ['soundscape', 'filmmaking', 'podcast'],
    ['compose', 'layer', 'edit', 'post']
  ),
  createTool(
    'audio-mixer',
    'Audio Mixer',
    'Mix and balance multiple audio tracks',
    'audio',
    '🎚️',
    ['soundscape', 'podcast', 'audiobook', 'filmmaking'],
    ['mix', 'edit', 'post']
  ),
  createTool(
    'podcast-editor',
    'Podcast Editor',
    'Edit and enhance podcast audio with AI assistance',
    'audio',
    '🎙️',
    ['podcast'],
    ['edit', 'publish']
  ),
  createTool(
    'audiobook-narrator',
    'Audiobook Narrator',
    'Generate narration for audiobooks using AI voices',
    'voice',
    '📖',
    ['audiobook'],
    ['record', 'edit']
  ),
  createTool(
    'whisper-transcriber',
    'Whisper Transcriber',
    'Transcribe audio to text using OpenAI Whisper',
    'voice',
    '👂',
    ['podcast', 'audiobook', 'filmmaking'],
    ['edit', 'post', 'record']
  ),
  createTool(
    'elevenlabs-tts',
    'ElevenLabs TTS',
    'Generate high-quality voice synthesis with ElevenLabs',
    'voice',
    '🔊',
    ['podcast', 'audiobook', 'filmmaking', 'multi'],
    ['record', 'production', 'create']
  ),
];

// ============================================
// PRODUCTION PILLAR TOOLS
// ============================================
export const PRODUCTION_TOOLS: Tool[] = [
  createTool(
    'script-formatter',
    'Script Formatter',
    'Format scripts to industry-standard screenplay format',
    'production',
    '📄',
    ['filmmaking'],
    ['script', 'preprod']
  ),
  createTool(
    'shot-list-generator',
    'Shot List Generator',
    'Generate detailed shot lists from scripts',
    'production',
    '📋',
    ['filmmaking'],
    ['preprod']
  ),
  createTool(
    'call-sheet-creator',
    'Call Sheet Creator',
    'Generate production call sheets automatically',
    'production',
    '📅',
    ['filmmaking'],
    ['preprod', 'production']
  ),
  createTool(
    'budget-calculator',
    'Budget Calculator',
    'Estimate project costs and create budgets',
    'production',
    '💰',
    ['filmmaking', 'podcast', 'multi'],
    ['concept', 'plan', 'preprod']
  ),
  createTool(
    'schedule-builder',
    'Schedule Builder',
    'Plan and optimize production schedules',
    'production',
    '📆',
    ['filmmaking', 'podcast', 'multi'],
    ['preprod', 'plan']
  ),
  createTool(
    'location-scout',
    'Location Scout',
    'Find and document potential filming locations',
    'production',
    '📍',
    ['filmmaking'],
    ['preprod']
  ),
  createTool(
    'casting-assistant',
    'Casting Assistant',
    'Get casting suggestions and manage auditions',
    'production',
    '🎭',
    ['filmmaking'],
    ['preprod']
  ),
];

// ============================================
// DISTRIBUTION PILLAR TOOLS
// ============================================
export const DISTRIBUTION_TOOLS: Tool[] = [
  createTool(
    'platform-optimizer',
    'Platform Optimizer',
    'Optimize content for different distribution platforms',
    'distribution',
    '📱',
    ['filmmaking', 'podcast', 'audiobook', 'multi'],
    ['publish', 'deploy']
  ),
  createTool(
    'thumbnail-generator',
    'Thumbnail Generator',
    'Create eye-catching thumbnails for videos and content',
    'distribution',
    '🖼️',
    ['filmmaking', 'podcast', 'multi'],
    ['publish', 'post', 'deploy']
  ),
  createTool(
    'description-writer',
    'Description Writer',
    'Write SEO-optimized descriptions for content',
    'distribution',
    '✍️',
    ['filmmaking', 'podcast', 'audiobook', 'multi'],
    ['publish', 'deploy']
  ),
  createTool(
    'tag-generator',
    'Tag Generator',
    'Generate relevant tags and keywords for discoverability',
    'distribution',
    '🏷️',
    ['filmmaking', 'podcast', 'multi'],
    ['publish', 'deploy']
  ),
  createTool(
    'schedule-publisher',
    'Schedule Publisher',
    'Schedule and automate content publishing',
    'distribution',
    '⏰',
    ['filmmaking', 'podcast', 'multi'],
    ['publish', 'deploy']
  ),
  createTool(
    'analytics-tracker',
    'Analytics Tracker',
    'Track and analyze content performance',
    'distribution',
    '📊',
    ['filmmaking', 'podcast', 'multi'],
    ['publish', 'deploy', 'review']
  ),
];

// ============================================
// ENHANCEMENT PILLAR TOOLS
// ============================================
export const ENHANCEMENT_TOOLS: Tool[] = [
  createTool(
    'mythic-structure',
    'Mythic Structure',
    'Apply Joseph Campbell\'s mythic framework to your story',
    'enhancement',
    '🏛️',
    ['storytelling', 'filmmaking'],
    ['outline', 'script', 'ideate']
  ),
  createTool(
    'heros-journey',
    'Hero\'s Journey',
    'Map your story to the classic Hero\'s Journey stages',
    'enhancement',
    '🦸',
    ['storytelling', 'filmmaking'],
    ['outline', 'script', 'ideate']
  ),
  createTool(
    'save-the-cat',
    'Save the Cat',
    'Generate beat sheets using Blake Snyder\'s method',
    'enhancement',
    '🐱',
    ['storytelling', 'filmmaking'],
    ['outline', 'script']
  ),
  createTool(
    'three-act-structure',
    'Three Act Structure',
    'Structure your story in classic three-act format',
    'enhancement',
    '3️⃣',
    ['storytelling', 'filmmaking'],
    ['outline', 'script']
  ),
  createTool(
    'condenser',
    'Condenser',
    'Condense and summarize text while preserving key points',
    'enhancement',
    '🗜️',
    ['storytelling', 'podcast', 'audiobook', 'multi'],
    ['edit', 'draft', 'review']
  ),
  createTool(
    'expander',
    'Expander',
    'Expand concepts and ideas into fuller narratives',
    'enhancement',
    '📈',
    ['storytelling', 'podcast', 'audiobook', 'multi'],
    ['draft', 'create']
  ),
  createTool(
    'style-transfer',
    'Style Transfer',
    'Apply different writing styles to your content',
    'enhancement',
    '🎨',
    ['storytelling', 'podcast', 'multi'],
    ['edit', 'draft', 'review']
  ),
];

// ============================================
// INTEGRATION PILLAR TOOLS
// ============================================
export const INTEGRATION_TOOLS: Tool[] = [
  createTool(
    'api-connector',
    'API Connector',
    'Connect to external APIs and services',
    'integration',
    '🔌',
    ['multi'],
    ['integrate', 'create']
  ),
  createTool(
    'workflow-builder',
    'Workflow Builder',
    'Build and manage automated workflows',
    'integration',
    '⚙️',
    ['multi'],
    ['plan', 'integrate']
  ),
  createTool(
    'data-transformer',
    'Data Transformer',
    'Transform and convert data between formats',
    'integration',
    '🔄',
    ['multi'],
    ['integrate', 'create']
  ),
  createTool(
    'export-manager',
    'Export Manager',
    'Manage and configure exports to different formats',
    'integration',
    '📤',
    ['filmmaking', 'podcast', 'audiobook', 'multi'],
    ['publish', 'deploy', 'post']
  ),
  createTool(
    'import-handler',
    'Import Handler',
    'Handle imports from various sources and formats',
    'integration',
    '📥',
    ['multi'],
    ['integrate', 'create']
  ),
  createTool(
    'sync-manager',
    'Sync Manager',
    'Sync data and settings across tools and platforms',
    'integration',
    '🔁',
    ['multi'],
    ['integrate', 'plan']
  ),
];

// ============================================
// VIDEO GENERATION TOOLS
// ============================================
export const VIDEO_TOOLS: Tool[] = [
  createTool(
    'runway-gen2',
    'Runway Gen-2',
    'Generate videos using RunwayML Gen-2 model',
    'video',
    '🎬',
    ['filmmaking', 'multi'],
    ['production', 'post', 'create']
  ),
  createTool(
    'video-essay-creator',
    'Video Essay Creator',
    'Create complete video essays from text content',
    'video',
    '📹',
    ['filmmaking', 'multi'],
    ['production', 'post', 'create']
  ),
];

// ============================================
// ALL TOOLS COMBINED
// ============================================
export const ALL_TOOLS: Tool[] = [
  ...STORY_TOOLS,
  ...VISUAL_TOOLS,
  ...AUDIO_TOOLS,
  ...PRODUCTION_TOOLS,
  ...DISTRIBUTION_TOOLS,
  ...ENHANCEMENT_TOOLS,
  ...INTEGRATION_TOOLS,
  ...VIDEO_TOOLS,
];

// Tool categories for filtering
export const TOOL_CATEGORIES = [
  { id: 'all', name: 'All Tools', icon: '📦' },
  { id: 'story', name: 'Story', icon: '📖' },
  { id: 'visual', name: 'Visual', icon: '🎨' },
  { id: 'image', name: 'Image Gen', icon: '🖼️' },
  { id: 'audio', name: 'Audio', icon: '🔊' },
  { id: 'voice', name: 'Voice', icon: '🎤' },
  { id: 'video', name: 'Video', icon: '🎬' },
  { id: 'production', name: 'Production', icon: '🎥' },
  { id: 'distribution', name: 'Distribution', icon: '📱' },
  { id: 'enhancement', name: 'Enhancement', icon: '✨' },
  { id: 'integration', name: 'Integration', icon: '🔌' },
];

// Get tools by category
export function getToolsByCategory(category: string): Tool[] {
  if (category === 'all') return ALL_TOOLS;
  return ALL_TOOLS.filter(tool => tool.category === category);
}

// Get tools by mode and stage
export function getToolsForModeAndStage(mode: WorkspaceMode, stage: string): Tool[] {
  return ALL_TOOLS.filter(
    tool => tool.modes.includes(mode) && tool.stages.includes(stage)
  );
}

// Search tools
export function searchTools(query: string): Tool[] {
  const lowerQuery = query.toLowerCase();
  return ALL_TOOLS.filter(
    tool =>
      tool.name.toLowerCase().includes(lowerQuery) ||
      tool.description.toLowerCase().includes(lowerQuery) ||
      tool.category.toLowerCase().includes(lowerQuery)
  );
}

export default ALL_TOOLS;
