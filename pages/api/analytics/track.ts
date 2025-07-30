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
    const { sessionId, action, metadata } = req.body;

    const userAgent = req.headers['user-agent'] || '';
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    await supabase
      .from('mind_map_usage')
      .insert({
        session_id: sessionId,
        action,
        ip_address: ipAddress,
        user_agent: userAgent,
        metadata
      });

    res.status(200).json({ success: true });

  } catch (error) {
    console.error('Analytics tracking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
