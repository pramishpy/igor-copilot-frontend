/**
 * Typed API client layer for communicating with the Igor Copilot FastAPI backend.
 */

import { IgorStatus, SSEStreamEvent, WaveInfo } from "@/types";

const getBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
};

/**
 * Fetch health status of the backend API.
 */
export async function checkApiHealth(): Promise<{ status: string; version: string }> {
  const res = await fetch(`${getBaseUrl()}/health`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Health check failed: ${res.statusText}`);
  }
  return res.json();
}

/**
 * Check Igor Pro COM bridge connectivity and active waves.
 */
export async function fetchIgorStatus(): Promise<IgorStatus> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/igor/status`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      return {
        connected: false,
        activeWaves: [],
        dataFolders: ["root:"],
        lastChecked: Date.now(),
        error: `Server responded with ${res.status}: ${res.statusText}`,
      };
    }
    const data = await res.json();
    return {
      connected: data.connected,
      activeWaves: data.active_waves || [],
      dataFolders: data.data_folders || ["root:"],
      lastChecked: Date.now(),
      error: data.error,
    };
  } catch (err) {
    return {
      connected: false,
      activeWaves: [],
      dataFolders: ["root:"],
      lastChecked: Date.now(),
      error: err instanceof Error ? err.message : "Failed to connect to backend",
    };
  }
}

/**
 * Fetch list of all active waves in Igor Pro.
 */
export async function fetchActiveWaves(): Promise<string[]> {
  const res = await fetch(`${getBaseUrl()}/api/igor/waves`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch waves: ${res.statusText}`);
  }
  const data = await res.json();
  return data.waves || [];
}

/**
 * Fetch data folder hierarchy from Igor Pro.
 */
export async function fetchDataFolders(): Promise<string[]> {
  const res = await fetch(`${getBaseUrl()}/api/igor/folders`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch folders: ${res.statusText}`);
  }
  const data = await res.json();
  return data.folders || ["root:"];
}

/**
 * Query detailed wave metadata.
 */
export async function fetchWaveData(waveName: string): Promise<WaveInfo> {
  const res = await fetch(`${getBaseUrl()}/api/igor/waves/${encodeURIComponent(waveName)}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch wave info: ${res.statusText}`);
  }
  return res.json();
}

/**
 * Directly execute an IPF macro in Igor Pro without the LLM agent.
 */
export async function executeScriptDirect(
  script: string
): Promise<{ success: boolean; command: string; output: string; error?: string | null }> {
  const res = await fetch(`${getBaseUrl()}/api/igor/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ script }),
  });
  if (!res.ok) {
    throw new Error(`Execution request failed: ${res.statusText}`);
  }
  return res.json();
}

/**
 * Send a non-streaming single-turn message to the Gemini agent.
 */
export async function sendChatMessage(
  message: string,
  sessionId?: string
): Promise<{
  reply: string;
  session_id: string;
  ipf_scripts: string[];
  graph_urls: string[];
  tool_call_trace: Array<{ turn: number; tool: string; args: Record<string, unknown> }>;
}> {
  const res = await fetch(`${getBaseUrl()}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ message, session_id: sessionId }),
  });
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.detail || `Chat request failed: ${res.statusText}`);
  }
  return res.json();
}

/**
 * Stream chat events from backend via SSE.
 */
export async function streamChatMessage(
  message: string,
  sessionId: string,
  onEvent: (event: SSEStreamEvent) => void,
  signal?: AbortSignal
): Promise<void> {
  const res = await fetch(`${getBaseUrl()}/api/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
    body: JSON.stringify({ message, session_id: sessionId }),
    signal,
  });

  if (!res.ok) {
    throw new Error(`Streaming failed with status ${res.status}`);
  }

  if (!res.body) {
    throw new Error("Response body is empty");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const blocks = buffer.split("\n\n");
    buffer = blocks.pop() || "";

    for (const block of blocks) {
      if (!block.trim()) continue;

      let eventType: SSEStreamEvent["event"] = "message";
      let eventData: Record<string, unknown> = {};

      const lines = block.split("\n");
      for (const line of lines) {
        if (line.startsWith("event: ")) {
          eventType = line.slice(7).trim() as SSEStreamEvent["event"];
        } else if (line.startsWith("data: ")) {
          try {
            eventData = JSON.parse(line.slice(6).trim());
          } catch {
            eventData = { raw: line.slice(6) };
          }
        }
      }

      onEvent({ event: eventType, data: eventData });
    }
  }
}
