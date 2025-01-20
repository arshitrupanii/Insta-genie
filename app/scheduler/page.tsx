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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Content Scheduler
            </h1>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 
                text-white font-semibold rounded-lg shadow-sm transition-all duration-200 
                hover:shadow-md active:transform active:scale-95"
            >
              <span className="mr-2">New Post</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
            <div className="grid grid-cols-1 gap-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="group border dark:border-gray-700 rounded-lg p-6 hover:shadow-md 
                    transition-all duration-200 hover:border-blue-200 dark:hover:border-blue-800"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm 
                          font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {getPlatformIcon(post.platform)}
                          <span>{post.platform}</span>
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          post.status === 'scheduled'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-900 dark:text-white text-lg">
                        {post.content}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      {formatDate(post.scheduledFor)}
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium 
                          text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md 
                          transition-colors duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" 
                          fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                          />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium 
                          text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md 
                          transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {posts.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 dark:text-gray-500 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">No posts yet</h3>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">Get started by creating a new post</p>
                </div>
              )}
            </div>
          </div>

          {isModalOpen && (
            <div 
              className="fixed inset-0 z-50"
              aria-labelledby="modal-title"
              role="dialog"
              aria-modal="true"
            >
              <div className="flex min-h-full items-center justify-center">
                <div 
                  className="fixed inset-0 bg-gray-500 bg-opacity-20 transition-opacity backdrop-blur-sm"
                  aria-hidden="true"
                  onClick={() => setIsModalOpen(false)}
                ></div>

                <div className="relative transform rounded-2xl bg-white dark:bg-gray-800 
                  text-left shadow-2xl transition-all w-full m-3 sm:m-6
                  sm:max-w-md md:max-w-lg lg:max-w-xl animate-[modal-enter_0.3s_ease-out]"
                >
                  {/* Close Button */}
                  <div className="absolute right-0 top-0 pr-4 pt-4 z-10">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="rounded-full h-8 w-8 flex items-center justify-center
                        bg-gray-100 dark:bg-gray-700 text-gray-400 
                        hover:text-gray-500 focus:outline-none focus:ring-2 
                        focus:ring-blue-500"
                    >
                      <span className="sr-only">Close</span>
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="px-4 pt-5 pb-4 sm:p-6">
                    <div className="flex items-center justify-center mb-4">
                      <div className="mx-auto flex h-10 w-10 flex-shrink-0 
                        items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900"
                      >
                        <svg className="h-5 w-5 text-blue-600 dark:text-blue-200" 
                          fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d={editingPost ? "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" : "M12 4v16m8-8H4"} 
                          />
                        </svg>
                      </div>
                    </div>
                    <h3 
                      className="text-center text-lg font-semibold text-gray-900 
                        dark:text-white mb-5"
                      id="modal-title"
                    >
                      {editingPost ? 'Edit Post' : 'Create New Post'}
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                          Platform
                        </label>
                        <div className="relative">
                          <select
                            value={editingPost?.platform || newPost.platform}
                            onChange={(e) => editingPost 
                              ? setEditingPost({...editingPost, platform: e.target.value})
                              : setNewPost({...newPost, platform: e.target.value})
                            }
                            className="block w-full rounded-xl border border-gray-200 bg-white/50 
                              dark:bg-gray-800/50 backdrop-blur-sm pl-10 pr-10 py-2.5 text-sm
                              shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                              focus:border-blue-500 dark:border-gray-600 dark:text-white 
                              transition-all duration-200 hover:bg-white/80 dark:hover:bg-gray-800/80"
                          >
                            {platforms.map((platform) => (
                              <option key={platform.id} value={platform.name}>
                                {platform.name}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex 
                            items-center pl-3 text-gray-400">
                            {getPlatformIcon(editingPost?.platform || newPost.platform)}
                          </div>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex 
                            items-center px-3 text-gray-400">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                          Content
                        </label>
                        <textarea
                          value={editingPost?.content || newPost.content}
                          onChange={(e) => editingPost
                            ? setEditingPost({...editingPost, content: e.target.value})
                            : setNewPost({...newPost, content: e.target.value})
                          }
                          placeholder="What would you like to share?"
                          rows={3}
                          className="block w-full rounded-xl border border-gray-200 bg-white/50 
                            dark:bg-gray-800/50 backdrop-blur-sm p-3 text-sm shadow-sm 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 
                            focus:border-blue-500 dark:border-gray-600 dark:text-white 
                            placeholder-gray-400 dark:placeholder-gray-300 transition-all 
                            duration-200 resize-none hover:bg-white/80 dark:hover:bg-gray-800/80"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                          Schedule For
                        </label>
                        <div className="relative">
                          <input
                            type="datetime-local"
                            value={editingPost?.scheduledFor || newPost.scheduledFor}
                            onChange={(e) => editingPost
                              ? setEditingPost({...editingPost, scheduledFor: e.target.value})
                              : setNewPost({...newPost, scheduledFor: e.target.value})
                            }
                            min={getCurrentDateTime()}
                            className="block w-full rounded-xl border border-gray-200 bg-white/50 
                              dark:bg-gray-800/50 backdrop-blur-sm pl-4 pr-10 py-2.5 text-sm
                              shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                              focus:border-blue-500 dark:border-gray-600 dark:text-white 
                              transition-all duration-200 hover:bg-white/80 dark:hover:bg-gray-800/80"
                          />
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex 
                            items-center px-3 text-gray-400">
                            <CalendarIcon className="h-4 w-4" />
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsModalOpen(false);
                            setEditingPost(null);
                          }}
                          className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 
                            bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-700 
                            dark:text-gray-200 text-sm font-medium hover:bg-white/80 
                            dark:hover:bg-gray-800/80 focus:outline-none focus:ring-2 
                            focus:ring-blue-500 transition-all duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600/90 
                            backdrop-blur-sm text-white text-sm font-medium hover:bg-blue-600 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all 
                            duration-200 transform active:scale-95"
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
    </div>
  )
}