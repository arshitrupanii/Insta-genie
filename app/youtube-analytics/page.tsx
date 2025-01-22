'use client'

import { useState } from 'react'
import { FaYoutube, FaChartLine } from 'react-icons/fa'
import Image from 'next/image'

interface ChannelStats {
  totalPosts: number;
  avgEngagement: string;
  followerGrowth: string;
  performanceScore: string;
  lastUpdated: string;
}

export default function YoutubeAnalytics() {
  const [channelUrl, setChannelUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<ChannelStats | null>(null)
  const [error, setError] = useState('')
  const [channelId, setChannelId] = useState('')
  const [channelName, setChannelName] = useState('')
  const [subscriberCount, setSubscriberCount] = useState('')
  const [totalViews, setTotalViews] = useState('')
  const [channelDescription, setChannelDescription] = useState('')
  const [creationDate, setCreationDate] = useState('')
  const [customUrl, setCustomUrl] = useState('')
  const [channelThumbnail, setChannelThumbnail] = useState('')
  const [country, setCountry] = useState('')

  const analyzeChannel = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const channelId = extractChannelId(channelUrl)
      const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY

      // If the extracted ID is a handle, resolve it to a channel ID
      let resolvedChannelId = channelId
      if (!/^[a-zA-Z0-9_-]{24}$/.test(channelId)) { // Check if it's not a valid channel ID
        const searchResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${channelId.replace('@', '')}&key=${apiKey}`)
        const searchData = await searchResponse.json()

        console.log('Search Response:', searchData)

        if (searchResponse.ok && searchData.items.length > 0) {
          resolvedChannelId = searchData.items[0].id.channelId // Get the channel ID from the search result
        } else {
          throw new Error('Channel not found or invalid handle')
        }
      }

      const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${resolvedChannelId}&key=${apiKey}`)
      const data = await response.json()

      console.log('Channel Data Response:', data)

      if (response.ok && data.items.length > 0) {
        const channelInfo = data.items[0]
        const stats = channelInfo.statistics

        // Set channel information
        setChannelId(channelInfo.id || 'N/A')
        setChannelName(channelInfo.snippet?.title || 'N/A')
        setSubscriberCount(stats.subscriberCount || 'N/A')
        setTotalViews(stats.viewCount || 'N/A')
        setChannelDescription(channelInfo.snippet?.description || 'N/A')
        setCreationDate(channelInfo.snippet?.publishedAt || 'N/A')
        setCustomUrl(channelInfo.snippet?.customUrl || 'N/A')
        setChannelThumbnail(channelInfo.snippet?.thumbnails?.default?.url || '')
        setCountry(channelInfo.snippet?.country || 'N/A')

        // Calculate average engagement
        const avgEngagement = calculateAvgEngagement(stats)
        setStats({
          totalPosts: parseInt(stats.videoCount, 10),
          avgEngagement: avgEngagement,
          followerGrowth: await fetchFollowerGrowth(resolvedChannelId, apiKey || ''),
          performanceScore: calculatePerformanceScore(stats),
          lastUpdated: new Date().toLocaleString()
        })
      } else {
        throw new Error('Channel not found or invalid handle')
      }
    } catch (err) {
      const errorMessage = (err as Error).message || 'Failed to analyze channel. Please try again.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Helper function to extract channel ID from URL
  const extractChannelId = (url: string): string => {
    // Regex for the new handle format
    const handleRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/@)([a-zA-Z0-9_-]+)/;
    const channelIdRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:channel\/|c\/|user\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{24})/;

    const handleMatch = url.match(handleRegex);
    const channelIdMatch = url.match(channelIdRegex);

    // Return the handle if it's a new format, or the channel ID if it's an old format
    return handleMatch ? handleMatch[1] : (channelIdMatch ? channelIdMatch[1] : '');
  }

  // Function to calculate average engagement
  const calculateAvgEngagement = (stats: any): string => {
    const views = parseInt(stats.viewCount, 10) || 0;
    const likes = parseInt(stats.likeCount, 10) || 0;
    return views > 0 ? ((likes / views) * 100).toFixed(2) + '%' : 'N/A';
  }

  // Function to fetch follower growth
  const fetchFollowerGrowth = async (channelId: string, apiKey: string): Promise<string> => {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`)
    const data = await response.json()
    if (data.items.length > 0) {
      return data.items[0].statistics.subscriberCount
    }
    return 'N/A'
  }

  // Function to calculate performance score
  const calculatePerformanceScore = (stats: any): string => {
    // Example logic for performance score calculation
    const views = parseInt(stats.viewCount, 10)
    const subscribers = parseInt(stats.subscriberCount, 10)
    return (subscribers > 0) ? (views / subscribers).toFixed(2) : 'N/A'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3">
            <FaYoutube className="text-red-600 text-5xl" />
            YouTube Channel Analytics
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Analyze any YouTube channel&apos;s performance metrics
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={analyzeChannel} className="mb-10">
          <div className="flex flex-col sm:flex-row gap-6">
            <input
              type="url"
              value={channelUrl}
              onChange={(e) => setChannelUrl(e.target.value)}
              placeholder="Enter YouTube channel URL"
              className="flex-1 rounded-lg border border-gray-300 bg-white dark:bg-gray-800 
                dark:border-gray-600 px-5 py-3 text-base shadow-md focus:outline-none focus:ring-2 
                focus:ring-red-500 transition duration-200"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center px-6 py-3 
                bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg 
                transition-colors duration-200 shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analyzing...
                </span>
              ) : (
                <span className="inline-flex items-center">
                  <FaChartLine className="mr-2" />
                  Analyze Channel
                </span>
              )}
            </button>
          </div>
        </form>

        {/* Channel Information Card */}
        {channelName && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 flex flex-col items-center">
            <Image 
              src={channelThumbnail} 
              alt="Channel Thumbnail" 
              width={128}
              height={128}
              className="rounded-full mb-4" 
            />
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{channelName}</h2>
          </div>
        )}

        {/* Channel Details Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Channel ID</h3>
            <p className="text-gray-500 dark:text-gray-400">{channelId}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Subscribers</h3>
            <p className="text-gray-500 dark:text-gray-400">{subscriberCount}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Views</h3>
            <p className="text-gray-500 dark:text-gray-400">{totalViews}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Created On</h3>
            <p className="text-gray-500 dark:text-gray-400">{new Date(creationDate).toLocaleDateString()}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Custom URL</h3>
            <p className="text-gray-500 dark:text-gray-400">
              <a href={`https://www.youtube.com/${customUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{customUrl}</a>
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Country</h3>
            <p className="text-gray-500 dark:text-gray-400">{country}</p>
          </div>
        </div>

        {/* Full-Width Description Card */}
        {channelDescription && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 col-span-1 sm:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Description</h3>
            <p className="text-gray-500 dark:text-gray-400">{channelDescription}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Results Card */}
        {stats && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Channel Analytics
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-5 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md">
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Posts</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalPosts}</div>
              </div>
              
              <div className="p-5 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md">
                <div className="text-sm text-gray-500 dark:text-gray-400">Average Engagement</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.avgEngagement}</div>
              </div>
              
              <div className="p-5 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md">
                <div className="text-sm text-gray-500 dark:text-gray-400">Follower Growth</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.followerGrowth}</div>
              </div>
              
              <div className="p-5 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md">
                <div className="text-sm text-gray-500 dark:text-gray-400">Performance Score</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.performanceScore}</div>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              Last updated: {stats.lastUpdated}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 