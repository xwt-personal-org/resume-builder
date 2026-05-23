import type { AiResumeRequest, AiResumeResponse, AiMode } from './schema';
import type { ResumeData } from '@/types';

export interface AiClientOptions {
  mode: AiMode;
  language: 'zh' | 'en';
  targetRole?: string;
  jobDescription?: string;
  personalMaterials?: string;
  currentResume: ResumeData;
}

export interface AiClientResult {
  success: true;
  data: AiResumeResponse;
}

export interface AiClientError {
  success: false;
  error: string;
  code?: string;
}

export type AiClientResponse = AiClientResult | AiClientError;

/**
 * Client-side helper to call the AI resume API route.
 * Submits to /api/ai/resume, NOT directly to Google.
 */
export async function requestAiResume(options: AiClientOptions): Promise<AiClientResponse> {
  const payload: AiResumeRequest = {
    mode: options.mode,
    language: options.language,
    targetRole: options.targetRole,
    jobDescription: options.jobDescription,
    personalMaterials: options.personalMaterials,
    currentResume: options.currentResume,
  };

  try {
    const response = await fetch('/api/ai/resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      const errorMessage = errorBody?.error || `AI 请求失败 (HTTP ${response.status})`;
      return {
        success: false,
        error: errorMessage,
        code: errorBody?.code,
      };
    }

    const data: AiResumeResponse = await response.json();
    return { success: true, data };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '网络请求失败，请检查网络连接。';
    return {
      success: false,
      error: message,
      code: 'NETWORK_ERROR',
    };
  }
}
