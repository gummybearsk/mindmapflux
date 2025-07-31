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

// Smart Dynamic Color Palette - Auto-assigns colors based on hierarchy and aesthetics
const SMART_COLOR_PALETTE = {
  // Core colors for different hierarchy levels
  hierarchy: [
    "#2D3748", // Deep Gray - Root/Center (strong foundation)
    "#2B6CB0", // Deep Blue - Primary branches (trust, stability)
    "#059669", // Green - Secondary branches (growth, nature)
    "#DC2626", // Red - Tertiary branches (energy, importance)
    "#7C2D12", // Brown - Supporting ideas (grounded, practical)
    "#6366F1", // Indigo - Creative branches (innovation, imagination)
    "#DB2777", // Pink - Emotional/personal branches (passion, feeling)
    "#EA580C", // Orange - Action-oriented branches (enthusiasm, action)
    "#7C3AED", // Purple - Strategic/planning branches (wisdom, strategy)
    "#0891B2", // Cyan - Technical/analytical branches (precision, analysis)
  ],
  
  // Contextual colors based on content type
  contextual: {
    business: "#1E40AF", // Professional blue
    creative: "#7C2D12", // Creative brown
    emotional: "#DC2626", // Emotional red
    technical: "#059669", // Technical green
    planning: "#7C3AED", // Planning purple
    financial: "#D97706", // Financial orange
    social: "#DB2777", // Social pink
    health: "#059669", // Health green
    education: "#6366F1", // Education indigo
    default: "#4B5563" // Neutral gray
  }
};

// Intelligent color assignment based on node content, hierarchy, and aesthetics
const getIntelligentColor = (node: MindMapNode, allNodes: MindMapNode[], nodeIndex: number, hierarchyLevel: number) => {
  const colors = SMART_COLOR_PALETTE;
  
  // Analyze content for contextual coloring
  const nodeText = node.label.toLowerCase();
  let contextColor = colors.contextual.default;
  
  // Context detection
  if (nodeText.includes('business') || nodeText.includes('market') || nodeText.includes('revenue')) {
    contextColor = colors.contextual.business;
  } else if (nodeText.includes('creative') || nodeText.includes('design') || nodeText.includes('art')) {
    contextColor = colors.contextual.creative;
  } else if (nodeText.includes('emotion') || nodeText.includes('feeling') || nodeText.includes('personal')) {
    contextColor = colors.contextual.emotional;
  } else if (nodeText.includes('technical') || nodeText.includes('system') || nodeText.includes('process')) {
    contextColor = colors.contextual.technical;
  } else if (nodeText.includes('plan') || nodeText.includes('strategy') || nodeText.includes('goal')) {
    contextColor = colors.contextual.planning;
  } else if (nodeText.includes('money') || nodeText.includes('cost') || nodeText.includes('price')) {
    contextColor = colors.contextual.financial;
  }
  
  // For center/root nodes - use contextual color or deep foundation color
  if (node.type === 'center') {
    return contextColor !== colors.contextual.default ? contextColor : colors.hierarchy[0];
  }
  
  // For hierarchical nodes - use hierarchy colors with some contextual influence
  const hierarchyColor = colors.hierarchy[Math.min(hierarchyLevel, colors.hierarchy.length - 1)];
  
  // Add variety within same level using node index
  if (hierarchyLevel > 0) {
    const colorIndex = (hierarchyLevel + Math.floor(nodeIndex / 3)) % colors.hierarchy.length;
    return colors.hierarchy[colorIndex];
  }
  
  return hierarchyColor;
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
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [currentStep, setCurrentStep] = useState<'input' | 'generating' | 'complete'>('input');

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

  // Smart positioning algorithm with overlap prevention (Problem 27) - FIXED TYPESCRIPT ERROR
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
      
      // FIXED: Use existingNodes directly instead of trying to convert positions
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
      
      // FIXED: Use existingNodes directly
      const position = findEmptyPosition(existingNodes, x, y, 80);
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
      
      // FIXED: Use existingNodes directly
      const position = findEmptyPosition(existingNodes, x, y, 60);
      positions.set(node.id, position);
    });

    return positions;
  };

  // Problem 26: Custom edge with dynamic connection points
  const createSmartEdge = (source: string, target: string, sourceNode: Node, targetNode: Node) => {
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
                  const { sourcePosition, targetPosition } = createSmartEdge(edge.source, edge.target, sourceNode, targetNode);
                  
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
  }, [nodes, onNodesChange, setEdges]);

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

      // Create React Flow nodes with intelligent color assignment
      const flowNodes: Node[] = mindMapData.nodes.map((node, index) => {
        const position = positions.get(node.id) || { x: 0, y: 0 };
        const nodeSize = node.type === 'center' ? 'large' : node.type === 'main' ? 'medium' : 'small';
        
        // Get hierarchy level for this node type
        const hierarchyLevel = node.type === 'center' ? 0 : 
                              node.type === 'main' ? 1 : 
                              node.type === 'sub' ? 2 : 3;
        
        // Get intelligent color based on content, hierarchy, and aesthetics
        const backgroundColor = getIntelligentColor(node, mindMapData.nodes, index, hierarchyLevel);

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
            color: "#FFFFFF", // High contrast white text
            border: `2px solid ${backgroundColor}`,
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

      // Create React Flow edges with smart connection points
      const flowEdges: Edge[] = mindMapData.connections.map((connection, index) => {
        const sourceNode = flowNodes.find(n => n.id === connection.from);
        const targetNode = flowNodes.find(n => n.id === connection.to);
        
        const { sourcePosition, targetPosition } = sourceNode && targetNode 
          ? createSmartEdge(connection.from, connection.to, sourceNode, targetNode)
          : { sourcePosition: Position.Right, targetPosition: Position.Left };

        // Get edge color based on source node color with slight transparency
        const sourceColor = sourceNode?.style?.background || '#6B7280';

        return {
          id: `edge-${index}`,
          source: connection.from,
          target: connection.to,
          type: 'smoothstep',
          animated: false,
          style: {
            stroke: sourceColor,
            strokeWidth: 2,
            strokeOpacity: 0.8
          },
          markerEnd: {
            type: MarkerType.Arrow,
            color: sourceColor,
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
        position: node.position,
        color: node.style?.background
      })),
      edges: edges.map(edge => ({
        source: edge.source,
        target: edge.target
      })),
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

  // Remove the manual color selection effect - colors are now fully automatic
  // Auto-adjustment happens during mind map generation based on content and hierarchy

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
          </div>
        )}
      </div>
    </div>
  );
}
