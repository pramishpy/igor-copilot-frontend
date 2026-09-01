"use client";

import React, { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  onExecute?: (code: string) => void;
  isExecuting?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = "ipf",
  onExecute,
  isExecuting = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  // Basic syntax formatting for IPF commands
  const highlightIpf = (text: string) => {
    return text.split("\n").map((line, lineIdx) => {
      // Match comments
      if (line.trim().startsWith("//")) {
        return (
          <div key={lineIdx} className="ipf-comment">
            {line}
          </div>
        );
      }

      const tokens = line.split(/(\s+|[();,"])/);
      return (
        <div key={lineIdx} className="leading-relaxed">
          {tokens.map((token, tokenIdx) => {
            if (
              ["Make", "Display", "CurveFit", "AppendToGraph", "ModifyGraph", "SetAxis", "Print", "String", "Variable", "Wave", "Function", "End", "Duplicate"].includes(
                token
              )
            ) {
              return (
                <span key={tokenIdx} className="ipf-command">
                  {token}
                </span>
              );
            }
            if (token.startsWith("/")) {
              return (
                <span key={tokenIdx} className="ipf-flag">
                  {token}
                </span>
              );
            }
            if (/^\d+(\.\d+)?$/.test(token)) {
              return (
                <span key={tokenIdx} className="ipf-number">
                  {token}
                </span>
              );
            }
            if (["sin", "cos", "tan", "exp", "ln", "log", "sqrt", "x", "root"].includes(token)) {
              return (
                <span key={tokenIdx} className="ipf-keyword">
                  {token}
                </span>
              );
            }
            return <span key={tokenIdx}>{token}</span>;
          })}
        </div>
      );
    });
  };

  return (
    <div className="my-3 rounded-lg overflow-hidden border border-cyan-500/20 bg-slate-950/90 shadow-lg">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-900/90 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-500/60" />
          <span className="font-mono font-medium text-cyan-300 uppercase tracking-wider text-[11px]">
            {language}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {onExecute && (
            <button
              onClick={() => onExecute(code)}
              disabled={isExecuting}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-600/80 hover:bg-indigo-600 text-white font-medium text-[11px] transition-colors disabled:opacity-50 shadow-sm"
              title="Run script directly in Igor Pro"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>{isExecuting ? "Executing..." : "Run in Igor"}</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-[11px] transition-colors"
            title="Copy code to clipboard"
          >
            {copied ? (
              <>
                <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-3.5 text-xs font-mono overflow-x-auto text-slate-200">
        {language.toLowerCase() === "ipf" ? highlightIpf(code) : <pre>{code}</pre>}
      </div>
    </div>
  );
};
