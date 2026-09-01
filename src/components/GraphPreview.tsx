"use client";

import React, { useState } from "react";

interface GraphPreviewProps {
  graphUrl: string;
}

export const GraphPreview: React.FC<GraphPreviewProps> = ({ graphUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const fullUrl = graphUrl.startsWith("http")
    ? graphUrl
    : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}${graphUrl}`;

  return (
    <>
      <div className="my-3 rounded-lg border border-slate-700/80 bg-slate-950 overflow-hidden shadow-xl max-w-lg">
        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span className="font-medium text-slate-200">Igor Pro Graph Output</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOpen(true)}
              className="text-slate-400 hover:text-cyan-400 transition-colors text-[11px] flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
              </svg>
              <span>Expand</span>
            </button>
            <a
              href={fullUrl}
              download="igor_graph.png"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-cyan-400 transition-colors text-[11px] flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Save</span>
            </a>
          </div>
        </div>

        <div
          className="relative bg-slate-900/50 p-2 flex items-center justify-center cursor-pointer hover:opacity-95 transition-opacity"
          onClick={() => setIsOpen(true)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fullUrl}
            alt="Igor Pro Graph Output"
            className="max-h-72 w-auto object-contain rounded border border-slate-800"
          />
        </div>
      </div>

      {/* Modal Zoom Lightbox */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div className="relative max-w-5xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl p-2 flex flex-col">
            <div className="flex justify-between items-center px-4 py-2 border-b border-slate-800">
              <span className="font-semibold text-slate-200 text-sm">Igor Pro Graph Preview</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 flex items-center justify-center overflow-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fullUrl}
                alt="Igor Pro Graph Enlarged"
                className="max-h-[75vh] w-auto object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
