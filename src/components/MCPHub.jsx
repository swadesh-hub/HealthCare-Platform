import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, ShieldCheck, RefreshCw, XCircle, Code, 
  Send, Trash2, Copy, Play, Database, FileText, Info
} from 'lucide-react';

export default function MCPHub() {
  const [sseUrl, setSseUrl] = useState('http://localhost:3001/sse');
  const [postUrl, setPostUrl] = useState('http://localhost:3001/api/mcp');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [logs, setLogs] = useState([]);
  
  // Lists from Initialize
  const [tools, setTools] = useState([]);
  const [resources, setResources] = useState([]);
  const [prompts, setPrompts] = useState([]);

  // Sandbox inputs
  const [activeTab, setActiveTab] = useState('logs'); // logs, tools, resources, prompts
  const [selectedTool, setSelectedTool] = useState(null);
  const [toolParams, setToolParams] = useState({});
  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [promptParams, setPromptParams] = useState({});

  const logsEndRef = useRef(null);

  // Hook into window for global log captures from PatientCopilot
  useEffect(() => {
    window.logMcpTransaction = (direction, message, payload) => {
      addLog(direction, message, payload);
    };

    // Auto connect or check on mount
    checkConnection();

    return () => {
      window.logMcpTransaction = null;
    };
  }, []);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (direction, message, payload) => {
    const newEntry = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toLocaleTimeString(),
      direction, // 'in' (request), 'out' (response), 'sys' (system info/error)
      message,
      payload
    };
    setLogs(prev => [...prev, newEntry]);
  };

  const checkConnection = async () => {
    setIsConnecting(true);
    addLog('sys', 'Probing MCP server endpoint...', null);
    try {
      // Direct request probe
      const res = await fetch(postUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'initialize',
          params: {},
          id: 1
        })
      });
      if (res.ok) {
        setIsConnected(true);
        addLog('sys', 'Connected to MCP Server successfully via REST proxy.', null);
        
        // Load capabilities
        fetchCapabilities();
      } else {
        setIsConnected(false);
        addLog('sys', 'Server returned error status. Running in local simulation mode.', null);
      }
    } catch (e) {
      setIsConnected(false);
      addLog('sys', 'MCP server is offline. Defaulting to Client-Side Simulation Mode.', null);
    } finally {
      setIsConnecting(false);
    }
  };

  const fetchCapabilities = async () => {
    try {
      // Fetch Tools
      const toolsRes = await fetch(postUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', method: 'tools/list', params: {}, id: 2 })
      });
      const toolsJSON = await toolsRes.json();
      if (toolsJSON.result?.tools) {
        setTools(toolsJSON.result.tools);
        if (toolsJSON.result.tools.length > 0) setSelectedTool(toolsJSON.result.tools[0]);
      }

      // Fetch Resources
      const resRes = await fetch(postUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', method: 'resources/list', params: {}, id: 3 })
      });
      const resJSON = await resRes.json();
      if (resJSON.result?.resources) {
        setResources(resJSON.result.resources);
        if (resJSON.result.resources.length > 0) setSelectedResource(resJSON.result.resources[0]);
      }

      // Fetch Prompts
      const promptsRes = await fetch(postUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', method: 'prompts/list', params: {}, id: 4 })
      });
      const promptsJSON = await promptsRes.json();
      if (promptsJSON.result?.prompts) {
        setPrompts(promptsJSON.result.prompts);
        if (promptsJSON.result.prompts.length > 0) setSelectedPrompt(promptsJSON.result.prompts[0]);
      }
    } catch (e) {
      addLog('sys', 'Failed to fetch full remote capabilities. Using fallback listings.', null);
      // Fallback local schema details
      setTools([
        { name: 'get_patient_vitals', description: 'Retrieve latest vitals for patient ID.', inputSchema: { properties: { patientId: { type: 'string' } } } },
        { name: 'check_symptoms', description: 'Perform symptom check triage.', inputSchema: { properties: { symptomKey: { type: 'string' }, language: { type: 'string' } } } },
        { name: 'find_hospitals', description: 'Search for matched medical clinics.', inputSchema: { properties: { specialty: { type: 'string' } } } }
      ]);
    }
  };

  const handleRunTool = async () => {
    if (!selectedTool) return;
    addLog('in', `Invoking tool manually: ${selectedTool.name}`, { method: 'tools/call', params: { name: selectedTool.name, arguments: toolParams } });
    
    try {
      let resJSON;
      if (isConnected) {
        const response = await fetch(postUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'tools/call',
            params: {
              name: selectedTool.name,
              arguments: toolParams
            },
            id: Date.now()
          })
        });
        resJSON = await response.json();
      } else {
        // Simulated response
        resJSON = {
          jsonrpc: '2.0',
          result: {
            content: [{ type: 'text', text: `[Simulation Result] Successfully called '${selectedTool.name}' with arguments: ${JSON.stringify(toolParams)}` }]
          },
          id: Date.now()
        };
      }
      
      addLog('out', `Response received for: ${selectedTool.name}`, resJSON);
    } catch (e) {
      addLog('sys', `Error executing tool: ${e.message}`, null);
    }
  };

  const handleReadResource = async () => {
    if (!selectedResource) return;
    addLog('in', `Reading resource: ${selectedResource.uri}`, { method: 'resources/read', params: { uri: selectedResource.uri } });
    
    try {
      let resJSON;
      if (isConnected) {
        const response = await fetch(postUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'resources/read',
            params: { uri: selectedResource.uri },
            id: Date.now()
          })
        });
        resJSON = await response.json();
      } else {
        resJSON = {
          jsonrpc: '2.0',
          result: {
            contents: [{ uri: selectedResource.uri, mimeType: 'application/json', text: '{\n  "simulated": "data"\n}' }]
          },
          id: Date.now()
        };
      }
      addLog('out', `Resource data retrieved: ${selectedResource.uri}`, resJSON);
    } catch (e) {
      addLog('sys', `Error reading resource: ${e.message}`, null);
    }
  };

  const copyLogs = () => {
    navigator.clipboard.writeText(JSON.stringify(logs, null, 2));
    addLog('sys', 'JSON-RPC logs copied to clipboard.', null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)] overflow-hidden text-slate-800">
      {/* Left panel: Connection & Schema explorer */}
      <div className="lg:col-span-1 flex flex-col gap-6 overflow-y-auto pr-1">
        {/* SSE Connect card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-premium p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <RefreshCw className="w-5 h-5 text-primary-600 animate-spin-slow" />
            <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wide">MCP Node Settings</h4>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">SSE Target Connection</label>
              <input 
                type="text" 
                value={sseUrl} 
                onChange={(e) => setSseUrl(e.target.value)}
                className="w-full mt-1.5 px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">JSON-RPC Endpoint (POST)</label>
              <input 
                type="text" 
                value={postUrl} 
                onChange={(e) => setPostUrl(e.target.value)}
                className="w-full mt-1.5 px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="flex items-center gap-1.5 text-xs font-bold">
                {isConnected ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-600">Online</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-amber-500" />
                    <span className="text-amber-500">Simulation Fallback</span>
                  </>
                )}
              </div>
              <button
                onClick={checkConnection}
                disabled={isConnecting}
                className="bg-primary-600 hover:bg-primary-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-md transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                {isConnecting ? "Probing..." : "Test Connection"}
              </button>
            </div>
          </div>
        </div>

        {/* Capabilities card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-premium p-5 space-y-4 flex-1 flex flex-col min-h-[300px]">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Database className="w-5 h-5 text-primary-600" />
            <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wide">Server Capabilities</h4>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3.5 text-xs">
            {/* Tools list */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Exposed Tools ({tools.length})</span>
              {tools.length === 0 ? (
                <p className="text-[11px] text-slate-400 italic">No tools loaded. Connect server to inspect.</p>
              ) : (
                <div className="grid grid-cols-1 gap-1">
                  {tools.map(t => (
                    <div 
                      key={t.name}
                      onClick={() => {
                        setSelectedTool(t);
                        setToolParams({});
                        setActiveTab('tools');
                      }}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                        selectedTool?.name === t.name 
                          ? 'border-primary-600 bg-primary-50/25 text-primary-800 font-bold' 
                          : 'border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <span>{t.name}</span>
                      <Code className="w-3.5 h-3.5" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Resources list */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Exposed Resources ({resources.length})</span>
              {resources.length === 0 ? (
                <p className="text-[11px] text-slate-400 italic">No resources loaded.</p>
              ) : (
                <div className="grid grid-cols-1 gap-1">
                  {resources.map(r => (
                    <div 
                      key={r.uri}
                      onClick={() => {
                        setSelectedResource(r);
                        setActiveTab('resources');
                      }}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                        selectedResource?.uri === r.uri 
                          ? 'border-primary-600 bg-primary-50/25 text-primary-800 font-bold' 
                          : 'border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <span className="truncate max-w-[85%]">{r.name || r.uri}</span>
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Developer Console log and Sandbox workspace */}
      <div className="lg:col-span-2 bg-slate-900 rounded-3xl shadow-premium flex flex-col overflow-hidden h-full border border-slate-800">
        {/* Terminal Header Tabs */}
        <div className="flex bg-slate-950 px-4 pt-3 border-b border-slate-800 justify-between items-center">
          <div className="flex gap-2">
            {[
              { id: 'logs', label: 'JSON-RPC Terminal', icon: Terminal },
              { id: 'tools', label: 'Tool Sandbox', icon: Play },
              { id: 'resources', label: 'Resource Reader', icon: Database }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4.5 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 border-t border-x ${
                    activeTab === tab.id 
                      ? 'bg-slate-900 border-slate-800 text-primary-400 font-black' 
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {activeTab === 'logs' && (
            <div className="flex gap-2 pb-2">
              <button 
                onClick={copyLogs}
                className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Copy Terminal logs as JSON"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setLogs([])}
                className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Clear Terminal logs"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Tab content screens */}
        <div className="flex-1 p-5 overflow-y-auto font-mono text-xs text-slate-300">
          
          {/* TAB 1: Live JSON-RPC logs terminal */}
          {activeTab === 'logs' && (
            <div className="space-y-4">
              {logs.length === 0 && (
                <div className="text-slate-500 py-10 text-center space-y-1.5">
                  <Terminal className="w-8 h-8 mx-auto text-slate-700 animate-pulse" />
                  <p>Console standby. Transactions (initialize, tool executions, resource fetches) appear here in JSON-RPC 2.0 format.</p>
                </div>
              )}
              {logs.map((log) => (
                <div key={log.id} className="border-b border-slate-800/80 pb-3.5">
                  <div className="flex items-center gap-2 text-[10px] pb-1">
                    <span className="text-slate-600">{log.timestamp}</span>
                    <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                      log.direction === 'in' 
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' 
                        : log.direction === 'out'
                          ? 'bg-cyan-950 text-cyan-400 border border-cyan-900'
                          : 'bg-slate-800 text-slate-400'
                    }`}>
                      {log.direction === 'in' ? '→ Client Request' : log.direction === 'out' ? '← Server Response' : 'System Message'}
                    </span>
                    <span className="font-extrabold text-slate-400">{log.message}</span>
                  </div>
                  {log.payload && (
                    <pre className="mt-2 p-3 bg-slate-950 rounded-xl overflow-x-auto text-[11px] border border-slate-800 text-cyan-500 leading-normal max-h-64">
                      {JSON.stringify(log.payload, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          )}

          {/* TAB 2: Interactive Tool Sandbox */}
          {activeTab === 'tools' && (
            <div className="space-y-5">
              {!selectedTool ? (
                <p className="text-slate-500 text-center py-6">Select a tool from the left panel to test execution.</p>
              ) : (
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4 font-sans text-sm">
                  <div>
                    <h5 className="font-black text-xs text-primary-400 font-mono">Tools/Call: {selectedTool.name}</h5>
                    <p className="text-xs text-slate-400 mt-1">{selectedTool.description}</p>
                  </div>

                  {/* Dynamic Argument parameters inputs */}
                  <div className="space-y-3.5 border-t border-slate-800/80 pt-3">
                    <span className="text-[10px] font-black text-slate-500 font-mono uppercase tracking-wider block">Parameters</span>
                    
                    {selectedTool.name === 'check_symptoms' && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 block">symptomKey</label>
                        <select
                          value={toolParams.symptomKey || ''}
                          onChange={(e) => setToolParams({ ...toolParams, symptomKey: e.target.value })}
                          className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs w-full text-slate-300 focus:outline-none focus:border-primary-500"
                        >
                          <option value="">-- Choose Symptom --</option>
                          <option value="chest_pain">chest_pain</option>
                          <option value="fever">fever</option>
                          <option value="cough_difficulty_breathing">cough_difficulty_breathing</option>
                        </select>
                      </div>
                    )}

                    {selectedTool.name === 'find_hospitals' && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 block">specialty</label>
                        <input
                          type="text"
                          placeholder="e.g. Cardiology"
                          value={toolParams.specialty || ''}
                          onChange={(e) => setToolParams({ ...toolParams, specialty: e.target.value })}
                          className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs w-full text-slate-300 focus:outline-none focus:border-primary-500"
                        />
                      </div>
                    )}

                    {selectedTool.name === 'get_patient_vitals' && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 block">patientId</label>
                        <input
                          type="text"
                          placeholder="e.g. amit-sharma"
                          value={toolParams.patientId || ''}
                          onChange={(e) => setToolParams({ ...toolParams, patientId: e.target.value })}
                          className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs w-full text-slate-300 focus:outline-none focus:border-primary-500"
                        />
                      </div>
                    )}

                    {selectedTool.name === 'interpret_report' && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 block">reportKey</label>
                        <input
                          type="text"
                          placeholder="e.g. lipid_hba1c"
                          value={toolParams.reportKey || ''}
                          onChange={(e) => setToolParams({ ...toolParams, reportKey: e.target.value })}
                          className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs w-full text-slate-300 focus:outline-none focus:border-primary-500"
                        />
                      </div>
                    )}

                    {/* Generic Language field */}
                    {['check_symptoms', 'find_hospitals', 'interpret_report'].includes(selectedTool.name) && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 block">language</label>
                        <select
                          value={toolParams.language || 'en'}
                          onChange={(e) => setToolParams({ ...toolParams, language: e.target.value })}
                          className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs w-full text-slate-300 focus:outline-none focus:border-primary-500"
                        >
                          <option value="en">English (en)</option>
                          <option value="hi">Hindi (hi)</option>
                          <option value="bn">Bengali (bn)</option>
                          <option value="ta">Tamil (ta)</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleRunTool}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-extrabold py-3 px-4 rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Run Method (POST JSON-RPC)</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Resource Reader */}
          {activeTab === 'resources' && (
            <div className="space-y-5">
              {!selectedResource ? (
                <p className="text-slate-500 text-center py-6">Select a resource from the left panel to inspect contents.</p>
              ) : (
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4 font-sans text-sm">
                  <div>
                    <span className="text-[10px] font-black text-primary-400 font-mono uppercase tracking-wider block">Resource Details</span>
                    <h5 className="font-extrabold text-sm text-slate-200 mt-1">{selectedResource.name}</h5>
                    <p className="text-xs text-slate-400 mt-0.5 font-mono">{selectedResource.uri}</p>
                    <p className="text-xs text-slate-400 mt-1">{selectedResource.description}</p>
                  </div>

                  <button
                    onClick={handleReadResource}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-extrabold py-3 px-4 rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Database className="w-4 h-4" />
                    <span>Read Resource content (resources/read)</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
