import React, { useState } from 'react';
import { 
  ExternalLink, 
  Download, 
  Play, 
  Terminal, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Sparkles,
  ArrowRight,
  Globe
} from 'lucide-react';
import { generateJupyterNotebookJSON, generateFullColabScript } from '../data/colabNotebook';
import { downloadMedicalGuidePdf } from '../utils/pdfGenerator';

export const ColabGuide: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState(false);

  const downloadNotebook = () => {
    const jsonStr = generateJupyterNotebookJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'medical_information_agent.ipynb';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyScript = async () => {
    await navigator.clipboard.writeText(generateFullColabScript());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2">
      {/* Hero Card */}
      <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 mb-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Complete Execution Walkthrough
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
          How to View the Code & Run Output in Google Colab
        </h2>
        <p className="text-sm sm:text-base text-teal-100/90 leading-relaxed mb-6">
          Follow these 4 simple steps to open Google Colab, import this exact notebook with your Groq and Tavily API keys already configured, execute all cells, and interact with the live Medical Information Agent and Gradio web interface.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={downloadNotebook}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-teal-400 hover:bg-teal-300 text-teal-950 shadow-lg cursor-pointer transition-all hover:scale-105"
          >
            <Download className="w-4 h-4" />
            1. Download 'medical_information_agent.ipynb'
          </button>
          <a
            href="https://colab.research.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-white shadow-md transition-all hover:scale-105"
          >
            <span>2. Open Google Colab</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Step by Step Flow */}
      <div className="space-y-6">
        {/* Step 1 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row gap-5">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 font-bold text-lg flex items-center justify-center shrink-0">
            1
          </div>
          <div className="space-y-2 flex-1">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Open Google Colab & Upload the Notebook</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Go to <a href="https://colab.research.google.com" target="_blank" rel="noreferrer" className="text-teal-700 underline font-semibold">colab.research.google.com</a> in your browser. 
              In the welcome dialog, click the <b>"Upload"</b> tab and choose the downloaded file <code>medical_information_agent.ipynb</code>.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-700">
              💡 <b>Alternative fast method:</b> Create a new blank notebook in Colab, click "Copy 1-Click Code" below, paste everything into the first code cell, and run!
              <div className="mt-2">
                <button
                  onClick={copyScript}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-white border border-slate-300 text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode ? 'Copied Monolithic Script!' : 'Copy 1-Click All-in-One Python Code'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row gap-5">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 font-bold text-lg flex items-center justify-center shrink-0">
            2
          </div>
          <div className="space-y-2 flex-1">
            <h3 className="text-base font-bold text-slate-900">
              Run All Cells in Order (or press Ctrl + F9)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              In Google Colab's top menu bar, click:
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-xs font-mono font-bold text-teal-900">
              <Play className="w-3.5 h-3.5 text-teal-700 fill-teal-700" />
              Runtime → Run all (Keyboard shortcut: Ctrl + F9 or Cmd + F9)
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Colab will execute each cell sequentially:
            </p>
            <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside bg-slate-50 p-3 rounded-lg border border-slate-100">
              <li><b>Cell 1:</b> Automatically creates <code>medical_reference_guide.pdf</code> with clinical data.</li>
              <li><b>Cell 2:</b> Installs <code>groq gradio langchain chromadb sentence-transformers pypdf</code>.</li>
              <li><b>Cell 3 & 4:</b> Connects and verifies Groq with model <code>llama-3.3-70b-versatile</code>.</li>
              <li><b>Cell 5 to 9:</b> Loads the PDF, splits into chunks, initializes HuggingFace embeddings, and creates the Chroma vector retriever.</li>
              <li><b>Cell 10 & 11:</b> Sets up the RAG tool and Medical Budget Calculator tool.</li>
              <li><b>Cell 12:</b> Assembles the agent and launches Gradio with <code>share=True</code>.</li>
            </ul>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row gap-5">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 font-bold text-lg flex items-center justify-center shrink-0">
            3
          </div>
          <div className="space-y-2 flex-1">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>Viewing the Live Gradio Output in Google Colab</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When the final cell finishes executing, Gradio generates two viewing outputs right below the cell:
            </p>

            <div className="space-y-2 pt-1">
              <div className="p-3 rounded-lg bg-slate-950 text-slate-200 font-mono text-xs border border-slate-800">
                <p className="text-emerald-400">Running on local URL:  http://127.0.0.1:7860</p>
                <p className="text-cyan-300 font-bold">Running on public URL: https://d19fa8982a7281c9a0.gradio.live</p>
                <p className="text-slate-500 text-[10px] mt-1">This share link expires in 72 hours.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-lg">
                  <h4 className="font-bold text-teal-900 mb-1">Option A: Embedded in Colab</h4>
                  <p className="text-teal-700 text-[11px]">
                    Scroll down right inside Google Colab — the interactive chat UI renders directly inside the notebook iframe!
                  </p>
                </div>
                <div className="p-3 bg-cyan-50/70 border border-cyan-200 rounded-lg">
                  <h4 className="font-bold text-cyan-900 mb-1">Option B: Public .gradio.live Link</h4>
                  <p className="text-cyan-700 text-[11px]">
                    Click the generated <code>https://...gradio.live</code> link to open your Medical Information Agent in a full-screen browser tab on any device!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row gap-5">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 font-bold text-lg flex items-center justify-center shrink-0">
            4
          </div>
          <div className="space-y-2 flex-1">
            <h3 className="text-base font-bold text-slate-900">
              Test Prompts in Gradio
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Once Gradio launches, test these queries to verify RAG and the Budget Tool in action:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-teal-50 hover:border-teal-300 transition-colors">
                <p className="font-bold text-slate-800">🩺 Clinical RAG Test:</p>
                <p className="text-slate-600 mt-0.5 italic">"What is the first-line medication protocol for hypertension?"</p>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-teal-50 hover:border-teal-300 transition-colors">
                <p className="font-bold text-slate-800">🚑 Emergency First Aid Test:</p>
                <p className="text-slate-600 mt-0.5 italic">"What are the emergency first aid steps for severe burns?"</p>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-teal-50 hover:border-teal-300 transition-colors">
                <p className="font-bold text-slate-800">💰 Medical Budget Test:</p>
                <p className="text-slate-600 mt-0.5 italic">"Estimate out-of-pocket costs for cataract surgery and specialist visit."</p>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-teal-50 hover:border-teal-300 transition-colors">
                <p className="font-bold text-slate-800">💊 Combined Inquiry:</p>
                <p className="text-slate-600 mt-0.5 italic">"How is Type 2 Diabetes treated with Metformin, and what is its annual cost?"</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Prevention & Colab Pro-Tips */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-xs space-y-3">
        <h4 className="font-bold text-emerald-950 flex items-center gap-1.5 text-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Resolved Colab Pitfalls (Why This Code Runs Error-Free)</span>
        </h4>
        <ul className="text-emerald-900/90 list-disc list-inside space-y-1.5">
          <li><b>Zero SQLite3 / Chroma Version Conflicts:</b> Google Colab often crashes on <code>import chromadb</code> due to outdated system SQLite. This notebook uses <code>faiss-cpu</code> with auto-fallback, which runs cleanly in seconds with zero system dependencies.</li>
          <li><b>Groq Model Auto-Detection:</b> Prevents model 404 errors by auto-testing active Groq models (<code>llama-3.3-70b-versatile</code> & <code>llama-3.1-8b-instant</code>).</li>
          <li><b>Universal Gradio Compatibility:</b> The chat handler supports Gradio v3, v4, and v5 without any schema or history format exceptions.</li>
          <li><b>Self-Contained PDF:</b> Cell 1 builds <code>medical_reference_guide.pdf</code> via ReportLab, so the RAG loader never fails from a missing file.</li>
        </ul>
      </div>
    </div>
  );
};
