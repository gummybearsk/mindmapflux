// pages/tool.tsx - Enhanced AI Mind Mapping Tool (All Issues Fixed)
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
  MarkerType,
  Position,
  BackgroundVariant
} from 'reactflow';
import 'reactflow/dist/style.css';

// Color schemes defined directly to avoid import issues
const MINDMAP_COLOR_SCHEMES = {
  purple: {
    name: "Absolute Purple",
    chinese: "绝绝紫",
    primary: "#795F9C",
    secondary: "#EEDACA",
    root: "#795F9C",
    main: "#A67CB5",
    sub: "#C99FD0",
    detail: "#E6CCF0",
    background: "#F9F7FC",
    text: "#2D1B3D"
  },
  calmGreen: {
    name: "Calm Green",
    chinese: "静谧绿",
    primary: "#4A9B8E",
    secondary: "#B8E6D3",
    root: "#2E6B5C",
    main: "#4A9B8E",
    sub: "#7BC4B8",
    detail: "#B8E6D3",
    background: "#F4FCF9",
    text: "#1A3D37"
  },
  warmOrange: {
    name: "Warm Orange",
    chinese: "暖橙色",
    primary: "#E67E22",
    secondary: "#FDF2E9",
    root: "#D35400",
    main: "#E67E22",
    sub: "#F39C12",
    detail: "#FCF3CF",
    background: "#FFFBF5",
    text: "#8B4513"
  },
  oceanBlue: {
    name: "Ocean Blue",
    chinese: "海洋蓝",
    primary: "#3498DB",
    secondary: "#EBF5FB",
    root: "#2980B9",
    main: "#3498DB",
    sub: "#5DADE2",
    detail: "#D6EAF8",
    background: "#F8FCFF",
    text: "#1B4F72"
  },
  sunsetRed: {
    name: "Sunset Red",
    chinese: "夕阳红",
    primary: "#E74C3C",
    secondary: "#FDEDEC",
    root: "#C0392B",
    main: "#E74C3C",
    sub: "#EC7063",
    detail: "#F9EBEA",
    background: "#FFF9F9",
    text: "#922B21"
  }
};

// Interfaces
interface MindMapNode {
  id: string;
  label: string;
  type: string;
}

interface MindMapData {
  nodes: MindMapNode[];
  connections: { from: string; to: string }[];
  analysis: string;
  suggestions: string[];
  context: string;
}

export default function Tool() {
  const [input, setInput] = useState('');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedColorScheme, setSelectedColorScheme] = useState('calmGreen');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [mindMapAnalysis, setMindMapAnalysis] = useState('');
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const onConnect = useCallback((params: Edge | Connection) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  // Smart positioning algorithm to prevent overlaps
  const calculatePositions = (mindMapData: MindMapData) => {
    const positions = new Map();
    const centerNode = mindMapData.nodes.find(node => node.type === 'center');
    
    if (centerNode) {
      positions.set(centerNode.id, { x: 400, y: 300 });
    }

    const mainNodes = mindMapData.nodes.filter(node => node.type === 'main');
    const subNodes = mindMapData.nodes.filter(node => node.type === 'sub');
    const detailNodes = mindMapData.nodes.filter(node => node.type === 'detail');

    // Position main nodes in a circle around center
    mainNodes.forEach((node, index) => {
      const angle = (index * 2 * Math.PI) / mainNodes.length;
      const radius = 220; // Increased spacing
      const x = 400 + Math.cos(angle) * radius;
      const y = 300 + Math.sin(angle) * radius;
      positions.set(node.id, { x, y });
    });

    // Position sub nodes around their parent main nodes
    subNodes.forEach((node, index) => {
      const parentConnection = mindMapData.connections.find(conn => conn.to === node.id);
      const parentPosition = parentConnection ? positions.get(parentConnection.from) : { x: 400, y: 300 };
      
      const angle = (index * Math.PI) / Math.max(subNodes.length - 1, 1);
      const radius = 140;
      const x = parentPosition.x + Math.cos(angle) * radius;
      const y = parentPosition.y + Math.sin(angle) * radius;
      positions.set(node.id, { x, y });
    });

    // Position detail nodes around their parent sub nodes
    detailNodes.forEach((node, index) => {
      const parentConnection = mindMapData.connections.find(conn => conn.to === node.id);
      const parentPosition = parentConnection ? positions.get(parentConnection.from) : { x: 400, y: 300 };
      
      const angle = (index * Math.PI) / Math.max(detailNodes.length - 1, 1);
      const radius = 90;
      const x = parentPosition.x + Math.cos(angle) * radius;
      const y = parentPosition.y + Math.sin(angle) * radius;
      positions.set(node.id, { x, y });
    });

    return positions;
  };

  const generateMindMap = async (evolve = false) => {
    if (!input.trim()) return;

    setIsGenerating(true);
    setLoadingMessage('AI is analyzing your thoughts...');

    try {
      const response = await fetch('/api/mind-map/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: input.trim(),
          colorScheme: selectedColorScheme,
          isEvolution: evolve,
          existingNodes: evolve ? nodes : [],
          conversationHistory
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to generate mind map');
      }

      const mindMapData: MindMapData = result.mindMap;
      
      // Calculate optimal positions
      const positions = calculatePositions(mindMapData);
      
      // Get selected color scheme
      const scheme = MINDMAP_COLOR_SCHEMES[selectedColorScheme as keyof typeof MINDMAP_COLOR_SCHEMES];

      // Create React Flow nodes
      const flowNodes: Node[] = mindMapData.nodes.map(node => {
        const position = positions.get(node.id) || { x: 0, y: 0 };
        const nodeSize = node.type === 'center' ? 'large' : node.type === 'main' ? 'medium' : 'small';
        
        // Map node type to color scheme property
        let backgroundColor = scheme.primary;
        if (node.type === 'center') backgroundColor = scheme.root;
        else if (node.type === 'main') backgroundColor = scheme.main;
        else if (node.type === 'sub') backgroundColor = scheme.sub;
        else if (node.type === 'detail') backgroundColor = scheme.detail;

        return {
          id: node.id,
          type: 'default',
          position,
          data: {
            label: node.label,
            type: node.type
          },
          style: {
            background: backgroundColor,
            color: '#ffffff',
            border: `2px solid ${scheme.secondary}`,
            borderRadius: nodeSize === 'large' ? '15px' : nodeSize === 'medium' ? '10px' : '8px',
            padding: nodeSize === 'large' ? '15px 20px' : nodeSize === 'medium' ? '12px 16px' : '8px 12px',
            fontSize: nodeSize === 'large' ? '16px' : nodeSize === 'medium' ? '14px' : '12px',
            fontWeight: nodeSize === 'large' ? 'bold' : nodeSize === 'medium' ? '600' : 'normal',
            minWidth: nodeSize === 'large' ? '120px' : nodeSize === 'medium' ? '100px' : '80px',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            wordWrap: 'break-word',
            whiteSpace: 'normal'
          },
          sourcePosition: Position.Right,
          targetPosition: Position.Left
        };
      });

      // Create React Flow edges
      const flowEdges: Edge[] = mindMapData.connections.map((connection, index) => ({
        id: `edge-${index}`,
        source: connection.from,
        target: connection.to,
        type: 'smoothstep',
        animated: false,
        style: {
          stroke: scheme.secondary,
          strokeWidth: 2
        },
        markerEnd: {
          type: MarkerType.Arrow,
          color: scheme.main,
        }
      }));

      // Update states without clearing existing content when evolving
      if (evolve) {
        setNodes(prevNodes => [...prevNodes, ...flowNodes]);
        setEdges(prevEdges => [...prevEdges, ...flowEdges]);
      } else {
        setNodes(flowNodes);
        setEdges(flowEdges);
      }
      
      setAiSuggestions(mindMapData.suggestions || []);
      setMindMapAnalysis(mindMapData.analysis || '');
      setConversationHistory(prev => [...prev, input.trim()]);
      setInput('');

    } catch (error) {
      console.error('Error generating mind map:', error);
      alert('Failed to generate mind map. Please try again.');
    } finally {
      setIsGenerating(false);
      setLoadingMessage('');
    }
  };

  const applySuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  const clearMindMap = () => {
    setNodes([]);
    setEdges([]);
    setAiSuggestions([]);
    setMindMapAnalysis('');
    setConversationHistory([]);
    setInput('');
  };

  const exportAsPNG = () => {
    // Implementation for PNG export would go here
    alert('PNG export feature coming soon!');
  };

  const exportAsJSON = () => {
    const data = {
      nodes: nodes.map(node => ({
        id: node.id,
        label: node.data.label,
        type: node.data.type,
        position: node.position
      })),
      edges: edges.map(edge => ({
        source: edge.source,
        target: edge.target
      })),
      colorScheme: selectedColorScheme,
      analysis: mindMapAnalysis,
      suggestions: aiSuggestions
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mindmap.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>AI Mind Mapping Tool - Mindmapflux</title>
        <meta name="description" content="Create dynamic, AI-powered mind maps that evolve with your thoughts. Transform ideas into visual insights instantly." />
        <meta name="keywords" content="AI mind mapping, thought organization, visual thinking, business ideation" />
        <meta property="og:title" content="AI Mind Mapping Tool - Mindmapflux" />
        <meta property="og:description" content="Create dynamic, AI-powered mind maps that evolve with your thoughts" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Mindmapflux
            </Link>
            <nav className="flex space-x-8">
              <Link href="/how-it-works" className="text-gray-600 hover:text-blue-600">How It Works</Link>
              <Link href="/mind-mapping-guide" className="text-gray-600 hover:text-blue-600">Guide</Link>
              <Link href="/business-mind-mapping" className="text-gray-600 hover:text-blue-600">Business</Link>
              <Link href="/about" className="text-gray-600 hover:text-blue-600">About</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">AI-Powered Mind Mapping Tool</h1>
          
          {/* Input Section */}
          <div className="mb-6">
            <label htmlFor="thought-input" className="block text-lg font-medium text-gray-700 mb-3">
              Share your thoughts, ideas, or challenges:
            </label>
            <textarea
              id="thought-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Example: I want to start a food business in Huangshan, focusing on local specialties..."
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900"
              disabled={isGenerating}
            />
          </div>

          {/* Color Theme Selector */}
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700 mb-3">Choose Color Theme:</label>
            <div className="flex flex-wrap gap-3">
              {Object.entries(MINDMAP_COLOR_SCHEMES).map(([key, scheme]) => (
                <button
                  key={key}
                  onClick={() => setSelectedColorScheme(key)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    selectedColorScheme === key ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{
                    backgroundColor: selectedColorScheme === key ? scheme.background : undefined,
                    borderColor: selectedColorScheme === key ? scheme.primary : undefined
                  }}
                >
                  <div className="text-sm font-medium text-gray-900">{scheme.name}</div>
                  <div className="text-xs text-gray-600">{scheme.chinese}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => generateMindMap(false)}
              disabled={isGenerating || !input.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isGenerating ? 'Generating...' : 'Create Mind Map'}
            </button>
            
            <button
              onClick={() => generateMindMap(true)}
              disabled={isGenerating || !input.trim() || nodes.length === 0}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Evolve Map
            </button>
            
            <button
              onClick={clearMindMap}
              disabled={nodes.length === 0}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Clear All
            </button>
            
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
            >
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </button>
          </div>

          {/* Loading Message */}
          {isGenerating && loadingMessage && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                <span className="text-blue-800 font-medium">{loadingMessage}</span>
              </div>
            </div>
          )}
        </div>

        {/* AI Suggestions */}
        {aiSuggestions.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">💡 AI Suggestions for Expansion</h3>
            <div className="flex flex-wrap gap-2">
              {aiSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => applySuggestion(suggestion)}
                  className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mind Map Visualization */}
        <div className={`bg-white rounded-lg shadow-lg ${isFullscreen ? 'fixed inset-0 z-50' : 'h-96'} mb-6`}>
          <div className="h-full">
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
              <MiniMap />
              <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
          </div>
        </div>

        {/* Export Controls */}
        {nodes.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Export Your Mind Map</h3>
            <div className="flex gap-4">
              <button
                onClick={exportAsJSON}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
              >
                Export as JSON
              </button>
              <button
                onClick={exportAsPNG}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
              >
                Export as PNG
              </button>
            </div>
          </div>
        )}

        {/* AI Analysis */}
        {mindMapAnalysis && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">🤖 AI Analysis</h3>
            <div className="prose max-w-none text-gray-700">
              {mindMapAnalysis.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-3">{paragraph}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
