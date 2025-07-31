// pages/tool.tsx - Enhanced AI Mind Mapping Tool (Problems 29-33 Fixed)
import { useState, useEffect, useCallback, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  NodeChange,
  MarkerType,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Interfaces
interface MindMapNode {
  id: string;
  label: string;
  type: 'main' | 'sub' | 'detail';
}

interface MindMapConnection {
  from: string;
  to: string;
}

interface MindMapData {
  nodes: MindMapNode[];
  connections: MindMapConnection[];
  analysis: string;
  suggestions: string[];
  context: string;
}

interface ApiResponse {
  success: boolean;
  data?: MindMapData;
  error?: string;
}

// Smart Dynamic Color Palette - Based on Branch System with Hierarchy
const BRANCH_COLOR_SYSTEM = {
  // Primary node color
  primary: {
    color: "#2D7D7D", // Teal - 正经绿
    name: "正经绿"
  },
  
  // Priority branch colors - use these first, don't cycle
  priority: [
    { color: "#795F9C", name: "绝绝紫" },
    { color: "#D85B72", name: "发财红" },
    { color: "#6B8857", name: "不焦虑" },
    { color: "#518463", name: "放青松" },
    { color: "#4C697A", name: "不摆蓝" },
    { color: "#886441", name: "糖太棕" }
  ],
  
  // Additional logical colors for 7+ branches
  additional: [
    { color: "#5D4E37", name: "深棕" },
    { color: "#2F4F4F", name: "深青" },
    { color: "#483D8B", name: "深紫" },
    { color: "#8B7355", name: "暗金" },
    { color: "#556B2F", name: "橄榄" },
    { color: "#8B4513", name: "鞍褐" },
    { color: "#2E8B57", name: "海绿" },
    { color: "#4682B4", name: "钢蓝" }
  ]
};

// Problem 29: File upload functionality for PNG/JSON mind maps
const FileUploadSection = ({ onFileUpload, isVisible }: { onFileUpload: (file: File) => void; isVisible: boolean }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'application/json' || file.type.startsWith('image/'))) {
      onFileUpload(file);
    } else {
      alert('Please upload a JSON file (previous mind map data) or PNG image (mind map screenshot)');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="mb-4 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <div className="text-center">
        <div className="mb-2">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-sm text-gray-600 mb-2">Continue evolving a previous mind map</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.png,.jpg,.jpeg"
          onChange={handleFileUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Upload Previous Mind Map
        </button>
        <p className="text-xs text-gray-500 mt-1">JSON (data) or PNG/JPG (image)</p>
      </div>
    </div>
  );
};

// Problem 31: Advanced layout algorithm with better spacing
const calculateOptimalPositions = (mindMapData: MindMapData, existingNodes: Node[] = []): Map<string, { x: number; y: number }> => {
  const positions = new Map<string, { x: number; y: number }>();
  
  // Find center/root nodes
  const connectedNodeIds = new Set([
    ...mindMapData.connections.map(c => c.from),
    ...mindMapData.connections.map(c => c.to)
  ]);
  
  const centerNodes = mindMapData.nodes.filter(node => 
    node.type === 'main' && !mindMapData.connections.some(c => c.to === node.id)
  );
  
  // If evolving, preserve existing positions and build around them
  if (existingNodes.length > 0) {
    existingNodes.forEach(node => {
      positions.set(node.id, { x: node.position.x, y: node.position.y });
    });
  }

  // Position center nodes first
  centerNodes.forEach((centerNode, index) => {
    if (positions.has(centerNode.id)) return; // Keep existing position
    
    const baseX = index * 400; // Spread multiple centers horizontally
    positions.set(centerNode.id, { x: baseX, y: 0 });
  });

  // Build tree structure for each center
  centerNodes.forEach(centerNode => {
    const centerPos = positions.get(centerNode.id)!;
    buildBranchLayout(centerNode.id, centerPos, mindMapData, positions, 1);
  });

  return positions;
};

// Recursive function to build branch layouts with optimal spacing
const buildBranchLayout = (
  parentId: string, 
  parentPos: { x: number; y: number }, 
  mindMapData: MindMapData, 
  positions: Map<string, { x: number; y: number }>,
  level: number
) => {
  const children = mindMapData.connections
    .filter(c => c.from === parentId)
    .map(c => mindMapData.nodes.find(n => n.id === c.to))
    .filter(Boolean) as MindMapNode[];

  if (children.length === 0) return;

  // Calculate optimal spacing based on level and number of children
  const radiusBase = level === 1 ? 280 : (level === 2 ? 200 : 150);
  const radius = radiusBase + (children.length - 1) * 20; // Expand radius for more children
  const angleStep = children.length === 1 ? 0 : (2 * Math.PI) / children.length;
  const startAngle = level === 1 ? -Math.PI / 2 : 0; // Start main branches at top

  children.forEach((child, index) => {
    if (positions.has(child.id)) return; // Keep existing position

    const angle = startAngle + (index * angleStep);
    let x = parentPos.x + Math.cos(angle) * radius;
    let y = parentPos.y + Math.sin(angle) * radius;

    // Problem 31: Find empty position to avoid overlaps
    const finalPosition = findOptimalEmptyPosition(
      [...mindMapData.nodes.map(n => positions.get(n.id)).filter(Boolean) as { x: number; y: number }[]],
      x, y, 120 // Minimum distance
    );

    positions.set(child.id, finalPosition);
    
    // Recursively position grandchildren
    buildBranchLayout(child.id, finalPosition, mindMapData, positions, level + 1);
  });
};

// Problem 31: Improved empty position finding with spiral search
const findOptimalEmptyPosition = (
  existingPositions: { x: number; y: number }[],
  preferredX: number,
  preferredY: number,
  minDistance: number
): { x: number; y: number } => {
  
  // Check if preferred position is available
  const isPositionFree = (x: number, y: number) => {
    return existingPositions.every(pos => {
      const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
      return distance >= minDistance;
    });
  };

  if (isPositionFree(preferredX, preferredY)) {
    return { x: preferredX, y: preferredY };
  }

  // Spiral search for empty position
  const maxRadius = 500;
  const stepSize = 30;
  
  for (let radius = stepSize; radius <= maxRadius; radius += stepSize) {
    const steps = Math.max(8, Math.floor(radius * 0.1)); // More steps for larger radius
    
    for (let i = 0; i < steps; i++) {
      const angle = (2 * Math.PI * i) / steps;
      const x = preferredX + Math.cos(angle) * radius;
      const y = preferredY + Math.sin(angle) * radius;
      
      if (isPositionFree(x, y)) {
        return { x, y };
      }
    }
  }

  // Fallback to preferred position with small random offset
  return {
    x: preferredX + (Math.random() - 0.5) * 100,
    y: preferredY + (Math.random() - 0.5) * 100
  };
};

// Get intelligent color based on branch system and hierarchy
const assignBranchColor = (
  node: MindMapNode, 
  allNodes: MindMapNode[], 
  connections: MindMapConnection[],
  index: number
): string => {
  
  // Safety checks
  if (!node || !allNodes || !connections) {
    return BRANCH_COLOR_SYSTEM.primary.color;
  }
  
  // Debug logging to understand the structure
  console.log('Assigning color for node:', node.id, node.label, node.type);
  
  // Find all root nodes (nodes with no incoming connections)
  const rootNodes = allNodes.filter(n => !connections.some(c => c.to === n.id));
  console.log('Root nodes found:', rootNodes.map(n => ({ id: n.id, label: n.label })));
  
  // If this is a root node, assign branch colors
  if (rootNodes.some(root => root.id === node.id)) {
    const rootIndex = rootNodes.findIndex(root => root.id === node.id);
    console.log('Root node index:', rootIndex);
    
    if (rootIndex === 0) {
      // First root gets primary color (center)
      return BRANCH_COLOR_SYSTEM.primary.color;
    } else {
      // Other roots get branch colors
      const branchIndex = rootIndex - 1;
      if (branchIndex < BRANCH_COLOR_SYSTEM.priority.length) {
        const color = BRANCH_COLOR_SYSTEM.priority[branchIndex].color;
        console.log('Assigned priority color:', color, BRANCH_COLOR_SYSTEM.priority[branchIndex].name);
        return color;
      } else {
        const additionalIndex = (branchIndex - BRANCH_COLOR_SYSTEM.priority.length) % BRANCH_COLOR_SYSTEM.additional.length;
        const color = BRANCH_COLOR_SYSTEM.additional[additionalIndex].color;
        console.log('Assigned additional color:', color, BRANCH_COLOR_SYSTEM.additional[additionalIndex].name);
        return color;
      }
    }
  }
  
  // For non-root nodes, find their root parent and inherit color family
  const findRootParent = (nodeId: string, visited = new Set<string>()): string | null => {
    if (visited.has(nodeId)) return null;
    visited.add(nodeId);
    
    const parentConnection = connections.find(c => c.to === nodeId);
    if (!parentConnection) return nodeId; // This is a root
    
    const parentNode = allNodes.find(n => n.id === parentConnection.from);
    if (!parentNode) return nodeId;
    
    // If parent is a root, return it
    if (rootNodes.some(root => root.id === parentNode.id)) {
      return parentNode.id;
    }
    
    // Otherwise, keep looking up
    return findRootParent(parentNode.id, visited);
  };
  
  const rootParentId = findRootParent(node.id);
  console.log('Found root parent for', node.label, ':', rootParentId);
  
  if (rootParentId) {
    const rootParent = allNodes.find(n => n.id === rootParentId);
    if (rootParent) {
      // Get the base color from the root parent
      const rootIndex = rootNodes.findIndex(root => root.id === rootParentId);
      let baseColor: string;
      
      if (rootIndex === 0) {
        baseColor = BRANCH_COLOR_SYSTEM.primary.color;
      } else {
        const branchIndex = rootIndex - 1;
        if (branchIndex < BRANCH_COLOR_SYSTEM.priority.length) {
          baseColor = BRANCH_COLOR_SYSTEM.priority[branchIndex].color;
        } else {
          const additionalIndex = (branchIndex - BRANCH_COLOR_SYSTEM.priority.length) % BRANCH_COLOR_SYSTEM.additional.length;
          baseColor = BRANCH_COLOR_SYSTEM.additional[additionalIndex].color;
        }
      }
      
      // Apply hierarchy lightening based on depth
      const getNodeDepth = (nodeId: string): number => {
        const connection = connections.find(c => c.to === nodeId);
        if (!connection) return 0;
        return 1 + getNodeDepth(connection.from);
      };
      
      const depth = getNodeDepth(node.id);
      console.log('Node depth:', depth, 'Base color:', baseColor);
      
      return adjustColorBrightness(baseColor, depth);
    }
  }
  
  // Fallback
  console.log('Using fallback color for:', node.label);
  return BRANCH_COLOR_SYSTEM.priority[0].color;
};

// Adjust color brightness for hierarchy with reset mechanism
const adjustColorBrightness = (hexColor: string, level: number): string => {
  // Safety checks
  if (!hexColor || typeof hexColor !== 'string' || !hexColor.startsWith('#') || hexColor.length !== 7) {
    return BRANCH_COLOR_SYSTEM.primary.color; // Fallback to primary color
  }
  
  const lightenPercent = Math.min(level * 10, 60); // Max 60% lighter
  
  // Convert hex to RGB with error handling
  try {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Check for valid RGB values
    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      return BRANCH_COLOR_SYSTEM.primary.color;
    }
    
    // Apply lightening
    const factor = lightenPercent / 100;
    const newR = Math.min(255, Math.round(r + (255 - r) * factor));
    const newG = Math.min(255, Math.round(g + (255 - g) * factor));
    const newB = Math.min(255, Math.round(b + (255 - b) * factor));
    
    // If too light (>90% white), reset to darker version
    const avgBrightness = (newR + newG + newB) / 3;
    if (avgBrightness > 230) {
      return adjustColorBrightness(hexColor, Math.floor(level / 2));
    }
    
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  } catch (error) {
    console.warn('Color adjustment error:', error);
    return BRANCH_COLOR_SYSTEM.primary.color;
  }
};

// Problem 32: Smart edge connection points that adjust when nodes move
const calculateConnectionPoints = (sourceNode: Node, targetNode: Node): { sourceHandle: Position; targetHandle: Position } => {
  const dx = targetNode.position.x - sourceNode.position.x;
  const dy = targetNode.position.y - sourceNode.position.y;
  
  // Determine optimal connection sides based on relative positions
  let sourceHandle: Position;
  let targetHandle: Position;
  
  if (Math.abs(dx) > Math.abs(dy)) {
    // Horizontal connection is dominant
    if (dx > 0) {
      sourceHandle = Position.Right;
      targetHandle = Position.Left;
    } else {
      sourceHandle = Position.Left;
      targetHandle = Position.Right;
    }
  } else {
    // Vertical connection is dominant
    if (dy > 0) {
      sourceHandle = Position.Bottom;
      targetHandle = Position.Top;
    } else {
      sourceHandle = Position.Top;
      targetHandle = Position.Bottom;
    }
  }
  
  return { sourceHandle, targetHandle };
};

export default function Tool() {
  const [input, setInput] = useState('');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState<'input' | 'generating' | 'complete'>('input');
  const [analysis, setAnalysis] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Analyzing your thoughts...');
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showFullscreenInput, setShowFullscreenInput] = useState(true);

  // Problem 30: Clear session data on component mount (no cross-session memory)
  useEffect(() => {
    // Clear any potential session data
    setNodes([]);
    setEdges([]);
    setConversationHistory([]);
    setAnalysis('');
    setSuggestions([]);
    // Note: No localStorage or sessionStorage used - everything is in-memory only
  }, []);

  // Problem 28: Rotating loading messages
  const loadingMessages = [
    'Analyzing your thoughts...',
    'Mapping connections...',
    'Organizing ideas...',
    'Building structure...',
    'Finalizing mind map...'
  ];

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setLoadingMessage(prev => {
          const currentIndex = loadingMessages.indexOf(prev);
          const nextIndex = (currentIndex + 1) % loadingMessages.length;
          return loadingMessages[nextIndex];
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  // Problem 29: Handle file upload for previous mind maps
  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    
    if (file.type === 'application/json') {
      // Handle JSON file - previous mind map data
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        
        if (data.nodes && data.edges) {
          // Restore previous mind map
          setNodes(data.nodes);
          setEdges(data.edges);
          setCurrentStep('complete');
          setAnalysis(data.analysis || 'Restored from previous session');
          setSuggestions(data.suggestions || []);
        }
      } catch (error) {
        alert('Invalid JSON file. Please upload a valid mind map data file.');
      }
    } else if (file.type.startsWith('image/')) {
      // Handle image file - will use AI to analyze the image content
      setInput(`Continue evolving this mind map based on the uploaded image: ${file.name}`);
    }
    
    setShowFileUpload(false);
  };

  // Problem 32: Handle node position changes and update edge connections
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    onNodesChange(changes);
    
    // Update edge connection points when nodes are moved
    changes.forEach(change => {
      if (change.type === 'position' && change.position) {
        setEdges(currentEdges => 
          currentEdges.map(edge => {
            const sourceNode = nodes.find(n => n.id === edge.source);
            const targetNode = nodes.find(n => n.id === edge.target);
            
            if (sourceNode && targetNode && (edge.source === change.id || edge.target === change.id)) {
              const { sourceHandle, targetHandle } = calculateConnectionPoints(sourceNode, targetNode);
              return {
                ...edge,
                sourceHandle,
                targetHandle
              };
            }
            return edge;
          })
        );
      }
    });
  }, [nodes, onNodesChange, setEdges]);

  const generateMindMap = async (evolve = false) => {
    if (!input.trim() && !uploadedFile) return;

    setIsGenerating(true);
    setCurrentStep('generating');
    
    try {
      let response;
      
      if (uploadedFile) {
        // Use FormData only when file is uploaded
        const formData = new FormData();
        formData.append('input', input.trim());
        formData.append('isEvolution', evolve.toString());
        formData.append('file', uploadedFile);
        
        if (evolve) {
          const existingData = {
            nodes: nodes.map(node => ({
              id: node.id,
              label: node.data?.label || 'Unknown',
              type: node.data?.type || 'main',
              position: node.position,
              color: typeof node.style?.background === 'string' ? node.style.background : undefined
            })),
            edges: edges.map(edge => ({
              from: edge.source,
              to: edge.target
            })),
            conversationHistory
          };
          formData.append('existingNodes', JSON.stringify(existingData));
        }

        response = await fetch('/api/mind-map/generate', {
          method: 'POST',
          body: formData
        });
      } else {
        // Use JSON format for regular requests (maintains backend compatibility)
        const requestBody: any = {
          input: input.trim(),
          isEvolution: evolve,
          conversationHistory
        };

        if (evolve) {
          const existingData = {
            nodes: nodes.map(node => ({
              id: node.id,
              label: node.data?.label || 'Unknown',
              type: node.data?.type || 'main',
              position: node.position,
              color: typeof node.style?.background === 'string' ? node.style.background : undefined
            })),
            edges: edges.map(edge => ({
              from: edge.source,
              to: edge.target
            })),
            conversationHistory
          };
          requestBody.existingNodes = existingData.nodes;
        }

        response = await fetch('/api/mind-map/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('API Response:', result); // Debug logging
      
      // Handle different possible response formats from backend
      let mindMapData: MindMapData;
      
      if (result.success && result.data) {
        // Format 1: { success: true, data: MindMapData }
        mindMapData = result.data;
      } else if (result.nodes && result.connections) {
        // Format 2: Direct MindMapData object
        mindMapData = result as MindMapData;
      } else if (result.mindMap) {
        // Format 3: { mindMap: MindMapData }
        mindMapData = result.mindMap;
      } else {
        // Error case
        console.error('API returned error or unexpected format:', result);
        throw new Error(result.error || result.message || 'Failed to generate mind map');
      }
      
      // Calculate optimal positions with overlap prevention
      const positions = calculateOptimalPositions(mindMapData, evolve ? nodes : []);
      
      // Create React Flow nodes with intelligent color assignment
      const flowNodes: Node[] = mindMapData.nodes.map((node, index) => {
        const position = positions.get(node.id) || { x: 0, y: 0 };
        
        // Safe color assignment with error handling
        let backgroundColor: string;
        try {
          backgroundColor = assignBranchColor(node, mindMapData.nodes, mindMapData.connections, index);
        } catch (error) {
          console.warn('Color assignment error:', error);
          backgroundColor = BRANCH_COLOR_SYSTEM.primary.color; // Fallback to primary color
        }
        
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
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 16px',
            fontSize: node.type === 'main' ? '16px' : node.type === 'sub' ? '14px' : '12px',
            fontWeight: node.type === 'main' ? 'bold' : node.type === 'sub' ? '600' : 'normal',
            minWidth: node.type === 'main' ? '120px' : node.type === 'sub' ? '100px' : '80px',
            textAlign: 'center',
            wordWrap: 'break-word',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          },
          draggable: true
        };
      });

      // Create React Flow edges with smart connection points
      const flowEdges: Edge[] = mindMapData.connections.map((connection, index) => {
        const sourceNode = flowNodes.find(n => n.id === connection.from);
        const targetNode = flowNodes.find(n => n.id === connection.to);
        
        if (!sourceNode || !targetNode) {
          return {
            id: `${connection.from}-${connection.to}`,
            source: connection.from,
            target: connection.to,
            type: 'smoothstep',
            animated: false,
            style: { stroke: '#6B7280', strokeWidth: 2 },
            markerEnd: { type: MarkerType.Arrow }
          };
        }

        const { sourceHandle, targetHandle } = calculateConnectionPoints(sourceNode, targetNode);
        
        // Safe color extraction with fallback
        let strokeColor = '#6B7280'; // Default gray
        if (sourceNode?.style?.background && typeof sourceNode.style.background === 'string') {
          strokeColor = sourceNode.style.background;
        }

        return {
          id: `${connection.from}-${connection.to}`,
          source: connection.from,
          target: connection.to,
          type: 'smoothstep',
          animated: false,
          style: { 
            stroke: strokeColor,
            strokeWidth: 2,
            strokeOpacity: 0.8
          },
          markerEnd: { 
            type: MarkerType.Arrow,
            color: strokeColor
          },
          sourceHandle,
          targetHandle
        };
      });

      if (evolve) {
        // Evolution: add new nodes/edges to existing ones
        setNodes(prev => [...prev, ...flowNodes.filter(node => !prev.some(p => p.id === node.id))]);
        setEdges(prev => [...prev, ...flowEdges.filter(edge => !prev.some(p => p.id === edge.id))]);
      } else {
        // New mind map: replace all nodes/edges
        setNodes(flowNodes);
        setEdges(flowEdges);
      }

      setAnalysis(mindMapData.analysis);
      setSuggestions(mindMapData.suggestions);
      setConversationHistory(prev => [...prev, input.trim()]);
      setCurrentStep('complete');
      
    } catch (error) {
      console.error('Error generating mind map:', error);
      
      // More user-friendly error messages
      let errorMessage = 'Failed to generate mind map. ';
      if (error instanceof Error) {
        if (error.message.includes('HTTP error')) {
          errorMessage += 'Server error occurred. Please check your backend API.';
        } else if (error.message.includes('fetch')) {
          errorMessage += 'Network error. Please check your connection.';
        } else {
          errorMessage += error.message;
        }
      } else {
        errorMessage += 'Unknown error occurred.';
      }
      
      alert(errorMessage);
    } finally {
      setIsGenerating(false);
      setUploadedFile(null);
    }
  };

  const exportMindMap = (format: 'json' | 'png') => {
    if (format === 'json') {
      const data = {
        nodes: nodes.map(node => ({
          id: node.id,
          label: node.data?.label || 'Unknown',
          type: node.data?.type || 'main',
          position: node.position,
          color: typeof node.style?.background === 'string' ? node.style.background : undefined
        })),
        edges: edges.map(edge => ({
          from: edge.source,
          to: edge.target
        })),
        analysis,
        suggestions,
        conversationHistory,
        timestamp: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mindmap-data.json';
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'png') {
      // PNG export would require additional canvas rendering
      alert('PNG export coming soon! Use JSON export for now to save your mind map data.');
    }
  };

  const startOver = () => {
    setNodes([]);
    setEdges([]);
    setInput('');
    setAnalysis('');
    setSuggestions([]);
    setConversationHistory([]);
    setCurrentStep('input');
    setIsFullscreen(false);
    setShowFullscreenInput(true);
    setUploadedFile(null);
  };

  // Problem 33: Fullscreen input interface
  return (
    <>
      <Head>
        <title>AI Mind Mapping Tool - MindMapFlux</title>
        <meta name="description" content="Create dynamic, AI-powered mind maps that evolve with your thoughts" />
      </Head>

      <div className={`min-h-screen bg-white ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
        {/* Navigation Header - Hidden in fullscreen */}
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

        {/* Problem 33: Fullscreen Input Hover Box - Toggleable */}
        {isFullscreen && currentStep === 'complete' && showFullscreenInput && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white p-4 rounded-lg shadow-lg border max-w-md w-full mx-4">
            <div className="mb-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Continue evolving your mind map..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && generateMindMap(true)}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => generateMindMap(true)}
                disabled={!input.trim()}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
              >
                Continue
              </button>
              <button
                onClick={() => setShowFileUpload(true)}
                className="bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700 text-sm"
              >
                📁
              </button>
            </div>
            
            {/* Problem 33: AI Suggestions in fullscreen */}
            {suggestions.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-gray-600 mb-2">AI Suggestions:</p>
                <div className="flex flex-wrap gap-1">
                  {suggestions.slice(0, 3).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(suggestion)}
                      className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded hover:bg-blue-100"
                    >
                      {suggestion.length > 25 ? suggestion.substring(0, 25) + '...' : suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Problem 23: Exit Fullscreen Button + Input Toggle */}
        {isFullscreen && (
          <div className="fixed top-4 right-4 z-50 flex gap-2">
            <button
              onClick={() => setShowFullscreenInput(!showFullscreenInput)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 shadow-lg flex items-center"
              title={showFullscreenInput ? "Hide input box" : "Show input box"}
            >
              {showFullscreenInput ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              )}
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
            
            {/* Step 1: Input Interface */}
            {currentStep === 'input' && !isFullscreen && (
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    AI-Powered Mind Mapping Tool
                  </h1>
                  <p className="text-lg text-gray-600">
                    Transform your thoughts into dynamic, evolving mind maps
                  </p>
                </div>

                {/* Problem 29: File Upload Section */}
                <div className="mb-6">
                  <button
                    onClick={() => setShowFileUpload(!showFileUpload)}
                    className="w-full text-left p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-sm text-gray-700">
                      💡 Have a previous mind map? Upload it to continue evolving
                    </span>
                  </button>
                </div>

                <FileUploadSection 
                  onFileUpload={handleFileUpload}
                  isVisible={showFileUpload}
                />

                {/* Input Section */}
                <div className="mb-6">
                  <label htmlFor="thought-input" className="block text-lg font-medium text-gray-700 mb-3">
                    Share your thoughts, ideas, or challenges:
                  </label>
                  <textarea
                    id="thought-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Example: I want to start a food business in Huangshan focusing on local cuisine and tourism..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div className="text-center">
                  <button
                    onClick={() => generateMindMap(false)}
                    disabled={!input.trim() && !uploadedFile}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Create Mind Map
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Generating State */}
            {currentStep === 'generating' && (
              <div className="max-w-2xl mx-auto text-center py-16">
                <div className="mb-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Creating Your Mind Map
                </h2>
                <p className="text-gray-600">
                  {loadingMessage}
                </p>
              </div>
            )}

            {/* Step 3: Complete Mind Map */}
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
                        placeholder="Continue evolving your mind map..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        onKeyPress={(e) => e.key === 'Enter' && e.shiftKey === false && (e.preventDefault(), generateMindMap(true))}
                      />
                    </div>
                    
                    {/* Buttons Under Input */}
                    <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => generateMindMap(true)}
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
                        <button
                          onClick={() => setShowFileUpload(true)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                          📁 Upload
                        </button>
                      </div>
                      
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setIsFullscreen(true);
                            setShowFullscreenInput(true);
                          }}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                        >
                          Fullscreen
                        </button>
                        <button
                          onClick={() => exportMindMap('json')}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                          Export JSON
                        </button>
                      </div>
                    </div>

                    {/* AI Suggestions Under Buttons */}
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
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={handleNodesChange}
                    onEdgesChange={onEdgesChange}
                    fitView
                    fitViewOptions={{ padding: 0.2 }}
                    nodesDraggable={true}
                    nodesConnectable={false}
                    elementsSelectable={true}
                  >
                    <Controls />
                    <MiniMap />
                    <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                  </ReactFlow>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Problem 29: File Upload Modal */}
        {showFileUpload && currentStep === 'complete' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Upload Previous Mind Map</h3>
              <FileUploadSection 
                onFileUpload={handleFileUpload}
                isVisible={true}
              />
              <button
                onClick={() => setShowFileUpload(false)}
                className="mt-4 w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
