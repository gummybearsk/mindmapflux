// pages/tool.tsx - Enhanced AI Mind Mapping Tool (Problems 21-28 Fixed)
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
  BackgroundVariant,
  NodeChange,
  EdgeChange,
  ReactFlowInstance
} from 'reactflow';
import 'reactflow/dist/style.css';

// Color schemes with high contrast for readability (Problem 22)
const MINDMAP_COLOR_SCHEMES = {
  purple: {
    name: "Absolute Purple",
    chinese: "绝绝紫",
    primary: "#795F9C",
    secondary: "#EEDACA",
    root: "#4A1958", // Darker for better contrast
    main: "#795F9C",
    sub: "#A67CB5",
    detail: "#D4B5E8",
    background: "#F9F7FC",
    text: "#FFFFFF" // White text for contrast
  },
  calmGreen: {
    name: "Calm Green",
    chinese: "静谧绿",
    primary: "#4A9B8E",
    secondary: "#B8E6D3",
    root: "#1F4E3D", // Darker for better contrast
    main: "#4A9B8E",
    sub: "#7BC4B8",
    detail: "#B8E6D3",
    background: "#F4FCF9",
    text: "#FFFFFF"
  },
  warmOrange: {
    name: "Warm Orange",
    chinese: "暖橙色",
    primary: "#E67E22",
    secondary: "#FDF2E9",
    root: "#B8540A", // Darker for better contrast
    main: "#E67E22",
    sub: "#F39C12",
    detail: "#FCF3CF",
    background: "#FFFBF5",
    text: "#FFFFFF"
  },
  oceanBlue: {
    name: "Ocean Blue",
    chinese: "海洋蓝",
    primary: "#3498DB",
    secondary: "#EBF5FB",
    root: "#1A5490", // Darker for better contrast
    main: "#3498DB",
    sub: "#5DADE2",
    detail: "#D6EAF8",
    background: "#F8FCFF",
    text: "#FFFFFF"
  },
  sunsetRed: {
    name: "Sunset Red",
    chinese: "夕阳红",
    primary: "#E74C3C",
    secondary: "#FDEDEC",
    root: "#A12B1F", // Darker for better contrast
    main: "#E74C3C",
    sub: "#EC7063",
    detail: "#F9EBEA",
    background: "#FFF9F9",
    text: "#FFFFFF"
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
  const [loadingMessages] = useState([
    'AI is analyzing your thoughts...',
    'Identifying key concepts and relationships...',
    'Structuring your mind map hierarchy...',
    'Optimizing layout and connections...',
    'Finalizing your visual thought map...'
  ]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showColorOptions, setShowColorOptions] = useState(false); // Problem 21
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [currentStep, setCurrentStep] = useState<'input' | 'generating' | 'complete'>('input'); // Problem 24

  // Problem 28: Rotating loading messages
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isGenerating, loadingMessages.length]);

  // Problem 27: Auto-adjust node positions to prevent overlap
  const findEmptyPosition = (existingNodes: Node[], baseX: number, baseY: number, radius = 150) => {
    const attempts = 20;
    for (let i = 0; i < attempts; i++) {
      const angle = (i * 2 * Math.PI) / attempts;
      const x = baseX + Math.cos(angle) * radius;
      const y = baseY + Math.sin(angle) * radius;
      
      const tooClose = existingNodes.some(node => {
        const distance = Math.sqrt(Math.pow(node.position.x - x, 2) + Math.pow(node.position.y - y, 2));
        return distance < 120; // Minimum distance between nodes
      });
      
      if (!tooClose) {
        return { x, y };
      }
    }
    // Fallback position if no empty space found
    return { x: baseX + Math.random() * 200 - 100, y: baseY + Math.random() * 200 - 100 };
  };

  // Smart positioning algorithm with overlap prevention (Problem 27)
  const calculatePositions = (mindMapData: MindMapData, existingNodes: Node[] = []) => {
    const positions = new Map();
    const centerNode = mindMapData.nodes.find(node => node.type === 'center');
    
    if (centerNode) {
      positions.set(centerNode.id, { x: 400, y: 300 });
    }

    const mainNodes = mindMapData.nodes.filter(node => node.type === 'main');
    const subNodes = mindMapData.nodes.filter(node => node.type === 'sub');
    const detailNodes = mindMapData.nodes.filter(node => node.type === 'detail');

    // Position main nodes in a circle around center with overlap prevention
    mainNodes.forEach((node, index) => {
      const angle = (index * 2 * Math.PI) / mainNodes.length;
      const radius = 220;
      let x = 400 + Math.cos(angle) * radius;
      let y = 300 + Math.sin(angle) * radius;
      
      // Check for overlap with existing nodes
      const position = findEmptyPosition(existingNodes, x, y, 100);
      positions.set(node.id, position);
    });

    // Position sub nodes around their parent main nodes
    subNodes.forEach((node, index) => {
      const parentConnection = mindMapData.connections.find(conn => conn.to === node.id);
      const parentPosition = parentConnection ? positions.get(parentConnection.from) : { x: 400, y: 300 };
      
      const angle = (index * Math.PI) / Math.max(subNodes.length - 1, 1);
      const radius = 140;
      let x = parentPosition.x + Math.cos(angle) * radius;
      let y = parentPosition.y + Math.sin(angle) * radius;
      
      const position = findEmptyPosition([...existingNodes, ...Array.from(positions.entries()).map(([id, pos]) => ({ id, position: pos }))], x, y, 80);
      positions.set(node.id, position);
    });

    // Position detail nodes around their parent sub nodes
    detailNodes.forEach((node, index) => {
      const parentConnection = mindMapData.connections.find(conn => conn.to === node.id);
      const parentPosition = parentConnection ? positions.get(parentConnection.from) : { x: 400, y: 300 };
      
      const angle = (index * Math.PI) / Math.max(detailNodes.length - 1, 1);
      const radius = 90;
      let x = parentPosition.x + Math.cos(angle) * radius;
      let y = parentPosition.y + Math.sin(angle) * radius;
      
      const position = findEmptyPosition([...existingNodes, ...Array.from(positions.entries()).map(([id, pos]) => ({ id, position: pos }))], x, y, 60);
      positions.set(node.id, position);
    });

    return positions;
  };

  // Problem 26: Custom edge with dynamic connection points
  const createSmartEdge = (source: string, target: string, sourceNode: Node, targetNode: Node, scheme: any) => {
    // Calculate connection points based on node positions
    const sourcePos = sourceNode.position;
    const targetPos = targetNode.position;
    
    // Determine which side of the source node to connect from
    const deltaX = targetPos.x - sourcePos.x;
    const deltaY = targetPos.y - sourcePos.y;
    
    let sourcePosition = Position.Right;
    let targetPosition = Position.Left;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      sourcePosition = deltaX > 0 ? Position.Right : Position.Left;
      targetPosition = deltaX > 0 ? Position.Left : Position.Right;
    } else {
      sourcePosition = deltaY > 0 ? Position.Bottom : Position.Top;
      targetPosition = deltaY > 0 ? Position.Top : Position.Bottom;
    }

    return {
      sourcePosition,
      targetPosition
    };
  };

  const onConnect = useCallback((params: Edge | Connection) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  // Problem 26: Handle node position changes and update edge connections
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    onNodesChange(changes);
    
    // Update edge connection points when nodes are moved
    changes.forEach(change => {
      if (change.type === 'position' && change.position) {
        const movedNode = nodes.find(n => n.id === change.id);
        if (movedNode) {
          setEdges(currentEdges => 
            currentEdges.map(edge => {
              if (edge.source === change.id || edge.target === change.id) {
                const sourceNode = nodes.find(n => n.id === edge.source);
                const targetNode = nodes.find(n => n.id === edge.target);
                
                if (sourceNode && targetNode) {
                  const scheme = MINDMAP_COLOR_SCHEMES[selectedColorScheme as keyof typeof MINDMAP_COLOR_SCHEMES];
                  const { sourcePosition, targetPosition } = createSmartEdge(edge.source, edge.target, sourceNode, targetNode, scheme);
                  
                  return {
                    ...edge,
                    sourceHandle: sourcePosition,
                    targetHandle: targetPosition
                  };
                }
              }
              return edge;
            })
          );
        }
      }
    });
  }, [nodes, onNodesChange, setEdges, selectedColorScheme]);

  const generateMindMap = async (evolve = false) => {
    if (!input.trim()) return;

    setIsGenerating(true);
    setCurrentStep('generating'); // Problem 24
    setCurrentMessageIndex(0);

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
      
      // Calculate optimal positions with overlap prevention
      const positions = calculatePositions(mindMapData, evolve ? nodes : []);
      
      // Get selected color scheme
      const scheme = MINDMAP_COLOR_SCHEMES[selectedColorScheme as keyof typeof MINDMAP_COLOR_SCHEMES];

      // Create React Flow nodes with better contrast (Problem 22)
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
            color: scheme.text, // High contrast text (Problem 22)
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

      // Create React Flow edges with smart connection points (Problem 26)
      const flowEdges: Edge[] = mindMapData.connections.map((connection, index) => {
        const sourceNode = flowNodes.find(n => n.id === connection.from);
        const targetNode = flowNodes.find(n => n.id === connection.to);
        
        const { sourcePosition, targetPosition } = sourceNode && targetNode 
          ? createSmartEdge(connection.from, connection.to, sourceNode, targetNode, scheme)
          : { sourcePosition: Position.Right, targetPosition: Position.Left };

        return {
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
          },
          sourceHandle: sourcePosition,
          targetHandle: targetPosition
        };
      });

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
      setCurrentStep('complete'); // Problem 24

    } catch (error) {
      console.error('Error generating mind map:', error);
      alert('Failed to generate mind map. Please try again.');
      setCurrentStep('input'); // Problem 24
    } finally {
      setIsGenerating(false);
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
    setCurrentStep('input'); // Problem 24
  };

  // Problem 23: Exit fullscreen function
  const exitFullscreen = () => {
    setIsFullscreen(false);
  };

  const exportAsPNG = () => {
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

  // Problem 21: Auto color selection based on hierarchy
  useEffect(() => {
    if (nodes.length > 0 && !showColorOptions) {
      // Auto-select colors based on mind map complexity and evolve when needed
      const colorKeys = Object.keys(MINDMAP_COLOR_SCHEMES);
      const currentIndex = colorKeys.indexOf(selectedColorScheme);
      
      // Change color scheme when mind map evolves beyond certain complexity
      if (nodes.length > 10 && currentIndex < colorKeys.length - 1) {
        setSelectedColorScheme(colorKeys[currentIndex + 1]);
      }
    }
  }, [nodes.length, selectedColorScheme, showColorOptions]);

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
          
          {/* Problem 24: Step-based interface */}
          {currentStep === 'input' && (
            <>
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

              {/* Problem 21: Color schemes as system choice, with option to show manual selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-lg font-medium text-gray-700">
                    Color Theme: <span className="text-sm text-gray-500">(Auto-selected based on content)</span>
                  </label>
                  <button
                    onClick={() => setShowColorOptions(!showColorOptions)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {showColorOptions ? 'Auto Select' : 'Manual Select'}
                  </button>
                </div>
                
                {showColorOptions && (
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
                )}
                
                {!showColorOptions && (
                  <div className="text-sm text-gray-600">
                    Current: {MINDMAP_COLOR_SCHEMES[selectedColorScheme as keyof typeof MINDMAP_COLOR_SCHEMES].name} 
                    ({MINDMAP_COLOR_SCHEMES[selectedColorScheme as keyof typeof MINDMAP_COLOR_SCHEMES].chinese})
                  </div>
                )}
              </div>

              {/* Problem 24: Single button at the beginning */}
              <div className="flex justify-center">
                <button
                  onClick={() => generateMindMap(false)}
                  disabled={isGenerating || !input.trim()}
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
                >
                  Create Mind Map
                </button>
              </div>
            </>
          )}

          {/* Problem 24 & 28: During generation - show progress with rotating messages */}
          {currentStep === 'generating' && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Creating Your Mind Map</h3>
              <p className="text-gray-600">{loadingMessages[currentMessageIndex]}</p>
              <div className="mt-4 bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-blue-800">
                  AI is processing your thoughts and organizing them into a visual structure...
                </div>
              </div>
            </div>
          )}

          {/* Problem 24: After completion - show Continue and Start Over buttons */}
          {currentStep === 'complete' && (
            <>
              {/* Problem 25: Input hover box for fullscreen mode */}
              <div className={`mb-6 ${isFullscreen ? 'fixed top-4 left-4 right-4 z-50 bg-white p-4 rounded-lg shadow-lg' : ''}`}>
                <label htmlFor="continue-input" className="block text-lg font-medium text-gray-700 mb-3">
                  Continue evolving your mind map:
                </label>
                <textarea
                  id="continue-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Add more thoughts to evolve your mind map..."
                  className="w-full h-20 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900"
                />
              </div>

              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={() => generateMindMap(true)}
                  disabled={!input.trim()}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Continue
                </button>
                
                <button
                  onClick={clearMindMap}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                >
                  Start Over
                </button>
                
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
                >
                  {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                </button>
              </div>
            </>
          )}
        </div>

        {/* AI Suggestions */}
        {aiSuggestions.length > 0 && !isFullscreen && (
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
        <div className={`bg-white rounded-lg shadow-lg ${isFullscreen ? 'fixed inset-0 z-40' : 'h-96'} mb-6`}>
          {/* Problem 23: Clear exit fullscreen button */}
          {isFullscreen && (
            <button
              onClick={exitFullscreen}
              className="absolute top-4 right-4 z-50 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
            >
              Exit Fullscreen
            </button>
          )}
          
          <div className="h-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={handleNodesChange} // Problem 26: Smart edge updates
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
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
        {nodes.length > 0 && !isFullscreen && (
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
