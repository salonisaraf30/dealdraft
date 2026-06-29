import { NextRequest, NextResponse } from 'next/server';
import { RegenerateRequest } from '@/lib/types';
import { REGENERATE_SYSTEM_PROMPT } from '@/lib/prompts';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body: RegenerateRequest = await req.json();

    if (!body.sectionTitle || !body.existingMemo) {
      return NextResponse.json({ error: 'sectionTitle and existingMemo are required' }, { status: 400 });
    }

    const apiKey = process.env.MERGE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const memoContext = `${REGENERATE_SYSTEM_PROMPT}

Deal: ${body.existingMemo.dealTitle}
Type: ${body.existingMemo.dealType}
Summary: ${body.existingMemo.subtitle}
Original prompt: ${body.prompt}

Regenerate only the section titled: "${body.sectionTitle}"`;

    const response = await fetch('https://api-gateway.merge.dev/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'anthropic/claude-sonnet-4-6',
        stream: false,
        include_routing_metadata: true,
        input: [
          {
            type: 'message',
            role: 'user',
            content: memoContext,
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: `API error: ${err}` }, { status: response.status });
    }

    const data = await response.json();
    const content = extractText(data);

    if (!content) {
      console.error('Unrecognised response shape:', JSON.stringify(data).slice(0, 500));
      return NextResponse.json({ error: 'Empty response from AI' }, { status: 500 });
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Regenerate error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function extractText(data: Record<string, unknown>): string {
  if (Array.isArray(data.output)) {
    for (const item of data.output as Record<string, unknown>[]) {
      if (Array.isArray(item.content)) {
        for (const c of item.content as Record<string, unknown>[]) {
          if (c.text) return c.text as string;
        }
      }
      if (typeof item.content === 'string') return item.content;
    }
  }
  if (Array.isArray(data.content)) {
    for (const c of data.content as Record<string, unknown>[]) {
      if (c.text) return c.text as string;
    }
  }
  if (typeof data.text === 'string') return data.text;
  if (Array.isArray(data.choices)) {
    const msg = (data.choices as Record<string, unknown>[])[0]?.message as Record<string, unknown> | undefined;
    if (typeof msg?.content === 'string') return msg.content;
  }
  return '';
}
