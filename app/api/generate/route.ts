import { NextRequest, NextResponse } from 'next/server';
import { GenerateRequest, MemoSection } from '@/lib/types';
import { GENERATE_SYSTEM_PROMPT } from '@/lib/prompts';

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
            role: 'system',
            content: GENERATE_SYSTEM_PROMPT,
          },
          {
            type: 'message',
            role: 'user',
            content: body.prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: `API error: ${err}` }, { status: response.status });
    }

    const data = await response.json();

    // Extract text from Responses API output format
    const outputItem = data.output?.find((o: { type: string }) => o.type === 'message');
    const textItem = outputItem?.content?.find((c: { type: string }) => c.type === 'output_text');
    const text = textItem?.text ?? '';

    if (!text) {
      return NextResponse.json({ error: 'Empty response from AI' }, { status: 500 });
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
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
