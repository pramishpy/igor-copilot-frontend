/**
 * TypeScript definitions and data contracts for Igor Copilot Frontend.
 */

export interface ToolCallTraceItem {
  turn: number;
  tool: string;
  args: Record<string, unknown>;
  status?: "pending" | "success" | "failed" | "corrected";
  result?: Record<string, unknown>;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  ipfScripts?: string[];
  graphUrls?: string[];
  toolTrace?: ToolCallTraceItem[];
  isStreaming?: boolean;
  error?: string | null;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messageCount: number;
}

export interface IgorStatus {
  connected: boolean;
  activeWaves: string[];
  dataFolders: string[];
  lastChecked: number;
  error?: string | null;
}

export interface WaveInfo {
  name: string;
  info: string;
  exists: boolean;
  error?: string | null;
}

export interface SSEStreamEvent {
  event: "start" | "tool_call" | "message" | "error" | "done";
  data: {
    session_id?: string;
    turn?: number;
    tool?: string;
    args?: Record<string, unknown>;
    reply?: string;
    ipf_scripts?: string[];
    graph_urls?: string[];
    error?: string;
  };
}
