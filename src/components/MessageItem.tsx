"use client";

import React from "react";
import { ChatMessage } from "@/types";
import { CodeBlock } from "./CodeBlock";
import { ToolTrace } from "./ToolTrace";
import { GraphPreview } from "./GraphPreview";

interface MessageItemProps {
  message: ChatMessage;
  onExecuteScript?: (script: string) => void;
  isExecutingScript?: boolean;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  onExecuteScript,
  isExecutingScript = false,
}) => {
  const isUser = message.role === "user";

  // Parse text content to extract ```ipf code blocks if present
  const renderFormattedContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        const lines = part.slice(3, -3).trim().split("\n");
        const firstLine = lines[0].trim();
        const hasLang = /^[a-zA-Z0-9_-]+$/.test(firstLine);
        const lang = hasLang ? firstLine : "ipf";
        const code = (hasLang ? lines.slice(1) : lines).join("\n");

        return (
          <CodeBlock
            key={idx}
            code={code}
            language={lang}
            onExecute={onExecuteScript}
            isExecuting={isExecutingScript}
          />
        );
      }

      return (
        <div key={idx} className="whitespace-pre-wrap leading-relaxed">
          {part}
        </div>
      );
    });
  };

  return (
    <div
      className={`flex w-full gap-3.5 my-4 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 font-bold text-xs">
          IC
        </div>
      )}

      <div
        className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`px-4 py-3 rounded-2xl text-sm shadow-sm ${
            isUser
              ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-sm"
              : "bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-sm backdrop-blur-md"
          }`}
        >
          {renderFormattedContent(message.content)}

          {/* Render dedicated IPF scripts if not already in content */}
          {message.ipfScripts && message.ipfScripts.length > 0 && !message.content.includes("```") && (
            <div className="mt-3">
              {message.ipfScripts.map((script, scriptIdx) => (
                <CodeBlock
                  key={scriptIdx}
                  code={script}
                  language="ipf"
                  onExecute={onExecuteScript}
                  isExecuting={isExecutingScript}
                />
              ))}
            </div>
          )}

          {/* Tool Execution Timeline */}
          {message.toolTrace && message.toolTrace.length > 0 && (
            <ToolTrace traces={message.toolTrace} />
          )}

          {/* Graph Visualizations */}
          {message.graphUrls && message.graphUrls.length > 0 && (
            <div className="mt-3 space-y-2">
              {message.graphUrls.map((url, urlIdx) => (
                <GraphPreview key={urlIdx} graphUrl={url} />
              ))}
            </div>
          )}

          {/* Streaming Spinner */}
          {message.isStreaming && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-indigo-400">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 font-mono text-[11px]">Executing in Igor Pro...</span>
            </div>
          )}

          {message.error && (
            <div className="mt-2 p-2 rounded bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
              {message.error}
            </div>
          )}
        </div>

        <span className="text-[10px] text-slate-500 mt-1 px-1 font-mono">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xs font-semibold">
          U
        </div>
      )}
    </div>
  );
};
