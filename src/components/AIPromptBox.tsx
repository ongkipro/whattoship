'use client';

import { useState } from 'react';
import { Copy, Check, Sparkles } from 'lucide-react';

interface AIPromptBoxProps {
  prompt: string;
  title?: string;
}

export default function AIPromptBox({ prompt, title }: AIPromptBoxProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = prompt;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xs overflow-hidden my-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3.5 sm:py-3 bg-slate-50 border-b border-slate-200/80">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-800">
            Ready-to-Use AI Starter Prompt {title ? `• ${title}` : ''}
          </span>
        </div>

        <button
          onClick={handleCopy}
          aria-label="Copy AI prompt to clipboard"
          className={`flex items-center justify-center gap-1.5 px-3.5 py-2 sm:py-1.5 min-h-[44px] sm:min-h-[34px] rounded-full text-xs font-medium transition-all active:scale-95 touch-manipulation shrink-0 ${
            copied
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 border border-slate-200 shadow-2xs'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Copy AI Prompt</span>
            </>
          )}
        </button>
      </div>

      {/* Code / Prompt Body */}
      <div className="p-4 sm:p-5 font-mono text-xs sm:text-sm text-slate-700 bg-slate-50/50 leading-relaxed overflow-x-auto whitespace-pre-wrap break-words select-all">
        {prompt}
      </div>

      {/* Clean Utility Footer */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200/80 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Ready to paste directly into your IDE or LLM assistant.</span>
        <span className="font-mono text-[10px] text-slate-400">MARKDOWN</span>
      </div>
    </div>
  );
}
