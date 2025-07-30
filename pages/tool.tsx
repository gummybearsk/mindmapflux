// pages/tool.tsx - Enhanced AI Mind Mapping Tool
import { useState, useEffect, useCallback, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Enhanced interfaces
interface MindMapNode {
  id: string;
  text: string;
  category: 'root' | 'main' | 'sub' | 'detail';
  color: string;
  parent?: string;
  level: number;
  importance?: number;
  connections?: string[];
}

interface MindMapData {
  title: string;
  nodes: MindMapNode[];
  connections: { from: string; to: string }[];
  context: string;
  suggestions?: string[];
  expandable: boolean;
}

// Color schemes from your specification
const COLOR_SCHEMES = {
  purple: {
    name: "Absolute Purple",
    root: "#795F9C",
    main: "#A67CB5",
    sub: "#C198D4",
    detail: "#E0C4F3",
    background: "#F8F5FB"
  },
  fortuneRed: {
    name: "Fortune Red", 
    root: "#D85B72",
    main: "#E08799",
    sub: "#E8A9B8",
    detail: "#F0CBD6",
    background: "#FDF7F8"
  },
  calmGreen: {
    name: "Calm Green",
    root: "#6B8857",
    main: "#87A574",
    sub: "#A3C291",
    detail: "#BFDFAE",
    background: "#F7FAF5"
  },
  pineGreen: {
    name: "Pine Green",
    root: "#518463",
    main: "#6FA080",
    sub: "#8DBC9D",
    detail: "#ABD8BA",
    background: "#F5F9F7"
  },
  authenticBlue: {
    name: "Authentic Blue",
    root: "#4C697A",
    main: "#6B8595",
    sub: "#8AA1B0",
    detail: "#A9BDCB",
    background: "#F5F7F9"
  },
  sugarBrown: {
    name: "Sugar Brown",
    root: "#886441",
    main: "#A58057",
    sub: "#C29C6D",
    detail: "#DFB883",
    background: "#FBF8F5"
  }
};

// Enhanced AI prompt for better mind map generation
const generateEnhancedPrompt = (input: string, existingNodes: MindMapNode[] = [], colorScheme: string = 'calmGreen') => {
  const existingContext = existingNodes.length > 0 
    ? `\n\nEXISTING MIND MAP CONTEXT: ${existingNodes.map(n => `${n.text} (${n.category})`).join(', ')}`
    : '';

  return `You are an expert business strategist, entrepreneur, and mind mapping specialist with deep knowledge in business, finance, accounting, and strategic planning. Create a comprehensive, intelligent mind map based on this input: "${input}"

${existingContext}

CRITICAL REQUIREMENTS:
1. **COMPREHENSIVE ANALYSIS**: Create a complete project blueprint. Understand context deeply and create logical relationships. Know what categories make sense for this topic.

2. **INTELLIGENT STRUCTURE**: 
   - 1 ROOT node (central concept)
   - 4-8 MAIN categories (major themes)
   - 2-6 SUB categories per main (detailed aspects)
   - 1-4 DETAIL nodes per sub (specific items/actions)

3. **BUSINESS EXPERTISE**: Act as a successful entrepreneur/investor/professor. Apply deep business knowledge, include real-world case studies, SWOT analysis insights, and practical takeaways.

4. **EXPANDABLE DESIGN**: Each node should suggest natural expansion points. Include "expandable: true" if more details can be added.

5. **SMART POSITIONING**: Calculate positions to avoid overlaps using radial distribution around center.

6. **COLOR CODING**: Use "${colorScheme}" scheme:
   - Root: deepest color, center position
   - Main: medium color, radial around root  
   - Sub: lighter color, branching from main
   - Detail: lightest color, final branches

7. **CONCISE TEXT**: 1-4 words per node, descriptive but brief.

8. **MEMORIZATION**: Remember user inputs and apply learnings to subsequent maps.

EXAMPLE FOR "online business": 
- Root: "Online Business" 
- Main: "Product Strategy", "Marketing Channels", "Revenue Streams", "Operations", "Legal Structure", "Financial Planning"
- Sub under Marketing: "Social Media", "Content Marketing", "Paid Ads", "SEO Strategy"
- Detail under Social Media: "TikTok", "Instagram", "YouTube", "LinkedIn"

Return JSON format:
{
  "title": "Central Theme",
  "context": "Brief analysis of the topic",
  "nodes": [
    {
      "id": "unique_id",
      "text": "Node Text",
      "category": "root|main|sub|detail", 
      "color": "#hexcolor",
      "parent": "parent_id",
      "level": 0,
      "importance": 1-10,
      "x": calculated_x_position,
      "y": calculated_y_position
    }
  ],
  "connections": [{"from": "parent_id", "to": "child_id"}],
  "suggestions": ["suggestion1", "suggestion2"],
  "expandable": true|false
}`;
};

// Smart positioning algorithm
const calculateSmartPositions = (nodes: MindMapNode[]): { [key: string]: { x: number; y: number } } => {
  const positions: { [key: string]: { x: number; y: number } } = {};
  const centerX = 400;
  const centerY = 300;
  
  // Find root node
  const rootNode = nodes.find(n => n.category === 'root');
  if (rootNode) {
    positions[rootNode.id] = { x: centerX, y: centerY };
  }

  // Position main nodes in circle around root
  const mainNodes = nodes.filter(n => n.category === 'main');
  const mainRadius = 200;
  mainNodes.forEach((node, index) => {
    const angle = (2 * Math.PI * index) / mainNodes.length;
    positions[node.id] = {
      x: centerX + mainRadius * Math.cos(angle),
      y: centerY + mainRadius * Math.sin(angle)
    };
  });

  // Position sub nodes around their parents
  const subNodes = nodes.filter(n => n.category === 'sub');
  subNodes.forEach((node, index) => {
    const parent = nodes.find(n => n.id === node.parent);
    if (parent && positions[parent.id]) {
      const parentPos = positions[parent.id];
      const subRadius = 120;
      const siblingIndex = subNodes.filter(n => n.parent === node.parent).indexOf(node);
      const totalSiblings = subNodes.filter(n => n.parent === node.parent).length;
      
      const angleOffset = (2 * Math.PI * siblingIndex) / Math.max(totalSiblings, 1);
      const baseAngle = Math.atan2(parentPos.y - centerY, parentPos.x - centerX);
      const angle = baseAngle + angleOffset - Math.PI/4;
      
      positions[node.id] = {
        x: parentPos.x + subRadius * Math.cos(angle),
        y: parentPos.y + subRadius * Math.sin(angle)
      };
    }
  });

  // Position detail nodes
  const detailNodes = nodes.filter(n => n.category === 'detail');
  detailNodes.forEach((node) => {
    const parent = nodes.find(n => n.id === node.parent);
    if (parent && positions[parent.id]) {
      const parentPos = positions[parent.id];
      const detailRadius = 80;
      const siblingIndex = detailNodes.filter(n => n.parent === node.parent).indexOf(node);
      const totalSiblings = detailNodes.filter(n => n.parent === node.parent).length;
      
      const angleOffset = (2 * Math.PI * siblingIndex) / Math.max(totalSiblings, 1);
      const angle = angleOffset;
      
      positions[node.id] = {
        x: parentPos.x + detailRadius * Math.cos(angle),
        y: parentPos.y + detailRadius * Math.sin(angle)
      };
    }
  });

  return positions;
};

// Convert to React Flow format with smart positioning
const convertToReactFlowData = (data: MindMapData, colorScheme: keyof typeof COLOR_SCHEMES = 'calmGreen') => {
  const scheme = COLOR_SCHEMES[colorScheme];
  const positions = calculateSmartPositions(data.nodes);

  const nodes: Node[] = data.nodes.map((node) => {
    const pos = positions[node.id] || { x: 400, y: 300 };
    
    // Dynamic sizing based on category
    const getNodeSize = (category: string) => {
      switch (category) {
        case 'root': return { width: 180, height: 60 };
        case 'main': return { width: 140, height: 50 };
        case 'sub': return { width: 120, height: 40 };
        case 'detail': return { width: 100, height: 35 };
        default: return { width: 120, height: 40 };
      }
    };

    const size = getNodeSize(node.category);
    
    return {
      id: node.id,
      type: 'default',
      position: pos,
      data: {
        label: (
          <div style={{
            padding: node.category === 'root' ? '12px 16px' : '8px 12px',
            backgroundColor: node.color,
            borderRadius: node.category === 'root' ? '12px' : '8px',
            color: 'white',
            fontWeight: node.category === 'root' ? 'bold' : node.category === 'main' ? '600' : 'normal',
            fontSize: node.category === 'root' ? '16px' : node.category === 'main' ? '14px' : '12px',
            textAlign: 'center',
            width: size.width - 20,
            height: size.height - 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            border: '2px solid rgba(255,255,255,0.2)'
          }}>
            {node.text}
          </div>
        )
      },
      style: {
        width: size.width,
        height: size.height,
        border: 'none',
        background: 'transparent'
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    };
  });

  const edges: Edge[] = data.connections.map((conn, index) => ({
    id: `edge-${index}`,
    source: conn.from,
    target: conn.to,
    type: 'straight',
    style: {
      stroke: scheme.main,
      strokeWidth: 2,
    },
    markerEnd: {
      type: 'arrow',
      color: scheme.main,
    },
  }));

  return { nodes, edges };
};

export default function MindMapTool() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mindMapData, setMindMapData] = useState<MindMapData | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedScheme, setSelectedScheme] = useState<keyof typeof COLOR_SCHEMES>('calmGreen');
  const [conversationHistory, setConversationHistory] = useState<MindMapData[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  const onConnect = useCallback((params: Connection | Edge) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  // Enhanced mind map generation
  const generateMindMap = async (isEvolution = false) => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    setError('');

    try {
      const prompt = generateEnhancedPrompt(
        input, 
        isEvolution ? mindMapData?.nodes : [], 
        selectedScheme
      );

      const response = await fetch('/api/mind-map/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          isEvolution,
          colorScheme: selectedScheme 
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: MindMapData = await response.json();
      
      // Update conversation history
      setConversationHistory(prev => [...prev, data]);
      
      const { nodes: flowNodes, edges: flowEdges } = convertToReactFlowData(data, selectedScheme);
      
      setMindMapData(data);
      setNodes(flowNodes);
      setEdges(flowEdges);
      setSuggestions(data.suggestions || []);

      // Track analytics
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'mind_map_generated',
          data: { 
            nodeCount: flowNodes.length,
            theme: selectedScheme,
            isEvolution 
          }
        }),
      });

    } catch (error) {
      console.error('Error generating mind map:', error);
      setError('Failed to generate mind map. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Evolution function - adds to existing mind map
  const evolveMindMap = () => {
    generateMindMap(true);
  };

  // Export functions
  const exportAsJSON = () => {
    if (!mindMapData) return;
    
    const dataStr = JSON.stringify(mindMapData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mindmap-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Clear function
  const clearMindMap = () => {
    setMindMapData(null);
    setNodes([]);
    setEdges([]);
    setInput('');
    setSuggestions([]);
    setError('');
    setConversationHistory([]);
  };

  // Apply suggestion
  const applySuggestion = (suggestion: string) => {
    setInput(prev => prev ? `${prev}. ${suggestion}` : suggestion);
  };

  return (
    <>
      <Head>
        <title>AI Mind Map Generator - Mindmapflux</title>
        <meta name="description" content="Generate intelligent, evolving mind maps with AI. Transform your thoughts into visual insights." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="flex items-center">
                  <span className="ml-2 text-xl font-bold text-gray-900">Mindmapflux</span>
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900">How it Works</Link>
                <Link href="/mind-mapping-guide" className="text-gray-600 hover:text-gray-900">Guide</Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI Mind Map Generator
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform your ideas into intelligent, evolving mind maps. Our AI understands context and creates comprehensive project blueprints.
            </p>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Input Section */}
              <div className="lg:col-span-2">
                <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
                  Describe your idea, project, or topic:
                </label>
                <textarea
                  id="input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g., 'I want to start an online business selling handmade jewelry. Need to figure out target customers, marketing strategy, pricing, logistics, and legal requirements.'"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                />
                
                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={() => generateMindMap(false)}
                    disabled={isLoading || !input.trim()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isLoading ? 'Generating...' : 'Generate Mind Map'}
                  </button>
                  
                  {mindMapData && (
                    <button
                      onClick={evolveMindMap}
                      disabled={isLoading || !input.trim()}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                    >
                      Evolve Map
                    </button>
                  )}
                  
                  <button
                    onClick={clearMindMap}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Color Scheme Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Theme:
                </label>
                <select
                  value={selectedScheme}
                  onChange={(e) => setSelectedScheme(e.target.value as keyof typeof COLOR_SCHEMES)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(COLOR_SCHEMES).map(([key, scheme]) => (
                    <option key={key} value={key}>
                      {scheme.name}
                    </option>
                  ))}
                </select>

                {/* Export Options */}
                {mindMapData && (
                  <div className="mt-4">
                    <button
                      onClick={exportAsJSON}
                      className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 mb-2"
                    >
                      Export JSON
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">AI Suggestions for expansion:</h3>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => applySuggestion(suggestion)}
                      className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-100 border border-blue-200"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mind Map Visualization */}
          <div className="bg-white rounded-lg shadow-md" style={{ height: '600px' }}>
            {mindMapData ? (
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                attributionPosition="bottom-left"
              >
                <Controls />
                <MiniMap 
                  nodeColor={(node) => {
                    const bgColor = node.style?.backgroundColor || '#6B8857';
                    return typeof bgColor === 'string' ? bgColor : '#6B8857';
                  }}
                  maskColor="rgba(0,0,0,0.1)"
                />
                <Background />
              </ReactFlow>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="text-6xl mb-4">🧠</div>
                  <h3 className="text-xl font-semibold mb-2">Ready to map your thoughts?</h3>
                  <p>Enter your idea above and watch it transform into an intelligent mind map.</p>
                </div>
              </div>
            )}
          </div>

          {/* Context Display */}
          {mindMapData?.context && (
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Analysis</h3>
              <p className="text-gray-700">{mindMapData.context}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
