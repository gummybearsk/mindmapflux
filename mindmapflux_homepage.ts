// pages/index.tsx
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement email capture
    console.log('Email submitted:', email);
  };

  return (
    <>
      <Head>
        <title>Mindmapflux - AI-Powered Mind Mapping for Business Ideas & Thought Organization</title>
        <meta name="description" content="Transform your thoughts into visual mind maps with AI assistance. Organize business ideas, clarify thinking, and visualize connections with Mindmapflux - the intelligent thought mapping platform." />
        <meta name="keywords" content="mind mapping, business ideas, thought organization, AI mind map, visual thinking, idea mapping, business planning, creativity tools" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://mindmapflux.com" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mindmapflux.com" />
        <meta property="og:title" content="Mindmapflux - AI-Powered Mind Mapping Platform" />
        <meta property="og:description" content="Transform your thoughts into visual mind maps with AI assistance. Perfect for business ideation and thought organization." />
        <meta property="og:image" content="https://mindmapflux.com/og-image.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://mindmapflux.com" />
        <meta property="twitter:title" content="Mindmapflux - AI-Powered Mind Mapping Platform" />
        <meta property="twitter:description" content="Transform your thoughts into visual mind maps with AI assistance. Perfect for business ideation and thought organization." />
        <meta property="twitter:image" content="https://mindmapflux.com/og-image.jpg" />
        
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        {/* Navigation */}
        <nav className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/" className="text-2xl font-bold text-blue-600">
                  Mindmapflux
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-8">
                  <Link href="/how-it-works" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                    How It Works
                  </Link>
                  <Link href="/mind-mapping-guide" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                    Guide
                  </Link>
                  <Link href="/business-mind-mapping" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                    Business
                  </Link>
                  <Link href="/about" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                    About
                  </Link>
                  <Link href="/tool" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                    Try Free Tool
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Transform Your Thoughts Into 
                <span className="text-blue-600"> Visual Mind Maps</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
                AI-powered mind mapping that evolves with your thinking. Organize business ideas, 
                clarify complex thoughts, and visualize connections like never before.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Link 
                  href="/tool" 
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Start Mind Mapping Free
                </Link>
                <Link 
                  href="/how-it-works" 
                  className="text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  See How It Works →
                </Link>
              </div>
              
              {/* Trust Indicators */}
              <div className="text-gray-500 text-sm">
                ✓ No sign-up required ✓ Free forever ✓ AI-powered insights
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Why Mindmapflux Works Better
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Unlike static mind mapping tools, Mindmapflux uses AI to understand your thoughts 
                and dynamically evolve your mind map as you think.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Insights</h3>
                <p className="text-gray-600">
                  Get intelligent suggestions for connections, missing elements, and better organization of your ideas.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Dynamic Evolution</h3>
                <p className="text-gray-600">
                  Your mind map restructures automatically as you add new thoughts, creating better logical flow.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Business Focused</h3>
                <p className="text-gray-600">
                  Designed specifically for business ideation, strategic planning, and professional thought organization.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600">
                Three simple steps to transform your scattered thoughts into organized visual insights
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Input Your Thoughts</h3>
                <p className="text-gray-600">
                  Simply type or speak your ideas, no matter how scattered or incomplete they are.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Analysis</h3>
                <p className="text-gray-600">
                  Our AI understands your concepts and creates logical connections between ideas.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Visual Mind Map</h3>
                <p className="text-gray-600">
                  Get an interactive mind map that evolves as you refine and add more thoughts.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Link 
                href="/tool" 
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Try It Now - It's Free
              </Link>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Perfect For Every Business Need
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Strategy</h3>
                <p className="text-gray-600 text-sm">
                  Map out business models, competitive analysis, and strategic planning.
                </p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Development</h3>
                <p className="text-gray-600 text-sm">
                  Organize feature ideas, user requirements, and development roadmaps.
                </p>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Planning</h3>
                <p className="text-gray-600 text-sm">
                  Break down complex projects into manageable tasks and dependencies.
                </p>
              </div>
              
              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Problem Solving</h3>
                <p className="text-gray-600 text-sm">
                  Analyze problems from multiple angles and explore solution pathways.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Organize Your Thoughts?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Start creating intelligent mind maps today. No account required, completely free to use.
            </p>
            <Link 
              href="/tool" 
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              Start Mind Mapping Now
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Mindmapflux</h3>
                <p className="text-gray-400">
                  AI-powered mind mapping for better thinking and business ideation.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Tools</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/tool" className="hover:text-white">Mind Map Creator</Link></li>
                  <li><Link href="/business-mind-mapping" className="hover:text-white">Business Templates</Link></li>
                  <li><Link href="/how-it-works" className="hover:text-white">How It Works</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Learn</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/mind-mapping-guide" className="hover:text-white">Mind Mapping Guide</Link></li>
                  <li><Link href="/business-ideation-techniques" className="hover:text-white">Business Ideation</Link></li>
                  <li><Link href="/creative-thinking-methods" className="hover:text-white">Creative Thinking</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/about" className="hover:text-white">About</Link></li>
                  <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
              <p>&copy; 2025 Mindmapflux. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}