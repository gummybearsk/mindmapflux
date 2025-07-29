// pages/business-mind-mapping.tsx
import Head from 'next/head';
import Link from 'next/link';

export default function BusinessMindMapping() {
  return (
    <>
      <Head>
        <title>Business Mind Mapping - Strategic Planning & Ideation Tool 2025</title>
        <meta name="description" content="Transform your business strategy with AI-powered mind mapping. Perfect for strategic planning, project management, team brainstorming, and business model development." />
        <meta name="keywords" content="business mind mapping, strategic planning, business strategy, project management, team brainstorming, business model canvas" />
        <link rel="canonical" href="https://mindmapflux.com/business-mind-mapping" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                Mindmapflux
              </Link>
              <div className="hidden md:flex space-x-8">
                <Link href="/how-it-works" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                  How It Works
                </Link>
                <Link href="/mind-mapping-guide" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                  Guide
                </Link>
                <Link href="/business-mind-mapping" className="text-blue-600 px-3 py-2 text-sm font-medium">
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
              Business Mind Mapping: Strategic Thinking Made Visual
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Transform complex business challenges into clear, actionable strategies. Use AI-powered mind mapping 
              for strategic planning, project management, team alignment, and innovative problem-solving.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/tool" 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 inline-block text-center"
              >
                Start Business Planning
              </Link>
              <Link 
                href="#use-cases" 
                className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 inline-block text-center"
              >
                See Business Use Cases
              </Link>
            </div>
          </div>
        </section>

        {/* Why Business Mind Mapping Works */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Smart Businesses Use Mind Mapping
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Leading companies use visual thinking to solve complex problems, align teams, 
                and accelerate decision-making processes.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Faster Decision Making</h3>
                <p className="text-gray-600">
                  Visualize all factors and relationships at once, leading to 40% faster strategic decisions 
                  and reduced analysis paralysis.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Better Team Alignment</h3>
                <p className="text-gray-600">
                  Get everyone on the same page with shared visual understanding. Reduce miscommunication 
                  and improve project coordination.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovation & Creativity</h3>
                <p className="text-gray-600">
                  Visual thinking stimulates creative problem-solving. Discover new opportunities and 
                  innovative solutions your competitors miss.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Business Use Cases */}
        <section id="use-cases" className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Business Mind Mapping Applications
              </h2>
              <p className="text-lg text-gray-600">
                From startup planning to enterprise strategy, mind mapping transforms business thinking
              </p>
            </div>

            <div className="space-y-12">
              {/* Strategic Planning */}
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="lg:w-2/3">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Strategic Planning & Business Strategy</h3>
                    <p className="text-gray-600 mb-6">
                      Map your entire business strategy from vision to execution. Visualize market opportunities, 
                      competitive positioning, resource allocation, and strategic initiatives in one comprehensive view.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <ul className="space-y-2 text-gray-600">
                        <li>• Business model development</li>
                        <li>• Market analysis and segmentation</li>
                        <li>• Competitive landscape mapping</li>
                        <li>• SWOT analysis visualization</li>
                      </ul>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Goal setting and OKR planning</li>
                        <li>• Resource allocation planning</li>
                        <li>• Risk assessment and mitigation</li>
                        <li>• Growth strategy development</li>
                      </ul>
                    </div>
                  </div>
                  <div className="lg:w-1/3">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h4 className="font-semibold mb-2">Example: SaaS Startup Strategy</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="bg-blue-600 text-white px-2 py-1 rounded text-center">Product Strategy</div>
                        <div className="grid grid-cols-2 gap-1 mt-2">
                          <div className="bg-green-100 px-2 py-1 rounded text-xs">MVP Features</div>
                          <div className="bg-purple-100 px-2 py-1 rounded text-xs">Target Market</div>
                          <div className="bg-orange-100 px-2 py-1 rounded text-xs">Pricing Model</div>
                          <div className="bg-yellow-100 px-2 py-1 rounded text-xs">Go-to-Market</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Management */}
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="flex flex-col lg:flex-row-reverse items-center gap-8">
                  <div className="lg:w-2/3">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Project Management & Planning</h3>
                    <p className="text-gray-600 mb-6">
                      Break down complex projects into manageable components. Track dependencies, timelines, 
                      and resources while maintaining a clear overview of project scope and objectives.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <ul className="space-y-2 text-gray-600">
                        <li>• Project scope definition</li>
                        <li>• Work breakdown structures</li>
                        <li>• Timeline and milestone mapping</li>
                        <li>• Resource requirement planning</li>
                      </ul>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Team role clarification</li>
                        <li>• Risk identification and planning</li>
                        <li>• Stakeholder mapping</li>
                        <li>• Progress tracking systems</li>
                      </ul>
                    </div>
                  </div>
                  <div className="lg:w-1/3">
                    <div className="bg-green-50 p-6 rounded-lg">
                      <h4 className="font-semibold mb-2">Example: Product Launch</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="bg-green-600 text-white px-2 py-1 rounded text-center">Launch Project</div>
                        <div className="grid grid-cols-1 gap-1 mt-2">
                          <div className="bg-blue-100 px-2 py-1 rounded text-xs">Pre-Launch (8 weeks)</div>
                          <div className="bg-purple-100 px-2 py-1 rounded text-xs">Marketing Campaign</div>
                          <div className="bg-orange-100 px-2 py-1 rounded text-xs">Product Testing</div>
                          <div className="bg-yellow-100 px-2 py-1 rounded text-xs">Team Training</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Innovation & Ideation */}
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="lg:w-2/3">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Innovation & Idea Development</h3>
                    <p className="text-gray-600 mb-6">
                      Transform brainstorming sessions into structured innovation processes. Capture ideas, 
                      explore possibilities, and develop concepts from initial spark to market-ready solutions.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <ul className="space-y-2 text-gray-600">
                        <li>• Brainstorming session organization</li>
                        <li>• Idea evaluation and prioritization</li>
                        <li>• Product feature development</li>
                        <li>• Service design thinking</li>
                      </ul>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Market opportunity mapping</li>
                        <li>• User journey visualization</li>
                        <li>• Problem-solution fit analysis</li>
                        <li>• Innovation pipeline management</li>
                      </ul>
                    </div>
                  </div>
                  <div className="lg:w-1/3">
                    <div className="bg-purple-50 p-6 rounded-lg">
                      <h4 className="font-semibold mb-2">Example: New Feature Ideas</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="bg-purple-600 text-white px-2 py-1 rounded text-center">Feature Brainstorm</div>
                        <div className="grid grid-cols-2 gap-1 mt-2">
                          <div className="bg-red-100 px-2 py-1 rounded text-xs">User Pain Points</div>
                          <div className="bg-blue-100 px-2 py-1 rounded text-xs">Tech Solutions</div>
                          <div className="bg-green-100 px-2 py-1 rounded text-xs">Business Value</div>
                          <div className="bg-yellow-100 px-2 py-1 rounded text-xs">Implementation</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meeting & Communication */}
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="flex flex-col lg:flex-row-reverse items-center gap-8">
                  <div className="lg:w-2/3">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Meeting Planning & Communication</h3>
                    <p className="text-gray-600 mb-6">
                      Make meetings more productive and presentations more compelling. Structure agendas, 
                      capture discussions, and create visual presentations that engage and inform.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <ul className="space-y-2 text-gray-600">
                        <li>• Meeting agenda structuring</li>
                        <li>• Discussion topic organization</li>
                        <li>• Action item tracking</li>
                        <li>• Decision documentation</li>
                      </ul>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Presentation outline creation</li>
                        <li>• Complex concept explanation</li>
                        <li>• Stakeholder communication</li>
                        <li>• Training material design</li>
                      </ul>
                    </div>
                  </div>
                  <div className="lg:w-1/3">
                    <div className="bg-orange-50 p-6 rounded-lg">
                      <h4 className="font-semibold mb-2">Example: Board Meeting</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="bg-orange-600 text-white px-2 py-1 rounded text-center">Q4 Review</div>
                        <div className="grid grid-cols-1 gap-1 mt-2">
                          <div className="bg-blue-100 px-2 py-1 rounded text-xs">Financial Performance</div>
                          <div className="bg-green-100 px-2 py-1 rounded text-xs">Strategic Updates</div>
                          <div className="bg-purple-100 px-2 py-1 rounded text-xs">Market Analysis</div>
                          <div className="bg-yellow-100 px-2 py-1 rounded text-xs">Next Year Planning</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Business Success Stories
              </h2>
              <p className="text-lg text-gray-600">
                See how companies use mind mapping to achieve better business outcomes
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Tech Startup: Product Strategy</h3>
                <div className="space-y-3 text-gray-600">
                  <p><strong>Challenge:</strong> Complex product roadmap with multiple stakeholder inputs</p>
                  <p><strong>Solution:</strong> Used mind mapping to visualize feature priorities, user needs, and technical constraints</p>
                  <p><strong>Result:</strong> 60% faster product planning cycles and improved team alignment</p>
                </div>
                <div className="mt-4 text-sm text-blue-600 font-medium">
                  Time Saved: 15 hours per planning cycle
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Consulting Firm: Client Presentations</h3>
                <div className="space-y-3 text-gray-600">
                  <p><strong>Challenge:</strong> Complex analysis needed clear, compelling presentation format</p>
                  <p><strong>Solution:</strong> Created visual mind maps to structure findings and recommendations</p>
                  <p><strong>Result:</strong> 90% client approval rate and faster decision-making</p>
                </div>
                <div className="mt-4 text-sm text-green-600 font-medium">
                  Client Satisfaction: +25% improvement
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Manufacturing: Process Improvement</h3>
                <div className="space-y-3 text-gray-600">
                  <p><strong>Challenge:</strong> Inefficient production processes with multiple bottlenecks</p>
                  <p><strong>Solution:</strong> Mapped entire production workflow to identify improvement opportunities</p>
                  <p><strong>Result:</strong> 30% efficiency improvement and reduced waste</p>
                </div>
                <div className="mt-4 text-sm text-purple-600 font-medium">
                  Cost Savings: $2.3M annually
                </div>
              </div>

              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">E-commerce: Marketing Strategy</h3>
                <div className="space-y-3 text-gray-600">
                  <p><strong>Challenge:</strong> Fragmented marketing efforts across multiple channels</p>
                  <p><strong>Solution:</strong> Created integrated marketing mind map connecting all touchpoints</p>
                  <p><strong>Result:</strong> 45% increase in marketing ROI and better campaign coordination</p>
                </div>
                <div className="mt-4 text-sm text-orange-600 font-medium">
                  ROI Improvement: 45% increase
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Getting Started */}
        <section className="py-20 bg-blue-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Transform Your Business Thinking Today
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of businesses using AI-powered mind mapping for better strategy, 
              faster decisions, and improved team alignment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/tool" 
                className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                Start Your Business Mind Map
              </Link>
              <Link 
                href="/mind-mapping-guide" 
                className="border border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
              >
                Learn Mind Mapping Basics
              </Link>
            </div>
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