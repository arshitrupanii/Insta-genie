import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Configuration and constants
const GEMINI_MODEL = 'gemini-1.5-flash';
const CAPTIONS_COUNT = 5;

// System prompt for caption generation
const SYSTEM_PROMPT = `You are a professional social media caption writer specializing in engaging, Instagram-friendly captions.

Instructions:
1. Write engaging, concise captions
   - Each caption should be one paragraph
   - Use clear, captivating, and creative language
2. Optimize captions for Instagram's algorithm
   - Make them engaging, relatable, and shareable
   - Use hooks, storytelling, or Call to Action (CTA)
3. Enhance captions with emojis
   - Include 5 to 10 relevant emojis to improve readability and appeal
4. Include trending hashtags
   - Add exactly 3 relevant, trending hashtags at the end
5. Maintain specified tone and niche
   - Adapt language and style to the given tone and subject area

Example Output:
[
  "Coffee, laughter, and great company. ☕😄 What more could you ask for?\n#CoffeeLovers #GoodVibesOnly #MorningRoutine",
  "Power up your day with an espresso shot! ☕💪 Start strong and own your goals!\n#MorningMotivation #CaffeineBoost #GoGetIt"
]`;

// Type definitions for input and response
interface CaptionRequest {
  prompt: string;
  niche: string;
  tone: string;
  toneDescription: string;
}

interface CaptionResponse {
  captions: string[];
}

// Initialize Gemini AI
const initializeGeminiAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: GEMINI_MODEL });
};

// Construct full generation prompt
const createFullPrompt = (request: CaptionRequest): string => {
  return `${SYSTEM_PROMPT}
Generate exactly ${CAPTIONS_COUNT} captions in a ${request.tone.toLowerCase()} tone for the niche: "${request.niche}".
- Maintain the tone: ${request.toneDescription}
- Each caption should be short, engaging, and optimized for social media
- Include 5 to 10 relevant emojis
- Add exactly 3 trending hashtags at the end
- Return the result as a valid JSON array`;
};

// Robust parsing of AI response
const processAIResponse = (text: string): string[] => {
  try {
    // Remove code block markers if present
    const cleanedText = text
      .replace(/^```(json)?/m, '')  // Remove opening code block
      .replace(/```$/m, '')         // Remove closing code block
      .trim();

    // Parse the cleaned text
    const captions = JSON.parse(cleanedText);
    
    if (!Array.isArray(captions) || captions.length === 0) {
      throw new Error('No valid captions generated');
    }
    
    return captions;
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    console.error('Raw AI response:', text);
    
    // Additional parsing attempt for problematic responses
    try {
      // Try extracting JSON-like content
      const jsonMatch = text.match(/\[.*\]/);
      if (jsonMatch) {
        const extractedJson = jsonMatch[0].trim();
        const captions = JSON.parse(extractedJson);
        return captions;
      }
    } catch (extractError) {
      console.error('Extraction attempt failed:', extractError);
    }

    throw new Error('Invalid caption format from AI');
  }
};

// Main handler for caption generation
export async function POST(req: Request) {
  try {
    // Parse request body
    const body: CaptionRequest = await req.json();
    const { prompt, niche, tone, toneDescription } = body;

    // Validate input
    if (!prompt || !niche || !tone) {
      return NextResponse.json(
        { error: 'Missing required fields: prompt, niche, and tone are required' },
        { status: 400 }
      );
    }

    // Initialize Gemini model
    const model = initializeGeminiAI();

    // Generate captions
    const fullPrompt = createFullPrompt(body);
    const result = await model.generateContent(fullPrompt);
    const text = result.response.text();

    // Process and validate captions
    const captions = processAIResponse(text);

    return NextResponse.json({ captions });
  } catch (error) {
    console.error('Caption generation error:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred while generating captions' 
      },
      { status: 500 }
    );
  }
}