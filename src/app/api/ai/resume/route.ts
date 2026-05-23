import { NextResponse } from 'next/server';
import { validateAiRequest } from '@/lib/ai/schema';
import { callGemini } from '@/lib/ai/gemini';

export async function POST(request: Request) {
  // Check API key is configured
  if (!process.env.GOOGLE_AI_API_KEY) {
    return NextResponse.json(
      {
        error: 'AI 功能未配置。请在 .env.local 中设置 GOOGLE_AI_API_KEY。',
        code: 'MISSING_API_KEY',
      },
      { status: 503 }
    );
  }

  // Parse request body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: '请求格式错误，无法解析 JSON。', code: 'INVALID_JSON' },
      { status: 400 }
    );
  }

  // Validate request
  const validation = validateAiRequest(body);
  if (!validation.valid) {
    return NextResponse.json(
      { error: validation.error, code: 'INVALID_PAYLOAD' },
      { status: 400 }
    );
  }

  // Call Gemini
  try {
    const result = await callGemini(validation.data);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'AI 服务调用失败，请稍后重试。';

    // Don't leak internal error details about API keys
    const safeMessage = message.includes('API key')
      ? 'AI 服务配置错误，请检查 API Key 设置。'
      : message.includes('GOOGLE_AI_API_KEY')
        ? 'AI 功能未配置。请在 .env.local 中设置 GOOGLE_AI_API_KEY。'
        : message;

    return NextResponse.json(
      { error: safeMessage, code: 'PROVIDER_ERROR' },
      { status: 502 }
    );
  }
}
