// pages/privacy.tsx
import Head from 'next/head';
import Link from 'next/link';

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - Mindmapflux</title>
        <meta name="description" content="Mindmapflux privacy policy. Learn how we protect your data and respect your privacy when using our AI mind mapping platform." />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://mindmapflux.com/privacy" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                Mindmapflux
              </Link>
            </div>
          </div>
        </nav>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-600 mb-8">
              <strong>Last updated:</strong> January 1, 2025
            </p>

            <p>
              At Mindmapflux, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, and protect your information when you use our AI-powered mind mapping platform.
            </p>

            <h2>Information We Collect</h2>
            
            <h3>Information You Provide</h3>
            <ul>
              <li><strong>Mind Map Content:</strong> The thoughts, ideas, and content you input to create mind maps</li>
              <li><strong>Usage Data:</strong> How you interact with our platform and tools</li>
              <li><strong>Technical Data:</strong> IP address, browser type, device information, and usage patterns</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <ul>
              <li>Session identifiers for anonymous usage tracking</li>
              <li>Performance and analytics data to improve our service</li>
              <li>Cookie data for website functionality and user experience</li>
            </ul>

            <h2>How We Use Your Information</h2>
            
            <h3>Service Provision</h3>
            <ul>
              <li>Generate AI-powered mind maps based on your input</li>
              <li>Provide, maintain, and improve our platform</li>
              <li>Ensure proper functionality of interactive features</li>
            </ul>

            <h3>Analytics and Improvement</h3>
            <ul>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Monitor performance and fix technical issues</li>
              <li>Develop new features and capabilities</li>
            </ul>

            <h2>Data Protection and Security</h2>
            
            <h3>Security Measures</h3>
            <ul>
              <li>Industry-standard encryption for data transmission</li>
              <li>Secure servers with access controls and monitoring</li>
              <li>Regular security audits and updates</li>
              <li>Limited access to personal data on a need-to-know basis</li>
            </ul>

            <h3>Data Retention</h3>
            <ul>
              <li>Mind map content is processed in real-time and not permanently stored unless you choose to save it</li>
              <li>Anonymous usage analytics are retained for service improvement</li>
              <li>Session data is automatically deleted after 30 days</li>
            </ul>

            <h2>Cookies and Tracking</h2>
            
            <p>We use cookies and similar technologies to:</p>
            <ul>
              <li>Maintain your session and preferences</li>
              <li>Analyze website traffic and user behavior</li>
              <li>Improve website performance and user experience</li>
              <li>Provide relevant content and features</li>
            </ul>

            <p>You can control cookie settings through your browser preferences.</p>

            <h2>Third-Party Services</h2>
            
            <h3>AI Processing</h3>
            <p>
              We use OpenAI's services to process your mind map content. This processing is done securely 
              and in accordance with OpenAI's privacy policies. Your content is not used to train AI models.
            </p>

            <h3>Analytics</h3>
            <p>
              We use analytics services to understand how our platform is used. This data is anonymized 
              and aggregated to protect your privacy.
            </p>

            <h2>Your Rights and Choices</h2>
            
            <h3>Access and Control</h3>
            <ul>
              <li>Request information about data we have collected</li>
              <li>Ask for correction of inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Opt out of certain data collection practices</li>
            </ul>

            <h3>Data Portability</h3>
            <p>
              You can export your mind maps at any time using our built-in export features. 
              We provide data in common formats like JSON and PNG.
            </p>

            <h2>International Users</h2>
            
            <p>
              Our services are hosted in the United States. By using Mindmapflux, you consent to the 
              transfer and processing of your information in the United States, which may have different 
              privacy laws than your country of residence.
            </p>

            <h2>Children's Privacy</h2>
            
            <p>
              Our service is not intended for children under 13 years of age. We do not knowingly collect 
              personal information from children under 13. If you believe we have collected information 
              from a child under 13, please contact us immediately.
            </p>

            <h2>Changes to This Policy</h2>
            
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material 
              changes by posting the updated policy on our website. Your continued use of our service 
              after changes constitutes acceptance of the updated policy.
            </p>

            <h2>Contact Information</h2>
            
            <p>
              If you have questions about this Privacy Policy or our data practices, please contact us 
              through our website's support channels.
            </p>

            <div className="mt-12 p-6 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Ready to Create Mind Maps?</h3>
              <p className="text-blue-800 mb-4">
                Start using our privacy-focused AI mind mapping tool today.
              </p>
              <Link 
                href="/tool" 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 inline-block"
              >
                Try Free Tool
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Link href="/" className="text-xl font-bold text-blue-400 mb-4 inline-block">
                Mindmapflux
              </Link>
              <div className="flex justify-center space-x-6 text-sm text-gray-400">
                <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-white">Terms of Service</Link>
                <Link href="/about" className="hover:text-white">About</Link>
              </div>
              <p className="text-gray-400 text-sm mt-4">
                &copy; 2025 Mindmapflux. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

