'use client'

import { useTheme } from 'next-themes'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      <span className="sr-only">Toggle theme</span>
      <SunIcon className="h-5 w-5 block dark:hidden" />
      <MoonIcon className="h-5 w-5 hidden dark:block" />
    </button>
  )
}