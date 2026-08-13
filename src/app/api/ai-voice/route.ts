import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { transcript, categories } = await req.json();

    if (!transcript || typeof transcript !== 'string' || !transcript.trim()) {
      return NextResponse.json({ error: 'Transcript text is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API Key missing' }, { status: 500 });
    }

    const categoriesPrompt = categories
      ? categories.map((c: any) => `ID: "${c.id}", Name: "${c.name}", Type: "${c.type}"`).join('\n')
      : '';

    const promptText = `
You are a voice transaction parser for DinER expense tracking app in Colombia.
Extract transaction parameters from the following spoken voice command transcript:

Spoken Transcript: "${transcript}"

Available Categories:
${categoriesPrompt}

Currency is COP (Colombian Pesos). Note: Phrases like "45 mil", "45k", "45000" mean amount 45000.

Return ONLY valid JSON matching this exact structure:
{
  "description": "Clean concise transaction description title string (e.g. McDonald's)",
  "amount": numeric integer value (e.g. 45000),
  "type": "expense" or "income",
  "categoryId": "matched category ID string or null",
  "tags": ["array", "of", "#lowercase_tags"]
}
`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const res = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn('Gemini Voice API Error:', res.status, errText);
      return NextResponse.json({ error: 'Gemini Voice API failed' }, { status: 500 });
    }

    const data = await res.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      return NextResponse.json({ error: 'Empty response from Gemini Voice' }, { status: 500 });
    }

    const parsed = JSON.parse(candidateText);
    return NextResponse.json({
      description: parsed.description || 'Voice Transaction',
      amount: typeof parsed.amount === 'number' ? parsed.amount : 0,
      type: parsed.type || 'expense',
      categoryId: parsed.categoryId || null,
      tags: Array.isArray(parsed.tags) ? parsed.tags : [],
    });
  } catch (error: any) {
    console.error('Error in ai-voice API route:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
