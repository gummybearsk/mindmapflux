// pages/terms.tsx
import Head from 'next/head';
import Link from 'next/link';

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service - Mindmapflux</title>
        <meta name="description" content="Mindmapflux terms of service. Learn about the terms and conditions for using our AI mind mapping platform." />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://mindmapflux.com/terms" />
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-600 mb-8">
              <strong>Last updated:</strong> January 1, 2025
            </p>

            <p>
              Welcome to Mindmapflux. These Terms of Service govern your use of our AI-powered 
              mind mapping platform. By using our service, you agree to these terms.
            </p>

            <h2>Acceptance of Terms</h2>
            
            <p>
              By accessing or using Mindmapflux, you agree to be bound by these Terms of Service 
              and our Privacy Policy. If you do not agree to these terms, please do not use our service.
            </p>

            <h2>Description of Service</h2>
            
            <p>
              Mindmapflux is an AI-powered platform that helps users create visual mind maps from 
              their thoughts and ideas. Our service includes:
            </p>
            <ul>
              <li>AI-powered mind map generation</li>
              <li>Interactive mind map editing tools</li>
              <li>Export capabilities for created mind maps</li>
              <li>Educational content about mind mapping</li>
            </ul>

            <h2>User Responsibilities</h2>
            
            <h3>Acceptable Use</h3>
            <p>You agree to use Mindmapflux only for lawful purposes and in accordance with these terms. You may not:</p>
            <ul>
              <li>Use the service for any illegal or unauthorized purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Upload malicious content or attempt to disrupt our service</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
            </ul>

            <h3>Content Responsibility</h3>
            <ul>
              <li>You are responsible for all content you input into our system</li>
              <li>You must have the right to use any content you submit</li>
              <li>You agree not to submit confidential or sensitive information</li>
              <li>You retain ownership of your original content</li>
            </ul>

            <h2>Service Availability</h2>
            
            <h3>Service Provision</h3>
            <p>
              We strive to provide reliable service but cannot guarantee 100% uptime. We reserve 
              the right to modify, suspend, or discontinue any part of our service at any time.
            </p>

            <h3>Free Service</h3>
            <p>
              Our basic mind mapping tool is provided free of charge. We reserve the right to 
              introduce premium features or modify our service offerings in the future.
            </p>

            <h2>Intellectual Property</h2>
            
            <h3>Our Rights</h3>
            <ul>
              <li>Mindmapflux and our technology are protected by intellectual property laws</li>
              <li>You may not copy, modify, or reverse engineer our platform</li>
              <li>Our trademarks and branding are our exclusive property</li>
            </ul>

            <h3>Your Rights</h3>
            <ul>
              <li>You retain ownership of mind maps you create using our platform</li>
              <li>You can export and use your mind maps as you see fit</li>
              <li>You grant us a limited license to process your content to provide our service</li>
            </ul>

            <h2>Privacy and Data</h2>
            
            <p>
              Your privacy is important to us. Please review our Privacy Policy to understand 
              how we collect, use, and protect your information.
            </p>

            <h2>Disclaimers</h2>
            
            <h3>Service Disclaimers</h3>
            <p>
              Our service is provided "as is" without warranties of any kind. We do not guarantee:
            </p>
            <ul>
              <li>Continuous or error-free operation</li>
              <li>That our service will meet your specific requirements</li>
              <li>The accuracy of AI-generated content</li>
              <li>That our service is free from bugs or security vulnerabilities</li>
            </ul>

            <h3>AI Content Disclaimer</h3>
            <p>
              Mind maps are generated using AI technology. While we strive for accuracy and 
              usefulness, you should review and verify all AI-generated content before relying on it.
            </p>

            <h2>Limitation of Liability</h2>
            
            <p>
              To the maximum extent permitted by law, Mindmapflux shall not be liable for any 
              indirect, incidental, special, consequential, or punitive damages arising from 
              your use of our service.
            </p>

            <h2>Indemnification</h2>
            
            <p>
              You agree to defend, indemnify, and hold harmless Mindmapflux from any claims, 
              damages, or expenses arising from your use of our service or violation of these terms.
            </p>

            <h2>Termination</h2>
            
            <h3>Termination by You</h3>
            <p>You may stop using our service at any time.</p>

            <h3>Termination by Us</h3>
            <p>
              We may suspend or terminate your access to our service if you violate these terms 
              or for any other reason at our discretion.
            </p>

            <h2>Changes to Terms</h2>
            
            <p>
              We may update these Terms of Service from time to time. We will notify you of 
              material changes by posting updated terms on our website. Your continued use 
              constitutes acceptance of the updated terms.
            </p>

            <h2>Governing Law</h2>
            
            <p>
              These terms are governed by the laws of the United States. Any disputes shall be 
              resolved in the appropriate courts.
            </p>

            <h2>Contact Information</h2>
            
            <p>
              If you have questions about these Terms of Service, please contact us through 
              our website's support channels.
            </p>

            <div className="mt-12 p-6 bg-green-50 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-2">Start Creating Mind Maps</h3>
              <p className="text-green-800 mb-4">
                Now that you understand our terms, try our free AI mind mapping tool.
              </p>
              <Link 
                href="/tool" 
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 inline-block"
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
