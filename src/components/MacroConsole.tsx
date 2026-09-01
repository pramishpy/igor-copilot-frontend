"use client";

import React, { useState } from "react";
import { executeScriptDirect } from "@/lib/api";

interface MacroConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshWorkspace: () => void;
}

interface ExecutionLog {
  id: string;
  command: string;
  output: string;
  error?: string | null;
  success: boolean;
  timestamp: number;
}

export const MacroConsole: React.FC<MacroConsoleProps> = ({
  isOpen,
  onClose,
  onRefreshWorkspace,
}) => {
  const [script, setScript] = useState("");
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  if (!isOpen) return null;

  const handleExecute = async () => {
    if (!script.trim() || isExecuting) return;

    setIsExecuting(true);
    const cmd = script.trim();
    try {
      const result = await executeScriptDirect(cmd);
      setLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          command: cmd,
          output: result.output || "Success",
          error: result.error,
          success: result.success,
          timestamp: Date.now(),
        },
        ...prev,
      ]);
      setScript("");
      onRefreshWorkspace();
    } catch (err) {
      setLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          command: cmd,
          output: "",
          error: err instanceof Error ? err.message : "Execution failed",
          success: false,
          timestamp: Date.now(),
        },
        ...prev,
      ]);
    } finally {
      setIsExecuting(false);
    }
  };

  const sampleMacros = [
    "Make/O/N=200 raw_data; raw_data = sin(x/15) + gnoise(0.1); Display raw_data",
    "ModifyGraph rgb=(0,150,255), lsize=2; SetAxis/A",
    "CurveFit/M=2 gauss raw_data",
  ];

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 bg-slate-950/95 border-t border-slate-800 backdrop-blur-xl shadow-2xl max-h-[60vh] flex flex-col transition-all">
      {/* Console Header */}
      <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="font-mono text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Igor Pro Direct IPF Terminal
          </span>
          <span className="text-[10px] text-slate-500 hidden sm:inline font-mono">
            Execute raw macro language commands directly into Igor instance
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLogs([])}
            className="text-slate-400 hover:text-slate-200 text-xs px-2 py-0.5 rounded hover:bg-slate-800 transition-colors"
          >
            Clear Log
          </button>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Editor & Samples */}
      <div className="p-3 border-b border-slate-800/80 bg-slate-900/40 flex flex-col gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto text-[10px] font-mono text-slate-400">
          <span className="text-slate-500 uppercase font-sans font-semibold text-[9px]">
            Templates:
          </span>
          {sampleMacros.map((macro, idx) => (
            <button
              key={idx}
              onClick={() => setScript(macro)}
              className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 hover:border-cyan-500/40 hover:text-cyan-300 transition-all truncate max-w-xs"
              title={macro}
            >
              {macro}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <textarea
            rows={2}
            value={script}
            onChange={(e) => setScript(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleExecute();
              }
            }}
            placeholder="Type IPF commands (e.g. Make/O/N=100 wave0; Display wave0)... Press Ctrl+Enter to run"
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
          />

          <button
            onClick={handleExecute}
            disabled={!script.trim() || isExecuting}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 shadow-md shadow-indigo-500/20"
          >
            {isExecuting ? (
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
            <span>Execute</span>
          </button>
        </div>
      </div>

      {/* Execution Logs */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-48 font-mono text-xs">
        {logs.length === 0 ? (
          <div className="text-center text-slate-500 py-4 text-[11px]">
            No direct commands executed yet. Enter code above to run directly in Igor Pro.
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className={`p-2.5 rounded-lg border flex flex-col gap-1 ${
                log.success
                  ? "bg-slate-900/60 border-slate-800 text-slate-200"
                  : "bg-rose-950/40 border-rose-800/80 text-rose-300"
              }`}
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-cyan-400 font-semibold">{log.command}</span>
                <span className="text-slate-500">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="text-[11px] whitespace-pre-wrap">
                {log.error ? log.error : log.output}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
