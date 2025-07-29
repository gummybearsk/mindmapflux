import React from 'react';
import Head from 'next/head';

const HowItWorks: React.FC = () => {
  return (
    <>
      <Head>
        <title>How It Works - AI-Powered Mind Mapping | Mindmapflux</title>
        <meta name="description" content="Discover how Mindmapflux transforms your thoughts into dynamic, AI-enhanced mind maps. Learn our 3-step process for better thinking and planning." />
        <meta name="keywords" content="how mind mapping works, AI mind mapping process, dynamic mind maps, thought organization" />
        <link rel="canonical" href="https://mindmapflux.com/how-it-works" />
        
        {/* Open Graph */}
        <meta property="og:title" content="How It Works - AI-Powered Mind Mapping | Mindmapflux" />
        <meta property="og:description" content="Discover how Mindmapflux transforms your thoughts into dynamic, AI-enhanced mind maps. Learn our 3-step process for better thinking and planning." />
        <meta property="og:url" content="https://mindmapflux.com/how-it-works" />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="How It Works - AI-Powered Mind Mapping | Mindmapflux" />
        <meta name="twitter:description" content="Discover how Mindmapflux transforms your thoughts into dynamic, AI-enhanced mind maps. Learn our 3-step process for better thinking and planning." />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Create AI-Powered Mind Maps",
            "description": "Learn how to create dynamic, AI-enhanced mind maps with Mindmapflux",
            "step": [
              {
                "@type": "HowToStep",
                "name": "Input Your Thoughts",
                "text": "Share your ideas, goals, or challenges in natural language"
              },
              {
                "@type": "HowToStep", 
                "name": "AI Analysis",
                "text": "Our AI analyzes relationships and structures your thoughts intelligently"
              },
              {
                "@type": "HowToStep",
                "name": "Dynamic Evolution",
                "text": "Your mind map evolves and adapts as you add more information"
              }
            ]
          })}
        </script>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <a href="/" className="text-2xl font-bold text-blue-600">
                  Mindmapflux
                </a>
              </div>
              <div className="hidden md:flex space-x-8">
                <a href="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</a>
                <a href="/how-it-works" className="text-blue-600 font-medium">How It Works</a>
                <a href="/mind-mapping-guide" className="text-gray-700 hover:text-blue-600 transition-colors">Guide</a>
                <a href="/business-mind-mapping" className="text-gray-700 hover:text-blue-600 transition-colors">Business</a>
                <a href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">About</a>
              </div>
              <a
                href="/tool"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Mapping
              </a>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How <span className="text-blue-600">AI-Powered</span> Mind Mapping Works
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover how Mindmapflux transforms your scattered thoughts into organized, 
              actionable mind maps that evolve with your thinking process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/tool"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Try It Now - Free
              </a>
              <a
                href="#process"
                className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                See the Process
              </a>
            </div>
          </div>
        </section>

        {/* The Process Section */}
        <section id="process" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Three Simple Steps to Better Thinking
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our AI-powered process transforms complex ideas into clear, visual structures 
                that help you think more effectively and make better decisions.
              </p>
            </div>

            {/* Step 1 */}
            <div className="mb-20">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="lg:w-1/2">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mr-4">
                      1
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                      Input Your Thoughts
                    </h3>
                  </div>
                  <p className="text-lg text-gray-600 mb-6">
                    Simply type or speak your ideas, challenges, goals, or any topic you want to explore. 
                    No need for perfect structure - our AI understands natural language and context.
                  </p>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Natural language processing
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Voice input supported
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Context-aware understanding
                    </li>
                  </ul>
                </div>
                <div className="lg:w-1/2">
                  <div className="bg-gray-100 rounded-lg p-8 shadow-lg">
                    <div className="bg-white rounded-lg p-6 border-2 border-dashed border-gray-300">
                      <div className="text-gray-400 mb-4">💭 Input Example:</div>
                      <p className="text-gray-700 italic">
                        "I need to launch a new product but I'm worried about market competition, 
                        budget constraints, and timeline pressures. I also need to consider team 
                        resources and customer feedback from our last launch..."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="mb-20">
              <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
                <div className="lg:w-1/2">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mr-4">
                      2
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                      AI Analysis & Structuring
                    </h3>
                  </div>
                  <p className="text-lg text-gray-600 mb-6">
                    Our advanced AI analyzes your input to identify key concepts, relationships, 
                    and logical connections. It creates an intelligent structure that reveals 
                    insights you might have missed.
                  </p>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Identifies key themes and concepts
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Maps logical relationships
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Prioritizes by importance and urgency
                    </li>
                  </ul>
                </div>
                <div className="lg:w-1/2">
                  <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-lg p-8 shadow-lg">
                    <div className="text-center mb-4">
                      <div className="text-gray-600 mb-2">🧠 AI Processing...</div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="text-sm text-gray-500 mb-2">Analyzing relationships:</div>
                        <div className="space-y-2">
                          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs inline-block mr-2">Product Launch</div>
                          <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs inline-block mr-2">Competition</div>
                          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs inline-block mr-2">Budget</div>
                          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs inline-block">Resources</div>
                        </div>
                      </div>
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
                    <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mr-4">
                      3
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                      Dynamic Evolution
                    </h3>
                  </div>
                  <p className="text-lg text-gray-600 mb-6">
                    Your mind map isn't static - it evolves as you add new information, insights, 
                    or changes in perspective. The AI continuously restructures and optimizes 
                    the layout for maximum clarity and usefulness.
                  </p>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Real-time restructuring
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Adaptive layout optimization
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Continuous insight generation
                    </li>
                  </ul>
                </div>
                <div className="lg:w-1/2">
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-8 shadow-lg relative">
                    <div className="text-center">
                      <div className="text-gray-600 mb-4">🎯 Your Dynamic Mind Map</div>
                      <div className="bg-white rounded-lg p-6 shadow-sm">
                        <div className="text-center mb-4">
                          <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold mb-4">
                            Product Launch Strategy
                          </div>
                          <div className="flex justify-center space-x-4 mb-4">
                            <div className="bg-red-100 text-red-800 px-3 py-2 rounded-lg text-sm">
                              Market Analysis
                            </div>
                            <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm">
                              Resource Planning
                            </div>
                          </div>
                          <div className="flex justify-center space-x-2">
                            <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Budget</div>
                            <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Timeline</div>
                            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Team</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-pulse">
                      ✨
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Enhancement Features */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                AI-Powered Enhancement Features
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Beyond basic mind mapping, our AI provides intelligent features 
                that transform how you think and plan.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white rounded-lg p-6 shadow-lg border-t-4 border-blue-600">
                <div className="text-3xl mb-4">🔄</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Dynamic Restructuring</h3>
                <p className="text-gray-600">
                  As you add new information, the AI automatically reorganizes your mind map 
                  to maintain logical flow and visual clarity.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-lg p-6 shadow-lg border-t-4 border-green-600">
                <div className="text-3xl mb-4">💡</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Intelligent Suggestions</h3>
                <p className="text-gray-600">
                  Get AI-powered suggestions for missing connections, potential solutions, 
                  and areas that need more exploration.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-lg p-6 shadow-lg border-t-4 border-purple-600">
                <div className="text-3xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Priority Analysis</h3>
                <p className="text-gray-600">
                  AI analyzes your content to identify high-priority items and 
                  critical path dependencies for better decision-making.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white rounded-lg p-6 shadow-lg border-t-4 border-red-600">
                <div className="text-3xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Gap Identification</h3>
                <p className="text-gray-600">
                  Automatically identifies missing elements, potential risks, 
                  and opportunities you might have overlooked.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-white rounded-lg p-6 shadow-lg border-t-4 border-yellow-600">
                <div className="text-3xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Pattern Recognition</h3>
                <p className="text-gray-600">
                  Discovers hidden patterns and relationships in your thinking 
                  that lead to breakthrough insights.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-white rounded-lg p-6 shadow-lg border-t-4 border-indigo-600">
                <div className="text-3xl mb-4">⚡</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time Adaptation</h3>
                <p className="text-gray-600">
                  Your mind map evolves instantly as your thinking develops, 
                  keeping pace with your creative process.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Traditional vs AI-Powered Mind Mapping
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                See how AI transforms the mind mapping experience from static 
                documentation to dynamic thinking assistance.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Traditional Tools</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-blue-600">Mindmapflux AI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Map Creation</td>
                    <td className="px-6 py-4 text-center text-gray-600">Manual node placement</td>
                    <td className="px-6 py-4 text-center text-green-600 font-semibold">AI-powered automatic structuring</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Content Analysis</td>
                    <td className="px-6 py-4 text-center text-gray-600">User interpretation only</td>
                    <td className="px-6 py-4 text-center text-green-600 font-semibold">AI identifies patterns & gaps</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Evolution</td>
                    <td className="px-6 py-4 text-center text-gray-600">Static once created</td>
                    <td className="px-6 py-4 text-center text-green-600 font-semibold">Dynamic restructuring</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Insights</td>
                    <td className="px-6 py-4 text-center text-gray-600">Limited to user knowledge</td>
                    <td className="px-6 py-4 text-center text-green-600 font-semibold">AI-generated suggestions</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Collaboration</td>
                    <td className="px-6 py-4 text-center text-gray-600">Manual sharing & merging</td>
                    <td className="px-6 py-4 text-center text-green-600 font-semibold">Intelligent synthesis</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600">
                Everything you need to know about AI-powered mind mapping
              </p>
            </div>

            <div className="space-y-8">
              {/* FAQ 1 */}
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  How is AI mind mapping different from traditional mind mapping?
                </h3>
                <p className="text-gray-600">
                  Traditional mind mapping requires you to manually structure and organize your thoughts. 
                  AI mind mapping analyzes your input, identifies relationships, suggests connections, 
                  and continuously evolves the structure as you add new information. It's like having 
                  a thinking partner that helps you see patterns and insights you might miss.
                </p>
              </div>

              {/* FAQ 2 */}
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Do I need to learn special formatting or syntax?
                </h3>
                <p className="text-gray-600">
                  Not at all! Simply type or speak your thoughts in natural language, just like 
                  you would explain them to a colleague. Our AI understands context, relationships, 
                  and priorities without requiring any special formatting or technical knowledge.
                </p>
              </div>

              {/* FAQ 3 */}
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  How accurate is the AI analysis of my thoughts?
                </h3>
                <p className="text-gray-600">
                  Our AI is trained on vast amounts of business and creative thinking patterns, 
                  making it highly accurate at identifying logical relationships and priorities. 
                  However, you maintain full control - you can edit, adjust, or override any 
                  AI suggestions to match your specific needs and preferences.
                </p>
              </div>

              {/* FAQ 4 */}
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Can I export my mind maps to other tools?
                </h3>
                <p className="text-gray-600">
                  Yes! You can export your mind maps in multiple formats including PNG images, 
                  PDF documents, and structured text formats. This makes it easy to share your 
                  thinking with others or integrate with your existing workflow tools.
                </p>
              </div>

              {/* FAQ 5 */}
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Is my data secure and private?
                </h3>
                <p className="text-gray-600">
                  Absolutely. Your data is encrypted in transit and at rest. We don't store your 
                  personal information or thought content beyond what's necessary to provide the service. 
                  You can delete your mind maps at any time, and we comply with all major privacy 
                  regulations including GDPR and CCPA.
                </p>
              </div>

              {/* FAQ 6 */}
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  What types of projects work best with AI mind mapping?
                </h3>
                <p className="text-gray-600">
                  AI mind mapping excels with complex, multi-faceted challenges like strategic planning, 
                  product development, problem-solving, creative brainstorming, and decision-making. 
                  It's particularly powerful for business scenarios where you need to consider multiple 
                  variables, stakeholders, and potential outcomes simultaneously.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Thinking?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Experience the power of AI-enhanced mind mapping. Start organizing your thoughts 
              more effectively in just minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/tool"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Start Mapping Now - Free
              </a>
              <a
                href="/mind-mapping-guide"
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="text-2xl font-bold text-blue-400 mb-4">Mindmapflux</div>
                <p className="text-gray-300 mb-4 max-w-md">
                  Transform your thinking with AI-powered mind mapping. 
                  Organize ideas, solve problems, and make better decisions.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Platform</h3>
                <ul className="space-y-2 text-gray-300">
                  <li><a href="/how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                  <li><a href="/tool" className="hover:text-white transition-colors">Mind Mapping Tool</a></li>
                  <li><a href="/mind-mapping-guide" className="hover:text-white transition-colors">Complete Guide</a></li>
                  <li><a href="/business-mind-mapping" className="hover:text-white transition-colors">Business Applications</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-gray-300">
                  <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 Mindmapflux. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HowItWorks;
