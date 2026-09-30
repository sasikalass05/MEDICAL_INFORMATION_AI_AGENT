/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { ApiKeysBar } from './components/ApiKeysBar';
import { NotebookViewer } from './components/NotebookViewer';
import { InteractivePlayground } from './components/InteractivePlayground';
import { ColabGuide } from './components/ColabGuide';

export default function App() {
  const [activeTab, setActiveTab] = useState<'notebook' | 'playground' | 'guide'>('notebook');

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* API Key Bar */}
      <ApiKeysBar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'notebook' && <NotebookViewer />}
        {activeTab === 'playground' && <InteractivePlayground />}
        {activeTab === 'guide' && <ColabGuide />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-700">Medical Information Agent</span> — Built for Google Colab with Groq LLM, LangChain RAG & Gradio
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('guide')}
              className="text-teal-700 hover:text-teal-900 font-medium cursor-pointer"
            >
              Colab Setup Instructions
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('playground')}
              className="text-teal-700 hover:text-teal-900 font-medium cursor-pointer"
            >
              Live Simulator
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
