import { NextRequest, NextResponse } from 'next/server';
import { RegenerateRequest } from '@/lib/types';
import { REGENERATE_SYSTEM_PROMPT } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  try {
    const body: RegenerateRequest = await req.json();

    if (!body.sectionTitle || !body.existingMemo) {
      return NextResponse.json({ error: 'sectionTitle and existingMemo are required' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const memoContext = `Deal: ${body.existingMemo.dealTitle}
Type: ${body.existingMemo.dealType}
Summary: ${body.existingMemo.subtitle}

Original prompt: ${body.prompt}

Existing sections for context:
${body.existingMemo.sections.map((s) => `${s.number}. ${s.title}: ${s.content.slice(0, 200)}...`).join('\n')}

Please regenerate the section titled: "${body.sectionTitle}"`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: REGENERATE_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: memoContext }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: `Claude API error: ${err}` }, { status: response.status });
    }

    const data = await response.json();
    const content = data.content?.[0]?.text ?? '';

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Regenerate error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
