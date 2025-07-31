// pages/tool.tsx - Intelligent Context-Aware Mind Mapping Tool
import { useState, useEffect, useCallback, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import ReactFlow to avoid SSR issues
const ReactFlow = dynamic(
  () => import('reactflow').then((mod) => mod.default),
  { ssr: false }
);

const MiniMap = dynamic(
  () => import('reactflow').then((mod) => mod.MiniMap),
  { ssr: false }
);

const Controls = dynamic(
  () => import('reactflow').then((mod) => mod.Controls),
  { ssr: false }
);

const Background = dynamic(
  () => import('reactflow').then((mod) => mod.Background),
  { ssr: false }
);

// Import types and enums safely
import type { Node, Edge, NodeChange } from 'reactflow';

// Enhanced interfaces for intelligent mind mapping
interface MindMapNode {
  id: string;
  label: string;
  type: 'center' | 'main' | 'sub' | 'detail';
  level?: number;
  parentId?: string;
  semantic_weight?: number;
  concept_category?: string;
}

interface MindMapConnection {
  from: string;
  to: string;
  relationship_type?: 'hierarchy' | 'association' | 'dependency';
  strength?: number;
}

interface MindMapStructure {
  nodes: MindMapNode[];
  connections: MindMapConnection[];
  analysis: string;
  suggestions: string[];
  context?: string;
  semantic_clusters?: string[][];
  restructure_recommendations?: string[];
}

// Smart Color System (preserved from previous version)
const BRANCH_COLOR_SYSTEM = {
  primary: { color: "#2D7D7D", name: "正经绿" },
  priority: [
    { color: "#795F9C", name: "绝绝紫" },
    { color: "#D85B72", name: "发财红" },
    { color: "#6B8857", name: "不焦虑" },
    { color: "#518463", name: "放青松" },
    { color: "#4C697A", name: "不摆蓝" },
    { color: "#886441", name: "糖太棕" }
  ],
  additional: [
    { color: "#5D4E37", name: "深棕" },
    { color: "#2F4F4F", name: "深青" },
    { color: "#483D8B", name: "深紫" },
    { color: "#8B7355", name: "暗金" }
  ]
};

export default function IntelligentTool() {
  const [input, setInput] = useState('');
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState<'input' | 'generating' | 'complete'>('input');
  const [analysis, setAnalysis] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullscreenInput, setShowFullscreenInput] = useState(true);
  const [semanticClusters, setSemanticClusters] = useState<string[][]>([]);
  const [evolutionMode, setEvolutionMode] = useState<'expand' | 'restructure' | 'connect' | 'analyze'>('expand');
  const [isClient, setIsClient] = useState(false);

  // Ensure component only renders on client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Manual node state management (replacing useNodesState)
  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => {
      const updatedNodes = [...nds];
      changes.forEach((change) => {
        // Only process changes that have an id property
        if ('id' in change) {
          const nodeIndex = updatedNodes.findIndex((node) => node.id === change.id);
          if (nodeIndex !== -1) {
            if (change.type === 'position' && 'position' in change && change.position) {
              updatedNodes[nodeIndex] = {
                ...updatedNodes[nodeIndex],
                position: change.position
              };
            } else if (change.type === 'select' && 'selected' in change) {
              updatedNodes[nodeIndex] = {
                ...updatedNodes[nodeIndex],
                selected: change.selected
              };
            }
          }
        }
      });
      return updatedNodes;
    });
  }, []);

  // Manual edge state management (replacing useEdgesState)
  const onEdgesChange = useCallback((changes: any[]) => {
    setEdges((eds) => {
      const updatedEdges = [...eds];
      changes.forEach((change) => {
        // Only process changes that have an id property
        if ('id' in change) {
          const edgeIndex = updatedEdges.findIndex((edge) => edge.id === change.id);
          if (edgeIndex !== -1 && change.type === 'select' && 'selected' in change) {
            updatedEdges[edgeIndex] = {
              ...updatedEdges[edgeIndex],
              selected: change.selected
            };
          }
        }
      });
      return updatedEdges;
    });
  }, []);

  // Intelligent node selection handler
  const handleNodeClick = useCallback((event: any, node: Node) => {
    setSelectedNodeId(node.id);
    console.log('🎯 Selected node for context:', node.data?.label);
  }, []);

  // Context-aware evolution intent detection
  const detectEvolutionIntent = (inputText: string): 'expand' | 'restructure' | 'connect' | 'analyze' => {
    const expandKeywords = ['expand', 'elaborate', 'detail', 'break down', 'explore'];
    const restructureKeywords = ['reorganize', 'restructure', 'group', 'cluster', 'organize'];
    const connectKeywords = ['connect', 'relate', 'link', 'associate', 'combine'];
    const analyzeKeywords = ['analyze', 'examine', 'evaluate', 'assess', 'review'];

    const lowerInput = inputText.toLowerCase();
    
    if (expandKeywords.some(keyword => lowerInput.includes(keyword))) return 'expand';
    if (restructureKeywords.some(keyword => lowerInput.includes(keyword))) return 'restructure';
    if (connectKeywords.some(keyword => lowerInput.includes(keyword))) return 'connect';
    if (analyzeKeywords.some(keyword => lowerInput.includes(keyword))) return 'analyze';
    
    return 'expand'; // Default to expand
  };

  // Intelligent mind map generation
  const generateIntelligentMindMap = async (evolve = false) => {
    if (!input.trim()) return;

    setIsGenerating(true);
    setCurrentStep('generating');
    
    try {
      // Detect user's intent
      const intent = detectEvolutionIntent(input);
      setEvolutionMode(intent);

      console.log('🧠 Sending request to your API:', {
        input: input.trim(),
        isEvolution: evolve,
        selectedNode: selectedNodeId,
        intent
      });

      // Call your existing API with the correct format
      const response = await fetch('/api/mind-map/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: input.trim(),
          isEvolution: evolve,
          existingNodes: evolve ? nodes : [],
          conversationHistory: conversationHistory,
          colorScheme: 'calmGreen'
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('🎯 API Response:', result);
      
      let mindMapData: MindMapStructure;
      if (result.success && result.mindMap) {
        mindMapData = result.mindMap;
      } else {
        throw new Error(result.error || 'Failed to generate intelligent mind map');
      }
      
      // Create nodes with intelligent positioning and coloring
      const positions = calculateIntelligentPositions(mindMapData, evolve ? nodes : []);
      const flowNodes: Node[] = mindMapData.nodes.map((node, index) => {
        const position = positions.get(node.id) || { x: 0, y: 0 };
        const backgroundColor = assignIntelligentColor(node, mindMapData.nodes, mindMapData.connections);
        
        // Determine node importance and styling
        const connections = mindMapData.connections.filter(c => c.from === node.id || c.to === node.id);
        const importance = connections.length + (node.semantic_weight || 1);
        
        let fontSize = '14px';
        let fontWeight = 'normal';
        let minWidth = '100px';
        let padding = '12px 16px';
        
        if (importance >= 5) {
          fontSize = '16px';
          fontWeight = 'bold';
          minWidth = '140px';
          padding = '14px 20px';
        } else if (importance >= 3) {
          fontSize = '15px';
          fontWeight = '600';
          minWidth = '120px';
          padding = '13px 18px';
        }

        return {
          id: node.id,
          type: 'default',
          position,
          data: { 
            label: node.label,
            type: node.type,
            level: node.level || 0,
            parentId: node.parentId,
            semantic_weight: node.semantic_weight || 1,
            concept_category: node.concept_category
          },
          style: {
            background: backgroundColor,
            color: 'white',
            border: selectedNodeId === node.id ? '3px solid #FFD700' : 'none',
            borderRadius: '8px',
            padding,
            fontSize,
            fontWeight,
            minWidth,
            textAlign: 'center',
            wordWrap: 'break-word',
            boxShadow: selectedNodeId === node.id 
              ? '0 4px 12px rgba(255,215,0,0.4)' 
              : '0 2px 8px rgba(0,0,0,0.15)',
            cursor: 'pointer'
          },
          draggable: true
        };
      });

      // Create intelligent edges
      const flowEdges: Edge[] = mindMapData.connections.map((connection, index) => {
        const sourceNode = flowNodes.find(n => n.id === connection.from);
        const targetNode = flowNodes.find(n => n.id === connection.to);
        
        let strokeColor = '#6B7280';
        if (sourceNode?.style?.background && typeof sourceNode.style.background === 'string') {
          strokeColor = sourceNode.style.background;
        }
        
        const strokeWidth = connection.strength ? Math.max(1, connection.strength * 2) : 2;
        const animated = connection.relationship_type === 'association';
        
        return {
          id: `${connection.from}-${connection.to}`,
          source: connection.from,
          target: connection.to,
          type: 'smoothstep',
          animated,
          style: { 
            stroke: strokeColor,
            strokeWidth,
            strokeOpacity: 0.7
          },
          markerEnd: { 
            type: 'arrowclosed',
            color: strokeColor
          },
          data: {
            relationship_type: connection.relationship_type,
            strength: connection.strength
          }
        } as Edge;
      });

      if (evolve) {
        // Intelligent evolution: merge with existing structure
        const existingNodeIds = new Set(nodes.map(n => n.id));
        const newNodes = flowNodes.filter(node => !existingNodeIds.has(node.id));
        const existingEdgeIds = new Set(edges.map(e => e.id));
        const newEdges = flowEdges.filter(edge => !existingEdgeIds.has(edge.id));
        
        setNodes(prev => [...prev, ...newNodes]);
        setEdges(prev => [...prev, ...newEdges]);
      } else {
        // New mind map: replace all
        setNodes(flowNodes);
        setEdges(flowEdges);
      }

      setAnalysis(mindMapData.analysis || '');
      setSuggestions(mindMapData.suggestions || []);
      setSemanticClusters(mindMapData.semantic_clusters || []);
      setConversationHistory(prev => [...prev, input.trim()]);
      setCurrentStep('complete');
      
    } catch (error) {
      console.error('Error generating intelligent mind map:', error);
      alert(`Failed to generate mind map: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Intelligent positioning algorithm
  const calculateIntelligentPositions = (mindMapData: MindMapStructure, existingNodes: Node[] = []): Map<string, { x: number; y: number }> => {
    const positions = new Map<string, { x: number; y: number }>();
    
    // Preserve existing positions if evolving
    if (existingNodes.length > 0) {
      existingNodes.forEach(node => {
        positions.set(node.id, { x: node.position.x, y: node.position.y });
      });
    }

    // Find the center node (type === 'center')
    const centerNode = mindMapData.nodes.find(n => n.type === 'center');
    if (!centerNode) {
      // If no center node, find the most connected one
      const connectionCounts = new Map<string, number>();
      mindMapData.nodes.forEach(node => {
        const connections = mindMapData.connections.filter(c => c.from === node.id || c.to === node.id);
        connectionCounts.set(node.id, connections.length);
      });
      
      const mostConnected = mindMapData.nodes.reduce((prev, current) => {
        const prevCount = connectionCounts.get(prev.id) || 0;
        const currentCount = connectionCounts.get(current.id) || 0;
        return currentCount > prevCount ? current : prev;
      });
      
      if (!positions.has(mostConnected.id)) {
        positions.set(mostConnected.id, { x: 0, y: 0 });
      }
    } else {
      // Position center node
      if (!positions.has(centerNode.id)) {
        positions.set(centerNode.id, { x: 0, y: 0 });
      }
    }
    
    const rootNodeId = centerNode?.id || mindMapData.nodes[0]?.id;
    const rootPos = positions.get(rootNodeId) || { x: 0, y: 0 };
    
    // Position main nodes in a circle around center
    const mainNodes = mindMapData.nodes.filter(n => n.type === 'main');
    mainNodes.forEach((node, index) => {
      if (!positions.has(node.id)) {
        const angle = (2 * Math.PI * index) / mainNodes.length - Math.PI / 2; // Start from top
        const radius = 250;
        const x = rootPos.x + Math.cos(angle) * radius;
        const y = rootPos.y + Math.sin(angle) * radius;
        positions.set(node.id, { x, y });
      }
    });
    
    // Position sub nodes around their main parents
    const subNodes = mindMapData.nodes.filter(n => n.type === 'sub');
    subNodes.forEach((node) => {
      if (!positions.has(node.id)) {
        // Find parent through connections
        const parentConnection = mindMapData.connections.find(c => c.to === node.id);
        const parentId = parentConnection?.from;
        const parentPos = parentId ? positions.get(parentId) : rootPos;
        
        if (parentPos) {
          const siblings = subNodes.filter(n => {
            const siblingParentConnection = mindMapData.connections.find(c => c.to === n.id);
            return siblingParentConnection?.from === parentId;
          });
          const siblingIndex = siblings.indexOf(node);
          
          const subRadius = 150;
          const baseAngle = Math.atan2(parentPos.y - rootPos.y, parentPos.x - rootPos.x);
          const spreadAngle = Math.PI / 3; // 60 degrees spread
          const angleStep = siblings.length > 1 ? spreadAngle / (siblings.length - 1) : 0;
          const angle = baseAngle - spreadAngle/2 + (angleStep * siblingIndex);
          
          const x = parentPos.x + Math.cos(angle) * subRadius;
          const y = parentPos.y + Math.sin(angle) * subRadius;
          positions.set(node.id, { x, y });
        }
      }
    });

    // Position detail nodes around their sub parents
    const detailNodes = mindMapData.nodes.filter(n => n.type === 'detail');
    detailNodes.forEach((node) => {
      if (!positions.has(node.id)) {
        // Find parent through connections
        const parentConnection = mindMapData.connections.find(c => c.to === node.id);
        const parentId = parentConnection?.from;
        const parentPos = parentId ? positions.get(parentId) : rootPos;
        
        if (parentPos) {
          const siblings = detailNodes.filter(n => {
            const siblingParentConnection = mindMapData.connections.find(c => c.to === n.id);
            return siblingParentConnection?.from === parentId;
          });
          const siblingIndex = siblings.indexOf(node);
          
          const detailRadius = 100;
          const baseAngle = Math.atan2(parentPos.y - rootPos.y, parentPos.x - rootPos.x);
          const spreadAngle = Math.PI / 2; // 90 degrees spread
          const angleStep = siblings.length > 1 ? spreadAngle / (siblings.length - 1) : 0;
          const angle = baseAngle - spreadAngle/2 + (angleStep * siblingIndex);
          
          const x = parentPos.x + Math.cos(angle) * detailRadius;
          const y = parentPos.y + Math.sin(angle) * detailRadius;
          positions.set(node.id, { x, y });
        }
      }
    });

    return positions;
  };

  // Intelligent color assignment based on semantic relationships
  const assignIntelligentColor = (
    node: MindMapNode,
    allNodes: MindMapNode[],
    connections: MindMapConnection[]
  ): string => {
    try {
      // Center node gets primary color
      if (node.type === 'center') {
        return BRANCH_COLOR_SYSTEM.primary.color;
      }
      
      // Find the center node
      const centerNode = allNodes.find(n => n.type === 'center');
      if (!centerNode) {
        // If no center node, use index-based coloring
        const nodeIndex = allNodes.indexOf(node);
        const colorIndex = nodeIndex % BRANCH_COLOR_SYSTEM.priority.length;
        return BRANCH_COLOR_SYSTEM.priority[colorIndex].color;
      }
      
      // Find which main branch this node belongs to
      const findMainBranch = (nodeId: string): string | null => {
        // If this is a main node connected to center, return itself
        const directConnection = connections.find(c => c.from === centerNode.id && c.to === nodeId);
        if (directConnection) return nodeId;
        
        // Find parent connection and traverse up
        const parentConnection = connections.find(c => c.to === nodeId);
        if (!parentConnection) return null;
        
        return findMainBranch(parentConnection.from);
      };
      
      const mainBranchId = findMainBranch(node.id);
      if (mainBranchId) {
        // Find all main branches (direct children of center)
        const mainBranches = connections
          .filter(c => c.from === centerNode.id)
          .map(c => c.to);
        
        const branchIndex = mainBranches.indexOf(mainBranchId);
        if (branchIndex !== -1) {
          let baseColor: string;
          if (branchIndex < BRANCH_COLOR_SYSTEM.priority.length) {
            baseColor = BRANCH_COLOR_SYSTEM.priority[branchIndex].color;
          } else {
            const additionalIndex = (branchIndex - BRANCH_COLOR_SYSTEM.priority.length) % BRANCH_COLOR_SYSTEM.additional.length;
            baseColor = BRANCH_COLOR_SYSTEM.additional[additionalIndex].color;
          }
          
          // Apply hierarchy lightening for sub and detail nodes
          if (node.type === 'sub') {
            return adjustColorBrightness(baseColor, 1);
          } else if (node.type === 'detail') {
            return adjustColorBrightness(baseColor, 2);
          }
          
          return baseColor;
        }
      }
      
      return BRANCH_COLOR_SYSTEM.primary.color;
    } catch (error) {
      console.error('Error in color assignment:', error);
      return BRANCH_COLOR_SYSTEM.primary.color;
    }
  };

  // Color brightness adjustment for hierarchy
  const adjustColorBrightness = (hexColor: string, level: number): string => {
    if (!hexColor.startsWith('#') || level === 0) return hexColor;
    
    const lightenPercent = Math.min(level * 15, 45);
    
    try {
      const r = parseInt(hexColor.slice(1, 3), 16);
      const g = parseInt(hexColor.slice(3, 5), 16);
      const b = parseInt(hexColor.slice(5, 7), 16);
      
      const factor = lightenPercent / 100;
      const newR = Math.min(255, Math.round(r + (255 - r) * factor));
      const newG = Math.min(255, Math.round(g + (255 - g) * factor));
      const newB = Math.min(255, Math.round(b + (255 - b) * factor));
      
      return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    } catch {
      return hexColor;
    }
  };

  const startOver = () => {
    setNodes([]);
    setEdges([]);
    setInput('');
    setSelectedNodeId(null);
    setAnalysis('');
    setSuggestions([]);
    setSemanticClusters([]);
    setConversationHistory([]);
    setCurrentStep('input');
    setIsFullscreen(false);
    setShowFullscreenInput(true);
  };

  const exportMindMap = (format: 'json') => {
    if (format === 'json') {
      const data = {
        nodes: nodes.map(node => ({
          id: node.id,
          label: node.data?.label || 'Unknown',
          type: node.data?.type || 'main',
          position: node.position,
          style: node.style
        })),
        edges: edges.map(edge => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          type: edge.type
        })),
        analysis,
        suggestions,
        timestamp: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mindmap-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <>
      <Head>
        <title>Intelligent AI Mind Mapping - MindMapFlux</title>
        <meta name="description" content="Context-aware AI mind mapping that understands structure and evolves intelligently" />
      </Head>

      <div className={`min-h-screen bg-white ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
        {/* Navigation */}
        {!isFullscreen && (
          <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <Link href="/" className="text-xl font-bold text-gray-900">
                    MindMapFlux
                  </Link>
                </div>
                <div className="flex items-center space-x-8">
                  <Link href="/how-it-works" className="text-gray-700 hover:text-gray-900">How It Works</Link>
                  <Link href="/mind-mapping-guide" className="text-gray-700 hover:text-gray-900">Guide</Link>
                  <Link href="/business-mind-mapping" className="text-gray-700 hover:text-gray-900">Business</Link>
                  <Link href="/about" className="text-gray-700 hover:text-gray-900">About</Link>
                </div>
              </div>
            </div>
          </nav>
        )}

        {/* Fullscreen Input Box */}
        {isFullscreen && currentStep === 'complete' && showFullscreenInput && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white p-4 rounded-lg shadow-lg border max-w-md w-full mx-4">
            <div className="mb-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={selectedNodeId ? "Continue evolving this node..." : "Continue evolving your mind map..."}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && generateIntelligentMindMap(true)}
              />
              {selectedNodeId && (
                <p className="text-xs text-blue-600 mt-1">
                  🎯 Focused on: {nodes.find(n => n.id === selectedNodeId)?.data?.label}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => generateIntelligentMindMap(true)}
                disabled={!input.trim()}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
              >
                {evolutionMode === 'expand' ? 'Expand' : evolutionMode === 'restructure' ? 'Restructure' : evolutionMode === 'connect' ? 'Connect' : 'Analyze'}
              </button>
              <button
                onClick={() => setSelectedNodeId(null)}
                className="bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700 text-sm"
                title="Clear selection"
              >
                🎯
              </button>
            </div>
          </div>
        )}

        {/* Exit Fullscreen Button */}
        {isFullscreen && (
          <div className="fixed top-4 right-4 z-50 flex gap-2">
            <button
              onClick={() => setShowFullscreenInput(!showFullscreenInput)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 shadow-lg"
              title={showFullscreenInput ? "Hide input box" : "Show input box"}
            >
              {showFullscreenInput ? '▼' : '▲'}
            </button>
            <button
              onClick={() => {
                setIsFullscreen(false);
                setShowFullscreenInput(true);
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 shadow-lg"
            >
              Exit Fullscreen
            </button>
          </div>
        )}

        <div className={`${isFullscreen ? 'h-screen' : 'max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8'}`}>
          <div className={isFullscreen ? 'h-full flex flex-col' : ''}>

            {/* Input Interface */}
            {currentStep === 'input' && !isFullscreen && (
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Intelligent AI Mind Mapping
                  </h1>
                  <p className="text-lg text-gray-600">
                    Context-aware AI that understands your thoughts and evolves intelligently
                  </p>
                </div>

                <div className="mb-6">
                  <label htmlFor="thought-input" className="block text-lg font-medium text-gray-700 mb-3">
                    Describe your concept or challenge:
                  </label>
                  <textarea
                    id="thought-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Example: Create a local food specialty business in Huangshan that leverages tourism and authentic cuisine..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div className="text-center">
                  <button
                    onClick={() => generateIntelligentMindMap(false)}
                    disabled={!input.trim()}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Generate Intelligent Mind Map
                  </button>
                </div>
              </div>
            )}

            {/* Generating State */}
            {currentStep === 'generating' && (
              <div className="max-w-2xl mx-auto text-center py-16">
                <div className="mb-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  🧠 AI is thinking intelligently...
                </h2>
                <p className="text-gray-600">
                  Understanding context and building logical structure
                </p>
              </div>
            )}

            {/* Complete Mind Map */}
            {currentStep === 'complete' && (
              <div className={isFullscreen ? 'flex-1 flex flex-col' : ''}>
                {/* Controls - Better Layout */}
                {!isFullscreen && (
                  <div className="mb-6">
                    {/* Input Section */}
                    <div className="mb-4">
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={selectedNodeId ? "Continue evolving the selected node..." : "Continue evolving your mind map..."}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        onKeyPress={(e) => e.key === 'Enter' && e.shiftKey === false && (e.preventDefault(), generateIntelligentMindMap(true))}
                      />
                      {selectedNodeId && (
                        <p className="text-sm text-blue-600 mt-2">
                          🎯 Selected node: <strong>{nodes.find(n => n.id === selectedNodeId)?.data?.label}</strong>
                          <button
                            onClick={() => setSelectedNodeId(null)}
                            className="ml-2 text-red-600 hover:text-red-800"
                          >
                            Clear
                          </button>
                        </p>
                      )}
                    </div>
                    
                    {/* Button Section */}
                    <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => generateIntelligentMindMap(true)}
                          disabled={!input.trim()}
                          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                          Continue
                        </button>
                        <button
                          onClick={startOver}
                          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                        >
                          Start Over
                        </button>
                      </div>
                      
                      <div className="flex gap-3">
                        <button
                          onClick={() => setIsFullscreen(true)}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                        >
                          Fullscreen
                        </button>
                        <button
                          onClick={() => exportMindMap('json')}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                        >
                          Export JSON
                        </button>
                      </div>
                    </div>

                    {/* AI Suggestions */}
                    {suggestions.length > 0 && (
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h3 className="text-lg font-medium text-blue-900 mb-3">💡 AI Expansion Suggestions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => setInput(suggestion)}
                              className="text-left p-3 bg-white rounded border hover:bg-blue-50 hover:border-blue-300 transition-colors"
                            >
                              <span className="text-sm text-gray-700">{suggestion}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Mind Map Visualization */}
                <div className={`bg-gray-50 rounded-lg overflow-hidden ${
                  isFullscreen ? 'flex-1' : 'h-96 lg:h-[600px]'
                }`}>
                  {isClient ? (
                    <ReactFlow
                      nodes={nodes}
                      edges={edges}
                      onNodesChange={onNodesChange}
                      onEdgesChange={onEdgesChange}
                      onNodeClick={handleNodeClick}
                      fitView
                      fitViewOptions={{ padding: 0.2 }}
                      nodesDraggable={true}
                      nodesConnectable={false}
                      elementsSelectable={true}
                    >
                      <Controls />
                      <MiniMap />
                      <Background variant={"dots" as any} gap={12} size={1} />
                    </ReactFlow>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading mind map...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
