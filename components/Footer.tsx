import Link from 'next/link'

const features = [
  {
    title: 'AI Content Ideation',
    href: '/content-ideas',
  },
  {
    title: 'Caption Generator',
    href: '/caption-generator',
  },
  {
    title: 'Multi-Platform Posting',
    href: '/scheduler',
  },
  {
    title: 'Analytics Dashboard',
    href: '/analytics',
  },
]

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="/about" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">About</a></li>
              <li><a href="/careers" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Careers</a></li>
              <li><a href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Blog</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Support</h3>
            <ul className="space-y-3">
              <li><a href="/help" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Help Center</a></li>
              <li><a href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Contact</a></li>
              <li><a href="/status" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Status</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><a href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Privacy</a></li>
              <li><a href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Terms</a></li>
              <li><a href="/cookies" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Cookies</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Social</h3>
            <ul className="space-y-3">
              <li><a href="https://twitter.com" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Twitter</a></li>
              <li><a href="https://instagram.com" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Instagram</a></li>
              <li><a href="https://linkedin.com" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
} 