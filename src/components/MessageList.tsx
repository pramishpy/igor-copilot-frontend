"use client";

import React, { useEffect, useRef } from "react";
import { ChatMessage } from "@/types";
import { MessageItem } from "./MessageItem";

interface MessageListProps {
  messages: ChatMessage[];
  onSelectPrompt?: (prompt: string) => void;
  onExecuteScript?: (script: string) => void;
  isExecutingScript?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  onSelectPrompt,
  onExecuteScript,
  isExecutingScript = false,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const quickPrompts = [
    {
      title: "Generate Sine Wave & Plot",
      prompt: "Create a 200-point sine wave named 'sine_wave' and display it in a graph window.",
      category: "Wave Creation",
    },
    {
      title: "Fit Gaussian Curve",
      prompt: "Fit the active wave to a Gaussian curve and report the fit coefficients.",
      category: "Data Analysis",
    },
    {
      title: "Export Top Graph Image",
      prompt: "Render and export the top graph window as a PNG image.",
      category: "Visualization",
    },
    {
      title: "List Active Waves & Folders",
      prompt: "List all active waves and data folder hierarchy in this experiment.",
      category: "Inspection",
    },
  ];

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30 flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/10">
          <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-slate-100 mb-2">
          WaveMetrics Igor Pro AI Copilot
        </h2>
        <p className="text-sm text-slate-400 max-w-md mb-8">
          Operate Igor Pro with natural language. Generate IPF code, execute curve fits, manipulate waves, and view rendered graphs in real time.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl w-full">
          {quickPrompts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onSelectPrompt?.(item.prompt)}
              className="flex flex-col items-start p-3 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-800/60 transition-all text-left group"
            >
              <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 mb-1">
                {item.category}
              </span>
              <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                {item.title}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                {item.prompt}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-2">
      {messages.map((msg) => (
        <MessageItem
          key={msg.id}
          message={msg}
          onExecuteScript={onExecuteScript}
          isExecutingScript={isExecutingScript}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};
