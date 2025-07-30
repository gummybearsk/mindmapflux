// pages/api/mind-map/generate.ts - Enhanced AI Generation (FIXED)
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

RESPONSE FORMAT - RETURN EXACTLY THIS JSON STRUCTURE:
{
  "nodes": [
    {
      "id": "unique_id",
      "label": "Node Text (1-4 words)",
      "type": "center|main|sub|detail"
    }
  ],
  "connections": [
    {"from": "parent_id", "to": "child_id"}
  ],
  "analysis": "Strategic analysis paragraph explaining the approach and key insights",
  "suggestions": ["expansion idea 1", "expansion idea 2", "expansion idea 3", "expansion idea 4", "expansion idea 5"]
}

CRITICAL: Your response must be valid JSON only. No extra text before or after the JSON.`;
};

// Smart positioning calculator
const calculatePositions = (nodes: any[]) => {
  const centerX = 400;
  const centerY = 300;
  const positions = new Map();

  // Position center node
  const centerNode = nodes.find(n => n.type === 'center');
  if (centerNode) {
    positions.set(centerNode.id, { x: centerX, y: centerY });
  }

  // Position main nodes in circle around center
  const mainNodes = nodes.filter(n => n.type === 'main');
  const mainRadius = 220;
  mainNodes.forEach((node, index) => {
    const angle = (2 * Math.PI * index) / mainNodes.length - Math.PI / 2; // Start from top
    positions.set(node.id, {
      x: centerX + mainRadius * Math.cos(angle),
      y: centerY + mainRadius * Math.sin(angle)
    });
  });

  // Position sub nodes around their main parents
  const subNodes = nodes.filter(n => n.type === 'sub');
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
  const detailNodes = nodes.filter(n => n.type === 'detail');
  detailNodes.forEach((node) => {
    const parent = nodes.find(n => n.id === node.parent);
    if (parent && positions.has(parent.id)) {
      const parentPos = positions.get(parent.id);
      const siblings = detailNodes.filter(n => n.parent === node.parent);
      const siblingIndex = siblings.indexOf(node);
      const totalSiblings = siblings.length;
      
      const detailRadius = 90;
      const baseAngle = Math.atan2(parentPos.y - centerY, parentPos.x - centerX);
      const spreadAngie = Math.PI / 2; // 90 degrees spread
      const angleStep = totalSiblings > 1 ? spreadAngie / (totalSiblings - 1) : 0;
      const angle = baseAngle - spreadAngie/2 + (angleStep * siblingIndex);
      
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
  
  // Simple keyword extraction for fallback
  const keywords = input.split(/[\s,]+/).filter(word => 
    word.length > 3 && !['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can'].includes(word.toLowerCase())
  ).slice(0, 6);

  const centerTopic = keywords[0] || 'Main Topic';
  const mainTopics = keywords.slice(1, 5);

  const nodes = [
    {
      id: 'center',
      label: centerTopic,
      type: 'center'
    }
  ];

  const connections = [];

  // Create main nodes from remaining keywords
  mainTopics.forEach((keyword, index) => {
    const nodeId = `main_${index}`;
    
    nodes.push({
      id: nodeId,
      label: keyword,
      type: 'main'
    });

    connections.push({ from: 'center', to: nodeId });
  });

  return {
    nodes,
    connections,
    analysis: `Generated a strategic mind map for "${input}". This covers the key areas that need attention and provides a foundation for detailed planning.`,
    suggestions: [
      'Add specific action items',
      'Include timeline considerations', 
      'Expand financial planning',
      'Add risk management',
      'Consider resource requirements'
    ]
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // FIXED: Match the frontend parameter names
    const { 
      input, 
      isEvolution = false, 
      colorScheme = 'calmGreen',
      existingNodes = [],
      conversationHistory = []
    } = req.body;

    if (!input) {
      return res.status(400).json({ error: 'Input is required' });
    }

    const systemPrompt = createSystemPrompt(colorScheme);
    
    // Build user prompt with context
    let userPrompt = input;
    if (isEvolution && existingNodes.length > 0) {
      userPrompt += `\n\nEXISTING STRUCTURE: This is an evolution of an existing mind map. Build upon and enhance the following existing elements: ${existingNodes.map(n => n.data?.label || 'Node').join(', ')}`;
    }
    if (conversationHistory.length > 0) {
      userPrompt += `\n\nPREVIOUS CONTEXT: ${conversationHistory.slice(-2).join(' ')}`;
    }
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
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
      mindMapData = generateFallbackMindMap(input, colorScheme);
    }

    // Validate and enhance the mind map data
    if (!mindMapData.nodes || !Array.isArray(mindMapData.nodes)) {
      mindMapData = generateFallbackMindMap(input, colorScheme);
    }

    // Ensure required properties exist
    if (!mindMapData.analysis) {
      mindMapData.analysis = `Strategic analysis for: ${input}`;
    }
    if (!mindMapData.suggestions) {
      mindMapData.suggestions = ['Expand details', 'Add timeline', 'Include resources'];
    }

    // Add metadata
    mindMapData.timestamp = new Date().toISOString();
    mindMapData.colorScheme = colorScheme;
    mindMapData.isEvolution = isEvolution;

    // Return the response format expected by frontend
    return res.status(200).json({
      success: true,
      mindMap: mindMapData
    });

  } catch (error) {
    console.error('Error generating mind map:', error);
    
    // Return fallback mind map on any error
    const fallbackData = generateFallbackMindMap(
      req.body.input || req.body.prompt || 'Mind Map', 
      req.body.colorScheme || 'calmGreen'
    );
    
    return res.status(200).json({
      success: true,
      mindMap: fallbackData
    });
  }
}
