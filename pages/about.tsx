// pages/about.tsx
import Head from 'next/head';
import Link from 'next/link';

export default function About() {
  return (
    <>
      <Head>
        <title>About Mindmapflux - AI-Powered Mind Mapping Platform Mission</title>
        <meta name="description" content="Learn about Mindmapflux's mission to transform thought organization through AI-powered mind mapping. Discover our vision for better thinking and business innovation." />
        <meta name="keywords" content="about mindmapflux, AI mind mapping company, visual thinking platform, thought organization mission" />
        <link rel="canonical" href="https://mindmapflux.com/about" />
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
                <Link href="/business-mind-mapping" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                  Business
                </Link>
                <Link href="/about" className="text-blue-600 px-3 py-2 text-sm font-medium">
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
        <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              About Mindmapflux: Revolutionizing Visual Thinking
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              We believe that everyone deserves tools that match the speed and complexity of modern thinking. 
              Mindmapflux combines artificial intelligence with proven visual thinking techniques to help 
              individuals and businesses organize thoughts, clarify ideas, and accelerate innovation.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-blue-50 p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-600 mb-6">
                  To democratize visual thinking by making AI-powered mind mapping accessible to everyone. 
                  We're transforming how people organize thoughts, solve problems, and communicate ideas 
                  across all areas of life and business.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <span className="text-gray-600">Simplify complex thinking processes</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <span className="text-gray-600">Accelerate innovation and creativity</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <span className="text-gray-600">Bridge human intelligence with AI assistance</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
                <p className="text-gray-600 mb-6">
                  A world where visual thinking is the standard for problem-solving, strategic planning, 
                  and creative expression. We envision AI-powered tools that understand context, 
                  anticipate needs, and evolve with human thinking patterns.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                    <span className="text-gray-600">Universal adoption of visual thinking</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                    <span className="text-gray-600">AI that truly understands human thought</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                    <span className="text-gray-600">Better decisions through better thinking</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Problem We Solve */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">The Problem We're Solving</h2>
              <p className="text-lg text-gray-600">
                Modern professionals face information overload and complexity that traditional tools can't handle
              </p>
            </div>

            <div className="space-y-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Information Overwhelm</h3>
                <p className="text-gray-600">
                  We process 34 GB of information daily, but our tools for organizing thoughts haven't evolved. 
                  Traditional note-taking and linear thinking methods can't keep up with the complexity 
                  of modern challenges.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-orange-500">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Disconnected Ideas</h3>
                <p className="text-gray-600">
                  Brilliant insights get lost in scattered documents, forgotten in meeting notes, 
                  or buried in digital chaos. We lack systems that capture the connections between 
                  our thoughts and ideas.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Slow Decision Making</h3>
                <p className="text-gray-600">
                  Complex decisions require analyzing multiple factors, but we struggle to see 
                  the big picture while managing details. This leads to analysis paralysis 
                  and missed opportunities.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Team Misalignment</h3>
                <p className="text-gray-600">
                  Teams waste countless hours in meetings trying to get everyone on the same page. 
                  Without shared visual understanding, projects suffer from miscommunication 
                  and conflicting priorities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Solution */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How Mindmapflux Changes Everything</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We've reimagined mind mapping for the AI age, creating a platform that understands 
                your thoughts and helps organize them intelligently
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Powered Intelligence</h3>
                <p className="text-gray-600">
                  Our AI understands context, recognizes patterns, and suggests connections you might miss. 
                  It's like having a thinking partner that never gets tired.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Dynamic Evolution</h3>
                <p className="text-gray-600">
                  Your mind maps grow and adapt as you think. Add new information and watch the structure 
                  reorganize automatically for optimal clarity and insight.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Universal Application</h3>
                <p className="text-gray-600">
                  From business strategy to personal planning, our platform adapts to any domain. 
                  One tool for all your thinking and organizing needs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 bg-blue-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
              <p className="text-lg text-gray-600">
                The principles that guide everything we build and every decision we make
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Simplicity First</h3>
                <p className="text-gray-600">
                  Powerful doesn't mean complicated. We believe the best tools disappear into the 
                  background, letting you focus on thinking rather than learning software.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Human-Centered AI</h3>
                <p className="text-gray-600">
                  AI should enhance human intelligence, not replace it. Our technology amplifies 
                  your natural thinking abilities while respecting your unique perspective.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Privacy & Security</h3>
                <p className="text-gray-600">
                  Your thoughts and ideas are precious. We implement robust security measures 
                  and never use your data for anything other than improving your experience.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Continuous Innovation</h3>
                <p className="text-gray-600">
                  The future of thinking tools is just beginning. We constantly explore new ways 
                  to make visual thinking more powerful, accessible, and intuitive.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Future */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">The Future of Thinking</h2>
              <p className="text-lg text-gray-600">
                We're just getting started on our mission to transform how humans think and solve problems
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">What's Next for Mindmapflux</h3>
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong>Domain Expansion:</strong> While we start with business ideation, we're building 
                  towards a platform that supports thinking in any field - from emotional healing and 
                  therapy to scientific research and creative writing.
                </p>
                <p>
                  <strong>Advanced AI Integration:</strong> We're developing AI that doesn't just organize 
                  your thoughts, but actively participates in the thinking process - asking the right 
                  questions, challenging assumptions, and suggesting new perspectives.
                </p>
                <p>
                  <strong>Collaborative Intelligence:</strong> Future versions will seamlessly blend 
                  individual and team thinking, creating shared mind maps that evolve with group 
                  discussions and collective insights.
                </p>
                <p>
                  <strong>Adaptive Learning:</strong> Our platform will learn your thinking patterns 
                  and preferences, becoming more helpful and intuitive with every interaction.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Get Started */}
        <section className="py-20 bg-blue-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Join the Visual Thinking Revolution
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Experience the future of thought organization. Start creating AI-powered mind maps 
              that evolve with your thinking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/tool" 
                className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                Try Mindmapflux Free
              </Link>
              <Link 
                href="/how-it-works" 
                className="border border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
              >
                See How It Works
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
