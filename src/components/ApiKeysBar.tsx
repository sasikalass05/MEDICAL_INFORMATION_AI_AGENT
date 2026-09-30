import React, { useState } from 'react';
import { Key, Eye, EyeOff, Copy, Check, ShieldCheck } from 'lucide-react';
import { GROQ_API_KEY_DEFAULT, TAVILY_API_KEY_DEFAULT } from '../data/colabNotebook';

export const ApiKeysBar: React.FC = () => {
  const [showKeys, setShowKeys] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const mask = (str: string) => (showKeys ? str : `${str.slice(0, 8)}...${str.slice(-4)}`);

  return (
    <div className="bg-gradient-to-r from-teal-50/70 via-white to-cyan-50/70 border-b border-teal-100/60 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-teal-900 font-medium">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>Configured API Credentials (Injected into Colab Notebook):</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Groq Key Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs">
            <Key className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-semibold text-slate-900">Groq:</span>
            <code className="font-mono text-slate-600">{mask(GROQ_API_KEY_DEFAULT)}</code>
            <button
              onClick={() => copyToClipboard(GROQ_API_KEY_DEFAULT, 'groq')}
              className="p-1 hover:text-teal-700 transition-colors"
              title="Copy Groq Key"
            >
              {copiedKey === 'groq' ? (
                <Check className="w-3 h-3 text-emerald-600" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>

          {/* Tavily Key Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs">
            <Key className="w-3.5 h-3.5 text-blue-500" />
            <span className="font-semibold text-slate-900">Tavily:</span>
            <code className="font-mono text-slate-600">{mask(TAVILY_API_KEY_DEFAULT)}</code>
            <button
              onClick={() => copyToClipboard(TAVILY_API_KEY_DEFAULT, 'tavily')}
              className="p-1 hover:text-teal-700 transition-colors"
              title="Copy Tavily Key"
            >
              {copiedKey === 'tavily' ? (
                <Check className="w-3 h-3 text-emerald-600" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>

          {/* Toggle Mask */}
          <button
            onClick={() => setShowKeys(!showKeys)}
            className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors px-2 py-1 rounded"
          >
            {showKeys ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showKeys ? 'Hide' : 'Reveal'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
