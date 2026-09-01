"use client";

import React, { useState } from "react";
import { ChatSession, IgorStatus } from "@/types";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  sessions: ChatSession[];
  currentSessionId: string;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
  igorStatus: IgorStatus | null;
  onRefreshIgor: () => void;
  onInspectWave?: (waveName: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  sessions,
  currentSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  igorStatus,
  onRefreshIgor,
  onInspectWave,
}) => {
  const [activeTab, setActiveTab] = useState<"sessions" | "explorer">("explorer");
  const [waveSearch, setWaveSearch] = useState("");

  const filteredWaves = (igorStatus?.activeWaves || []).filter((w) =>
    w.toLowerCase().includes(waveSearch.toLowerCase())
  );

  return (
    <aside
      className={`fixed sm:relative z-40 h-full transition-all duration-300 ease-in-out flex flex-col glass-panel border-r border-slate-800 ${
        isOpen ? "w-80 translate-x-0" : "w-0 -translate-x-full sm:w-0 sm:translate-x-0 overflow-hidden"
      }`}
    >
      {/* Sidebar Header & Tab Switcher */}
      <div className="p-3 border-b border-slate-800 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded bg-indigo-600 flex items-center justify-center font-bold text-[10px] text-white">
              IP
            </div>
            <span className="font-semibold text-xs tracking-tight text-slate-200">
              Workspace Manager
            </span>
          </div>

          <button
            onClick={onToggle}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-md hover:bg-slate-800"
            title="Collapse Sidebar"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex p-0.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs">
          <button
            onClick={() => setActiveTab("explorer")}
            className={`flex-1 py-1 px-2 rounded-md font-medium text-[11px] transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "explorer"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7M4 7c0-2 1-3 3-3h10c2 0 3 1 3 3M4 7h16" />
            </svg>
            <span>Igor Explorer</span>
          </button>

          <button
            onClick={() => setActiveTab("sessions")}
            className={`flex-1 py-1 px-2 rounded-md font-medium text-[11px] transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "sessions"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span>Sessions</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Igor Pro Workspace Explorer */}
      {activeTab === "explorer" && (
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Active Igor State Card */}
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-300 text-[11px]">COM Status</span>
              <button
                onClick={onRefreshIgor}
                className="text-slate-400 hover:text-cyan-400 text-[10px] flex items-center gap-1"
                title="Refresh from Igor Pro"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  igorStatus?.connected ? "bg-emerald-400 pulse-live" : "bg-rose-500"
                }`}
              />
              <span className="text-slate-200 font-mono text-[11px]">
                {igorStatus?.connected ? "Igor Pro 9 / Active" : "Disconnected"}
              </span>
            </div>
          </div>

          {/* Active Data Folders */}
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-1">
              Data Folders
            </span>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-900 space-y-1">
              {(igorStatus?.dataFolders || ["root:"]).map((folder, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
                  <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  </svg>
                  <span>{folder}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Waves Browser */}
          <div className="space-y-1.5 flex-1 flex flex-col">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Active Waves ({igorStatus?.activeWaves?.length || 0})
              </span>
            </div>

            <input
              type="text"
              placeholder="Search waves..."
              value={waveSearch}
              onChange={(e) => setWaveSearch(e.target.value)}
              className="w-full px-2.5 py-1 text-xs rounded-md bg-slate-950/90 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />

            <div className="space-y-1 max-h-64 overflow-y-auto">
              {filteredWaves.length > 0 ? (
                filteredWaves.map((wave, idx) => (
                  <button
                    key={idx}
                    onClick={() => onInspectWave?.(wave)}
                    className="w-full text-left px-2 py-1.5 rounded-md hover:bg-slate-800/60 flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <svg className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span className="text-xs font-mono text-slate-300 group-hover:text-cyan-300 truncate">
                        {wave}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      Inspect
                    </span>
                  </button>
                ))
              ) : (
                <div className="p-3 text-center text-xs text-slate-500 font-mono">
                  No waves found
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Sessions List */}
      {activeTab === "sessions" && (
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <button
            onClick={onNewSession}
            className="w-full py-2 px-3 rounded-lg bg-indigo-600/20 border border-indigo-500/40 hover:bg-indigo-600/30 text-indigo-300 text-xs font-medium flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Conversation</span>
          </button>

          <div className="space-y-1 mt-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer text-xs transition-colors ${
                  session.id === currentSessionId
                    ? "bg-slate-800 text-slate-100 border border-slate-700"
                    : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <svg className="w-3.5 h-3.5 flex-shrink-0 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="truncate font-medium">{session.title}</span>
                </div>

                {sessions.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    title="Delete Session"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};
