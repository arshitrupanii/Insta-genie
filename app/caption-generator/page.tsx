'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowPathIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

const TONE_LABELS = [
  { emoji: '👔', name: 'Formal', description: 'Elegant and sophisticated' },
  { emoji: '🙂', name: 'Friendly', description: 'Warm and approachable' },
  { emoji: '😎', name: 'Casual', description: 'Laid-back and fun' },
  { emoji: '💼', name: 'Professional', description: 'Business-focused but personable' },
  { emoji: '💪', name: 'Confident', description: 'Bold and inspiring' }
]

const NICHE_SUGGESTIONS = [
  { label: 'Travel', examples: ['Adventure travel', 'Luxury destinations', 'Budget backpacking'] },
  { label: 'Food', examples: ['Restaurant reviews', 'Recipe sharing', 'Food photography'] },
  { label: 'Fitness', examples: ['Workout tips', 'Healthy lifestyle', 'Gym motivation'] },
  { label: 'Fashion', examples: ['Style tips', 'Outfit inspiration', 'Fashion trends'] },
  { label: 'Tech', examples: ['Product reviews', 'Tech news', 'Digital lifestyle'] },
  { label: 'Business', examples: ['Entrepreneurship', 'Marketing tips', 'Business growth'] },
]

const TRENDING_HASHTAGS = {
  Travel: ['#AdventureAwaits', '#Wanderlust', '#TravelDiaries'],
  Food: ['#Foodie', '#InstaFood', '#Yummy'],
  Fitness: ['#FitLife', '#WorkoutMotivation', '#HealthyLiving'],
  Fashion: ['#OOTD', '#FashionInspo', '#StyleGoals'],
  Tech: ['#TechTrends', '#Gadgets', '#Innovation'],
  Business: ['#Entrepreneur', '#BusinessTips', '#SuccessMindset'],
}

const PROMPT_TEMPLATE = `Given the content niche: "{{niche}}"

Please generate 5 creative content ideas with photo suggestions, each matching a different tone:

{{#tones}}
{{emoji}} {{name}} TONE:
Content Idea: [Generate a {{description}} content idea for this niche]
Photo Suggestion: [Describe an appropriate photo setup that matches this tone]

{{/tones}}

Keep suggestions specific, actionable, and aligned with both the niche and tone. `

const CAPTION_TEMPLATE = `Generate an engaging Instagram caption for a user-uploaded video or image. The caption must meet the following requirements:

1. **Content Analysis**
   - Analyze the uploaded media to determine its primary theme (e.g., travel, food, fashion, fitness, tech, humor, pets, etc.).
   - Identify key elements visible in the image or video, such as objects, actions, colors, location, mood, or emotions.
   - Consider the media's tone (e.g., fun, adventurous, romantic, professional, humorous) to match the caption's style.

2. **Caption Structure**
   - Create a caption in three parts:
     - **Hook:** Start with an attention-grabbing phrase, question, or emoji that evokes curiosity or emotion to make it stand out in the Instagram feed.
     - **Body:** Use descriptive and engaging language to elaborate on the content. Paint a vivid picture with words, incorporating sensory details (sights, sounds, feelings) to draw the reader in. Use relatable language that resonates with the audience.
     - **Call to Action (CTA):** Encourage interaction by asking a thought-provoking question, suggesting a share, or prompting users to comment, like, or save.

3. **Use of Emojis**
   - Strategically use emojis to enhance the visual appeal and mood of the caption. Match emojis to the theme or specific objects in the media (e.g., 🌴 for travel, 🍕 for food).
   - Use emojis sparingly and effectively to avoid overcrowding the caption, ensuring they complement the text.

4. **Hashtags**
   - Generate 5-10 relevant hashtags that align with the content's theme. Include a mix of popular and niche hashtags for maximum reach.
   - Ensure hashtags are specific and well-researched to match the target audience and increase discoverability.

5. **Tone**
   - Adapt the tone of the caption to the content's purpose and audience (e.g., casual, trendy, professional, or inspirational).
   - Use playful, motivational, or heartfelt language if the content is fun or action-packed. For professional content, keep the tone polished and engaging.

**Examples:**
- Example 1: Travel Video of a Sunset on a Beach
  🎥 "Another day, another paradise moment 🌅✨ Watching the sun kiss the ocean never gets old! 🌊💛
  What's your dream sunset destination? 🗺️
  #BeachVibes #TravelDiaries #GoldenHour #Wanderlust"

- Example 2: Food Photo of a Gourmet Burger
  🍔 "The juiciest bite you'll take today 🤤🔥 Who's hungry for this mouthwatering masterpiece? 🍟❤️
  Drop a 🍔 if burgers are your love language!
  #FoodieGoals #BurgerLover #DeliciousBites #NomNom"

- Example 3: Fitness Video of a Gym Workout
  💪 "Sweat, hustle, and repeat! 🔥 No excuses, just results 🏋️‍♂️ Who's hitting the gym today? 👊
  Tag your gym buddy below ⬇️
  #FitnessJourney #GymMotivation #FitLife #NoPainNoGain"

- Example 4: Pet Video of a Playful Puppy
  🐶 "Cuteness overload! 🐾💖 This little furball's energy is paw-sitively contagious! 🦴🐕
  Who else loves puppy zoomies? 🥰
  #DogLover #PuppyLove #FurryFriends #TooCute"

**Notes for Gemini AI:**
- Ensure the caption fits within Instagram's 2,200-character limit.
- Optimize for both human engagement and Instagram's algorithm by using relatable language and searchable hashtags.
- Keep the content fun, natural, and easy to read while aligning with trends.
- Aim for a conversational tone that feels authentic and relatable, as if the user is sharing a personal experience or story.`

export default function CaptionGenerator() {
  const [niche, setNiche] = useState('')
  const [showNicheSuggestions, setShowNicheSuggestions] = useState(false)
  const [selectedTone, setSelectedTone] = useState<typeof TONE_LABELS[0] | null>(null)
  const [captions, setCaptions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [videoPreviews, setVideoPreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    // Check if adding new files would exceed the limit
    if (imagePreviews.length + files.length > 5) {
      setError('Maximum 5 images allowed')
      return
    }

    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        setError('Each image must be less than 10MB')
        return
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string])
        setError(null)
      }
      reader.onerror = () => {
        setError('Failed to read image file')
      }
      reader.readAsDataURL(file)
    })
  }

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    // Check if adding new videos would exceed the limit
    if (videoPreviews.length + files.length > 3) {
      setError('Maximum 3 videos allowed')
      return
    }

    files.forEach(file => {
      if (file.size > 100 * 1024 * 1024) {
        setError('Each video must be less than 100MB')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setVideoPreviews(prev => [...prev, reader.result as string])
        setError(null)
      }
      reader.onerror = () => {
        setError('Failed to read video file')
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeVideo = (index: number) => {
    setVideoPreviews(prev => prev.filter((_, i) => i !== index))
    setError(null)
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
                What&apos;s your niche or content description? (optional)
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

            {/* Optional Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Add images for context (max 5)
              </label>
              <div className="mt-1 flex flex-col px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  {imagePreviews.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group w-32 h-32">
                          <Image
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            width={128}
                            height={128}
                            className="h-32 w-32 rounded-lg object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm"
                            aria-label="Remove image"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  
                  {imagePreviews.length < 5 && (
                    <>
                      <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                        >
                          <span>Upload files</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            ref={fileInputRef}
                            className="sr-only"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, GIF up to 10MB each ({5 - imagePreviews.length} remaining)
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Optional Video Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Add videos for context (max 3)
              </label>
              <div className="mt-1 flex flex-col px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  {videoPreviews.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                      {videoPreviews.map((preview, index) => (
                        <div key={index} className="relative group w-32 h-32">
                          <video
                            src={preview}
                            controls
                            className="h-32 w-32 rounded-lg object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeVideo(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm"
                            aria-label="Remove video"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  
                  {videoPreviews.length < 3 && (
                    <>
                      <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                        <label
                          htmlFor="video-upload"
                          className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                        >
                          <span>Upload videos</span>
                          <input
                            id="video-upload"
                            name="video-upload"
                            type="file"
                            accept="video/*"
                            multiple
                            onChange={handleVideoChange}
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        MP4, AVI, MOV up to 100MB each ({3 - videoPreviews.length} remaining)
                      </p>
                    </>
                  )}
                </div>
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