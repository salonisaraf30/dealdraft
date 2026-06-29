import { NextRequest, NextResponse } from 'next/server';
import { GenerateRequest, MemoSection } from '@/lib/types';
import { GENERATE_SYSTEM_PROMPT } from '@/lib/prompts';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json();

    if (!body.prompt?.trim()) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.MERGE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

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
            content: `${GENERATE_SYSTEM_PROMPT}\n\nDeal: ${body.prompt}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: `API error: ${err}` }, { status: response.status });
    }

    const data = await response.json();

    // Extract text — try multiple response shapes
    const text = extractText(data);

    if (!text) {
      console.error('Unrecognised response shape:', JSON.stringify(data).slice(0, 500));
      return NextResponse.json({ error: 'Empty response from AI' }, { status: 500 });
    }

    // Strip any accidental markdown fences
    const clean = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch {
      console.error('JSON parse failed. Raw text:', clean.slice(0, 300));
      return NextResponse.json({ error: 'Failed to parse AI response as JSON' }, { status: 500 });
    }

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

// Handles Anthropic, OpenAI Responses API, and plain {text} shapes
function extractText(data: Record<string, unknown>): string {
  // OpenAI Responses API: data.output[].content[].text
  if (Array.isArray(data.output)) {
    for (const item of data.output as Record<string, unknown>[]) {
      if (Array.isArray(item.content)) {
        for (const c of item.content as Record<string, unknown>[]) {
          if (c.text) return c.text as string;
        }
      }
      // Sometimes content is a plain string
      if (typeof item.content === 'string') return item.content;
    }
  }
  // Anthropic Messages API: data.content[].text
  if (Array.isArray(data.content)) {
    for (const c of data.content as Record<string, unknown>[]) {
      if (c.text) return c.text as string;
    }
  }
  // Flat text field
  if (typeof data.text === 'string') return data.text;
  // OpenAI Chat: choices[].message.content
  if (Array.isArray(data.choices)) {
    const msg = (data.choices as Record<string, unknown>[])[0]?.message as Record<string, unknown> | undefined;
    if (typeof msg?.content === 'string') return msg.content;
  }
  return '';
}
