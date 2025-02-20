import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Footer } from "@/components/Footer";

export default function Home() {
  const features = [
    {
      title: "AI Content Ideation",
      description: "Generate trending content ideas based on your niche and audience.",
      href: "/content-ideas",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Caption Generator",
      description: "Create engaging captions with AI-powered suggestions and hashtags.",
      href: "/caption-generator",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Multi-Platform Posting",
      description: "Schedule and manage posts across multiple social media platforms.",
      href: "/scheduler",
      gradient: "from-orange-500 to-red-500",
    },
    {
      title: "Analytics Dashboard",
      description: "Track performance metrics and get insights to grow your audience.",
      href: "/analytics",
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <>
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative isolate overflow-hidden">
          <div className="hero-gradient absolute inset-0" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight gradient-text mb-6 sm:mb-8 leading-tight">
                Create Better Caption with AI
              </h1>
              <p className="text-xs sm:text-sm md:text-lg text-gray-600 dark:text-gray-300">
                <span className="block sm:hidden">
                  AI-powered tools for content—ideas, captions & posts.
                </span>
                <span className="hidden sm:block">
                  Streamline your content creation process with AI-powered tools. Generate ideas, create captions, and manage your social media presence all in one place.
                </span>
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                <Link
                  href="/caption-generator"
                  className="w-full sm:w-auto max-w-xs sm:max-w-none rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold text-white shadow-lg hover:opacity-90 active:scale-95 transition-all duration-200 hover:scale-105"
                >
                  Get Started
                </Link>
                <Link
                  href="/features"
                  className="group text-sm sm:text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2 hover:gap-3 active:opacity-70 transition-all duration-200"
                >
                  Learn more
                  <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12 sm:pb-24">
          <div className="mx-auto max-w-2xl lg:text-center mb-12 sm:mb-16">
            <h2 className="text-sm sm:text-base font-semibold leading-7 text-blue-600 uppercase tracking-wider">
              Features
            </h2>
            <p className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Everything you need to create amazing content
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800/50 p-6 sm:p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 backdrop-blur-xl transform hover:scale-[1.02]"
              >
                <div className={`absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${feature.gradient}`} />
                <dt className="flex items-center gap-x-3 text-lg sm:text-xl font-semibold leading-7 text-gray-900 dark:text-white">
                  {feature.title}
                </dt>
                <dd className="mt-3 flex flex-auto flex-col text-sm sm:text-base leading-6 sm:leading-7 text-gray-600 dark:text-gray-300">
                  <p className="flex-auto">{feature.description}</p>
                  <p className="mt-4">
                    <Link
                      href={feature.href}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-500 flex items-center gap-2 group/link"
                    >
                      Learn more
                      <ArrowRightIcon className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                  </p>
                </dd>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
