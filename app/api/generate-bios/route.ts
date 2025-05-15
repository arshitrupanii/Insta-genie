import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const { prompt } = await request.json()
    
    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    if (!text) {
      throw new Error('No content generated')
    }

    // Validate the response format
    const bios = text.split('---')
      .map(bio => bio.trim())
      .filter(bio => {
        // Check if bio has at least 2 lines (tone label + content)
        const lines = bio.split('\n')
        return bio.length > 0 && lines.length >= 2
      })

    if (bios.length === 0) {
      throw new Error('No valid bios generated')
    }

    return new Response(JSON.stringify({ content: text }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to generate bios' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
} 