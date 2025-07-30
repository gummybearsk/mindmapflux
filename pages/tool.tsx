// pages/tool.tsx - Enhanced AI Mind Mapping Tool (TypeScript Fixed)
import { useState, useEffect, useCallback, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ReactFlow, { 
  MiniMap, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState, 
  Node, 
  Edge, 
  MarkerType 
} from 'reactflow';
import 'reactflow/dist/style.css';
import { MINDMAP_COLOR_SCHEMES } from '../utils/colorSchemes';

interface MindMapData {
  nodes: Node[];
  connections: { from: string; to: string }[];
  analysis: string;
  suggestions: string[];
  context: string;
}

export default function Tool() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mindMapData, setMindMapData] = useState<MindMapData | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedColorScheme, setSelectedColorScheme] = useState('blue');
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [isEvolution, setIsEvolution] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState('');

  const generateMindMap = async (evolve = false) => {
    if (!input.trim()) return;
    
    setLoading(true);
    setError('');
    setIsEvolution(evolve);

    try {
      const response = await fetch('/api/mind-map/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: input.trim(),
          colorScheme: selectedColorScheme,
          isEvolution: evolve,
          existingNodes: evolve ? nodes : [],
          conversationHistory
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate mind map');
      }

      const data = await response.json();
      
      if (data.success) {
        setMindMapData(data.mindMap);
        setSuggestions(data.mindMap.suggestions || []);
        
        // Update conversation history
        setConversationHistory(prev => [...prev, input.trim()]);
        
        // Clear input for next evolution
        setInput('');
      } else {
        setError(data.error || 'Failed to generate mind map');
      }
    } catch (error) {
      console.error('Error generating mind map:', error);
      setError('Failed to generate mind map. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const evolveMindMap = () => {
    generateMindMap(true);
  };

  const addSuggestionToInput = (suggestion: string) => {
    setInput(prev => prev ? `${prev} ${suggestion}` : suggestion);
  };

  const exportMindMap = (format: 'json' | 'png') => {
    if (!mindMapData) return;

    if (format === 'json') {
      const dataStr = JSON.stringify(mindMapData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = 'mindmap.json';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };

  // Convert mind map data to React Flow format
  useEffect(() => {
    if (!mindMapData) return;

    const scheme = MINDMAP_COLOR_SCHEMES[selectedColorScheme as keyof typeof MINDMAP_COLOR_SCHEMES];
    
    // Position nodes using advanced algorithm
    const positions = new Map();
    const centerX = 400;
    const centerY = 300;
    
    // Find center node
    const centerNode = mindMapData.nodes.find(node => node.type === 'center') || mindMapData.nodes[0];
    if (centerNode) {
      positions.set(centerNode.id, { x: centerX, y: centerY });
    }

    // Position main category nodes in a circle
    const mainNodes = mindMapData.nodes.filter(node => node.type === 'main');
    const mainRadius = 220;
    const mainAngleStep = (2 * Math.PI) / mainNodes.length;
    
    mainNodes.forEach((node, index) => {
      const angle = index * mainAngleStep;
      positions.set(node.id, {
        x: centerX + mainRadius * Math.cos(angle),
        y: centerY + mainRadius * Math.sin(angle)
      });
    });

    // Position sub-nodes around their parent main nodes
    mainNodes.forEach((mainNode, mainIndex) => {
      const subNodes = mindMapData.nodes.filter(node => 
        mindMapData.connections.some(conn => 
          conn.from === mainNode.id && conn.to === node.id
        )
      );
      
      if (subNodes.length === 0) return;
      
      const mainPos = positions.get(mainNode.id);
      const subRadius = 140;
      const baseAngle = mainIndex * mainAngleStep;
      const spreadAngle = Math.PI / 3; // 60 degrees spread
      const angleStep = spreadAngle / Math.max(1, subNodes.length - 1);
      
      subNodes.forEach((node, subIndex) => {
        const angle = baseAngle - spreadAngle/2 + (angleStep * subIndex);
        positions.set(node.id, {
          x: mainPos.x + subRadius * Math.cos(angle),
          y: mainPos.y + subRadius * Math.sin(angle)
        });
      });
    });

    // Position detail nodes around sub-nodes
    mindMapData.nodes.filter(node => node.type === 'detail').forEach(detailNode => {
      const parentConnection = mindMapData.connections.find(conn => conn.to === detailNode.id);
      if (!parentConnection) return;
      
      const parentPos = positions.get(parentConnection.from);
      if (!parentPos) return;
      
      const detailRadius = 90;
      const randomAngle = Math.random() * 2 * Math.PI;
      positions.set(detailNode.id, {
        x: parentPos.x + detailRadius * Math.cos(randomAngle),
        y: parentPos.y + detailRadius * Math.sin(randomAngle)
      });
    });

    // Create React Flow nodes
    const flowNodes: Node[] = mindMapData.nodes.map(node => {
      const position = positions.get(node.id) || { x: 0, y: 0 };
      const nodeSize = node.type === 'center' ? 'large' : node.type === 'main' ? 'medium' : 'small';
      
      return {
        id: node.id,
        type: 'default',
        position,
        data: { 
          label: node.label,
          type: node.type
        },
        style: {
          background: scheme.nodeColors[node.type as keyof typeof scheme.nodeColors] || scheme.primary,
          color: '#ffffff',
          border: `2px solid ${scheme.secondary}`,
          borderRadius: nodeSize === 'large' ? '15px' : nodeSize === 'medium' ? '10px' : '8px',
          padding: nodeSize === 'large' ? '15px' : nodeSize === 'medium' ? '12px' : '8px',
          fontSize: nodeSize === 'large' ? '16px' : nodeSize === 'medium' ? '14px' : '12px',
          fontWeight: nodeSize === 'large' ? 'bold' : nodeSize === 'medium' ? '600' : 'normal',
          minWidth: nodeSize === 'large' ? '200px' : nodeSize === 'medium' ? '150px' : '100px',
          textAlign: 'center',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        },
      };
    });

    // Create React Flow edges - FIXED TypeScript Issue
    const flowEdges: Edge[] = mindMapData.connections.map((conn, index) => ({
      id: `edge-${index}`,
      source: conn.from,
      target: conn.to,
      type: 'default',
      style: { 
        stroke: scheme.main, 
        strokeWidth: 2 
      },
      markerEnd: {
        type: MarkerType.Arrow, // FIXED: Using MarkerType enum
        color: scheme.main,
      },
    }));

    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [mindMapData, selectedColorScheme]);

  return (
    <>
      <Head>
        <title>AI Mind Mapping Tool - Transform Ideas into Visual Maps | Mindmapflux</title>
        <meta name="description" content="Create intelligent mind maps with AI. Transform scattered thoughts into organized visual maps that evolve with your thinking." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                Mindmapflux
              </Link>
              <nav className="hidden md:flex space-x-8">
                <Link href="/how-it-works" className="text-gray-700 hover:text-blue-600">How It Works</Link>
                <Link href="/mind-mapping-guide" className="text-gray-700 hover:text-blue-600">Guide</Link>
                <Link href="/business-mind-mapping" className="text-gray-700 hover:text-blue-600">Business</Link>
                <Link href="/about" className="text-gray-700 hover:text-blue-600">About</Link>
              </nav>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Tool Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI-Powered Mind Mapping Tool
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform your scattered thoughts into organized visual maps. Our AI understands your ideas and creates intelligent connections.
            </p>
          </div>

          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="mb-4">
              <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
                Describe your ideas, project, or thoughts:
              </label>
              <textarea
                id="input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Example: I want to start a sustainable fashion business targeting millennials. Need to figure out product sourcing, brand positioning, marketing strategy, logistics, funding options..."
                disabled={loading}
              />
            </div>

            {/* Color Theme Selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose Color Theme:
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(MINDMAP_COLOR_SCHEMES).map(([key, scheme]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedColorScheme(key)}
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                      selectedColorScheme === key
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                    style={{ 
                      backgroundColor: selectedColorScheme === key ? scheme.light : undefined,
                      borderColor: selectedColorScheme === key ? scheme.primary : undefined 
                    }}
                  >
                    {scheme.name}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
                {error}
              </div>
            )}

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => generateMindMap(false)}
                disabled={loading || !input.trim()}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Generating...' : 'Generate Mind Map'}
              </button>

              {mindMapData && (
                <button
                  onClick={evolveMindMap}
                  disabled={loading || !input.trim()}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Evolving...' : 'Evolve Map'}
                </button>
              )}

              {mindMapData && (
                <button
                  onClick={() => exportMindMap('json')}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  Export JSON
                </button>
              )}
            </div>
          </div>

          {/* AI Suggestions */}
          {suggestions.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🤖 AI Suggestions for Expansion
              </h3>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => addSuggestionToInput(suggestion)}
                    className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors text-sm"
                  >
                    + {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mind Map Visualization */}
          {mindMapData && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-96 sm:h-[500px] lg:h-[600px]">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  fitView
                  attributionPosition="bottom-left"
                >
                  <MiniMap />
                  <Controls />
                  <Background />
                </ReactFlow>
              </div>

              {/* Analysis Section */}
              {mindMapData.analysis && (
                <div className="p-6 border-t bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    🧠 AI Strategic Analysis
                  </h3>
                  <div className="prose prose-sm max-w-none text-gray-700">
                    {mindMapData.analysis.split('\n').map((paragraph, index) => (
                      paragraph.trim() && <p key={index} className="mb-2">{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          {!mindMapData && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                How to Use This Tool
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">📝 Input Your Ideas</h4>
                  <p className="text-gray-600 text-sm">
                    Describe your project, business idea, or any complex topic. Don't worry about organization - just dump your thoughts!
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">🎨 Choose Your Style</h4>
                  <p className="text-gray-600 text-sm">
                    Select from beautiful Chinese-inspired color themes to match your preference or project type.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">🧠 AI Processing</h4>
                  <p className="text-gray-600 text-sm">
                    Our AI analyzes your input and creates logical connections, categories, and strategic insights.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">🔄 Evolve & Refine</h4>
                  <p className="text-gray-600 text-sm">
                    Add more thoughts and use "Evolve Map" to enhance your existing mind map without starting over.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
