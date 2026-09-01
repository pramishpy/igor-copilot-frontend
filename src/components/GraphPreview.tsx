"use client";

import React, { useState } from "react";

interface GraphPreviewProps {
  graphUrl: string;
  onModifyGraph?: (prompt: string) => void;
}

export const GraphPreview: React.FC<GraphPreviewProps> = ({
  graphUrl,
  onModifyGraph,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const fullUrl = graphUrl.startsWith("http")
    ? graphUrl
    : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}${graphUrl}`;

  return (
    <>
      <div className="my-3 rounded-xl border border-slate-700/80 bg-slate-950 overflow-hidden shadow-xl max-w-lg">
        {/* Graph Header */}
        <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="font-semibold text-slate-200">Igor Pro Plot Render</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(true)}
              className="text-slate-400 hover:text-cyan-400 transition-colors text-[11px] flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
              </svg>
              <span>Zoom</span>
            </button>
            <a
              href={fullUrl}
              download="igor_plot.png"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-cyan-400 transition-colors text-[11px] flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download</span>
            </a>
          </div>
        </div>

        {/* Graph Image Display */}
        <div
          className="relative bg-slate-900/50 p-2.5 flex items-center justify-center cursor-pointer group"
          onClick={() => setIsOpen(true)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fullUrl}
            alt="Igor Pro Graph Plot"
            className="max-h-72 w-auto object-contain rounded-lg border border-slate-800 transition-transform group-hover:scale-[1.01]"
          />
        </div>

        {/* Quick Graph Tools Toolbar */}
        {onModifyGraph && (
          <div className="px-3 py-1.5 bg-slate-900/90 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[10px]">
            <span className="text-slate-500 font-semibold uppercase text-[9px]">Tools:</span>
            <button
              onClick={() => onModifyGraph("Add legend and format trace labels in top graph.")}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              + Legend
            </button>
            <button
              onClick={() => onModifyGraph("ModifyGraph grid=1 in top graph.")}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Toggle Grid
            </button>
            <button
              onClick={() => onModifyGraph("SetAxis/A in top graph to autoscale all axes.")}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Autoscale
            </button>
            <button
              onClick={() => onModifyGraph("Re-export the top graph window as high resolution PNG.")}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Re-Export
            </button>
          </div>
        )}
      </div>

      {/* Full-Screen Zoom Lightbox Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl p-2 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-4 py-2 border-b border-slate-800">
              <span className="font-semibold text-slate-200 text-sm">
                Igor Pro Graph Visualizer
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={fullUrl}
                  download="igor_plot_hires.png"
                  className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs flex items-center gap-1 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Save Image</span>
                </a>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4 flex items-center justify-center overflow-auto bg-slate-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fullUrl}
                alt="Igor Pro Graph Fullscreen"
                className="max-h-[75vh] w-auto object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
