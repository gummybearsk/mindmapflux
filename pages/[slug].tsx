// pages/[slug].tsx - Dynamic article pages
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  meta_description: string;
  keywords: string;
  featured_image: string;
  author: string;
  published_at: string;
  updated_at: string;
  view_count: number;
  htmlContent: string; // Pre-processed HTML content
}

interface ArticlePageProps {
  article: Article;
  relatedArticles: Article[];
}

export default function ArticlePage({ article, relatedArticles }: ArticlePageProps) {
  return (
    <>
      <Head>
        <title>{article.title}</title>
        <meta name="description" content={article.meta_description} />
        <meta name="keywords" content={article.keywords} />
        <link rel="canonical" href={`https://mindmapflux.com/${article.slug}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.meta_description} />
        <meta property="og:url" content={`https://mindmapflux.com/${article.slug}`} />
        <meta property="og:type" content="article" />
        {article.featured_image && (
          <meta property="og:image" content={article.featured_image} />
        )}
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.meta_description} />
        {article.featured_image && (
          <meta name="twitter:image" content={article.featured_image} />
        )}

        {/* Article Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": article.title,
            "description": article.meta_description,
            "image": article.featured_image,
            "author": {
              "@type": "Organization",
              "name": article.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "Mindmapflux",
              "logo": {
                "@type": "ImageObject",
                "url": "https://mindmapflux.com/logo.png"
              }
            },
            "datePublished": article.published_at,
            "dateModified": article.updated_at,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://mindmapflux.com/${article.slug}`
            }
          })}
        </script>
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

        {/* Article Content */}
        <article className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Article Header */}
            <header className="mb-12">
              {/* Breadcrumbs */}
              <nav className="mb-8">
                <div className="flex text-sm text-gray-500">
                  <Link href="/" className="hover:text-blue-600">Home</Link>
                  <span className="mx-2">/</span>
                  <span className="text-gray-900">{article.title}</span>
                </div>
              </nav>

              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {article.title}
              </h1>

              {article.excerpt && (
                <p className="text-xl text-gray-600 mb-8">
                  {article.excerpt}
                </p>
              )}

              <div className="flex items-center text-sm text-gray-500 mb-8">
                <span>By {article.author}</span>
                <span className="mx-2">•</span>
                <span>{new Date(article.published_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
                <span className="mx-2">•</span>
                <span>{article.view_count} views</span>
              </div>

              {article.featured_image && (
                <div className="mb-8">
                  <img
                    src={article.featured_image}
                    alt={article.title}
                    className="w-full h-64 lg:h-96 object-cover rounded-lg shadow-sm"
                  />
                </div>
              )}

              {/* CTA */}
              <div className="bg-blue-50 p-6 rounded-lg mb-8">
                <div className="flex flex-col sm:flex-row items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Ready to Create Your Own Mind Map?
                    </h3>
                    <p className="text-gray-600">
                      Transform your ideas into visual mind maps with our free AI-powered tool.
                    </p>
                  </div>
                  <Link
                    href="/tool"
                    className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 whitespace-nowrap"
                  >
                    Try Free Tool →
                  </Link>
                </div>
              </div>
            </header>

            {/* Article Body */}
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: article.htmlContent }}
              style={{
                fontSize: '18px',
                lineHeight: '1.7',
                color: '#374151'
              }}
            />

            {/* Internal Links Section */}
            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Explore More Resources
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Link href="/tool" className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-blue-600 mb-2">🧠 Free Mind Map Tool</h4>
                  <p className="text-sm text-gray-600">Create AI-powered mind maps instantly</p>
                </Link>
                <Link href="/mind-mapping-guide" className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-blue-600 mb-2">📚 Complete Guide</h4>
                  <p className="text-sm text-gray-600">Master mind mapping techniques</p>
                </Link>
                <Link href="/business-mind-mapping" className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-blue-600 mb-2">💼 Business Applications</h4>
                  <p className="text-sm text-gray-600">Mind mapping for business success</p>
                </Link>
                <Link href="/how-it-works" className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-blue-600 mb-2">⚡ How It Works</h4>
                  <p className="text-sm text-gray-600">Understand our AI process</p>
                </Link>
              </div>
            </div>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <section className="mt-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {relatedArticles.map((relatedArticle) => (
                    <Link
                      key={relatedArticle.id}
                      href={`/${relatedArticle.slug}`}
                      className="block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {relatedArticle.featured_image && (
                        <img
                          src={relatedArticle.featured_image}
                          alt={relatedArticle.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {relatedArticle.title}
                        </h3>
                        {relatedArticle.excerpt && (
                          <p className="text-gray-600 text-sm">
                            {relatedArticle.excerpt}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </article>

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

export const getStaticPaths: GetStaticPaths = async () => {
  // Get all published articles for static generation
  const { data: articles } = await supabase
    .from('articles')
    .select('slug')
    .eq('status', 'published');

  const paths = articles?.map((article) => ({
    params: { slug: article.slug }
  })) || [];

  return {
    paths,
    fallback: 'blocking' // Allow new articles to be generated on demand
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;

  try {
    // Get the article
    const { data: article, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error || !article) {
      return {
        notFound: true
      };
    }

    // Process markdown to HTML server-side
    const markdownHtml = await marked(article.content);
    const htmlContent = DOMPurify.sanitize(markdownHtml);

    // Get related articles (same keywords or recent articles)
    const { data: relatedArticles } = await supabase
      .from('articles')
      .select('id, title, slug, excerpt, featured_image')
      .eq('status', 'published')
      .neq('id', article.id)
      .limit(4)
      .order('published_at', { ascending: false });

    return {
      props: {
        article: {
          ...article,
          htmlContent
        },
        relatedArticles: relatedArticles || []
      },
      revalidate: 3600 // Revalidate every hour
    };

  } catch (error) {
    console.error('Error fetching article:', error);
    return {
      notFound: true
    };
  }
};
