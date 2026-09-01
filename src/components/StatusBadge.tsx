"use client";

import React from "react";
import { IgorStatus } from "@/types";

interface StatusBadgeProps {
  status: IgorStatus | null;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  isLoading = false,
  onRefresh,
}) => {
  const isConnected = status?.connected ?? false;

  return (
    <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-sm">
      <div className="relative flex items-center justify-center">
        {isConnected ? (
          <>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 pulse-live" />
            <span className="sr-only">Connected</span>
          </>
        ) : (
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
        )}
      </div>

      <div className="flex items-center gap-1.5 text-xs">
        <span className="font-medium text-slate-300">
          {isConnected ? "Igor Pro Connected" : "Igor Pro Offline"}
        </span>
        {status?.activeWaves && status.activeWaves.length > 0 && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {status.activeWaves.length} waves
          </span>
        )}
      </div>

      {onRefresh && (
        <button
          onClick={onRefresh}
          disabled={isLoading}
          title="Refresh Igor connection status"
          className="ml-1 text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-50"
        >
          <svg
            className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      )}
    </div>
  );
};
