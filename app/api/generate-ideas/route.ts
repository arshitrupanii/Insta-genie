import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY || '');

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const niche = data.get('niche') as string;
    const image = data.get('image') as File | null;

    if (!niche) {
      return NextResponse.json(
        { error: 'Niche is required' },
        { status: 400 }
      );
    }

    // Use gemini-pro for text-only requests and gemini-pro-vision for image requests
    const modelName = image ? 'gemini-pro-vision' : 'gemini-pro';
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `Generate 5 unique and engaging content ideas for the following niche: ${niche}. Format each idea as a numbered list item.`;

    try {
      let result;
      
      if (image) {
        // Handle image input
        const imageData = await image.arrayBuffer();
        const imageBytes = new Uint8Array(imageData);
        
        result = await model.generateContent([
          {
            text: prompt,
          },
          {
            inlineData: {
              data: Buffer.from(imageBytes).toString('base64'),
              mimeType: image.type
            }
          }
        ]);
      } else {
        // Text-only input
        result = await model.generateContent(prompt);
      }

      const response = await result.response;
      const text = response.text();
      
      // Process the response into a clean array of ideas
      const ideas = text
        .split('\n')
        .map(line => line.replace(/^\d+[\.\)]\s*/, '').trim())
        .filter(line => line.length > 0)
        .slice(0, 5);

      return NextResponse.json({ ideas });
    } catch (aiError) {
      console.error('AI Generation Error:', aiError);
      const errorMessage = (aiError as Error).message;
      return NextResponse.json(
        { error: 'Failed to generate ideas with AI', details: errorMessage },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Request Processing Error:', error);
    const errorMessage = (error as Error).message;
    return NextResponse.json(
      { error: 'Failed to process request', details: errorMessage },
      { status: 500 }
    );
  }
}