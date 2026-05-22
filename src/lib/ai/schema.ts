import type { ResumeData, SectionKey } from '@/types';

// ---- Request ----

export type AiMode = 'generate' | 'optimize' | 'polish' | 'translate';

export interface AiResumeRequest {
  mode: AiMode;
  language: 'zh' | 'en';
  targetRole?: string;
  jobDescription?: string;
  personalMaterials?: string;
  currentResume: ResumeData;
}

// ---- Response ----

export interface AiResumeResponse {
  summary: string;
  proposedResumePatch: Partial<ResumeData>;
  sectionNotes: Partial<Record<SectionKey, string>>;
  warnings: string[];
}

// ---- Validation ----

const VALID_MODES: AiMode[] = ['generate', 'optimize', 'polish', 'translate'];
const VALID_LANGUAGES = ['zh', 'en'] as const;

export function validateAiRequest(body: unknown): { valid: true; data: AiResumeRequest } | { valid: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body must be a JSON object.' };
  }

  const obj = body as Record<string, unknown>;

  if (!obj.mode || !VALID_MODES.includes(obj.mode as AiMode)) {
    return { valid: false, error: `Invalid mode. Must be one of: ${VALID_MODES.join(', ')}` };
  }

  if (!obj.language || !VALID_LANGUAGES.includes(obj.language as 'zh' | 'en')) {
    return { valid: false, error: 'Invalid language. Must be "zh" or "en".' };
  }

  if (!obj.currentResume || typeof obj.currentResume !== 'object') {
    return { valid: false, error: 'currentResume is required and must be an object.' };
  }

  if (obj.targetRole !== undefined && typeof obj.targetRole !== 'string') {
    return { valid: false, error: 'targetRole must be a string if provided.' };
  }

  if (obj.jobDescription !== undefined && typeof obj.jobDescription !== 'string') {
    return { valid: false, error: 'jobDescription must be a string if provided.' };
  }

  if (obj.personalMaterials !== undefined && typeof obj.personalMaterials !== 'string') {
    return { valid: false, error: 'personalMaterials must be a string if provided.' };
  }

  return {
    valid: true,
    data: {
      mode: obj.mode as AiMode,
      language: obj.language as 'zh' | 'en',
      targetRole: obj.targetRole as string | undefined,
      jobDescription: obj.jobDescription as string | undefined,
      personalMaterials: obj.personalMaterials as string | undefined,
      currentResume: obj.currentResume as ResumeData,
    },
  };
}

export function validateAiResponse(raw: unknown): { valid: true; data: AiResumeResponse } | { valid: false; error: string } {
  if (!raw || typeof raw !== 'object') {
    return { valid: false, error: 'AI response is not a valid object.' };
  }

  const obj = raw as Record<string, unknown>;

  if (typeof obj.summary !== 'string') {
    return { valid: false, error: 'AI response missing summary string.' };
  }

  if (!obj.proposedResumePatch || typeof obj.proposedResumePatch !== 'object') {
    return { valid: false, error: 'AI response missing proposedResumePatch object.' };
  }

  const sectionNotes = (obj.sectionNotes && typeof obj.sectionNotes === 'object')
    ? obj.sectionNotes as Partial<Record<SectionKey, string>>
    : {};

  const warnings = Array.isArray(obj.warnings)
    ? (obj.warnings as unknown[]).filter((w): w is string => typeof w === 'string')
    : [];

  return {
    valid: true,
    data: {
      summary: obj.summary as string,
      proposedResumePatch: obj.proposedResumePatch as Partial<ResumeData>,
      sectionNotes,
      warnings,
    },
  };
}
