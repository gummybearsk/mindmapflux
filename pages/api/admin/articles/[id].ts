// pages/api/admin/articles/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { withAuth } from '../../auth/login';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

      if (error) {
        console.error('Error fetching article:', error);
        return res.status(404).json({ error: 'Article not found' });
      }

      return res.status(200).json({ article });

    } else if (req.method === 'PUT') {
      // Update article
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

      // Check if slug already exists (excluding current article)
      const { data: existingArticle } = await supabase
        .from('articles')
        .select('id')
        .eq('slug', slug)
        .neq('id', id)
        .single();

      if (existingArticle) {
        return res.status(400).json({ error: 'Article with this slug already exists' });
      }

      // Update article
      const { data: article, error } = await supabase
        .from('articles')
        .update({
          title,
          content,
          excerpt: excerpt || content.substring(0, 200) + '...',
          slug,
          meta_title: meta_title || title,
          meta_description: meta_description || excerpt,
          keywords: keywords || '',
          published: published || false,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating article:', error);
        return res.status(500).json({ error: 'Failed to update article' });
      }

      return res.status(200).json({ article });

    } else if (req.method === 'DELETE') {
      // Delete article
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting article:', error);
        return res.status(500).json({ error: 'Failed to delete article' });
      }

      return res.status(200).json({ message: 'Article deleted successfully' });

    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default withAuth(singleArticleHandler);
