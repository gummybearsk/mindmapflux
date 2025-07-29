// pages/admin/articles/new.tsx
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface ArticleForm {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  meta_description: string;
  keywords: string;
  status: 'draft' | 'published';
  featured_image: string;
}

export default function NewArticle() {
  const [article, setArticle] = useState<ArticleForm>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    meta_description: '',
    keywords: '',
    status: 'draft',
    featured_image: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/verify');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        router.push('/admin/login');
      }
    } catch (error) {
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setArticle(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handleSave = async (status: 'draft' | 'published') => {
    setSaving(true);
    
    try {
      const response = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...article, status }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push('/admin');
      } else {
        const error = await response.json();
        alert(`Failed to save article: ${error.message}`);
      }
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Head>
        <title>New Article - Admin - Mindmapflux</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/admin" className="text-blue-600 hover:text-blue-800">
                  ← Back to Admin
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleSave('draft')}
                  disabled={saving}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Draft'}
                </button>
                <button
                  onClick={() => handleSave('published')}
                  disabled={saving}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Publishing...' : 'Publish'}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">New Article</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Editor */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={article.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter article title..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Content */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content (Markdown)
                </label>
                <textarea
                  value={article.content}
                  onChange={(e) => setArticle(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your article content in Markdown..."
                  rows={20}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Use Markdown syntax for formatting. Example: # Heading, **bold**, *italic*, [link](url)
                </p>
              </div>

              {/* Excerpt */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt
                </label>
                <textarea
                  value={article.excerpt}
                  onChange={(e) => setArticle(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief summary of the article (used in listings)..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* SEO Settings */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={article.slug}
                      onChange={(e) => setArticle(prev => ({ ...prev, slug: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      URL: mindmapflux.com/{article.slug}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      value={article.meta_description}
                      onChange={(e) => setArticle(prev => ({ ...prev, meta_description: e.target.value }))}
                      placeholder="SEO description (150-160 characters)..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Characters: {article.meta_description.length}/160
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Keywords (SEO)
                    </label>
                    <input
                      type="text"
                      value={article.keywords}
                      onChange={(e) => setArticle(prev => ({ ...prev, keywords: e.target.value }))}
                      placeholder="keyword1, keyword2, keyword3..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Separate keywords with commas
                    </p>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Image</h3>
                <input
                  type="url"
                  value={article.featured_image}
                  onChange={(e) => setArticle(prev => ({ ...prev, featured_image: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                {article.featured_image && (
                  <img
                    src={article.featured_image}
                    alt="Featured image preview"
                    className="mt-4 w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
              </div>

              {/* Internal Linking Helper */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Internal Linking</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Remember to add internal links to:
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <Link href="/" className="text-blue-600">Homepage</Link></li>
                  <li>• <Link href="/tool" className="text-blue-600">Mind Map Tool</Link></li>
                  <li>• <Link href="/mind-mapping-guide" className="text-blue-600">Main Guide</Link></li>
                  <li>• <Link href="/business-mind-mapping" className="text-blue-600">Business Applications</Link></li>
                  <li>• Related articles in your content</li>
                </ul>
                <p className="text-xs text-gray-500 mt-2">
                  Use: [link text](/page-url) in Markdown
                </p>
              </div>

              {/* SEO Tips */}
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Tips</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>✓ Use H1, H2, H3 headings</li>
                  <li>✓ Include target keywords naturally</li>
                  <li>✓ Add FAQ sections for featured snippets</li>
                  <li>✓ Write 2000+ words for authority</li>
                  <li>✓ Include internal and external links</li>
                  <li>✓ Start with direct answer to main question</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// pages/admin/articles/edit/[id].tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
// Similar structure to NewArticle but with pre-populated data from existing article
// Will fetch article data by ID and populate the form