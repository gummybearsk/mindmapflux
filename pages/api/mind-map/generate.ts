// pages/api/mind-map/generate.ts - Enhanced AI Generation
import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Color schemes matching your specification
const COLOR_SCHEMES = {
  purple: {
    root: "#795F9C", main: "#A67CB5", sub: "#C198D4", detail: "#E0C4F3"
  },
  fortuneRed: {
    root: "#D85B72", main: "#E08799", sub: "#E8A9B8", detail: "#F0CBD6"
  },
  calmGreen: {
    root: "#6B8857", main: "#87A574", sub: "#A3C291", detail: "#BFDFAE"
  },
  pineGreen: {
    root: "#518463", main: "#6FA080", sub: "#8DBC9D", detail: "#ABD8BA"
  },
  authenticBlue: {
    root: "#4C697A", main: "#6B8595", sub: "#8AA1B0", detail: "#A9BDCB"
  },
  sugarBrown: {
    root: "#886441", main: "#A58057", sub: "#C29C6D", detail: "#DFB883"
  }
};

// Enhanced system prompt for intelligent mind mapping
const createSystemPrompt = (colorScheme: string = 'calmGreen') => {
  const colors = COLOR_SCHEMES[colorScheme] || COLOR_SCHEMES.calmGreen;
  
  return `You are an elite business strategist, entrepreneur, investor, and professor with expertise in business, accounting, finance, and strategic planning. You have decades of experience helping startups and corporations solve complex problems.

Your role is to create comprehensive, intelligent mind maps that serve as complete project blueprints. You understand context deeply, create logical relationships, and know exactly what categories make sense for any topic.

CORE CAPABILITIES:
- Deep business knowledge from real-world cases, theories, and models
- SWOT analysis expertise and strategic thinking
- Ability to break down complex projects into manageable components
- Understanding of practical implementation challenges
- Memory of user interactions to provide continuity

MIND MAP STRUCTURE REQUIREMENTS:
1. **COMPREHENSIVE ANALYSIS**: Create complete project blueprints that understand context and logical relationships
2. **HIERARCHICAL INTELLIGENCE**: 
   - 1 ROOT (central concept)
   - 4-8 MAIN categories (major strategic areas)
   - 2-6 SUB categories per main (tactical components)  
   - 1-4 DETAIL nodes per sub (specific actions/items)
3. **BUSINESS EXPERTISE**: Apply deep knowledge, include real-world insights, practical takeaways
4. **SMART POSITIONING**: Calculate non-overlapping positions using radial mathematics
5. **EXPANDABLE DESIGN**: Each node suggests natural expansion opportunities
6. **MEMORY**: Remember previous inputs and build upon them for evolution requests

COLOR SYSTEM (${colorScheme}):
- Root nodes: ${colors.root}
- Main categories: ${colors.main}  
- Sub categories: ${colors.sub}
- Detail items: ${colors.detail}

POSITIONING ALGORITHM:
- Root: Center (400, 300)
- Main: Radial distribution, 200px radius from center
- Sub: 120px radius from parent, avoiding overlaps
- Detail: 80px radius from parent

TEXT RULES:
- Concise: 1-4 words per node
- Descriptive but brief
- Business-appropriate language
- Action-oriented where applicable

EXAMPLE MIND MAP STRUCTURE:
For "start online jewelry business":
- Root: "Online Jewelry Business"
- Main: "Product Strategy", "Target Market", "Marketing Channels", "Operations", "Financial Planning", "Legal Structure"
- Sub under Product Strategy: "Product Line", "Sourcing", "Quality Control", "Pricing Strategy"
- Detail under Product Line: "Earrings", "Necklaces", "Bracelets", "Custom Orders"

RESPONSE FORMAT:
Always return valid JSON with this exact structure:
{
  "title": "Central Theme",
  "context": "Brief strategic analysis of the topic (2-3 sentences)",
  "nodes": [
    {
      "id": "unique_identifier",
      "text": "Node Label",
      "category": "root|main|sub|detail",
      "color": "#hexcolor",
      "parent": "parent_id_or_null",
      "level": 0-3,
      "importance": 1-10,
      "x": calculated_x_position,
      "y": calculated_y_position
    }
  ],
  "connections": [{"from": "parent_id", "to": "child_id"}],
  "suggestions": ["expansion_idea_1", "expansion_idea_2", "expansion_idea_3"],
  "expandable": true
}

Remember: You are an expert consultant creating strategic blueprints, not just simple mind maps. Apply your deep business knowledge to provide comprehensive, actionable insights.`;
};

// Smart positioning calculator
const calculatePositions = (nodes: any[]) => {
  const centerX = 400;
  const centerY = 300;
  const positions = new Map();

  // Position root at center
  const rootNode = nodes.find(n => n.category === 'root');
  if (rootNode) {
    positions.set(rootNode.id, { x: centerX, y: centerY });
  }

  // Position main nodes in circle around root
  const mainNodes = nodes.filter(n => n.category === 'main');
  const mainRadius = 220;
  mainNodes.forEach((node, index) => {
    const angle = (2 * Math.PI * index) / mainNodes.length - Math.PI / 2; // Start from top
    positions.set(node.id, {
      x: centerX + mainRadius * Math.cos(angle),
      y: centerY + mainRadius * Math.sin(angle)
    });
  });

  // Position sub nodes around their main parents
  const subNodes = nodes.filter(n => n.category === 'sub');
  subNodes.forEach((node) => {
    const parent = nodes.find(n => n.id === node.parent);
    if (parent && positions.has(parent.id)) {
      const parentPos = positions.get(parent.id);
      const siblings = subNodes.filter(n => n.parent === node.parent);
      const siblingIndex = siblings.indexOf(node);
      const totalSiblings = siblings.length;
      
      const subRadius = 140;
      const baseAngle = Math.atan2(parentPos.y - centerY, parentPos.x - centerX);
      const spreadAngle = Math.PI / 3; // 60 degrees spread
      const angleStep = totalSiblings > 1 ? spreadAngle / (totalSiblings - 1) : 0;
      const angle = baseAngle - spreadAngle/2 + (angleStep * siblingIndex);
      
      positions.set(node.id, {
        x: parentPos.x + subRadius * Math.cos(angle),
        y: parentPos.y + subRadius * Math.sin(angle)
      });
    }
  });

  // Position detail nodes around their sub parents
  const detailNodes = nodes.filter(n => n.category === 'detail');
  detailNodes.forEach((node) => {
    const parent = nodes.find(n => n.id === node.parent);
    if (parent && positions.has(parent.id)) {
      const parentPos = positions.get(parent.id);
      const siblings = detailNodes.filter(n => n.parent === node.parent);
      const siblingIndex = siblings.indexOf(node);
      const totalSiblings = siblings.length;
      
      const detailRadius = 90;
      const baseAngle = Math.atan2(parentPos.y - centerY, parentPos.x - centerX);
      const spreadAngle = Math.PI / 2; // 90 degrees spread
      const angleStep = totalSiblings > 1 ? spreadAngle / (totalSiblings - 1) : 0;
      const angle = baseAngle - spreadAngle/2 + (angleStep * siblingIndex);
      
      positions.set(node.id, {
        x: parentPos.x + detailRadius * Math.cos(angle),
        y: parentPos.y + detailRadius * Math.sin(angle)
      });
    }
  });

  return positions;
};

// Fallback mind map generator for API failures
const generateFallbackMindMap = (input: string, colorScheme: string = 'calmGreen') => {
  const colors = COLOR_SCHEMES[colorScheme] || COLOR_SCHEMES.calmGreen;
  const rootId = 'root';
  
  // Simple keyword extraction for fallback
  const keywords = input.split(/[\s,]+/).filter(word => 
    word.length > 3 && !['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can'].includes(word.toLowerCase())
  ).slice(0, 6);

  const nodes = [
    {
      id: rootId,
      text: keywords[0] || 'Main Topic',
      category: 'root',
      color: colors.root,
      parent: null,
      level: 0,
      importance: 10,
      x: 400,
      y: 300
    }
  ];

  const connections = [];

  // Create main nodes from remaining keywords
  keywords.slice(1).forEach((keyword, index) => {
    const nodeId = `main_${index}`;
    const angle = (2 * Math.PI * index) / (keywords.length - 1);
    const radius = 200;
    
    nodes.push({
      id: nodeId,
      text: keyword,
      category: 'main',
      color: colors.main,
      parent: rootId,
      level: 1,
      importance: 8,
      x: 400 + radius * Math.cos(angle),
      y: 300 + radius * Math.sin(angle)
    });

    connections.push({ from: rootId, to: nodeId });
  });

  return {
    title: keywords[0] || 'Mind Map',
    context: `Generated a basic mind map for: ${input.slice(0, 100)}...`,
    nodes,
    connections,
    suggestions: ['Add more details', 'Expand categories', 'Include timeline'],
    expandable: true
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, isEvolution = false, colorScheme = 'calmGreen' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const systemPrompt = createSystemPrompt(colorScheme);
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No response from AI');
    }

    // Parse the JSON response
    let mindMapData;
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : response;
      mindMapData = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError);
      // Return fallback mind map
      mindMapData = generateFallbackMindMap(prompt, colorScheme);
    }

    // Validate and enhance the mind map data
    if (!mindMapData.nodes || !Array.isArray(mindMapData.nodes)) {
      mindMapData = generateFallbackMindMap(prompt, colorScheme);
    }

    // Apply smart positioning if coordinates are missing
    const positions = calculatePositions(mindMapData.nodes);
    mindMapData.nodes = mindMapData.nodes.map(node => {
      const pos = positions.get(node.id) || { x: 400, y: 300 };
      return {
        ...node,
        x: pos.x,
        y: pos.y
      };
    });

    // Ensure proper color application
    const colors = COLOR_SCHEMES[colorScheme] || COLOR_SCHEMES.calmGreen;
    mindMapData.nodes = mindMapData.nodes.map(node => ({
      ...node,
      color: colors[node.category] || colors.main
    }));

    // Add metadata
    mindMapData.timestamp = new Date().toISOString();
    mindMapData.colorScheme = colorScheme;
    mindMapData.isEvolution = isEvolution;

    return res.status(200).json(mindMapData);

  } catch (error) {
    console.error('Error generating mind map:', error);
    
    // Return fallback mind map on any error
    const fallbackData = generateFallbackMindMap(
      req.body.prompt || 'Mind Map', 
      req.body.colorScheme || 'calmGreen'
    );
    
    return res.status(200).json(fallbackData);
  }
}
