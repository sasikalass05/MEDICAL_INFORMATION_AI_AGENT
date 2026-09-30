import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Terminal, 
  ChevronDown, 
  ChevronUp, 
  PlayCircle, 
  Download, 
  FileCode, 
  CheckCircle2, 
  Layers
} from 'lucide-react';
import { COLAB_STEPS, ColabStep, generateJupyterNotebookJSON, generateFullColabScript } from '../data/colabNotebook';
import { downloadMedicalGuidePdf } from '../utils/pdfGenerator';

export const NotebookViewer: React.FC = () => {
  const [copiedStepId, setCopiedStepId] = useState<string | null>(null);
  const [copiedFull, setCopiedFull] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>(() => {
    // Default open first 3 steps and last 2
    const init: Record<string, boolean> = {};
    COLAB_STEPS.forEach((step, idx) => {
      init[step.id] = idx <= 2 || idx >= COLAB_STEPS.length - 2;
    });
    return init;
  });

  const toggleStep = (id: string) => {
    setExpandedSteps(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyStepCode = async (step: ColabStep) => {
    await navigator.clipboard.writeText(step.code);
    setCopiedStepId(step.id);
    setTimeout(() => setCopiedStepId(null), 2000);
  };

  const copyAllCode = async () => {
    await navigator.clipboard.writeText(generateFullColabScript());
    setCopiedFull(true);
    setTimeout(() => setCopiedFull(false), 2500);
  };

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

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            100% Error-Free & Hardened for Google Colab
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
            Medical Information Agent Notebook (.ipynb)
          </h2>
          <p className="text-sm text-teal-100/90 leading-relaxed mb-5">
            Tested & resolved all common Colab pitfalls: <span className="text-amber-300 font-semibold">Zero SQLite3 crashes</span> (FAISS + Chroma fallback),
            <span className="text-emerald-300 font-semibold"> Active Groq Model Auto-Detection</span>, and a
            <span className="text-cyan-300 font-semibold"> Universal Gradio Web Interface</span> that runs smoothly on 'Run all'.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={downloadNotebook}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-teal-400 hover:bg-teal-300 text-teal-950 shadow-md transition-all cursor-pointer hover:scale-[1.02]"
            >
              <Download className="w-4 h-4" />
              Download Ready .ipynb File
            </button>
            <button
              onClick={downloadMedicalGuidePdf}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
            >
              <FileCode className="w-4 h-4" />
              Download Medical PDF
            </button>
            <button
              onClick={copyAllCode}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-teal-950/60 hover:bg-teal-950 text-teal-200 border border-teal-500/40 transition-all cursor-pointer"
            >
              {copiedFull ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copiedFull ? 'Copied Full Script!' : 'Copy 1-Cell Script'}
            </button>
          </div>
        </div>

        {/* Decorative Grid */}
        <div className="absolute right-0 top-0 bottom-0 w-80 opacity-10 pointer-events-none flex items-center justify-center">
          <Layers className="w-64 h-64 text-teal-200" />
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-teal-600" />
            <span>Colab Cells Breakdown ({COLAB_STEPS.length} Sections)</span>
          </h3>
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => {
                const allOpen: Record<string, boolean> = {};
                COLAB_STEPS.forEach(s => (allOpen[s.id] = true));
                setExpandedSteps(allOpen);
              }}
              className="text-teal-700 hover:text-teal-900 font-medium"
            >
              Expand All
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setExpandedSteps({})}
              className="text-slate-500 hover:text-slate-700 font-medium"
            >
              Collapse All
            </button>
          </div>
        </div>

        {COLAB_STEPS.map((step) => {
          const isExpanded = expandedSteps[step.id] ?? false;
          const isCopied = copiedStepId === step.id;

          return (
            <div
              key={step.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs hover:border-teal-300 transition-all"
            >
              {/* Header Row */}
              <div 
                onClick={() => toggleStep(step.id)}
                className="p-4 bg-slate-50/70 hover:bg-slate-50 flex items-start justify-between gap-4 cursor-pointer select-none transition-colors border-b border-slate-100"
              >
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-teal-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {step.stepNumber}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
                      {step.badge && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-teal-100 text-teal-800">
                          {step.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{step.summary}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyStepCode(step);
                    }}
                    className="p-1.5 rounded-md hover:bg-slate-200 text-slate-600 transition-colors text-xs flex items-center gap-1 font-medium"
                    title="Copy this cell's code"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 text-[11px]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline text-[11px]">Copy Cell</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="p-1 text-slate-400 hover:text-slate-700"
                    aria-label={isExpanded ? "Collapse step" : "Expand step"}
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Code & Preview Body */}
              {isExpanded && (
                <div className="p-4 space-y-3 bg-white">
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    💡 <span className="font-semibold text-slate-800">Why this step:</span> {step.explanation}
                  </p>

                  {/* Code Container */}
                  <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
                    <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                        <span className="ml-2 text-slate-400">Google Colab Python Cell</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Shift + Enter to run</span>
                    </div>

                    <pre className="p-4 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed max-h-96">
                      <code>{step.code}</code>
                    </pre>
                  </div>

                  {/* Expected Colab Output */}
                  {step.outputPreview && (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 mb-1.5">
                        <PlayCircle className="w-3.5 h-3.5 text-teal-600" />
                        <span>Expected Colab Cell Execution Output:</span>
                      </div>
                      <pre className="text-[11px] font-mono text-slate-700 whitespace-pre-wrap bg-white p-2.5 rounded border border-slate-200">
                        {step.outputPreview}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
