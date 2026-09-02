"use client";

import React, { useState, useEffect } from "react";

interface ThinkingTraceProps {
  thoughts: string[];
  isStreaming?: boolean;
}

export const ThinkingTrace: React.FC<ThinkingTraceProps> = ({
  thoughts,
  isStreaming = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      setSeconds((prev) => +(prev + 0.1).toFixed(1));
    }, 100);
    return () => clearInterval(interval);
  }, [isStreaming]);

  if (!thoughts || thoughts.length === 0) return null;

  return (
    <div className="mb-3 rounded-xl border border-violet-500/30 bg-violet-950/15 backdrop-blur-md overflow-hidden shadow-lg transition-all">
      {/* Accordion Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3.5 py-2 flex items-center justify-between bg-violet-950/30 hover:bg-violet-950/40 text-left transition-colors"
      >
        <div className="flex items-center gap-2">
          {/* Animated Brain Icon */}
          <div className="w-5 h-5 rounded-md bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-violet-300">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>

          <span className="text-xs font-semibold text-violet-200">
            {isStreaming ? "Thinking & Reasoning..." : `Thought Process (${thoughts.length} steps)`}
          </span>

          {isStreaming && (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          {isStreaming && (
            <span className="text-[10px] font-mono text-violet-400">
              {seconds.toFixed(1)}s
            </span>
          )}

          <svg
            className={`w-4 h-4 text-violet-400 transform transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded Thought Bullets */}
      {isExpanded && (
        <div className="p-3 border-t border-violet-500/20 space-y-1.5 font-mono text-[11px] max-h-56 overflow-y-auto">
          {thoughts.map((step, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 text-violet-200/90 animate-fade-in"
            >
              <div className="mt-0.5 text-violet-400 flex-shrink-0">
                {idx === thoughts.length - 1 && isStreaming ? (
                  <span className="inline-block w-2.5 h-2.5 rounded-full border-2 border-violet-400 border-t-transparent animate-spin" />
                ) : (
                  <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span className="leading-relaxed whitespace-pre-wrap">{step}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
