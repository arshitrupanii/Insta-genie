import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const SYSTEM_PROMPT = `You are a professional social media caption writer. For each caption:
1. Start with the tone emoji and label (e.g., "👔 Formal")
2. Write clear, engaging captions that fit social media.
3. Add 3 relevant, trending hashtags at the end.
4. when user add this line like "in 300 words","in 1000 words" then you generate caption in that many words. fetch that line in (number of words)words
5. add emoji in the caption to make the caption attractive and unique
6. make the caption instagram algorithm friendly

Each caption should be **one concise paragraph**, using relevant emojis.

Format Example:
👔 Formal  
Coffee, laughter, and great company. What more could you ask for? 😄☕  
#coffeelovers #laughterisbestmedicine

Return the response as a **valid JSON array**:
[
  "👔 Formal\\nCoffee, laughter, and great company. What more could you ask for? 😄☕\\n#coffeelovers #laughterisbestmedicine",
  "🔥 Bold\\nPower up your morning with a strong espresso shot! ☕💪 #MorningMotivation #CaffeineBoost"
]`;

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set');
    return NextResponse.json(
      { error: 'Gemini API key is not configured' },
      { status: 500 }
    );
  }

  try {
    // Parse request body
    const body = await req.json();
    const { prompt, niche, tone, toneDescription } = body;

    if (!prompt || !niche || !tone) {
      console.error('Missing required fields:', { prompt, niche, tone });
      return NextResponse.json(
        { error: 'Missing required fields: prompt, niche, and tone are required' },
        { status: 400 }
      );
    }

    console.log('Generating captions for:', { niche, tone, toneDescription });

    // Construct the full prompt
    const fullPrompt = `${SYSTEM_PROMPT}

Generate exactly 5 ${tone.toLowerCase()} tone captions for the niche: "${niche}".  
- Keep the tone: ${toneDescription}  
- Start each caption with the tone emoji and label  
- Keep each caption **short, engaging, and social-media-friendly**  
- Return the result as a **valid JSON array**`;

    // Generate content using Gemini
    const result = await model.generateContent(fullPrompt);
    const text = await result.response.text();

    console.log("Raw AI Response:", text);

    let captions: string[] = [];

    try {
      // Try parsing AI response as JSON
      captions = JSON.parse(text);
    } catch (error) {
      console.error('AI response is not in JSON format. Extracting manually.');

      // Split based on tone emoji (assuming Gemini follows the format)
      captions = text
        .split(/(?=👔|🔥|😊|💡|🚀)/) // Split at emojis marking new captions
        .map(c => c.trim())
        .filter(c => c.length > 50) // Ensure non-empty, valid captions
        .slice(0, 5); // Limit to 5 captions
    }

    // Validate captions
    if (!Array.isArray(captions) || captions.length === 0) {
      console.error('No valid captions generated:', captions);
      throw new Error('No valid captions generated');
    }

    console.log('Successfully generated captions:', captions);
    return NextResponse.json({ captions });

  } catch (error) {
    console.error('Caption generation error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      error,
    });

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred while generating captions' },
      { status: 500 }
    );
  }
}
