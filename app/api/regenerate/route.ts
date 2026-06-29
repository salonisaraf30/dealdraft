import { NextRequest, NextResponse } from 'next/server';
import { RegenerateRequest } from '@/lib/types';
import { REGENERATE_SYSTEM_PROMPT } from '@/lib/prompts';

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

    const memoContext = `Deal: ${body.existingMemo.dealTitle}
Type: ${body.existingMemo.dealType}
Summary: ${body.existingMemo.subtitle}

Original prompt: ${body.prompt}

Existing sections for context:
${body.existingMemo.sections.map((s) => `${s.number}. ${s.title}: ${s.content.slice(0, 200)}...`).join('\n')}

Please regenerate the section titled: "${body.sectionTitle}"`;

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
            content: REGENERATE_SYSTEM_PROMPT,
          },
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

    const outputItem = data.output?.find((o: { type: string }) => o.type === 'message');
    const textItem = outputItem?.content?.find((c: { type: string }) => c.type === 'output_text');
    const content = textItem?.text ?? '';

    if (!content) {
      return NextResponse.json({ error: 'Empty response from AI' }, { status: 500 });
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Regenerate error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
