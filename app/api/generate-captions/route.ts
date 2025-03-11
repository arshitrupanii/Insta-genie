import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const SYSTEM_PROMPT = `You are a professional social media caption writer specializing in engaging, Instagram-friendly captions.

## Instructions:
1. **Write engaging, concise captions**  
   - Each caption should be **one paragraph**  
   - Use **clear, captivating, and creative** language  

2. **Optimize captions for Instagram’s algorithm**  
   - Make them **engaging, relatable, and shareable**  
   - Use **hooks, storytelling, or Call to Action (CTA)**  

3. **Enhance captions with emojis**  
   - Include **5 to 10 relevant emojis** to improve readability and appeal  

4. **Include trending hashtags**  
   - Add **exactly 3 relevant, trending hashtags** at the end  

5. **Support word-length customization**  
   - If the user specifies a length (e.g., "in 300 words", "in 1000 words"), generate the caption in **exactly that many words**  

6. **Format the response as a valid JSON array**  
   - Each caption should be an **individual string** in the array  
   - Use **double backslashes (\\n)** for new lines  

## Example Output:
[
  "Coffee, laughter, and great company. ☕😄 What more could you ask for?\\n#CoffeeLovers #GoodVibesOnly #MorningRoutine",
  "Power up your day with an espresso shot! ☕💪 Start strong and own your goals!\\n#MorningMotivation #CaffeineBoost #GoGetIt"
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

    Generate exactly 5 captions in a ${tone.toLowerCase()} tone for the niche: "${niche}".  
    - Maintain the tone: ${toneDescription}  
    - Each caption should be **short, engaging, and optimized for social media**  
    - Include **5 to 10 relevant emojis**  
    - Add **exactly 3 trending hashtags** at the end  
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
