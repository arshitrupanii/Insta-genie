'use client'

import React, { useState, useCallback } from 'react'

const PROMPT = `Generate 10 unique, creative 4-line Instagram bios with different tones. Each bio should:
- Include relevant and trendy emojis
- Be fun, engaging, and memorable
- Have a consistent theme throughout all 4 lines
- Be appropriate for social media and modern audiences
- Include at least one creative wordplay or pun
- Mix personality traits with interests/hobbies
- Include a subtle call-to-action or engaging element
- Incorporate current social media trends
- Use a mix of personal and professional elements where appropriate
- Each line should be separated by newlines
- Each bio should start with its tone label
- Each bio should be separated by a special marker '---'

Format example:
🙂 Friendly:
✨ Living my best life, one adventure at a time 🌎
☕ Coffee lover, dog enthusiast 🐶
📸 Capturing the beauty of everyday moments
🌈 Spreading positivity and good vibes 🌈

Please generate one bio for each of these tones:
- 👔 Formal: (elegant and sophisticated)
- 🙂 Friendly: (warm and approachable)
- 😎 Casual: (laid-back and fun)
- 💼 Professional: (business-focused but personable)
- 💪 Confident: (bold and inspiring)
- 🎨 Creative: (artistic and imaginative)
- 🌟 Inspirational: (motivational and uplifting)
- 🤓 Nerdy: (intellectual and proudly geeky)
- 🎮 Gamer: (gaming and tech enthusiast)
- 🌱 Mindful: (wellness and personal growth focused)

Make each bio unique and tailored to its specific tone while maintaining authenticity and engagement. Include relevant hashtags or social media elements where appropriate.`

const BioGenerator = () => {
  const [bios, setBios] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch bios
  const fetchBios = async () => {
    try {
      const response = await fetch('/api/generate-bios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: PROMPT }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate bios')
      }
      
      const data = await response.json()
      
      if (!data.content) {
        throw new Error('No content received from server')
      }

      // Process the content into bios
      const generatedBios = data.content
        .split('---')
        .map((bio: string) => bio.trim())
        .filter((bio: string) => bio.length > 0)

      if (generatedBios.length === 0) {
        throw new Error('No valid bios generated')
      }

      return generatedBios
    } catch (error) {
      console.error('Error generating bios:', error)
      throw error
    }
  }

  // Handle generate button click
  const handleGenerate = async () => {
    setLoading(true)
    setError(null)

    try {
      const newBios = await fetchBios()
      setBios(newBios)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate bios. Please try again.')
      setBios([])
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here instead of an alert
      alert('Bio copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight gradient-text mb-6">
          Instagram Bio Generator
        </h1>
        <button
          onClick={handleGenerate}
          className="mb-6 bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </span>
          ) : 'Generate New Bios'}
        </button>

        {error && (
          <div className="text-red-500 mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {bios.map((bio, index) => {
            if (!bio) return null; // Skip if bio is undefined or empty
            
            const bioLines = bio.split('\n');
            if (bioLines.length < 2) return null; // Skip if bio doesn't have enough lines
            
            const [toneLabel, ...bioContent] = bioLines;
            const cleanBioContent = bioContent.join('\n').trim();

            return (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="text-sm font-medium p-2.5 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-200">
                  {toneLabel || 'Untitled Bio'}
                </div>
                <div className="flex items-start justify-between p-3 gap-4">
                  <pre className="text-left text-gray-600 dark:text-gray-300 whitespace-pre-line font-sans text-sm leading-relaxed">
                    {cleanBioContent}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(cleanBioContent)}
                    className="shrink-0 text-blue-500 hover:text-blue-600 transition-colors text-sm font-medium px-3 py-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default BioGenerator