import { NextRequest, NextResponse } from 'next/server';
import { GenerateRequest, MemoSection } from '@/lib/types';
import { GENERATE_SYSTEM_PROMPT } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json();

    if (!body.prompt?.trim()) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 4096,
        system: GENERATE_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: body.prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: `Claude API error: ${err}` }, { status: response.status });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text ?? '';

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI response as JSON' }, { status: 500 });
    }

    // Attach ids and isRegenerating flag
    const sections: MemoSection[] = (parsed.sections ?? []).map(
      (s: Omit<MemoSection, 'id' | 'isRegenerating'>) => ({
        ...s,
        id: `section-${s.number}`,
        isRegenerating: false,
      })
    );

    return NextResponse.json({
      dealTitle: parsed.dealTitle,
      dealType: parsed.dealType,
      subtitle: parsed.subtitle,
      generatedAt: new Date().toISOString(),
      sections,
    });
  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
