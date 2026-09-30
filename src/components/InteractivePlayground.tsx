import React, { useState } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Calculator, 
  Search, 
  Activity, 
  Terminal, 
  Sparkles,
  Info,
  DollarSign,
  FileText
} from 'lucide-react';
import { simulateMedicalAgent, AgentSimulationResult } from '../utils/agentSimulator';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  result?: AgentSimulationResult;
  timestamp: string;
}

export const InteractivePlayground: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'budget' | 'rag'>('chat');
  const [inputMessage, setInputMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'agent',
      text: "Hello! I am your **Medical Information Agent**.\n\nI am connected to the clinical medical knowledge base via **RAG (HuggingFace + Chroma)** and equipped with a **Medical Budget Tool**.\n\nAsk me about disease treatments, emergency first aid, or medical cost and copay estimates!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);

  // Budget Tool Direct State
  const [budgetQuery, setBudgetQuery] = useState('specialist, blood panel, and lisinopril');
  const [budgetResult, setBudgetResult] = useState<string>('');

  // RAG Direct State
  const [ragQuery, setRagQuery] = useState('hypertension blood pressure');
  const [ragResult, setRagResult] = useState<string>('');

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isThinking) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsThinking(true);

    setTimeout(() => {
      const res = simulateMedicalAgent(query);
      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: res.reply,
        result: res,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, agentMsg]);
      setIsThinking(false);
    }, 600);
  };

  const handleBudgetCalculate = () => {
    const res = simulateMedicalAgent(`cost budget for ${budgetQuery}`);
    const budgetTrace = res.traces.find(t => t.tool === 'medical_budget_calculator');
    setBudgetResult(budgetTrace ? budgetTrace.output : res.reply);
  };

  const handleRagSearch = () => {
    const res = simulateMedicalAgent(ragQuery);
    const ragTrace = res.traces.find(t => t.tool === 'medical_knowledge_search');
    setRagResult(ragTrace ? ragTrace.output : res.reply);
  };

  const sampleQuestions = [
    "What is the first-line medication protocol for hypertension?",
    "What are the emergency first aid steps for severe burns?",
    "Estimate out-of-pocket costs for cataract surgery and specialist consultation.",
    "What is Metformin used for and what are the standard dosages?"
  ];

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Colab Gradio Simulator Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-teal-200">Gradio UI Live Simulator</h3>
            <p className="text-xs text-slate-400">
              Test how your agent acts before running in Google Colab (identical tools & RAG output)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-mono text-emerald-400">Agent Ready</span>
        </div>
      </div>

      {/* Gradio Tabs Frame */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-2 pt-2 gap-1 text-xs">
          <button
            onClick={() => setActiveSubTab('chat')}
            className={`px-4 py-2 font-semibold rounded-t-lg transition-colors flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'chat'
                ? 'bg-white text-teal-900 border-t-2 border-teal-600 border-x border-slate-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bot className="w-4 h-4 text-teal-600" />
            <span>💬 Medical AI Chat Agent</span>
          </button>

          <button
            onClick={() => setActiveSubTab('budget')}
            className={`px-4 py-2 font-semibold rounded-t-lg transition-colors flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'budget'
                ? 'bg-white text-teal-900 border-t-2 border-teal-600 border-x border-slate-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-4 h-4 text-amber-600" />
            <span>💰 Medical Budget Tool</span>
          </button>

          <button
            onClick={() => setActiveSubTab('rag')}
            className={`px-4 py-2 font-semibold rounded-t-lg transition-colors flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'rag'
                ? 'bg-white text-teal-900 border-t-2 border-teal-600 border-x border-slate-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Search className="w-4 h-4 text-blue-600" />
            <span>🔍 Direct RAG Search</span>
          </button>
        </div>

        {/* Tab 1: Chat Interface */}
        {activeSubTab === 'chat' && (
          <div className="p-4 space-y-4">
            {/* Messages Area */}
            <div className="min-h-[380px] max-h-[520px] overflow-y-auto space-y-4 pr-1">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'agent' && (
                    <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 text-xs shadow-xs">
                      <Activity className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 shadow-2xs ${
                      msg.sender === 'user'
                        ? 'bg-teal-600 text-white rounded-br-xs'
                        : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-bl-xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

                    {/* Tool Scratchpad / Traces */}
                    {msg.result && msg.result.traces.length > 0 && (
                      <div className="pt-2 border-t border-slate-200/80 space-y-1.5 mt-2">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-teal-800">
                          <Terminal className="w-3 h-3" />
                          <span>LangChain Tool Traces Executed:</span>
                        </div>
                        {msg.result.traces.map((trace, idx) => (
                          <div
                            key={idx}
                            className="bg-white/90 p-2 rounded border border-slate-200 text-[11px] font-mono text-slate-700 space-y-1"
                          >
                            <span className="text-teal-700 font-bold">⚙️ Tool: {trace.tool}</span>
                            <p className="text-[10px] text-slate-600 truncate">Input: "{trace.input}"</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="text-[10px] opacity-60 text-right">{msg.timestamp}</div>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 text-xs shadow-xs">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isThinking && (
                <div className="flex gap-3 items-center text-xs text-teal-800">
                  <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center text-xs animate-spin">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping"></span>
                    <span>Medical Agent reasoning via Groq LLM & searching vector knowledge...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Sample Questions */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Sample Gradio Prompts:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {sampleQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 transition-colors text-left cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask clinical protocols, first aid, or medical budgets..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isThinking || !inputMessage.trim()}
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Direct Budget Calculator */}
        {activeSubTab === 'budget' && (
          <div className="p-5 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Direct Medical Budget Tool (Step 16)</h4>
              <p className="text-xs text-slate-500">
                Calculates estimated gross costs, standard insurance copays, annual prescription expenses, and financial savings.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Enter Medical Procedures / Prescriptions:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={budgetQuery}
                  onChange={(e) => setBudgetQuery(e.target.value)}
                  placeholder="e.g. mri scan, cataract surgery, lisinopril"
                  className="flex-1 px-3.5 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  onClick={handleBudgetCalculate}
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Calculate Budget
                </button>
              </div>
            </div>

            {budgetResult && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
                  <Calculator className="w-4 h-4 text-teal-600" />
                  <span>Budget Tool Output Breakdown:</span>
                </div>
                <pre className="font-mono text-xs text-slate-700 whitespace-pre-wrap bg-white p-3 rounded-lg border border-slate-200">
                  {budgetResult}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Direct RAG Search */}
        {activeSubTab === 'rag' && (
          <div className="p-5 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Direct Document RAG Search (Step 14 & 15)</h4>
              <p className="text-xs text-slate-500">
                Queries the Chroma vector store using HuggingFace sentence embeddings to retrieve top relevant medical chunks.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Search Query:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={ragQuery}
                  onChange={(e) => setRagQuery(e.target.value)}
                  placeholder="e.g. burns first aid, asthma inhaler, blood pressure"
                  className="flex-1 px-3.5 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  onClick={handleRagSearch}
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Query Chunks
                </button>
              </div>
            </div>

            {ragResult && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
                  <FileText className="w-4 h-4 text-teal-600" />
                  <span>Retrieved Vector Chunks:</span>
                </div>
                <pre className="font-mono text-xs text-slate-700 whitespace-pre-wrap bg-white p-3 rounded-lg border border-slate-200">
                  {ragResult}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
