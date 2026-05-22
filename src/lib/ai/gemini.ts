import { GoogleGenAI } from '@google/genai';
import type { AiResumeRequest } from './schema';
import { validateAiResponse } from './schema';
import type { AiResumeResponse } from './schema';
import { buildPrompt } from './prompts';

/**
 * Server-only Gemini client wrapper.
 * Must only be imported in server-side files (API routes, server components).
 * Never import this in client components.
 */

function getApiKey(): string {
  const key = process.env.GOOGLE_AI_API_KEY;
  if (!key) {
    throw new Error('GOOGLE_AI_API_KEY is not configured. Set it in .env.local');
  }
  return key;
}

function getModel(): string {
  return process.env.GOOGLE_AI_MODEL || 'gemini-2.5-flash';
}

/**
 * Extract JSON from a string that might contain markdown code fences.
 */
function extractJSON(text: string): string {
  // Try to extract from ```json ... ``` or ``` ... ```
  const fencedMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (fencedMatch) {
    return fencedMatch[1].trim();
  }
  // Try to find the first { ... } block
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return text.slice(firstBrace, lastBrace + 1);
  }
  return text.trim();
}

export async function callGemini(request: AiResumeRequest): Promise<AiResumeResponse> {
  const apiKey = getApiKey();
  const modelName = getModel();

  const ai = new GoogleGenAI({ apiKey });

  const { systemInstruction, userPrompt } = buildPrompt(request);

  const response = await ai.models.generateContent({
    model: modelName,
    contents: userPrompt,
    config: {
      systemInstruction,
      temperature: 0.7,
      maxOutputTokens: 8192,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error('Gemini returned an empty response.');
  }

  // Parse the JSON response
  const jsonStr = extractJSON(text);

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    throw new Error('Gemini response is not valid JSON. Raw output has been discarded for safety.');
  }

  const validation = validateAiResponse(parsed);
  if (!validation.valid) {
    throw new Error(`Invalid AI response structure: ${validation.error}`);
  }

  return validation.data;
}
