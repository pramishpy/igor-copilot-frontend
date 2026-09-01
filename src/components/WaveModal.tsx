"use client";

import React, { useState, useEffect } from "react";
import { WaveInfo } from "@/types";
import { fetchWaveData } from "@/lib/api";

interface WaveModalProps {
  waveName: string | null;
  onClose: () => void;
  onAction: (prompt: string) => void;
  onExecuteScript: (script: string) => void;
}

export const WaveModal: React.FC<WaveModalProps> = ({
  waveName,
  onClose,
  onAction,
  onExecuteScript,
}) => {
  const [waveInfo, setWaveInfo] = useState<WaveInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!waveName) return;

    let isMounted = true;
    const loadWave = async () => {
      try {
        const data = await fetchWaveData(waveName);
        if (isMounted) {
          setWaveInfo(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setWaveInfo({
            name: waveName,
            info: "",
            exists: false,
            error: err instanceof Error ? err.message : "Failed to load wave info",
          });
          setLoading(false);
        }
      }
    };

    loadWave();

    return () => {
      isMounted = false;
    };
  }, [waveName]);

  if (!waveName) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100 font-mono">
                {waveName}
              </h3>
              <span className="text-[11px] text-slate-400">Igor Pro Wave Inspector</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {loading ? (
            <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs">
              <span className="w-5 h-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
              <span>Querying Igor Pro COM bridge...</span>
            </div>
          ) : waveInfo?.error ? (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
              {waveInfo.error}
            </div>
          ) : (
            <>
              {/* Properties Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                    Status
                  </span>
                  <span className="font-semibold text-emerald-400 mt-0.5">
                    {waveInfo?.exists ? "Loaded in Memory" : "Not Found"}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                    Location
                  </span>
                  <span className="font-mono text-slate-200 mt-0.5 truncate">
                    root:{waveName}
                  </span>
                </div>
              </div>

              {/* Raw Info Output */}
              {waveInfo?.info && (
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                    WaveInfo String
                  </span>
                  <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-slate-300 font-mono text-xs overflow-x-auto">
                    {waveInfo.info}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                  Autonomous Copilot Actions
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      onAction(`Display wave '${waveName}' in a new graph window with styled axes.`);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-medium flex items-center gap-2 transition-all"
                  >
                    <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                    <span>Plot in Graph</span>
                  </button>

                  <button
                    onClick={() => {
                      onAction(`Fit wave '${waveName}' to a Gaussian curve and report coefficients.`);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 text-cyan-300 text-xs font-medium flex items-center gap-2 transition-all"
                  >
                    <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span>Fit Gaussian</span>
                  </button>

                  <button
                    onClick={() => {
                      onAction(`Calculate statistical summary for wave '${waveName}' (mean, standard deviation, min, max, RMS).`);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-2 transition-all"
                  >
                    <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span>Compute Stats</span>
                  </button>

                  <button
                    onClick={() => {
                      onExecuteScript(`Duplicate/O ${waveName}, ${waveName}_copy`);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-2 transition-all"
                  >
                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Duplicate Wave</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
