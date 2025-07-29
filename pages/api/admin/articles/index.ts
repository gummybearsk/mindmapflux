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
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching articles:', error);
        return res.status(500).json({ error: 'Failed to fetch articles' });
      }

      return res.status(200).json({ articles });

    } else if (req.method === 'POST') {
      // Create new article
      const {
        title,
        content,
        excerpt,
        slug,
        meta_title,
        meta_description,
        keywords,
        published
      } = req.body;

      // Validate required fields
      if (!title || !content || !slug) {
        return res.status(400).json({ error: 'Missing required fields: title, content, slug' });
      }

      // Check if slug already exists
      const { data: existingArticle } = await supabase
        .from('articles')
        .select('id')
        .eq('slug', slug)
        .single();

      if (existingArticle) {
        return res.status(400).json({ error: 'Article with this slug already exists' });
      }

      // Create article
      const { data: article, error } = await supabase
        .from('articles')
        .insert([{
          title,
          content,
          excerpt: excerpt || content.substring(0, 200) + '...',
          slug,
          meta_title: meta_title || title,
          meta_description: meta_description || excerpt,
          keywords: keywords || '',
          published: published || false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating article:', error);
        return res.status(500).json({ error: 'Failed to create article' });
      }

      return res.status(201).json({ article });

    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default withAuth(articlesHandler);
