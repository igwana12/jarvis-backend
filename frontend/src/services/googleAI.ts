/**
 * Google AI (Gemini) Service
 * Provides AI generation capabilities using Google's Gemini API
 */

const GOOGLE_AI_KEY = import.meta.env.VITE_GOOGLE_AI_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export interface GenerateContentRequest {
  prompt: string;
  model?: 'gemini-1.5-flash' | 'gemini-1.5-pro' | 'gemini-2.0-flash-exp';
  maxTokens?: number;
  temperature?: number;
}

export interface GenerateContentResponse {
  text: string;
  model: string;
  tokensUsed?: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

/**
 * Generate content using Gemini
 */
export async function generateContent({
  prompt,
  model = 'gemini-1.5-flash',
  maxTokens = 2048,
  temperature = 0.7,
}: GenerateContentRequest): Promise<GenerateContentResponse> {
  if (!GOOGLE_AI_KEY) {
    throw new Error('Google AI API key not configured');
  }

  const response = await fetch(
    `${GEMINI_API_URL}/${model}:generateContent?key=${GOOGLE_AI_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to generate content');
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  return {
    text,
    model,
    tokensUsed: data.usageMetadata?.totalTokenCount,
  };
}

/**
 * Chat with Gemini (multi-turn conversation)
 */
export async function chat(
  messages: ChatMessage[],
  model: 'gemini-1.5-flash' | 'gemini-1.5-pro' = 'gemini-1.5-flash'
): Promise<string> {
  if (!GOOGLE_AI_KEY) {
    throw new Error('Google AI API key not configured');
  }

  const contents = messages.map((msg) => ({
    role: msg.role,
    parts: [{ text: msg.content }],
  }));

  const response = await fetch(
    `${GEMINI_API_URL}/${model}:generateContent?key=${GOOGLE_AI_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contents }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to chat');
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

/**
 * Generate structured JSON output
 */
export async function generateJSON<T>(
  prompt: string,
  schema: string,
  model: 'gemini-1.5-flash' | 'gemini-1.5-pro' = 'gemini-1.5-flash'
): Promise<T> {
  const structuredPrompt = `${prompt}

Return your response as valid JSON matching this schema:
${schema}

Respond with ONLY the JSON, no markdown code blocks or explanation.`;

  const response = await generateContent({
    prompt: structuredPrompt,
    model,
    temperature: 0.3, // Lower temp for more consistent JSON
  });

  try {
    // Clean up potential markdown code blocks
    let jsonText = response.text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.slice(7);
    }
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.slice(3);
    }
    if (jsonText.endsWith('```')) {
      jsonText = jsonText.slice(0, -3);
    }

    return JSON.parse(jsonText.trim()) as T;
  } catch {
    throw new Error('Failed to parse JSON response');
  }
}

/**
 * Generate creative content with specific style
 */
export async function generateCreative(
  prompt: string,
  style: 'story' | 'script' | 'poem' | 'article' | 'marketing' | 'technical'
): Promise<string> {
  const stylePrompts: Record<string, string> = {
    story: 'Write an engaging narrative story with vivid descriptions and compelling characters.',
    script: 'Write a screenplay or script format with dialogue, scene descriptions, and stage directions.',
    poem: 'Write a creative poem with rich imagery, metaphors, and emotional depth.',
    article: 'Write a well-researched article with clear structure, facts, and insights.',
    marketing: 'Write persuasive marketing copy that engages and converts.',
    technical: 'Write clear, precise technical documentation or explanation.',
  };

  const fullPrompt = `${stylePrompts[style]}

${prompt}`;

  const response = await generateContent({
    prompt: fullPrompt,
    model: 'gemini-1.5-pro', // Use pro for creative tasks
    temperature: 0.8, // Higher temp for creativity
    maxTokens: 4096,
  });

  return response.text;
}

/**
 * Analyze and improve content
 */
export async function analyzeContent(content: string): Promise<{
  summary: string;
  strengths: string[];
  improvements: string[];
  readabilityScore: number;
}> {
  return generateJSON(
    `Analyze this content and provide feedback:

${content}`,
    `{
  "summary": "Brief summary of the content",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["suggestion 1", "suggestion 2"],
  "readabilityScore": 85
}`,
    'gemini-1.5-flash'
  );
}

/**
 * Generate image prompts for Midjourney/DALL-E
 */
export async function generateImagePrompt(
  description: string,
  style: string = 'cinematic'
): Promise<string> {
  const response = await generateContent({
    prompt: `Create a detailed image generation prompt for: ${description}

Style: ${style}

Include: composition, lighting, mood, colors, artistic style, and quality modifiers.
Format as a single paragraph optimized for Midjourney or DALL-E.`,
    model: 'gemini-1.5-flash',
    temperature: 0.7,
  });

  return response.text;
}

/**
 * Check if Google AI is configured
 */
export function isGoogleAIConfigured(): boolean {
  return !!GOOGLE_AI_KEY;
}

export default {
  generateContent,
  chat,
  generateJSON,
  generateCreative,
  analyzeContent,
  generateImagePrompt,
  isGoogleAIConfigured,
};
