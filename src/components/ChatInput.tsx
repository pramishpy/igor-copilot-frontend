"use client";

import React, { useState, useRef, useEffect } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  onStop?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading = false,
  onStop,
}) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        180
      )}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    onSendMessage(input.trim());
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const commandChips = [
    "Make/O/N=100 test_wave",
    "Display test_wave",
    "CurveFit gauss test_wave",
    "SavePICT/E=-5 as plot.png",
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col gap-2">
      {/* Quick Macro Suggestions */}
      <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono">
        <span className="text-slate-500 text-[10px] uppercase font-sans">Quick:</span>
        {commandChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => setInput((prev) => (prev ? `${prev}; ${chip}` : chip))}
            className="px-2 py-0.5 rounded-md bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/30 transition-all flex-shrink-0"
          >
            {chip}
          </button>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative rounded-2xl bg-slate-900/90 border border-slate-800 focus-within:border-indigo-500/60 shadow-xl backdrop-blur-md transition-all flex flex-col p-2"
      >
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Igor Copilot (e.g. 'Create a 100-point sine wave and fit to Gaussian')..."
          className="w-full bg-transparent px-3 py-1.5 text-sm text-slate-100 placeholder-slate-500 resize-none focus:outline-none max-h-44 font-sans"
        />

        <div className="flex items-center justify-between pt-2 px-2 text-xs border-t border-slate-800/40">
          <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Shift+Enter</kbd> for newline
          </span>

          <div className="flex items-center gap-2 ml-auto">
            {isLoading ? (
              <button
                type="button"
                onClick={onStop}
                className="flex items-center gap-1 px-3 py-1 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white font-medium text-xs transition-colors shadow-sm"
              >
                <span className="w-2 h-2 rounded-sm bg-white" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="flex items-center justify-center p-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white transition-all disabled:opacity-40 disabled:hover:from-indigo-600 disabled:hover:to-cyan-600 shadow-md shadow-indigo-500/20"
                title="Send Message"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
