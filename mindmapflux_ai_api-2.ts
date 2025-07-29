// pages/api/mind-map/generate.ts
import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface MindMapNode {
  id: string;
  text: string;
  category?: string;
  color?: string;
  parent?: string;
}

interface MindMapData {
  title: string;
  nodes: MindMapNode[];
  connections: Array<{ from: string; to: string }>;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { input, sessionId } = req.body;

    if (!input || typeof input !== 'string') {
      return res.status(400).json({ message: 'Input text is required' });
    }

    // Generate mind map using OpenAI
    const mindMap = await generateMindMapWithAI(input);

    // Store the mind map in database
    await storeMindMap(mindMap, sessionId, req);

    // Track usage
    await trackMindMapGeneration(sessionId, input.length, req);

    res.status(200).json({ mindMap });

  } catch (error) {
    console.error('Mind map generation error:', error);
    res.status(500).json({ 
      message: 'Failed to generate mind map', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}

async function generateMindMapWithAI(input: string): Promise<MindMapData> {
  const systemPrompt = `You are an expert mind mapping AI that helps people organize their thoughts visually. 

Your task is to analyze the user's input and create a structured mind map that:
1. Identifies the main central topic/theme
2. Breaks down the content into logical categories and subcategories
3. Creates a hierarchical structure with clear relationships
4. Uses concise, clear labels for each node
5. Organizes information from general to specific

Format your response as a JSON object with this exact structure:
{
  "title": "Main Topic Title",
  "nodes": [
    {
      "id": "root",
      "text": "Central Topic",
      "category": "root",
      "color": "#3b82f6"
    },
    {
      "id": "category1",
      "text": "Main Category 1",
      "category": "main",
      "color": "#10b981",
      "parent": "root"
    },
    {
      "id": "subcategory1",
      "text": "Subcategory",
      "category": "sub",
      "color": "#f59e0b",
      "parent": "category1"
    }
  ],
  "connections": [
    { "from": "root", "to": "category1" },
    { "from": "category1", "to": "subcategory1" }
  ]
}

Guidelines:
- Use descriptive but concise text (1-4 words per node)
- Create 3-7 main categories from the root
- Each main category can have 2-5 subcategories
- Use appropriate colors: blue for root, green for main categories, orange for subcategories, purple for details
- Ensure all nodes are connected through the parent-child relationships
- Generate unique IDs using descriptive names (no spaces, use underscores)
- Focus on the most important concepts and relationships`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Please create a mind map for the following thoughts/ideas: "${input}"` }
    ],
    temperature: 0.7,
    max_tokens: 2000,
  });

  const responseContent = completion.choices[0]?.message?.content;
  if (!responseContent) {
    throw new Error('No response from AI');
  }

  try {
    // Parse the JSON response
    const mindMapData = JSON.parse(responseContent);
    
    // Validate the structure
    if (!mindMapData.title || !mindMapData.nodes || !mindMapData.connections) {
      throw new Error('Invalid mind map structure');
    }

    // Ensure we have a root node
    const hasRoot = mindMapData.nodes.some((node: any) => node.category === 'root');
    if (!hasRoot) {
      throw new Error('No root node found');
    }

    return mindMapData;

  } catch (parseError) {
    console.error('Failed to parse AI response:', parseError);
    console.error('Raw response:', responseContent);
    
    // Fallback: create a simple mind map from the input
    return createFallbackMindMap(input);
  }
}

function createFallbackMindMap(input: string): MindMapData {
  // Simple fallback mind map when AI parsing fails
  const words = input.split(' ').filter(word => word.length > 3);
  const mainTopics = words.slice(0, 5);
  
  const nodes: MindMapNode[] = [
    {
      id: 'root',
      text: 'Main Topic',
      category: 'root',
      color: '#3b82f6'
    }
  ];

  const connections: Array<{ from: string; to: string }> = [];

  mainTopics.forEach((topic, index) => {
    const nodeId = `topic_${index}`;
    nodes.push({
      id: nodeId,
      text: topic,
      category: 'main',
      color: '#10b981',
      parent: 'root'
    });
    connections.push({ from: 'root', to: nodeId });
  });

  return {
    title: 'Organized Thoughts',
    nodes,
    connections
  };
}

async function storeMindMap(mindMap: MindMapData, sessionId: string, req: NextApiRequest) {
  try {
    const { data, error } = await supabase
      .from('mind_maps')
      .insert({
        title: mindMap.title,
        content: mindMap,
        user_session: sessionId,
        is_public: false
      });

    if (error) {
      console.error('Failed to store mind map:', error);
    }
  } catch (error) {
    console.error('Database storage error:', error);
  }
}

async function trackMindMapGeneration(sessionId: string, inputLength: number, req: NextApiRequest) {
  try {
    const userAgent = req.headers['user-agent'] || '';
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    await supabase
      .from('mind_map_usage')
      .insert({
        session_id: sessionId,
        action: 'generate',
        ip_address: ipAddress,
        user_agent: userAgent
      });
  } catch (error) {
    console.error('Usage tracking error:', error);
  }
}

// pages/api/analytics/track.ts
export async function analyticsHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { sessionId, action, metadata, timestamp } = req.body;

    const userAgent = req.headers['user-agent'] || '';
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    await supabase
      .from('mind_map_usage')
      .insert({
        session_id: sessionId,
        action,
        ip_address: ipAddress,
        user_agent: userAgent
      });

    res.status(200).json({ success: true });

  } catch (error) {
    console.error('Analytics tracking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// pages/api/mind-map/save.ts
export async function saveMindMapHandler(req: NextApiRequest, res: NextApiResponse) {
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

    res.status(201).json({ mindMap: data });

  } catch (error) {
    console.error('Save mind map error:', error);
    res.status(500).json({ message: 'Failed to save mind map' });
  }
}