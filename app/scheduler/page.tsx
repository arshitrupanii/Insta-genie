'use client'

import { useState } from 'react'
import { CalendarIcon, PhotoIcon } from '@heroicons/react/24/outline'

export default function Scheduler() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      platform: 'Instagram',
      content: 'Sharing the latest tips for success! 🚀',
      scheduledFor: '2023-09-20T10:00',
      status: 'scheduled'
    },
    {
      id: 2,
      platform: 'LinkedIn',
      content: 'Excited to announce our new features...',
      scheduledFor: '2023-09-21T14:30',
      status: 'draft'
    }
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Content Scheduler
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Scheduled Posts
            </h2>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md">
              New Post
            </button>
          </div>

          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="border dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {post.platform}
                    </span>
                    <p className="mt-2 text-gray-900 dark:text-white">
                      {post.content}
                    </p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    post.status === 'scheduled'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                  </span>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {new Date(post.scheduledFor).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}