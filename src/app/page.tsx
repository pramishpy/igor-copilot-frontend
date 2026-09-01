"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { ChatMessage, ChatSession, IgorStatus } from "@/types";
import { fetchIgorStatus, streamChatMessage, executeScriptDirect } from "@/lib/api";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { MessageList } from "@/components/MessageList";
import { ChatInput } from "@/components/ChatInput";

export default function Home() {
  // Session State
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: "session-default",
      title: "New Igor Analysis",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messageCount: 0,
    },
  ]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("session-default");
  const [messagesBySession, setMessagesBySession] = useState<Record<string, ChatMessage[]>>({
    "session-default": [],
  });

  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExecutingScript, setIsExecutingScript] = useState(false);
  const [igorStatus, setIgorStatus] = useState<IgorStatus | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Poll / Refresh Igor Pro status
  const refreshIgorStatus = useCallback(async () => {
    setIsLoadingStatus(true);
    try {
      const status = await fetchIgorStatus();
      setIgorStatus(status);
    } catch {
      // Handled in api client
    } finally {
      setIsLoadingStatus(false);
    }
  }, []);

  useEffect(() => {
    refreshIgorStatus();
    const interval = setInterval(refreshIgorStatus, 15000);
    return () => clearInterval(interval);
  }, [refreshIgorStatus]);

  // Current session messages
  const activeMessages = messagesBySession[currentSessionId] || [];

  // Send message flow with SSE streaming
  const handleSendMessage = async (userText: string) => {
    if (!userText.trim() || isGenerating) return;

    const userMsgId = `msg-${Date.now()}`;
    const assistantMsgId = `asst-${Date.now() + 1}`;

    const userMessage: ChatMessage = {
      id: userMsgId,
      role: "user",
      content: userText,
      timestamp: Date.now(),
    };

    const assistantMessage: ChatMessage = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      timestamp: Date.now(),
      isStreaming: true,
      toolTrace: [],
      ipfScripts: [],
      graphUrls: [],
    };

    // Update messages locally
    setMessagesBySession((prev) => ({
      ...prev,
      [currentSessionId]: [...(prev[currentSessionId] || []), userMessage, assistantMessage],
    }));

    // Update session title if first message
    setSessions((prev) =>
      prev.map((sess) => {
        if (sess.id === currentSessionId && sess.messageCount === 0) {
          const title = userText.length > 32 ? `${userText.slice(0, 32)}...` : userText;
          return { ...sess, title, updatedAt: Date.now(), messageCount: 1 };
        }
        return sess;
      })
    );

    setIsGenerating(true);
    abortControllerRef.current = new AbortController();

    try {
      await streamChatMessage(
        userText,
        currentSessionId,
        (event) => {
          if (event.event === "tool_call" && event.data) {
            setMessagesBySession((prev) => {
              const currentList = prev[currentSessionId] || [];
              const updated = currentList.map((m) => {
                if (m.id === assistantMsgId) {
                  const trace = m.toolTrace || [];
                  const newTurn = Number(event.data.turn) || trace.length + 1;
                  const newTool = String(event.data.tool || "execute_ipf_script");
                  const newArgs = event.data.args || {};
                  return {
                    ...m,
                    toolTrace: [
                      ...trace,
                      {
                        turn: newTurn,
                        tool: newTool,
                        args: newArgs,
                        status: "success" as const,
                      },
                    ],
                  };
                }
                return m;
              });
              return { ...prev, [currentSessionId]: updated };
            });
          } else if (event.event === "message" && event.data) {
            setMessagesBySession((prev) => {
              const currentList = prev[currentSessionId] || [];
              const updated = currentList.map((m) => {
                if (m.id === assistantMsgId) {
                  return {
                    ...m,
                    content: event.data.reply || m.content,
                    ipfScripts: event.data.ipf_scripts || m.ipfScripts,
                    graphUrls: event.data.graph_urls || m.graphUrls,
                    isStreaming: false,
                  };
                }
                return m;
              });
              return { ...prev, [currentSessionId]: updated };
            });
          } else if (event.event === "error") {
            setMessagesBySession((prev) => {
              const currentList = prev[currentSessionId] || [];
              const updated = currentList.map((m) => {
                if (m.id === assistantMsgId) {
                  return {
                    ...m,
                    content: m.content || "An error occurred while executing the Igor Pro operations.",
                    error: event.data.error,
                    isStreaming: false,
                  };
                }
                return m;
              });
              return { ...prev, [currentSessionId]: updated };
            });
          } else if (event.event === "done") {
            setMessagesBySession((prev) => {
              const currentList = prev[currentSessionId] || [];
              const updated = currentList.map((m) => {
                if (m.id === assistantMsgId) {
                  return { ...m, isStreaming: false };
                }
                return m;
              });
              return { ...prev, [currentSessionId]: updated };
            });
            // Refresh Igor status after operations complete
            refreshIgorStatus();
          }
        },
        abortControllerRef.current.signal
      );
    } catch (err: unknown) {
      if ((err as Error).name !== "AbortError") {
        setMessagesBySession((prev) => {
          const currentList = prev[currentSessionId] || [];
          const updated = currentList.map((m) => {
            if (m.id === assistantMsgId) {
              return {
                ...m,
                content: m.content || "Failed to communicate with the backend agent.",
                error: (err as Error).message,
                isStreaming: false,
              };
            }
            return m;
          });
          return { ...prev, [currentSessionId]: updated };
        });
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
    }
  };

  // Direct script execution
  const handleExecuteScript = async (script: string) => {
    setIsExecutingScript(true);
    try {
      await executeScriptDirect(script);
      refreshIgorStatus();
    } catch {
      // handled
    } finally {
      setIsExecutingScript(false);
    }
  };

  // Session Management
  const handleNewSession = () => {
    const newId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: "New Igor Analysis",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messageCount: 0,
    };
    setSessions((prev) => [newSession, ...prev]);
    setMessagesBySession((prev) => ({ ...prev, [newId]: [] }));
    setCurrentSessionId(newId);
  };

  const handleDeleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    setMessagesBySession((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    if (currentSessionId === id) {
      const remaining = sessions.filter((s) => s.id !== id);
      if (remaining.length > 0) {
        setCurrentSessionId(remaining[0].id);
      } else {
        handleNewSession();
      }
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={setCurrentSessionId}
        onNewSession={handleNewSession}
        onDeleteSession={handleDeleteSession}
        igorStatus={igorStatus}
        onRefreshIgor={refreshIgorStatus}
        onInspectWave={(wave) =>
          handleSendMessage(`Inspect wave '${wave}' in detail: show its length, data type, and summary statistics.`)
        }
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <Header
          igorStatus={igorStatus}
          isLoadingStatus={isLoadingStatus}
          onRefreshStatus={refreshIgorStatus}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
          onNewChat={handleNewSession}
        />

        {/* Message Stream */}
        <MessageList
          messages={activeMessages}
          onSelectPrompt={handleSendMessage}
          onExecuteScript={handleExecuteScript}
          isExecutingScript={isExecutingScript}
        />

        {/* Chat Input Bar */}
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isGenerating}
          onStop={handleStop}
        />
      </div>
    </div>
  );
}
