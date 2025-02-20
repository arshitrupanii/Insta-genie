import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Footer } from '@/components/Footer';

export default function LearnMore() {
  return (
    <>
      <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-6 sm:px-12 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold gradient-text mb-6">Learn More About InstaGenie</h1>
          <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            InstaGenie is an AI-powered platform designed to help content creators generate engaging captions.
          </p>
        </div>

        <div className="max-w-6xl mx-auto mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800/50 p-6 sm:p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 backdrop-blur-xl transform hover:scale-[1.02]">
            <h3 className="text-2xl font-semibold mb-3">🚀 AI-Powered Captions</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Generate creative and engaging captions tailored to your content with our smart AI technology.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800/50 p-6 sm:p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 backdrop-blur-xl transform hover:scale-[1.02]">
            <h3 className="text-2xl font-semibold mb-3">📸 Instant Hashtags</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Get optimized hashtags along with your captions to increase your reach and engagement.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800/50 p-6 sm:p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 backdrop-blur-xl transform hover:scale-[1.02]">
            <h3 className="text-2xl font-semibold mb-3">📊 Data-Driven Insights</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Analyze engagement trends and optimize your content strategy with AI-driven insights.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800/50 p-6 sm:p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 backdrop-blur-xl transform hover:scale-[1.02]">
            <h3 className="text-2xl font-semibold mb-3">🔗 Multi-Platform Integration</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Manage and schedule posts across multiple platforms for seamless content distribution.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link 
            href="/caption-generator" 
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:opacity-90 active:scale-95 transition-all duration-200"
          >
            Get Started Now <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
