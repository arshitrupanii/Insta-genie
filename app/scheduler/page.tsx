'use client'

import { useState } from 'react'
import { CalendarIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { 
  FaInstagram, 
  FaLinkedin, 
  FaTwitter, 
  FaYoutube, 
  FaFacebookSquare, 
  FaTiktok, 
  FaPinterest,
  FaMedium 
} from 'react-icons/fa';

// Helper function to format dates consistently
const formatDate = (date: string) => {
  if (!date) return ''
  try {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch (e) {
    return ''
  }
}

// Get current datetime in ISO format for the input default
const getCurrentDateTime = () => {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().slice(0, 16)
}

export default function Scheduler() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      platform: 'Instagram',
      content: 'Sharing the latest tips for success! 🚀',
      scheduledFor: '2024-03-20T10:00',
      status: 'scheduled'
    },
    {
      id: 2,
      platform: 'LinkedIn',
      content: 'Excited to announce our new features...',
      scheduledFor: '2024-03-21T14:30',
      status: 'draft'
    }
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newPost, setNewPost] = useState({
    platform: 'Instagram',
    content: '',
    scheduledFor: getCurrentDateTime(),
    status: 'draft'
  })

  const [editingPost, setEditingPost] = useState<null | {
    id: number;
    platform: string;
    content: string;
    scheduledFor: string;
    status: string;
  }>(null);

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: FaInstagram, color: 'text-pink-500' },
    { id: 'linkedin', name: 'LinkedIn', icon: FaLinkedin, color: 'text-blue-600' },
    { id: 'twitter', name: 'Twitter', icon: FaTwitter, color: 'text-blue-400' },
    { id: 'youtube', name: 'YouTube', icon: FaYoutube, color: 'text-red-600' },
    { id: 'facebook', name: 'Facebook', icon: FaFacebookSquare, color: 'text-blue-500' },
    { id: 'tiktok', name: 'TikTok', icon: FaTiktok, color: 'text-gray-800 dark:text-white' },
    { id: 'pinterest', name: 'Pinterest', icon: FaPinterest, color: 'text-red-500' },
    { id: 'medium', name: 'Medium', icon: FaMedium, color: 'text-gray-800 dark:text-white' }
  ];

  const getPlatformIcon = (platformName: string) => {
    const platform = platforms.find(p => p.name === platformName);
    if (!platform) return null;
    
    const Icon = platform.icon;
    return <Icon className={`h-4 w-4 ${platform.color}`} />;
  };

  const handleEdit = (post: typeof editingPost) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPost) {
      // Update existing post
      setPosts(posts => posts.map(post => 
        post.id === editingPost.id 
          ? { ...editingPost }
          : post
      ));
    } else {
      // Create new post
      setPosts(posts => [...posts, {
        id: posts.length + 1,
        ...newPost
      }]);
    }
    setIsModalOpen(false);
    setEditingPost(null);
    setNewPost({
      platform: 'Instagram',
      content: '',
      scheduledFor: getCurrentDateTime(),
      status: 'draft'
    });
  };

  const handleDelete = (id: number) => {
    setPosts(posts => posts.filter(post => post.id !== id))
  }

  const toggleStatus = (id: number) => {
    setPosts(posts => posts.map(post => 
      post.id === id 
        ? { ...post, status: post.status === 'draft' ? 'scheduled' : 'draft' }
        : post
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-2 sm:p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header Section */}
        <div className="mb-4 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Content Scheduler
            </h1>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 
                bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg 
                transition-all duration-200"
            >
              <span>New Post</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-6">
          <div className="grid grid-cols-1 gap-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="border dark:border-gray-700 rounded-lg p-3 sm:p-4 hover:shadow-sm 
                  transition-all duration-200"
              >
                {/* Post Header */}
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs 
                    bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {getPlatformIcon(post.platform)}
                    <span>{post.platform}</span>
                  </span>
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                    post.status === 'scheduled'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                  </span>
                </div>

                {/* Post Content */}
                <p className="text-sm sm:text-base text-gray-900 dark:text-white mb-3">
                  {post.content}
                </p>

                {/* Post Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 
                  pt-3 border-t dark:border-gray-700">
                  <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    <CalendarIcon className="h-4 w-4 mr-1.5" />
                    <span className="truncate">{formatDate(post.scheduledFor)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(post)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-1.5 
                        text-xs font-medium text-blue-600 hover:text-blue-800 
                        hover:bg-blue-50 rounded-md"
                    >
                      <svg className="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                        />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-1.5 
                        text-xs font-medium text-red-600 hover:text-red-800 
                        hover:bg-red-50 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {posts.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-400 dark:text-gray-500 mb-3">
                  <svg className="mx-auto h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
                    />
                  </svg>
                </div>
                <h3 className="text-base font-medium text-gray-900 dark:text-white">No posts yet</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new post</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 p-2 sm:p-4">
            <div className="min-h-full flex items-center justify-center">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-20 backdrop-blur-sm" 
                onClick={() => setIsModalOpen(false)}
              />

              <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                {/* Modal Close Button */}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute right-2 top-2 p-2 rounded-full hover:bg-gray-100 
                    dark:hover:bg-gray-700 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Modal Content */}
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-center mb-4">
                    {editingPost ? 'Edit Post' : 'Create New Post'}
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Form fields remain the same, just update styling for consistency */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium">Platform</label>
                      <select
                        value={editingPost?.platform || newPost.platform}
                        onChange={(e) => editingPost 
                          ? setEditingPost({...editingPost, platform: e.target.value})
                          : setNewPost({...newPost, platform: e.target.value})
                        }
                        className="w-full rounded-lg border border-gray-200 bg-white dark:bg-gray-800 
                          px-3 py-2 text-sm"
                      >
                        {platforms.map((platform) => (
                          <option key={platform.id} value={platform.name}>
                            {platform.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium">Content</label>
                      <textarea
                        value={editingPost?.content || newPost.content}
                        onChange={(e) => editingPost
                          ? setEditingPost({...editingPost, content: e.target.value})
                          : setNewPost({...newPost, content: e.target.value})
                        }
                        rows={3}
                        className="w-full rounded-lg border border-gray-200 bg-white dark:bg-gray-800 
                          p-3 text-sm"
                        placeholder="What would you like to share?"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium">Schedule For</label>
                      <input
                        type="datetime-local"
                        value={editingPost?.scheduledFor || newPost.scheduledFor}
                        onChange={(e) => editingPost
                          ? setEditingPost({...editingPost, scheduledFor: e.target.value})
                          : setNewPost({...newPost, scheduledFor: e.target.value})
                        }
                        min={getCurrentDateTime()}
                        className="w-full rounded-lg border border-gray-200 bg-white dark:bg-gray-800 
                          px-3 py-2 text-sm"
                      />
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setIsModalOpen(false);
                          setEditingPost(null);
                        }}
                        className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 
                          bg-gray-100 hover:bg-gray-200 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white 
                          bg-blue-600 hover:bg-blue-700 rounded-lg"
                      >
                        {editingPost ? 'Save Changes' : 'Create Post'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}