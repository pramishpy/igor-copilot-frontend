"use client";

import React from "react";
import { IgorStatus } from "@/types";
import { StatusBadge } from "./StatusBadge";

interface HeaderProps {
  igorStatus: IgorStatus | null;
  isLoadingStatus?: boolean;
  onRefreshStatus?: () => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  onNewChat?: () => void;
  onToggleConsole?: () => void;
  isConsoleOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  igorStatus,
  isLoadingStatus = false,
  onRefreshStatus,
  onToggleSidebar,
  isSidebarOpen = true,
  onNewChat,
  onToggleConsole,
  isConsoleOpen = false,
}) => {
  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-4 flex items-center justify-between flex-shrink-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          title={isSidebarOpen ? "Collapse sidebar" : "Open sidebar"}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-indigo-500/20">
            IC
          </div>
          <div>
            <h1 className="font-bold text-sm text-slate-100 leading-tight">
              Igor Copilot
            </h1>
            <span className="text-[10px] text-slate-400 font-mono">
              WaveMetrics Automation v0.3.0
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <StatusBadge
          status={igorStatus}
          isLoading={isLoadingStatus}
          onRefresh={onRefreshStatus}
        />

        {onToggleConsole && (
          <button
            onClick={onToggleConsole}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isConsoleOpen
                ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
                : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
            }`}
            title="Toggle Direct IPF Macro Terminal"
          >
            <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>IPF Terminal</span>
          </button>
        )}

        <button
          onClick={onNewChat}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-sm transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New Chat</span>
        </button>
      </div>
    </header>
  );
};
