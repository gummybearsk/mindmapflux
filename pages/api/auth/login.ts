// pages/api/admin/articles/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { withAuth } from '../../auth/login';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function articlesHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // Get all articles for admin
      const { data: articles, error } = await supabase
        .from('articles')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        return res.status(500).json({ message: 'Failed to fetch articles', error });
      }

      return res.status(200).json({ articles });

    } else if (req.method === 'POST') {
      // Create new article
      const {
        title,
        slug,
        content,
        excerpt,
        meta_description,
        keywords,
        status,
        featured_image
      } = req.body;

      // Validate required fields
      if (!title || !slug || !content) {
        return res.status(400).json({ message: 'Title, slug, and content are required' });
      }

      // Check if slug already exists
      const { data: existingArticle } = await supabase
        .from('articles')
        .select('id')
        .eq('slug', slug)
        .single();

      if (existingArticle) {
        return res.status(400).json({ message: 'Slug already exists' });
      }

      const articleData = {
        title,
        slug,
        content,
        excerpt: excerpt || '',
        meta_description: meta_description || '',
        keywords: keywords || '',
        status: status || 'draft',
        featured_image: featured_image || '',
        published_at: status === 'published' ? new Date().toISOString() : null
      };

      const { data: article, error } = await supabase
        .from('articles')
        .insert(articleData)
        .select()
        .single();

      if (error) {
        return res.status(500).json({ message: 'Failed to create article', error });
      }

      return res.status(201).json({ article });
    }

    return res.status(405).json({ message: 'Method not allowed' });

  } catch (error) {
    console.error('Articles API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default withAuth(articlesHandler);

// pages/api/admin/articles/[id].ts
async function singleArticleHandler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      // Get single article
      const { data: article, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !article) {
        return res.status(404).json({ message: 'Article not found' });
      }

      return res.status(200).json({ article });

    } else if (req.method === 'PUT') {
      // Update article
      const {
        title,
        slug,
        content,
        excerpt,
        meta_description,
        keywords,
        status,
        featured_image
      } = req.body;

      // Check if slug already exists (excluding current article)
      if (slug) {
        const { data: existingArticle } = await supabase
          .from('articles')
          .select('id')
          .eq('slug', slug)
          .neq('id', id)
          .single();

        if (existingArticle) {
          return res.status(400).json({ message: 'Slug already exists' });
        }
      }

      const updateData: any = {
        title,
        slug,
        content,
        excerpt,
        meta_description,
        keywords,
        featured_image,
        updated_at: new Date().toISOString()
      };

      // Handle status change
      if (status) {
        updateData.status = status;
        if (status === 'published') {
          // Set published_at if publishing for the first time
          const { data: currentArticle } = await supabase
            .from('articles')
            .select('published_at')
            .eq('id', id)
            .single();

          if (!currentArticle?.published_at) {
            updateData.published_at = new Date().toISOString();
          }
        }
      }

      const { data: article, error } = await supabase
        .from('articles')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return res.status(500).json({ message: 'Failed to update article', error });
      }

      return res.status(200).json({ article });

    } else if (req.method === 'DELETE') {
      // Delete article
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) {
        return res.status(500).json({ message: 'Failed to delete article', error });
      }

      return res.status(200).json({ message: 'Article deleted successfully' });
    }

    return res.status(405).json({ message: 'Method not allowed' });

  } catch (error) {
    console.error('Single article API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default withAuth(singleArticleHandler);

// pages/api/articles/[slug].ts (Public API for frontend)
export async function publicArticleHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { slug } = req.query;

  try {
    const { data: article, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error || !article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Increment view count
    await supabase
      .from('articles')
      .update({ view_count: article.view_count + 1 })
      .eq('id', article.id);

    // Track article view for analytics
    const userAgent = req.headers['user-agent'] || '';
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    await supabase
      .from('article_views')
      .insert({
        article_id: article.id,
        user_session: req.headers['x-session-id'] || 'anonymous',
        ip_address: ipAddress,
        user_agent: userAgent
      });

    return res.status(200).json({ article });

  } catch (error) {
    console.error('Public article API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// pages/api/articles/index.ts (Public API for article listing)
export async function publicArticlesListHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { limit = 10, offset = 0 } = req.query;

    const { data: articles, error } = await supabase
      .from('articles')
      .select('id, title, slug, excerpt, featured_image, published_at, view_count')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (error) {
      return res.status(500).json({ message: 'Failed to fetch articles', error });
    }

    return res.status(200).json({ articles });

  } catch (error) {
    console.error('Public articles list API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
