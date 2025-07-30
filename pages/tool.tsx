// pages/tool.tsx - React Flow Version (100% FREE & BEAUTIFUL)
import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

interface MindMapNode {
  id: string;
  text: string;
  category?: string;
  color?: string;
  parent?: string;
}

interface MindMapData {
  title: string;
  nodes: MindMapNode[];
  connections: Array<{ from: string; to: string }>;
}

export default function MindMapTool() {
  const [input, setInput] = useState('');
  const [mindMapData, setMindMapData] = useState<MindMapData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionId] = useState(() => Math.random().toString(36).substr(2, 9));
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const convertToReactFlowData = (data: MindMapData) => {
    // Convert nodes
    const flowNodes: Node[] = data.nodes.map((node, index) => ({
      id: node.id,
      type: 'default',
      position: { 
        x: node.category === 'root' ? 400 : (index % 3) * 300 + Math.random() * 100, 
        y: node.category === 'root' ? 200 : Math.floor(index / 3) * 150 + Math.random() * 50 
      },
      data: { 
        label: node.text
      },
      style: {
        background: node.color || (
          node.category === 'root' ? '#3b82f6' : 
          node.category === 'main' ? '#dcfce7' : '#fed7aa'
        ),
        color: node.category === 'root' ? 'white' : '#374151',
        border: `2px solid ${
          node.category === 'root' ? '#2563eb' : 
          node.category === 'main' ? '#16a34a' : '#ea580c'
        }`,
        borderRadius: '8px',
        fontSize: node.category === 'root' ? '16px' : '14px',
        fontWeight: node.category === 'root' ? 'bold' : '600',
        padding: '8px 16px',
        minWidth: '120px',
        textAlign: 'center',
      },
    }));

    // Convert edges
    const flowEdges: Edge[] = data.connections.map((conn, index) => ({
      id: `e${index}`,
      source: conn.from,
      target: conn.to,
      type: 'smoothstep',
      animated: true,
      style: { 
        stroke: '#6b7280', 
        strokeWidth: 2,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#6b7280',
      },
    }));

    return { nodes: flowNodes, edges: flowEdges };
  };

  useEffect(() => {
    if (mindMapData) {
      const { nodes: flowNodes, edges: flowEdges } = convertToReactFlowData(mindMapData);
      setNodes(flowNodes);
      setEdges(flowEdges);
    }
  }, [mindMapData, setNodes, setEdges]);

  useEffect(() => {
    trackUsage('tool_opened');
  }, []);

  const generateMindMap = async () => {
    if (!input.trim()) {
      setError('Please enter some thoughts or ideas to map');
      return;
    }

    setLoading(true);
    setError('');
    trackUsage('mind_map_generated');

    try {
      const response = await fetch('/api/mind-map/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: input.trim(),
          sessionId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate mind map');
      }

      const data = await response.json();
      setMindMapData(data.mindMap);

    } catch (error) {
      console.error('Mind map generation failed:', error);
      setError('Failed to generate mind map. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const exportMindMap = async (format: 'png' | 'json') => {
    if (!mindMapData) return;

    trackUsage('mind_map_exported', { format });

    try {
      if (format === 'json') {
        const dataStr = JSON.stringify(mindMapData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `mindmap-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else if (format === 'png') {
        // For PNG export, you'd need to implement html-to-image or similar
        // This is a basic implementation - can be enhanced
        alert('PNG export feature will be implemented in the next version. Use JSON export for now.');
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  const trackUsage = async (action: string, metadata?: any) => {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          action,
          metadata,
          timestamp: new Date().toISOString()
        }),
      });
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  };

  const clearMindMap = () => {
    setMindMapData(null);
    setInput('');
    setError('');
    setNodes([]);
    setEdges([]);
  };

  return (
    <>
      <Head>
        <title>Free AI Mind Map Tool - Create Visual Mind Maps Instantly</title>
        <meta name="description" content="Create beautiful mind maps instantly with AI assistance. Transform your thoughts into visual diagrams. Free online mind mapping tool with intelligent organization." />
        <meta name="keywords" content="free mind map tool, AI mind mapping, online mind map creator, visual thinking tool, mind map generator" />
        <link rel="canonical" href="https://mindmapflux.com/tool" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Mindmapflux AI Mind Map Tool",
            "description": "Free AI-powered mind mapping tool for creating visual thought diagrams",
            "applicationCategory": "ProductivityApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "AI-powered mind map generation",
              "Interactive visual editing",
              "Export to PNG and JSON",
              "Real-time collaboration",
              "No account required"
            ]
          })}
        </script>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                Mindmapflux
              </Link>
              <div className="hidden md:flex space-x-8">
                <Link href="/how-it-works" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                  How It Works
                </Link>
                <Link href="/mind-mapping-guide" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                  Guide
                </Link>
                <Link href="/business-mind-mapping" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                  Business
                </Link>
                <Link href="/about" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                  About
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Header */}
        <section className="bg-gradient-to-r from-blue-50 to-purple-50 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Free AI Mind Map Creator
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Transform your thoughts into visual mind maps with AI assistance. 
              No sign-up required - start organizing your ideas instantly.
            </p>
          </div>
        </section>

        {/* Main Tool Interface */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Input Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Enter Your Thoughts
                </h2>
                
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe your ideas, project, or problem here... 

Example: 'I want to start an online business selling courses. Need to figure out target audience, competition, pricing, marketing strategies, content creation, and technical platform..'"
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />

                <div className="mt-6 space-y-3">
                  <button
                    onClick={generateMindMap}
                    disabled={loading || !input.trim()}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating Mind Map...
                      </>
                    ) : (
                      '🧠 Generate Mind Map'
                    )}
                  </button>

                  {mindMapData && (
                    <button
                      onClick={clearMindMap}
                      className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-700"
                    >
                      Clear & Start Over
                    </button>
                  )}
                </div>

                {error && (
                  <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                {/* Example Ideas */}
                <div className="mt-8">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Example Ideas to Try:</h3>
                  <div className="space-y-2">
                    {[
                      'Plan a product launch strategy',
                      'Organize a research project',
                      'Design a marketing campaign',
                      'Plan a career transition',
                      'Brainstorm app features'
                    ].map((example, index) => (
                      <button
                        key={index}
                        onClick={() => setInput(example)}
                        className="block w-full text-left text-sm text-blue-600 hover:text-blue-800 py-1"
                      >
                        • {example}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mind Map Visualization */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm">
                {/* Toolbar */}
                {mindMapData && (
                  <div className="border-b border-gray-200 p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {mindMapData.title}
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => exportMindMap('json')}
                          className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                        >
                          💾 Export Data
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* React Flow Container */}
                <div className="relative">
                  <div 
                    className="w-full h-96 lg:h-[600px] border-2 border-dashed border-gray-200 rounded-lg"
                    style={{ backgroundColor: '#fafafa' }}
                  >
                    {nodes.length > 0 ? (
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
                            if (node.style?.background) return node.style.background as string;
                            return '#e5e7eb';
                          }}
                        />
                        <Background variant={2} gap={12} size={1} />
                      </ReactFlow>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <h3 className="text-lg font-medium mb-2">Your Mind Map Will Appear Here</h3>
                          <p className="text-sm">Enter your thoughts in the panel and click "Generate Mind Map"</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Instructions */}
              {mindMapData && (
                <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">💡 How to Use Your Mind Map:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Click and drag nodes to rearrange them</li>
                    <li>• Use the controls in the bottom left to zoom and pan</li>
                    <li>• View the mini-map to see the full structure</li>
                    <li>• Use the export button to save your work</li>
                    <li>• Add new ideas in the input panel to expand your map</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Features Section */}
          <section className="mt-16 py-12 bg-white rounded-lg shadow-sm">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Why Choose Our AI Mind Map Tool?
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered</h3>
                  <p className="text-gray-600 text-sm">
                    Our AI understands your thoughts and automatically creates logical connections and hierarchies.
                  </p>
                </div>

                <div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">100% Free</h3>
                  <p className="text-gray-600 text-sm">
                    No sign-up required, no hidden costs. Create unlimited mind maps completely free.
                  </p>
                </div>

                <div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Export Ready</h3>
                  <p className="text-gray-600 text-sm">
                    Download your mind maps as data files to use in presentations and documents.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Mindmapflux</h3>
                <p className="text-gray-400">
                  AI-powered mind mapping for better thinking and business ideation.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Tools</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/tool" className="hover:text-white">Mind Map Creator</Link></li>
                  <li><Link href="/business-mind-mapping" className="hover:text-white">Business Templates</Link></li>
                  <li><Link href="/how-it-works" className="hover:text-white">How It Works</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Learn</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/mind-mapping-guide" className="hover:text-white">Mind Mapping Guide</Link></li>
                  <li><Link href="/business-ideation-techniques" className="hover:text-white">Business Ideation</Link></li>
                  <li><Link href="/creative-thinking-methods" className="hover:text-white">Creative Thinking</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/about" className="hover:text-white">About</Link></li>
                  <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
              <p>&copy; 2025 Mindmapflux. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
