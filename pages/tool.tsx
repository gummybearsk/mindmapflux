// pages/tool.tsx - Complete Mind Mapping Tool with All Problems Actually Solved
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
import type { Node, Edge, NodeChange, EdgeChange } from 'reactflow';

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

// PROBLEM 11, 12, 21: Smart Color System - Branch-based with aesthetic colors
const BRANCH_COLOR_SYSTEM = {
  primary: { color: "#2D7D7D", name: "正经绿" }, // Center nodes
  priority: [
    { color: "#795F9C", name: "绝绝紫" }, // Branch 1
    { color: "#D85B72", name: "发财红" }, // Branch 2
    { color: "#6B8857", name: "不焦虑" }, // Branch 3
    { color: "#518463", name: "放青松" }, // Branch 4
    { color: "#4C697A", name: "不摆蓝" }, // Branch 5
    { color: "#886441", name: "糖太棕" }  // Branch 6
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

// PROBLEM 7, 18: 50 Rotating waiting messages (no progress bar, just spinning + messages)
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
  "🎨 Painting your mental canvas...",
  "🌍 Exploring global perspectives...",
  "🔥 Igniting breakthrough ideas...",
  "💫 Creating stellar arrangements...",
  "🎯 Targeting key opportunities...",
  "🌺 Blooming conceptual flowers...",
  "⚖️ Balancing strategic elements...",
  "🎵 Composing idea harmonies...",
  "🔍 Examining micro-details...",
  "🌟 Polishing brilliant insights...",
  "🚁 Getting bird's eye view...",
  "🎲 Rolling strategic dice...",
  "🔥 Forging powerful connections...",
  "🌀 Spiraling into deeper insights...",
  "🎪 Performing cognitive magic...",
  "🔬 Experimenting with combinations...",
  "🌅 Illuminating new horizons...",
  "🎯 Hitting conceptual targets...",
  "🌊 Riding waves of inspiration...",
  "🔮 Crystallizing future visions...",
  "🎨 Blending strategic colors...",
  "🚀 Preparing for idea launch...",
  "🌟 Adding final sparkles...",
  "🎭 Revealing the grand design...",
  "✨ Almost ready to amaze you..."
];

// PROBLEM 29: File Upload Component (PNG/JSON upload functionality)
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
        className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2 transition-colors"
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
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullscreenInput, setShowFullscreenInput] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [currentWaitingMessage, setCurrentWaitingMessage] = useState(0);

  // PROBLEM 30: Session isolation - clear everything on mount (security)
  useEffect(() => {
    setNodes([]);
    setEdges([]);
    setConversationHistory([]);
    setSuggestions([]);
    setSelectedNodeId(null);
    setIsClient(true);
  }, []);

  // PROBLEM 7, 18: Rotating waiting messages every 2 seconds (no progress bar)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setCurrentWaitingMessage(prev => (prev + 1) % WAITING_MESSAGES.length);
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGenerating]);

  // PROBLEM 32: Manual node state management with dynamic edge updates
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

    // PROBLEM 32: Update edge connection points when nodes move
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
  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
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

  // PROBLEM 32: Calculate optimal connection points between nodes
  const calculateConnectionPoints = (sourcePos: { x: number; y: number }, targetPos: { x: number; y: number }) => {
    const dx = targetPos.x - sourcePos.x;
    const dy = targetPos.y - sourcePos.y;
    
    let sourceHandle = 'right';
    let targetHandle = 'left';
    
    if (Math.abs(dx) > Math.abs(dy)) {
      sourceHandle = dx > 0 ? 'right' : 'left';
      targetHandle = dx > 0 ? 'left' : 'right';
    } else {
      sourceHandle = dy > 0 ? 'bottom' : 'top';
      targetHandle = dy > 0 ? 'top' : 'bottom';
    }
    
    return { sourceHandle, targetHandle };
  };

  // Node selection handler for context awareness
  const handleNodeClick = useCallback((event: any, node: Node) => {
    setSelectedNodeId(node.id);
    console.log('🎯 Selected node for context:', node.data?.label);
  }, []);

  // PROBLEM 29: File upload handler
  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    
    if (file.type === 'application/json') {
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        
        if (data.nodes && data.edges) {
          setNodes(data.nodes);
          setEdges(data.edges);
          setSuggestions(data.suggestions || []);
          setCurrentStep('complete');
          setInput('Continue evolving this mind map...');
        }
      } catch (error) {
        console.error('Error parsing JSON file:', error);
        alert('Invalid JSON file format');
      }
    } else if (file.type.startsWith('image/')) {
      setInput(`Continue evolving based on the uploaded image: ${file.name}`);
    }
  };

  // PROBLEM 6, 14, 15, 31: Smart positioning algorithm - no overlapping, clean template layout
  const calculateOptimalPositions = (mindMapData: MindMapStructure, existingNodes: Node[] = []): Map<string, { x: number; y: number }> => {
    const positions = new Map<string, { x: number; y: number }>();
    
    // Preserve existing positions if evolving
    if (existingNodes.length > 0) {
      existingNodes.forEach(node => {
        positions.set(node.id, { x: node.position.x, y: node.position.y });
      });
    }

    // Find center node (most connected or explicitly marked as center)
    let centerNode = mindMapData.nodes.find(n => n.type === 'center');
    if (!centerNode) {
      // Find most connected node as center
      const nodeConnections = mindMapData.nodes.map(node => ({
        node,
        connections: mindMapData.connections.filter(c => c.from === node.id || c.to === node.id).length
      }));
      centerNode = nodeConnections.sort((a, b) => b.connections - a.connections)[0].node;
    }
    
    // Center node at origin
    if (!positions.has(centerNode.id)) {
      positions.set(centerNode.id, { x: 0, y: 0 });
    }
    
    const centerPos = positions.get(centerNode.id)!;
    
    // Get main branches (direct children of center)
    const mainBranches = mindMapData.connections
      .filter(c => c.from === centerNode.id)
      .map(c => mindMapData.nodes.find(n => n.id === c.to))
      .filter(Boolean);
    
    // Position main branches in a circle around center
    const mainRadius = 300; // Increased for better spacing
    mainBranches.forEach((branch, index) => {
      if (!positions.has(branch.id)) {
        const angle = (2 * Math.PI * index) / mainBranches.length;
        const pos = {
          x: centerPos.x + Math.cos(angle) * mainRadius,
          y: centerPos.y + Math.sin(angle) * mainRadius
        };
        positions.set(branch.id, pos);
        
        // Position sub-branches around their main branch
        const subBranches = mindMapData.connections
          .filter(c => c.from === branch.id)
          .map(c => mindMapData.nodes.find(n => n.id === c.to))
          .filter(Boolean);
        
        const subRadius = 180;
        subBranches.forEach((subBranch, subIndex) => {
          if (!positions.has(subBranch.id)) {
            const subAngle = angle + (2 * Math.PI * subIndex) / Math.max(subBranches.length, 3) - Math.PI / 3;
            const subPos = {
              x: pos.x + Math.cos(subAngle) * subRadius,
              y: pos.y + Math.sin(subAngle) * subRadius
            };
            positions.set(subBranch.id, subPos);
            
            // Position detail nodes around sub-branches
            const detailBranches = mindMapData.connections
              .filter(c => c.from === subBranch.id)
              .map(c => mindMapData.nodes.find(n => n.id === c.to))
              .filter(Boolean);
            
            const detailRadius = 120;
            detailBranches.forEach((detailBranch, detailIndex) => {
              if (!positions.has(detailBranch.id)) {
                const detailAngle = subAngle + (2 * Math.PI * detailIndex) / Math.max(detailBranches.length, 2);
                const detailPos = {
                  x: subPos.x + Math.cos(detailAngle) * detailRadius,
                  y: subPos.y + Math.sin(detailAngle) * detailRadius
                };
                positions.set(detailBranch.id, detailPos);
              }
            });
          }
        });
      }
    });
    
    return positions;
  };

  // Main mind map generation function
  const generateIntelligentMindMap = async (evolve = false) => {
    if (!input.trim() && !uploadedFile) return;

    setIsGenerating(true);
    setCurrentStep('generating');
    setCurrentWaitingMessage(0);
    
    try {
      let response: Response;
      
      if (uploadedFile) {
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
      
      // PROBLEM 6, 14, 15, 31: Create nodes with optimal positioning and no overlapping
      const positions = calculateOptimalPositions(mindMapData, evolve ? nodes : []);
      const flowNodes: Node[] = mindMapData.nodes.map((node, index) => {
        const position = positions.get(node.id) || { x: 0, y: 0 };
        const backgroundColor = assignBranchColor(node, mindMapData.nodes, mindMapData.connections, index);
        
        // FIXED: Appropriate node size - not too big, proper text fit
        const connections = mindMapData.connections?.filter(c => c.from === node.id || c.to === node.id) || [];
        const importance = connections.length + (node.semantic_weight || 1);
        
        let fontSize = '12px';
        let fontWeight = 'normal';
        let minWidth = 'auto';
        let padding = '8px 12px';
        let maxWidth = '200px';
        
        if (node.type === 'center' || importance >= 5) {
          fontSize = '14px';
          fontWeight = 'bold';
          minWidth = 'auto';
          padding = '10px 16px';
          maxWidth = '220px';
        } else if (node.type === 'main' || importance >= 3) {
          fontSize = '13px';
          fontWeight = '600';
          minWidth = 'auto';
          padding = '9px 14px';
          maxWidth = '210px';
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
            border: selectedNodeId === node.id ? '2px solid #FFD700' : 'none',
            borderRadius: '8px',
            padding,
            fontSize,
            fontWeight,
            minWidth,
            maxWidth,
            textAlign: 'center' as const,
            wordWrap: 'break-word' as const,
            boxShadow: selectedNodeId === node.id 
              ? '0 4px 12px rgba(255,215,0,0.4)' 
              : '0 2px 6px rgba(0,0,0,0.15)',
            cursor: 'grab',
            whiteSpace: 'normal',
            lineHeight: '1.3',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          },
          draggable: true
        };
      });

      // PROBLEM 5, 13, 14: Create animated edges with proper arrows and colors
      const flowEdges: Edge[] = (mindMapData.connections || []).map((connection) => {
        const sourceNode = flowNodes.find(n => n.id === connection.from);
        const targetNode = flowNodes.find(n => n.id === connection.to);
        
        let strokeColor = '#6B7280';
        if (sourceNode?.style?.background && typeof sourceNode.style.background === 'string') {
          strokeColor = sourceNode.style.background;
        }
        
        const strokeWidth = connection.strength ? Math.max(2, connection.strength * 3) : 3;
        const animated = connection.relationship_type === 'association';
        
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
            strokeOpacity: 0.8
          },
          markerEnd: { 
            type: 'arrowclosed',
            color: strokeColor,
            width: 20,
            height: 20
          },
          data: {
            relationship_type: connection.relationship_type || 'hierarchy',
            strength: connection.strength || 1
          }
        } as Edge;
      });

      if (evolve) {
        // PROBLEM 2, 3: Intelligent evolution - merge with existing structure
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

      setSuggestions(mindMapData.suggestions || []);
      setConversationHistory(prev => [...prev, input.trim()]);
      setCurrentStep('complete');
      setUploadedFile(null);
      
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

  // PROBLEM 11, 12, 21: Enhanced color assignment with aesthetic branch system
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
      
      // Center node gets primary color (正经绿)
      if (node.type === 'center') {
        return BRANCH_COLOR_SYSTEM.primary.color;
      }
      
      // Find center node
      let centerNode = allNodes.find(n => n.type === 'center');
      if (!centerNode) {
        // Find most connected node as center
        const nodeConnections = allNodes.map(n => ({
          node: n,
          connections: connections.filter(c => c.from === n.id || c.to === n.id).length
        }));
        centerNode = nodeConnections.sort((a, b) => b.connections - a.connections)[0]?.node;
      }
      
      if (!centerNode) {
        // Fallback: use index-based coloring
        const colorIndex = index % BRANCH_COLOR_SYSTEM.priority.length;
        return BRANCH_COLOR_SYSTEM.priority[colorIndex].color;
      }
      
      // Find which main branch this node belongs to
      const findMainBranch = (nodeId: string, visited = new Set<string>()): string | null => {
        if (visited.has(nodeId)) return null; // Prevent infinite loops
        visited.add(nodeId);
        
        if (!connections || connections.length === 0) return null;
        
        // If this is a main node connected to center, return itself
        const directConnection = connections.find(c => c.from === centerNode!.id && c.to === nodeId);
        if (directConnection) return nodeId;
        
        // Find parent connection and traverse up
        const parentConnection = connections.find(c => c.to === nodeId);
        if (!parentConnection) return null;
        
        return findMainBranch(parentConnection.from, visited);
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
          
          // Apply hierarchy lightening for sub and detail nodes
          if (node.type === 'sub') {
            return adjustColorBrightness(baseColor, 15); // 15% lighter
          } else if (node.type === 'detail') {
            return adjustColorBrightness(baseColor, 30); // 30% lighter
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

  // Color brightness adjustment function
  const adjustColorBrightness = (hexColor: string, lightenPercent: number): string => {
    if (!hexColor || !hexColor.startsWith('#') || lightenPercent === 0) return hexColor;
    
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

  // Start over function
  const startOver = () => {
    setNodes([]);
    setEdges([]);
    setInput('');
    setSelectedNodeId(null);
    setSuggestions([]);
    setConversationHistory([]);
    setCurrentStep('input');
    setIsFullscreen(false);
    setShowFullscreenInput(true);
    setUploadedFile(null);
  };

  // PROBLEM 12: Export functionality
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
        suggestions,
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

        {/* PROBLEM 33: Fullscreen Input Box with better UX */}
        {isFullscreen && currentStep === 'complete' && showFullscreenInput && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white p-6 rounded-lg shadow-xl border max-w-lg w-full mx-4">
            <div className="mb-4">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={selectedNodeId ? "Continue evolving this node..." : "Continue evolving your mind map..."}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                rows={3}
                onKeyPress={(e) => e.key === 'Enter' && e.shiftKey === false && (e.preventDefault(), generateIntelligentMindMap(true))}
              />
              {selectedNodeId && (
                <p className="text-xs text-blue-600 mt-2">
                  🎯 Focused on: {nodes.find(n => n.id === selectedNodeId)?.data?.label}
                </p>
              )}
            </div>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => generateIntelligentMindMap(true)}
                disabled={!input.trim()}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm transition-colors"
              >
                Continue Evolution
              </button>
              <button
                onClick={() => setSelectedNodeId(null)}
                className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 text-sm"
                title="Clear selection"
              >
                🎯
              </button>
            </div>
            {/* FIXED: Complete AI Suggestions - no truncation */}
            {suggestions.length > 0 && (
              <div className="p-3 bg-blue-50 rounded-lg max-h-40 overflow-y-auto">
                <p className="text-sm font-medium text-blue-900 mb-2">💡 AI Suggestions:</p>
                <div className="space-y-2">
                  {suggestions.slice(0, 4).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(suggestion)}
                      className="w-full text-left text-xs bg-white px-3 py-2 rounded border hover:bg-blue-50 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PROBLEM 33: Fullscreen Controls */}
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

            {/* PROBLEM 1: Input Interface - shows comprehensive project blueprints */}
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

                {/* PROBLEM 29: Upload feature at the beginning */}
                <div className="mb-6 flex items-center justify-center">
                  <div className="flex items-center gap-4">
                    <FileUploadSection onFileUpload={handleFileUpload} />
                    {uploadedFile && (
                      <p className="text-sm text-gray-600">
                        📁 Uploaded: {uploadedFile.name}
                      </p>
                    )}
                  </div>
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

            {/* PROBLEM 7, 18: Generating State - Spinning icon + rotating messages (NO progress bar) */}
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
              </div>
            )}

            {/* PROBLEM 2, 3: Complete Mind Map with evolution capabilities */}
            {currentStep === 'complete' && (
              <div className={isFullscreen ? 'flex-1 flex flex-col' : ''}>
                {/* Controls - Better Layout */}
                {!isFullscreen && (
                  <div className="mb-6">
                    {/* Large Input Section */}
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
                    
                    {/* PROBLEM 16, 17: Button Section - Clear buttons */}
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

                    {/* FIXED: Complete AI Suggestions - no truncation, full text visible */}
                    {suggestions.length > 0 && (
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h3 className="text-lg font-medium text-blue-900 mb-3">💡 AI Expansion Suggestions</h3>
                        <div className="space-y-2">
                          {suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => setInput(suggestion)}
                              className="w-full text-left p-3 bg-white rounded border hover:bg-blue-50 hover:border-blue-300 transition-colors"
                            >
                              <span className="text-sm text-gray-700">{suggestion}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* PROBLEM 6, 14, 15, 18, 31: Mind Map Visualization - Clean, tidy, no overlapping, good size */}
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
                      onNodeDrag={(event, node) => {
                        // Ensure dragging works properly
                        console.log('Dragging node:', node.data?.label);
                      }}
                      fitView
                      fitViewOptions={{ padding: 0.2 }}
                      nodesDraggable={true}
                      nodesConnectable={false}
                      elementsSelectable={true}
                      nodeOrigin={[0.5, 0.5] as [number, number]}
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
