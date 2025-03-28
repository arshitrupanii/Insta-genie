'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowPathIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'

const TONE_LABELS = [
  { emoji: '👔', name: 'Formal', description: 'Elegant and sophisticated' },
  { emoji: '🙂', name: 'Friendly', description: 'Warm and approachable' },
  { emoji: '😎', name: 'Casual', description: 'Laid-back and fun' },
  { emoji: '💼', name: 'Professional', description: 'Business-focused but personable' },
  { emoji: '💪', name: 'Confident', description: 'Bold and inspiring' },
  { emoji: '🔥', name: 'Motivational', description: 'Energetic and uplifting' } // New tone added
];


const NICHE_SUGGESTIONS = [
  { label: 'Motivation', examples: ['Morning motivation', 'Success mindset'] },
  { label: 'Food', examples: ['Restaurant reviews', 'Recipe sharing'] },
  { label: 'Fitness', examples: ['Workout tips', 'Healthy lifestyle'] },
  { label: 'Business', examples: ['Entrepreneurship', 'Personal branding'] },
];


export default function CaptionGenerator() {
  const [niche, setNiche] = useState('')
  const [showNicheSuggestions, setShowNicheSuggestions] = useState(false)
  const [selectedTone, setSelectedTone] = useState<typeof TONE_LABELS[0] | null>(null)
  const [captions, setCaptions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  const CAPTION_TEMPLATE = `Generate ${5} different Instagram captions for the topic "${niche}" in a ${selectedTone} tone. 
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
    // ... more variations
  ]
}`

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (inputRef.current && 
          suggestionsRef.current && 
          !inputRef.current.contains(event.target as Node) && 
          !suggestionsRef.current.contains(event.target as Node)) {
        setShowNicheSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleNicheChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNiche(value)
    
    const matchingSuggestion = NICHE_SUGGESTIONS.some(
      suggestion => suggestion.label.toLowerCase().includes(value.toLowerCase()) ||
                   suggestion.examples.some(ex => ex.toLowerCase().includes(value.toLowerCase()))
    )
    setShowNicheSuggestions(matchingSuggestion)
  }

  const handleNicheSuggestionClick = (suggestion: string) => {
    setNiche(suggestion)
    setShowNicheSuggestions(false)
  }

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if a tone is selected
    if (!selectedTone) {
      setError('Please select a tone')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-captions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          niche: niche.trim() || 'General',
          tone: selectedTone.name,
          toneDescription: selectedTone.description,
          prompt: CAPTION_TEMPLATE
            .replace('{{niche}}', niche.trim() || 'General')
            .replace('{{selectedTone}}', selectedTone.name)
            .replace('{{toneDescription}}', selectedTone.description)
        }),
      })

      // Check if response is OK and is JSON
      if (!response.ok) {
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to generate captions')
        } else {
          const errorText = await response.text()
          throw new Error(`Server error: ${response.status} ${errorText.slice(0, 100)}...`)
        }
      }

      // Parse JSON response
      let data
      try {
        data = await response.json()
      } catch (parseError) {
        throw new Error('Invalid response format from server')
      }

      if (!Array.isArray(data.captions)) {
        throw new Error('Invalid caption data received')
      }

      setCaptions(data.captions)
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'Failed to generate captions')
      setCaptions([]) // Clear any existing captions on error
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Caption Generator
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Niche Input */}
            <div className="relative">
              <label htmlFor="niche" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What&apos;s your niche or content description?
              </label>
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  id="niche"
                  value={niche}
                  onChange={handleNicheChange}
                  onFocus={() => setShowNicheSuggestions(true)}
                  placeholder="E.g., Travel, Food, Fitness"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
                {showNicheSuggestions && (
                  <div 
                    ref={suggestionsRef}
                    className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700"
                  >
                    {NICHE_SUGGESTIONS
                      .filter(suggestion => 
                        suggestion.label.toLowerCase().includes(niche.toLowerCase()) ||
                        suggestion.examples.some(ex => ex.toLowerCase().includes(niche.toLowerCase()))
                      )
                      .map((nicheSuggestion) => (
                        <div
                          key={nicheSuggestion.label}
                          className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                          onClick={() => handleNicheSuggestionClick(nicheSuggestion.label)}
                        >
                          <div className="font-medium text-gray-900 dark:text-white">
                            {nicheSuggestion.label}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {nicheSuggestion.examples.join(' • ')}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Tone Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select your caption tone:
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {TONE_LABELS.map((tone) => (
                  <button
                    type="button"
                    key={tone.name}
                    onClick={() => setSelectedTone(tone)}
                    className={`group p-3 rounded-lg text-center transition-all
                      ${selectedTone?.name === tone.name 
                        ? 'bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-500' 
                        : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
                  >
                    <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                      {tone.emoji}
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {tone.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {tone.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !selectedTone}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                  Generating Captions...
                </>
              ) : (
                'Generate Captions'
              )}
            </button>
          </form>

          {/* Generated Captions Display */}
          {captions.length > 0 && (
            <div className="space-y-4 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Generated Captions
              </h2>
              {captions.map((caption, index) => (
                <div
                  key={index}
                  className="group relative bg-gray-50 dark:bg-gray-900 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-medium">
                    {caption}
                  </p>
                  <button
                    onClick={() => navigator.clipboard.writeText(caption)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-500 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}