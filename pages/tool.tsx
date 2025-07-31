// pages/tool.tsx - Complete Intelligent Mind Mapping Tool (All Features Restored)
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

// Import types safely
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

// Smart Color System
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
    { color: "#8B7355", name: "暗金" },
    { color: "#8FBC8F", name: "橄榄" },
    { color: "#8B4513", name: "鞍褐" },
    { color: "#2E8B57", name: "海绿" },
    { color: "#4682B4", name: "钢蓝" }
  ]
};

// Rotating waiting messages
const WAITING_MESSAGES = [
  "🧠 AI is analyzing your concept...",
  "🔍 Identifying key themes and patterns...",
  "🌟 Discovering hidden connections...",
  "📊 Structuring logical relationships...",
  "💡 Generating creative insights...",
  "🎯 Organizing ideas into clusters...",
  "🔗 Building semantic networks...",
  "📈 Calculating optimal positioning...",
  "🎨 Assigning intelligent colors...",
  "⚡ Processing contextual meaning...",
  "🔄 Evolving thought structures...",
  "🌱 Growing your idea tree...",
  "🧩 Connecting puzzle pieces...",
  "📝 Crafting strategic frameworks...",
  "🚀 Launching innovative concepts...",
  "🔮 Predicting expansion opportunities...",
  "💎 Refining core concepts...",
  "🌊 Creating knowledge flows...",
  "🎪 Orchestrating idea symphony...",
  "🏗️ Building conceptual architecture...",
  "🔬 Analyzing business potential...",
  "🎭 Mapping creative possibilities...",
  "🌈 Weaving colorful connections...",
  "🔧 Fine-tuning relationships...",
  "📐 Calculating perfect angles...",
  "🌍 Exploring global perspectives...",
  "🔥 Igniting breakthrough ideas...",
  "💫 Creating stellar arrangements...",
  "🌺 Blooming conceptual flowers...",
  "⚖️ Balancing strategic elements..."
];

// File Upload Component
const FileUploadSection = ({ onFileUpload }: { onFileUpload: (file: File) => void }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.png,.jpg,.jpeg"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      <button
        onClick={handleUploadClick}
        className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2"
        title="Upload previous mind map (JSON) or image (PNG/JPG)"
      >
        📁 Upload
      </button>
    </>
  );
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
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [currentWaitingMessage, setCurrentWaitingMessage] = useState(0);

  // Session isolation - clear everything on mount
  useEffect(() => {
    setNodes([]);
    setEdges([]);
    setConversationHistory([]);
    setAnalysis('');
    setSuggestions([]);
    setSemanticClusters([]);
    setSelectedNodeId(null);
    setIsClient(true);
  }, []);

  // Rotating waiting messages
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setCurrentWaitingMessage(prev => (prev + 1) % WAITING_MESSAGES.length);
      }, 2000); // Change message every 2 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGenerating]);

  // Manual node state management with smart edge connection updates
  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => {
      const updatedNodes = [...nds];
      changes.forEach((change) => {
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

    // Update edge connection points when nodes move
    changes.forEach(change => {
      if (change.type === 'position' && 'id' in change && 'position' in change && change.position) {
        setEdges(prevEdges => 
          prevEdges.map(edge => {
            if (edge.source === change.id || edge.target === change.id) {
              const sourceNode = nodes.find(n => n.id === edge.source);
              const targetNode = nodes.find(n => n.id === edge.target);
              
              if (sourceNode && targetNode) {
                const connectionPoints = calculateConnectionPoints(
                  change.id === edge.source ? change.position : sourceNode.position,
                  change.id === edge.target ? change.position : targetNode.position
                );
                
                return {
                  ...edge,
                  sourceHandle: connectionPoints.sourceHandle,
                  targetHandle: connectionPoints.targetHandle
                };
              }
            }
            return edge;
          })
        );
      }
    });
  }, [nodes]);

  // Manual edge state management
  const onEdgesChange = useCallback((changes: any[]) => {
    setEdges((eds) => {
      const updatedEdges = [...eds];
      changes.forEach((change) => {
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

  // Calculate optimal connection points between nodes
  const calculateConnectionPoints = (sourcePos: { x: number; y: number }, targetPos: { x: number; y: number }) => {
    const dx = targetPos.x - sourcePos.x;
    const dy = targetPos.y - sourcePos.y;
    
    // Determine best connection sides based on relative positions
    let sourceHandle = 'right';
    let targetHandle = 'left';
    
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal connection preferred
      sourceHandle = dx > 0 ? 'right' : 'left';
      targetHandle = dx > 0 ? 'left' : 'right';
    } else {
      // Vertical connection preferred
      sourceHandle = dy > 0 ? 'bottom' : 'top';
      targetHandle = dy > 0 ? 'top' : 'bottom';
    }
    
    return { sourceHandle, targetHandle };
  };

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
    
    return 'expand';
  };

  // File upload handler
  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    
    if (file.type === 'application/json') {
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        
        if (data.nodes && data.edges) {
          // Restore previous mind map
          setNodes(data.nodes);
          setEdges(data.edges);
          setAnalysis(data.analysis || '');
          setSuggestions(data.suggestions || []);
          setCurrentStep('complete');
          setInput('Continue evolving this mind map...');
        }
      } catch (error) {
        console.error('Error parsing JSON file:', error);
        alert('Invalid JSON file format');
      }
    } else if (file.type.startsWith('image/')) {
      // For images, set input to indicate continuing evolution
      setInput(`Continue evolving based on the uploaded image: ${file.name}`);
    }
  };

  // Enhanced positioning algorithm with collision detection
  const calculateOptimalPositions = (mindMapData: MindMapStructure, existingNodes: Node[] = []): Map<string, { x: number; y: number }> => {
    const positions = new Map<string, { x: number; y: number }>();
    
    // Preserve existing positions if evolving
    if (existingNodes.length > 0) {
      existingNodes.forEach(node => {
        positions.set(node.id, { x: node.position.x, y: node.position.y });
      });
    }

    // Find center node
    const centerNode = mindMapData.nodes.find(n => n.type === 'center') || mindMapData.nodes[0];
    if (!positions.has(centerNode.id)) {
      positions.set(centerNode.id, { x: 0, y: 0 });
    }
    
    const centerPos = positions.get(centerNode.id)!;
    
    // Build hierarchical structure
    const buildBranchLayout = (parentId: string, parentPos: { x: number; y: number }, level: number) => {
      const children = mindMapData.connections
        .filter(c => c.from === parentId)
        .map(c => mindMapData.nodes.find(n => n.id === c.to))
        .filter(Boolean) as MindMapNode[];
      
      if (children.length === 0) return;
      
      // Dynamic radius based on hierarchy level and number of children
      const baseRadius = level === 1 ? 280 : (level === 2 ? 200 : 150);
      const radius = Math.max(baseRadius, children.length * 40);
      
      children.forEach((child, index) => {
        if (!positions.has(child.id)) {
          const angle = (2 * Math.PI * index) / children.length - Math.PI / 2;
          let proposedPos = {
            x: parentPos.x + Math.cos(angle) * radius,
            y: parentPos.y + Math.sin(angle) * radius
          };
          
          // Find empty space using spiral search
          proposedPos = findOptimalEmptyPosition(proposedPos, positions, 120);
          positions.set(child.id, proposedPos);
          
          // Recursively position grandchildren
          buildBranchLayout(child.id, proposedPos, level + 1);
        }
      });
    };
    
    buildBranchLayout(centerNode.id, centerPos, 1);
    return positions;
  };

  // Advanced spiral search for empty positions
  const findOptimalEmptyPosition = (
    preferredPos: { x: number; y: number }, 
    existingPositions: Map<string, { x: number; y: number }>, 
    minDistance: number
  ): { x: number; y: number } => {
    const isPositionFree = (pos: { x: number; y: number }) => {
      const existingPositionsArray = Array.from(existingPositions.values());
      for (const existingPos of existingPositionsArray) {
        const distance = Math.sqrt(
          Math.pow(pos.x - existingPos.x, 2) + Math.pow(pos.y - existingPos.y, 2)
        );
        if (distance < minDistance) return false;
      }
      return true;
    };

    if (isPositionFree(preferredPos)) {
      return preferredPos;
    }

    // Spiral search for empty space
    for (let radius = minDistance; radius <= 500; radius += 20) {
      for (let angle = 0; angle < 2 * Math.PI; angle += Math.PI / 8) {
        const candidate = {
          x: preferredPos.x + Math.cos(angle) * radius,
          y: preferredPos.y + Math.sin(angle) * radius
        };
        
        if (isPositionFree(candidate)) {
          return candidate;
        }
      }
    }
    
    return preferredPos; // Fallback
  };

  // Intelligent mind map generation
  const generateIntelligentMindMap = async (evolve = false) => {
    if (!input.trim() && !uploadedFile) return;

    setIsGenerating(true);
    setCurrentStep('generating');
    setCurrentWaitingMessage(0);
    
    try {
      const intent = detectEvolutionIntent(input);
      setEvolutionMode(intent);

      console.log('🧠 Sending request to API:', {
        input: input.trim(),
        isEvolution: evolve,
        selectedNode: selectedNodeId,
        intent,
        hasFile: !!uploadedFile
      });

      let response: Response;
      
      if (uploadedFile) {
        // Handle file upload with FormData
        const formData = new FormData();
        formData.append('input', input.trim());
        formData.append('isEvolution', evolve.toString());
        formData.append('file', uploadedFile);
        formData.append('conversationHistory', JSON.stringify(conversationHistory));
        formData.append('colorScheme', 'calmGreen');
        if (evolve) {
          formData.append('existingNodes', JSON.stringify(nodes));
        }
        
        response = await fetch('/api/mind-map/generate', {
          method: 'POST',
          body: formData
        });
      } else {
        // Regular JSON request
        response = await fetch('/api/mind-map/generate', {
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
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('🎯 API Response:', result);
      
      let mindMapData: MindMapStructure;
      if (result.success && result.mindMap) {
        mindMapData = result.mindMap;
      } else {
        throw new Error(result.error || 'Failed to generate mind map');
      }
      
      // Create nodes with intelligent positioning and coloring
      const positions = calculateOptimalPositions(mindMapData, evolve ? nodes : []);
      const flowNodes: Node[] = mindMapData.nodes.map((node, index) => {
        const position = positions.get(node.id) || { x: 0, y: 0 };
        const backgroundColor = assignBranchColor(node, mindMapData.nodes, mindMapData.connections, index);
        
        // Determine node importance and styling
        const connections = mindMapData.connections?.filter(c => c.from === node.id || c.to === node.id) || [];
        const importance = connections.length + (node.semantic_weight || 1);
        
        // Hierarchical styling
        let fontSize = '14px';
        let fontWeight = 'normal';
        let minWidth = '100px';
        let padding = '12px 16px';
        
        if (node.type === 'center' || importance >= 5) {
          fontSize = '16px';
          fontWeight = 'bold';
          minWidth = '140px';
          padding = '14px 20px';
        } else if (node.type === 'main' || importance >= 3) {
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
            label: node.label || 'Unknown',
            type: node.type || 'main',
            level: node.level || 0,
            parentId: node.parentId,
            semantic_weight: node.semantic_weight || 1,
            concept_category: node.concept_category || 'general'
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
            textAlign: 'center' as const,
            wordWrap: 'break-word' as const,
            boxShadow: selectedNodeId === node.id 
              ? '0 4px 12px rgba(255,215,0,0.4)' 
              : '0 2px 8px rgba(0,0,0,0.15)',
            cursor: 'pointer'
          },
          draggable: true
        };
      });

      // Create intelligent edges with colored connections
      const flowEdges: Edge[] = (mindMapData.connections || []).map((connection, index) => {
        const sourceNode = flowNodes.find(n => n.id === connection.from);
        const targetNode = flowNodes.find(n => n.id === connection.to);
        
        let strokeColor = '#6B7280';
        if (sourceNode?.style?.background && typeof sourceNode.style.background === 'string') {
          strokeColor = sourceNode.style.background;
        }
        
        const strokeWidth = connection.strength ? Math.max(1, connection.strength * 2) : 2;
        const animated = connection.relationship_type === 'association';
        
        // Calculate connection points
        const connectionPoints = sourceNode && targetNode 
          ? calculateConnectionPoints(sourceNode.position, targetNode.position)
          : { sourceHandle: undefined, targetHandle: undefined };
        
        return {
          id: `${connection.from}-${connection.to}`,
          source: connection.from,
          target: connection.to,
          type: 'smoothstep',
          animated,
          sourceHandle: connectionPoints.sourceHandle,
          targetHandle: connectionPoints.targetHandle,
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
            relationship_type: connection.relationship_type || 'hierarchy',
            strength: connection.strength || 1
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
      setUploadedFile(null); // Clear uploaded file after processing
      
    } catch (error) {
      console.error('Error generating mind map:', error);
      let errorMessage = 'Failed to generate mind map. ';
      if (error instanceof Error) {
        if (error.message.includes('400')) {
          errorMessage += 'Please check your input and try again.';
        } else if (error.message.includes('500')) {
          errorMessage += 'Server error. Please try again in a moment.';
        } else {
          errorMessage += error.message;
        }
      }
      alert(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  // Enhanced color assignment with error handling
  const assignBranchColor = (
    node: MindMapNode,
    allNodes: MindMapNode[],
    connections: MindMapConnection[],
    index: number
  ): string => {
    try {
      if (!node || !allNodes || allNodes.length === 0) {
        return BRANCH_COLOR_SYSTEM.primary.color;
      }
      
      // Center node gets primary color
      if (node.type === 'center') {
        return BRANCH_COLOR_SYSTEM.primary.color;
      }
      
      // Find center node
      const centerNode = allNodes.find(n => n.type === 'center');
      if (!centerNode) {
        // Fallback: use index-based coloring
        const colorIndex = index % BRANCH_COLOR_SYSTEM.priority.length;
        return BRANCH_COLOR_SYSTEM.priority[colorIndex].color;
      }
      
      // Find which main branch this node belongs to
      const findMainBranch = (nodeId: string): string | null => {
        if (!connections || connections.length === 0) return null;
        
        // If this is a main node connected to center, return itself
        const directConnection = connections.find(c => c.from === centerNode.id && c.to === nodeId);
        if (directConnection) return nodeId;
        
        // Find parent connection and traverse up
        const parentConnection = connections.find(c => c.to === nodeId);
        if (!parentConnection) return null;
        
        return findMainBranch(parentConnection.from);
      };
      
      const mainBranchId = findMainBranch(node.id);
      if (mainBranchId && connections) {
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
          
          // Apply hierarchy lightening
          if (node.type === 'sub') {
            return adjustColorBrightness(baseColor, 1);
          } else if (node.type === 'detail') {
            return adjustColorBrightness(baseColor, 2);
          }
          
          return baseColor;
        }
      }
      
      // Fallback to primary color
      return BRANCH_COLOR_SYSTEM.primary.color;
    } catch (error) {
      console.error('Error in color assignment:', error);
      return BRANCH_COLOR_SYSTEM.primary.color;
    }
  };

  // Color brightness adjustment with error handling
  const adjustColorBrightness = (hexColor: string, level: number): string => {
    if (!hexColor || !hexColor.startsWith('#') || level === 0) return hexColor;
    
    const lightenPercent = Math.min(level * 15, 45);
    
    try {
      const r = parseInt(hexColor.slice(1, 3), 16);
      const g = parseInt(hexColor.slice(3, 5), 16);
      const b = parseInt(hexColor.slice(5, 7), 16);
      
      if (isNaN(r) || isNaN(g) || isNaN(b)) return hexColor;
      
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
    setUploadedFile(null);
  };

  const exportMindMap = (format: 'json' | 'png') => {
    if (format === 'json') {
      const data = {
        nodes: nodes.map(node => ({
          id: node.id,
          label: node.data?.label || 'Unknown',
          type: node.data?.type || 'main',
          position: node.position,
          style: node.style,
          level: node.data?.level || 0,
          parentId: node.data?.parentId,
          semantic_weight: node.data?.semantic_weight || 1,
          concept_category: node.data?.concept_category || 'general'
        })),
        edges: edges.map(edge => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          type: edge.type,
          style: edge.style,
          data: edge.data
        })),
        analysis,
        suggestions,
        semanticClusters,
        conversationHistory,
        timestamp: new Date().toISOString(),
        metadata: {
          totalNodes: nodes.length,
          totalEdges: edges.length,
          selectedNode: selectedNodeId
        }
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
            {/* Compressed AI Suggestions in Fullscreen */}
            {suggestions.length > 0 && (
              <div className="mt-3 p-2 bg-blue-50 rounded-md">
                <p className="text-xs font-medium text-blue-900 mb-1">💡 Quick suggestions:</p>
                <div className="flex flex-wrap gap-1">
                  {suggestions.slice(0, 3).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(suggestion)}
                      className="text-xs bg-white px-2 py-1 rounded border hover:bg-blue-50 transition-colors"
                    >
                      {suggestion.substring(0, 20)}...
                    </button>
                  ))}
                </div>
              </div>
            )}
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
                    disabled={!input.trim() && !uploadedFile}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Generate Intelligent Mind Map
                  </button>
                </div>
              </div>
            )}

            {/* Generating State with Rotating Messages */}
            {currentStep === 'generating' && (
              <div className="max-w-2xl mx-auto text-center py-16">
                <div className="mb-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {WAITING_MESSAGES[currentWaitingMessage]}
                </h2>
                <p className="text-gray-600">
                  Building your intelligent mind map structure...
                </p>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                </div>
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
                        <FileUploadSection onFileUpload={handleFileUpload} />
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
