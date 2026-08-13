import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { description, categories, aiMemory } = await req.json();

    if (!description || typeof description !== 'string' || !description.trim()) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    const descLower = description.toLowerCase().trim();

    // 1. Check AI Memory (User Learned Rules) first (0ms latency)
    if (aiMemory && typeof aiMemory === 'object') {
      for (const [phrase, catId] of Object.entries(aiMemory)) {
        if (descLower.includes(phrase.toLowerCase())) {
          const matchedCat = categories?.find((c: any) => c.id === catId);
          if (matchedCat) {
            return NextResponse.json({
              categoryId: matchedCat.id,
              type: matchedCat.type,
              suggestedEmoji: matchedCat.emoji,
              source: 'memory',
            });
          }
        }
      }
    }

    // 2. Call Gemini 2.0 Flash API
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API Key missing' }, { status: 500 });
    }

    const categoriesPrompt = categories
      ? categories.map((c: any) => `ID: "${c.id}", Name: "${c.name}", Type: "${c.type}", Emoji: "${c.emoji}"`).join('\n')
      : '';

    const promptText = `
You are an expert financial expense categorizer for DinER mobile app.
Categorize the following transaction description into the single best matching category from the available list.

Transaction Description: "${description}"

Available Categories:
${categoriesPrompt}

Return ONLY valid JSON matching this exact structure:
{
  "categoryId": "matched category ID string or null",
  "type": "expense" or "income",
  "suggestedEmoji": "single relevant emoji string for this specific transaction item"
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
      console.warn('Gemini API Error:', res.status, errText);
      return NextResponse.json({ error: 'Gemini API failed' }, { status: 500 });
    }

    const data = await res.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      return NextResponse.json({ error: 'Empty response from Gemini' }, { status: 500 });
    }

    const parsed = JSON.parse(candidateText);
    return NextResponse.json({
      categoryId: parsed.categoryId || null,
      type: parsed.type || 'expense',
      suggestedEmoji: parsed.suggestedEmoji || null,
      source: 'gemini_ai',
    });
  } catch (error: any) {
    console.error('Error in ai-parse API route:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
