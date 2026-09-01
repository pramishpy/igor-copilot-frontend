"use client";

import React, { useState } from "react";
import { ToolCallTraceItem } from "@/types";

interface ToolTraceProps {
  traces: ToolCallTraceItem[];
}

export const ToolTrace: React.FC<ToolTraceProps> = ({ traces }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!traces || traces.length === 0) return null;

  return (
    <div className="my-2 rounded-lg border border-slate-800 bg-slate-900/60 overflow-hidden text-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-slate-300 hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
          </span>
          <span className="font-medium text-indigo-300">
            {traces.length} Igor Pro {traces.length === 1 ? "Action" : "Actions"} Executed
          </span>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <span>{isOpen ? "Hide Steps" : "View Steps"}</span>
          <svg
            className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="p-3 border-t border-slate-800/80 space-y-2 bg-slate-950/40">
          {traces.map((trace, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-md bg-slate-900/90 border border-slate-800 flex flex-col gap-1.5 font-mono text-[11px]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
                    Turn {trace.turn}
                  </span>
                  <span className="font-semibold text-cyan-400">{trace.tool}()</span>
                </div>
                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  success
                </span>
              </div>

              {Object.keys(trace.args).length > 0 && (
                <div className="text-slate-300 bg-slate-950/80 p-1.5 rounded border border-slate-900 overflow-x-auto">
                  <span className="text-slate-500">args: </span>
                  {JSON.stringify(trace.args, null, 2)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
