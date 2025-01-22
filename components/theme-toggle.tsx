
'use client'

import { useTheme } from 'next-themes'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        <SunIcon className="absolute h-5 w-5 transition-all dark:opacity-0" />
        <MoonIcon className="absolute h-5 w-5 transition-all opacity-0 dark:opacity-100" />
      </div>
    </button>
  )
}