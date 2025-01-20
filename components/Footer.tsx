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
    <footer className="border-t border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="max-w-sm">
            <h3 className="font-bold text-xl text-gray-900 dark:text-white">AI Content Creator</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Create better content with AI-powered tools. Streamline your social media workflow.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-12 gap-y-8">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">Product</h4>
              <ul className="space-y-3">
                {features.map((feature) => (
                  <li key={feature.title}>
                    <Link href={feature.href} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                      {feature.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">Company</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} AI Content Creator. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
} 