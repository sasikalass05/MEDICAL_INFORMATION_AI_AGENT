import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  ExternalLink, 
  Copy, 
  Check, 
  Activity, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { generateJupyterNotebookJSON, generateFullColabScript } from '../data/colabNotebook';
import { downloadMedicalGuidePdf } from '../utils/pdfGenerator';

import { README_MARKDOWN } from '../data/readmeContent';

interface HeaderProps {
  activeTab: 'notebook' | 'playground' | 'guide';
  setActiveTab: (tab: 'notebook' | 'playground' | 'guide') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedReadme, setCopiedReadme] = useState(false);

  const handleCopyReadme = async () => {
    await navigator.clipboard.writeText(README_MARKDOWN);
    setCopiedReadme(true);
    setTimeout(() => setCopiedReadme(false), 2500);
  };

  const handleDownloadNotebook = () => {
    const jsonStr = generateJupyterNotebookJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'medical_information_agent.ipynb';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyScript = async () => {
    const script = generateFullColabScript();
    await navigator.clipboard.writeText(script);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <header className="border-b border-teal-100 bg-white sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Logo & Agent Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm shadow-teal-200">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  Medical Information Agent
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Google Colab Ready
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-50 text-cyan-800 border border-cyan-200">
                  Groq + LangChain + Gradio
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Autonomous Healthcare Agent with RAG PDF Search, Medical Budget Estimator & Public Gradio UI
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadNotebook}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-colors cursor-pointer"
              title="Download Jupyter Notebook (.ipynb) to upload directly to Colab"
            >
              <Download className="w-3.5 h-3.5" />
              Download .ipynb
            </button>

            <button
              onClick={downloadMedicalGuidePdf}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 transition-colors cursor-pointer"
              title="Download clinical medical knowledge reference PDF"
            >
              <FileText className="w-3.5 h-3.5" />
              Download PDF
            </button>

            <button
              onClick={handleCopyScript}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors cursor-pointer"
              title="Copy monolithic 1-cell python code"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied Python!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy 1-Click Code
                </>
              )}
            </button>

            <button
              onClick={handleCopyReadme}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
              title="Copy clean GitHub README markdown (no images) to paste on GitHub"
            >
              {copiedReadme ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied Clean README!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Clean README</span>
                </>
              )}
            </button>

            <a
              href="https://colab.research.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500 hover:bg-amber-600 text-white transition-colors"
            >
              <span>Open Colab</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 mt-3 border-t border-slate-100 pt-2.5">
          <button
            onClick={() => setActiveTab('notebook')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'notebook'
                ? 'bg-teal-100/80 text-teal-900 border border-teal-300'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Colab Notebook Code & Steps (13 Steps)</span>
          </button>

          <button
            onClick={() => setActiveTab('playground')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'playground'
                ? 'bg-teal-100/80 text-teal-900 border border-teal-300'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Live Agent & Gradio Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-teal-100/80 text-teal-900 border border-teal-300'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>How to Run in Google Colab (Step-by-Step)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
