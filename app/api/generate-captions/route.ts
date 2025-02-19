import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const SYSTEM_PROMPT = `You are a professional social media caption writer. For each caption:
1. Start with the tone emoji and label (e.g., "👔 Formal")
2. Write clear, detailed explanations for the topic
3. add 2,4 trending hashtags at the end

 Each caption should be unique and creative. Include relevant emojis and hashtags. 
                   Format the response as JSON with the following structure:
                   {
                     "variations": [
                       {
                         "caption": "First caption text",
                         "hashtags": ["#hashtag1", "#hashtag2"],
                         "emojis": ["emoji1", "emoji2"]
                       },
                       {
                         "caption": "Second caption text",
                         "hashtags": ["#hashtag3", "#hashtag4"],
                         "emojis": ["emoji3", "emoji4"]
                       }
]}

Format example:
Coffee, laughter, and great company. What more could you ask for? 😄☕
😄☕
#coffeelovers #laughterisbestmedicine

Keep each caption professional and informative while maintaining the specified tone.`;

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set')
    return NextResponse.json(
      { error: 'Gemini API key is not configured' },
      { status: 500 }
    )
  }

  try {
    // Parse and validate request body
    const body = await req.json()
    const { prompt, niche, tone, toneDescription } = body

    if (!prompt || !niche || !tone) {
      console.error('Missing required fields:', { prompt, niche, tone })
      return NextResponse.json(
        { error: 'Missing required fields: prompt, niche, and tone are required' },
        { status: 400 }
      )
    }

    console.log('Generating captions for:', { niche, tone, toneDescription })

    // Combine system prompt with user prompt
    const fullPrompt = `${SYSTEM_PROMPT}

Generate 7 ${tone.toLowerCase()} tone captions for the following niche: "${niche}"

Remember to:
- Keep the tone ${toneDescription}
- Start each caption with the tone emoji and label
- Maintain proper spacing and line breaks between sections

Generate 5 captions now:`;

    // Generate content using Gemini
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    // Process and format the response
    const captions = text
      .split(/\n\n+/)
      .filter(caption => {
        // Validate caption format
        const hasEmoji = /[^\w\s]/.test(caption);
        const hasNumber = /\d+\./.test(caption);
        const hasContent = caption.trim().length > 50;
        return hasEmoji && hasNumber && hasContent;
      })
      .map(caption => caption.trim())
      .slice(0, 5);  // Get 5 captions instead of 3

    if (captions.length === 0) {
      console.error('No valid captions generated from:', text)
      throw new Error('No valid captions generated')
    }

    console.log('Successfully generated captions:', captions.length)
    return NextResponse.json({ captions })

  } catch (error) {
    // Detailed error logging
    console.error('Caption generation error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      error,
    })

    // Return appropriate error message
    return NextResponse.json(
      { 
        error: error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred while generating captions'
      },
      { status: 500 }
    )
  }
} 