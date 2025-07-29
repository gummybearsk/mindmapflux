// pages/api/mind-map/save.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { mindMapData, sessionId, isPublic = false } = req.body;

    if (!mindMapData || !sessionId) {
      return res.status(400).json({ message: 'Mind map data and session ID are required' });
    }

    const { data, error } = await supabase
      .from('mind_maps')
      .insert({
        title: mindMapData.title,
        content: mindMapData,
        user_session: sessionId,
        is_public: isPublic
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Track save action
    await supabase
      .from('mind_map_usage')
      .insert({
        session_id: sessionId,
        action: 'save',
        mind_map_id: data.id,
        ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        user_agent: req.headers['user-agent'] || ''
      });

    res.status(201).json({ mindMap: data });

  } catch (error) {
    console.error('Save mind map error:', error);
    res.status(500).json({ message: 'Failed to save mind map' });
  }
}
