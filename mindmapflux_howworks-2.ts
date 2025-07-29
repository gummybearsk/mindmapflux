// pages/how-it-works.tsx
import Head from 'next/head';
import Link from 'next/link';

export default function HowItWorks() {
  return (
    <>
      <Head>
        <title>How Mindmapflux Works - AI Mind Mapping Process Explained 2025</title>
        <meta name="description" content="Learn how Mindmapflux transforms your thoughts into intelligent mind maps. Step-by-step guide to AI-powered thought organization and visual mapping." />
        <meta name="keywords" content="how mind mapping works, AI mind mapping process, thought organization steps, visual thinking guide, mind map creation" />
        <link rel="canonical" href="https://mindmapflux.com/how-it-works" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Navigation - Same as homepage */}
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                Mindmapflux
              </Link>
              <div className="hidden md:flex space-x-8">
                <Link href="/how-it-works" className="text-blue-600 px-3 py-2 text-sm font-medium">
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
        </nav>

        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-r from-blue-50 to-green-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              How Mindmapflux Transforms Your Thoughts Into Visual Maps
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Mindmapflux uses advanced AI to understand your thoughts and create dynamic, evolving mind maps. 
              Unlike static mapping tools, our platform restructures and optimizes your ideas in real-time.
            </p>
            <Link 
              href="/tool" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 inline-block"
            >
              Try It Now - Free
            </Link>
          </div>
        </section>

        {/* Step-by-Step Process */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                The 3-Step AI Mind Mapping Process
              </h2>
              <p className="text-lg text-gray-600">
                From scattered thoughts to organized visual insights in minutes
              </p>
            </div>

            {/* Step 1 */}
            <div className="mb-20">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="lg:w-1/2">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mr-4">
                      1
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Input Your Thoughts</h3>
                  </div>
                  <p className="text-lg text-gray-600 mb-6">
                    Start by typing any thoughts, ideas, or concepts you want to organize. Don't worry about structure - 
                    just dump everything that's in your mind. Our AI understands natural language and can work with:
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Incomplete sentences and fragments</li>
                    <li>• Random ideas without clear connections</li>
                    <li>• Business concepts and strategies</li>
                    <li>• Problem statements and solutions</li>
                    <li>• Goals and action items</li>
                  </ul>
                </div>
                <div className="lg:w-1/2">
                  <div className="bg-gray-100 p-6 rounded-lg">
                    <div className="bg-white p-4 rounded shadow-sm">
                      <h4 className="font-semibold mb-2">Example Input:</h4>
                      <p className="text-sm text-gray-600">
                        "I want to start an online business... maybe selling courses... need to find my target audience... 
                        competitor analysis... pricing strategy... marketing channels like social media... content creation..."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="mb-20">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="lg:w-1/2">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mr-4">
                      3
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Interactive Visual Mind Map</h3>
                  </div>
                  <p className="text-lg text-gray-600 mb-6">
                    Your organized thoughts are transformed into a dynamic, interactive mind map that you can:
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Drag and rearrange nodes</li>
                    <li>• Add new ideas that auto-connect</li>
                    <li>• Expand or collapse sections</li>
                    <li>• Edit and refine concepts</li>
                    <li>• Export in multiple formats</li>
                  </ul>
                  <p className="text-lg text-gray-600 mt-6">
                    The map evolves as you think - add new information and watch the AI reorganize everything for optimal clarity.
                  </p>
                </div>
                <div className="lg:w-1/2">
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-lg">
                    <h4 className="font-semibold mb-4">Your Mind Map:</h4>
                    <div className="relative">
                      {/* Simplified visual representation */}
                      <div className="text-center">
                        <div className="bg-blue-600 text-white px-4 py-2 rounded-lg inline-block mb-4">
                          Online Business
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-green-100 px-3 py-2 rounded text-sm">Strategy</div>
                          <div className="bg-purple-100 px-3 py-2 rounded text-sm">Marketing</div>
                          <div className="bg-orange-100 px-3 py-2 rounded text-sm">Operations</div>
                          <div className="bg-blue-100 px-3 py-2 rounded text-sm">Analysis</div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Interactive nodes you can click and expand</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                What Makes Mindmapflux Different
              </h2>
              <p className="text-lg text-gray-600">
                Traditional mind mapping tools are static. Mindmapflux evolves with your thinking.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Dynamic Restructuring</h3>
                <p className="text-gray-600">
                  Add new thoughts and watch your mind map automatically reorganize for better logical flow and clarity.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Intelligent Suggestions</h3>
                <p className="text-gray-600">
                  Get AI-powered recommendations for missing connections, related concepts, and better organization patterns.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-Time Evolution</h3>
                <p className="text-gray-600">
                  Your mind map grows and changes as you think, reflecting your evolving understanding and new insights.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Natural Language Input</h3>
                <p className="text-gray-600">
                  No need to pre-structure your thoughts. Just type naturally and let AI organize everything for you.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Business Focused</h3>
                <p className="text-gray-600">
                  Optimized for business ideation, strategic planning, and professional thought organization workflows.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Private</h3>
                <p className="text-gray-600">
                  Your thoughts and ideas are processed securely. No data is stored or shared with third parties.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600">
                Everything you need to know about how Mindmapflux works
              </p>
            </div>

            <div className="space-y-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How is this different from traditional mind mapping tools?
                </h3>
                <p className="text-gray-600">
                  Traditional tools require you to manually create and organize nodes. Mindmapflux uses AI to automatically 
                  understand your thoughts, create logical connections, and reorganize your map as you add new information. 
                  It's like having an intelligent assistant that helps structure your thinking.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Do I need to structure my thoughts before inputting them?
                </h3>
                <p className="text-gray-600">
                  Not at all! That's the beauty of Mindmapflux. You can input scattered, incomplete thoughts in any order. 
                  Our AI is designed to work with natural, unstructured input and will organize everything for you.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibent text-gray-900 mb-2">
                  Can I edit the AI-generated mind map?
                </h3>
                <p className="text-gray-600">
                  Absolutely! The AI creates the initial structure, but you have full control to edit, rearrange, add, 
                  or remove any elements. The map is completely interactive and customizable to your preferences.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What happens when I add new thoughts to an existing map?
                </h3>
                <p className="text-gray-600">
                  When you add new information, the AI analyzes how it relates to existing content and automatically 
                  integrates it into the most logical position. It may also suggest restructuring other parts of the 
                  map to maintain optimal organization.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Is my data secure and private?
                </h3>
                <p className="text-gray-600">
                  Yes, we take privacy seriously. Your thoughts and ideas are processed securely and are not stored 
                  permanently on our servers. We don't share your data with third parties or use it for any purpose 
                  other than creating your mind map.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I export my mind maps?
                </h3>
                <p className="text-gray-600">
                  Yes! You can export your mind maps in various formats including PDF, PNG, and text outlines. 
                  This makes it easy to share your organized thoughts or integrate them into other workflows.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Experience AI-Powered Mind Mapping?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Transform your scattered thoughts into organized visual insights in minutes, not hours.
            </p>
            <Link 
              href="/tool" 
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              Start Creating Your Mind Map
            </Link>
          </div>
        </section>

        {/* Footer - Same as homepage */}
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

            {/* Step 2 */}
            <div className="mb-20">
              <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
                <div className="lg:w-1/2">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mr-4">
                      2
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">AI Analysis & Organization</h3>
                  </div>
                  <p className="text-lg text-gray-600 mb-6">
                    Our AI engine analyzes your input using advanced natural language processing to:
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Identify key concepts and entities</li>
                    <li>• Recognize relationships between ideas</li>
                    <li>• Group related thoughts into logical clusters</li>
                    <li>• Suggest missing elements or connections</li>
                    <li>• Organize information hierarchically</li>
                  </ul>
                  <p className="text-lg text-gray-600 mt-6">
                    This process takes just seconds but provides insights that would take hours to organize manually.
                  </p>
                </div>
                <div className="lg:w-1/2">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-semibold mb-4">AI Processing:</h4>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded shadow-sm">
                        <span className="text-sm font-medium text-blue-600">Concept Extraction:</span>
                        <p className="text-sm text-gray-600">Online Business, Courses, Target Audience...</p>
                      </div>
                      <div className="bg-white p-3 rounded shadow-sm">
                        <span className="text-sm font-medium text-green-600">Relationship Mapping:</span>
                        <p className="text-sm text-gray-600">Marketing → Audience → Content → Courses</p>
                      </div>
                      <div className="bg-white p-3 rounded shadow-sm">
                        <span className="text-sm font-medium text-purple-600">Clustering:</span>
                        <p className="text-sm text-gray-600">Strategy, Marketing, Operations, Analysis</p>
                      </div>
                    </div>
                  </div>
                