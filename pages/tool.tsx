// pages/api/mind-map/intelligent-generate.ts - Context-Aware AI Mind Map Generation
import { NextApiRequest, NextApiResponse } from 'next';

interface IntelligentMindMapNode {
  id: string;
  label: string;
  type: 'main' | 'sub' | 'detail';
  level?: number;
  parentId?: string;
  semantic_weight?: number;
  concept_category?: string;
}

interface IntelligentMindMapConnection {
  from: string;
  to: string;
  relationship_type?: 'hierarchy' | 'association' | 'dependency';
  strength?: number;
}

interface IntelligentRequest {
  input: string;
  isEvolution: boolean;
  selectedNodeId?: string;
  focusContext?: string;
  existingStructure?: {
    nodes: IntelligentMindMapNode[];
    connections: IntelligentMindMapConnection[];
    semantic_map: any;
  };
  evolutionIntent: 'expand' | 'restructure' | 'connect' | 'analyze';
  conversationHistory: string[];
}

interface IntelligentResponse {
  nodes: IntelligentMindMapNode[];
  connections: IntelligentMindMapConnection[];
  analysis: string;
  suggestions: string[];
  context: string;
  semantic_clusters?: string[][];
  restructure_recommendations?: string[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      input,
      isEvolution,
      selectedNodeId,
      focusContext,
      existingStructure,
      evolutionIntent,
      conversationHistory
    }: IntelligentRequest = req.body;

    console.log('🧠 Intelligent Mind Map Request:', {
      input: input.substring(0, 100) + '...',
      isEvolution,
      selectedNodeId,
      focusContext,
      evolutionIntent,
      hasExistingStructure: !!existingStructure
    });

    // Build context-aware prompt for OpenAI
    const intelligentPrompt = buildIntelligentPrompt(
      input,
      isEvolution,
      selectedNodeId,
      focusContext,
      existingStructure,
      evolutionIntent,
      conversationHistory
    );

    console.log('🎯 Generated Intelligent Prompt:', intelligentPrompt.substring(0, 200) + '...');

    // Call OpenAI with intelligent prompt
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an intelligent mind mapping AI that understands context, structure, and logical relationships. You create dynamic mind maps that evolve intelligently based on user input and existing structure.

Your capabilities:
- Understand existing mind map structure and relationships
- Expand specific nodes logically when requested
- Cluster and group related concepts semantically  
- Restructure layouts to reflect refined logic
- Create meaningful connections between ideas
- Maintain hierarchical relationships
- Assign semantic weights and categories

Always respond with valid JSON in the exact format specified.`
          },
          {
            role: 'user',
            content: intelligentPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('OpenAI API Error:', openAIResponse.status, errorText);
      throw new Error(`OpenAI API error: ${openAIResponse.status}`);
    }

    const aiResult = await openAIResponse.json();
    const aiContent = aiResult.choices[0]?.message?.content;

    if (!aiContent) {
      throw new Error('No content received from OpenAI');
    }

    console.log('🤖 Raw AI Response:', aiContent.substring(0, 300) + '...');

    // Parse AI response
    let parsedResponse: IntelligentResponse;
    try {
      // Clean the response to extract JSON
      const cleanedContent = aiContent.replace(/```json\n?|\n?```/g, '').trim();
      parsedResponse = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('AI Content:', aiContent);
      
      // Fallback: create a basic response
      parsedResponse = createFallbackResponse(input, isEvolution, existingStructure);
    }

    // Validate and enhance the response
    const validatedResponse = validateAndEnhanceResponse(parsedResponse, existingStructure, evolutionIntent);

    console.log('✅ Final Validated Response:', {
      nodeCount: validatedResponse.nodes.length,
      connectionCount: validatedResponse.connections.length,
      hasClusters: !!validatedResponse.semantic_clusters
    });

    res.status(200).json({
      success: true,
      data: validatedResponse
    });

  } catch (error) {
    console.error('Intelligent mind map generation error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}

function buildIntelligentPrompt(
  input: string,
  isEvolution: boolean,
  selectedNodeId?: string,
  focusContext?: string,
  existingStructure?: any,
  evolutionIntent?: string,
  conversationHistory?: string[]
): string {
  let prompt = '';

  if (isEvolution && existingStructure) {
    // Evolution mode: build on existing structure
    prompt += `EVOLUTION MODE: Intelligently evolve an existing mind map.

EXISTING MIND MAP STRUCTURE:
Nodes: ${JSON.stringify(existingStructure.nodes, null, 2)}
Connections: ${JSON.stringify(existingStructure.connections, null, 2)}

EVOLUTION CONTEXT:
- User Input: "${input}"
- Evolution Intent: ${evolutionIntent}
- Selected Node: ${selectedNodeId ? `"${selectedNodeId}" (${focusContext})` : 'None'}
- Conversation History: ${conversationHistory?.join(' → ') || 'None'}

INSTRUCTIONS:
${getEvolutionInstructions(evolutionIntent, selectedNodeId, focusContext)}

Create ONLY the NEW or MODIFIED nodes and connections that should be added/changed.
Maintain logical hierarchy and semantic relationships.
Ensure new content logically extends from the selected node or fits semantically within the existing structure.`;

  } else {
    // New mind map mode
    prompt += `NEW MIND MAP MODE: Create a comprehensive mind map from scratch.

USER INPUT: "${input}"

INSTRUCTIONS:
- Analyze the input to identify the main concept and key components
- Create a hierarchical structure with logical relationships
- Assign semantic weights based on importance (1-5 scale)
- Group related concepts into semantic clusters
- Create meaningful connections between ideas
- Ensure comprehensive coverage of the topic`;
  }

  prompt += `

RESPONSE FORMAT (Valid JSON only):
{
  "nodes": [
    {
      "id": "unique-id",
      "label": "Node Label", 
      "type": "main|sub|detail",
      "level": 0,
      "parentId": "parent-node-id",
      "semantic_weight": 3,
      "concept_category": "category"
    }
  ],
  "connections": [
    {
      "from": "parent-id",
      "to": "child-id", 
      "relationship_type": "hierarchy|association|dependency",
      "strength": 2
    }
  ],
  "analysis": "Brief analysis of the mind map structure and key insights",
  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"],
  "context": "Context about how this mind map addresses the user's input",
  "semantic_clusters": [["related", "concepts"], ["another", "cluster"]],
  "restructure_recommendations": ["Recommendation 1", "Recommendation 2"]
}

IMPORTANT:
- Use descriptive, meaningful labels
- Create logical parent-child relationships
- Assign appropriate semantic weights (higher = more important)
- Include 3-5 intelligent suggestions for further evolution
- Ensure JSON is valid and parseable`;

  return prompt;
}

function getEvolutionInstructions(
  evolutionIntent?: string,
  selectedNodeId?: string,
  focusContext?: string
): string {
  switch (evolutionIntent) {
    case 'expand':
      return selectedNodeId
        ? `EXPAND the selected node "${focusContext}" by creating logical sub-nodes and connections. 
         Focus specifically on breaking down this concept into detailed components.
         All new nodes should be children or descendants of the selected node.`
        : `EXPAND the mind map by adding new branches and detailed sub-components.
         Add depth and breadth to existing concepts.`;

    case 'restructure':
      return `RESTRUCTURE the mind map to better organize and group related concepts.
         Identify semantic clusters and reorganize connections for clearer logic.
         May involve changing hierarchy levels and relationship types.`;

    case 'connect':
      return `CREATE NEW CONNECTIONS between existing concepts that should be related.
         Focus on finding associations, dependencies, and cross-links between different branches.
         Add relationship connections that enhance understanding.`;

    case 'analyze':
      return `ANALYZE the existing structure and ADD analytical insights.
         Create new nodes that represent analysis, conclusions, implications, or insights.
         Focus on meta-level thinking about the existing concepts.`;

    default:
      return `INTELLIGENTLY EVOLVE the mind map based on the user's input.
         Determine the best approach (expand, restructure, connect, or analyze) based on context.`;
  }
}

function createFallbackResponse(
  input: string,
  isEvolution: boolean,
  existingStructure?: any
): IntelligentResponse {
  console.log('🚨 Creating fallback response due to AI parsing failure');

  // Create basic nodes based on input
  const mainConcept = input.substring(0, 50).trim();
  const fallbackNodes: IntelligentMindMapNode[] = [
    {
      id: 'main-concept',
      label: mainConcept,
      type: 'main',
      level: 0,
      semantic_weight: 5,
      concept_category: 'core'
    },
    {
      id: 'analysis-branch',
      label: 'Analysis',
      type: 'sub',
      level: 1,
      parentId: 'main-concept',
      semantic_weight: 3,
      concept_category: 'analysis'
    },
    {
      id: 'implementation-branch',
      label: 'Implementation',
      type: 'sub',
      level: 1,
      parentId: 'main-concept',
      semantic_weight: 3,
      concept_category: 'action'
    }
  ];

  const fallbackConnections: IntelligentMindMapConnection[] = [
    {
      from: 'main-concept',
      to: 'analysis-branch',
      relationship_type: 'hierarchy',
      strength: 2
    },
    {
      from: 'main-concept',
      to: 'implementation-branch',
      relationship_type: 'hierarchy',
      strength: 2
    }
  ];

  return {
    nodes: fallbackNodes,
    connections: fallbackConnections,
    analysis: `Basic mind map created for: ${mainConcept}`,
    suggestions: [
      'Expand on the analysis components',
      'Add more implementation details',
      'Consider potential challenges'
    ],
    context: 'Fallback mind map generated due to processing constraints',
    semantic_clusters: [['analysis'], ['implementation']]
  };
}

function validateAndEnhanceResponse(
  response: IntelligentResponse,
  existingStructure?: any,
  evolutionIntent?: string
): IntelligentResponse {
  // Ensure all nodes have required fields
  const validatedNodes = response.nodes.map((node, index) => ({
    id: node.id || `node-${Date.now()}-${index}`,
    label: node.label || 'Untitled Node',
    type: node.type || 'main',
    level: node.level || 0,
    parentId: node.parentId,
    semantic_weight: node.semantic_weight || 1,
    concept_category: node.concept_category || 'general'
  }));

  // Ensure all connections are valid
  const nodeIds = new Set(validatedNodes.map(n => n.id));
  const validatedConnections = response.connections.filter(conn => 
    nodeIds.has(conn.from) && nodeIds.has(conn.to)
  ).map(conn => ({
    from: conn.from,
    to: conn.to,
    relationship_type: conn.relationship_type || 'hierarchy',
    strength: conn.strength || 1
  }));

  // Ensure we have suggestions
  const suggestions = response.suggestions && response.suggestions.length > 0
    ? response.suggestions
    : [
        'Expand with more detailed sub-components',
        'Add implementation considerations',
        'Explore potential challenges and solutions'
      ];

  return {
    nodes: validatedNodes,
    connections: validatedConnections,
    analysis: response.analysis || 'Mind map structure created successfully',
    suggestions,
    context: response.context || 'Context-aware mind map generated',
    semantic_clusters: response.semantic_clusters || [],
    restructure_recommendations: response.restructure_recommendations || []
  };
}
