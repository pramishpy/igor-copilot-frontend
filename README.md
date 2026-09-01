# Igor Copilot — Frontend

> AI-driven chat interface for autonomous WaveMetrics Igor Pro orchestration

[![CI](https://github.com/pramishpy/igor-copilot-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/pramishpy/igor-copilot-frontend/actions/workflows/ci.yml)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-Apache%202.0-green.svg)](LICENSE)

## Overview

This is the **web frontend** for [Igor Copilot](https://github.com/pramishpy/igor-copilot-backend) — a natural language interface that lets researchers command WaveMetrics Igor Pro through conversational AI.

### Features
- 💬 **Conversational AI Chat** — Send natural language commands and receive streamed responses with tool call execution traces.
- 📊 **Inline Graph Rendering & Lightbox** — View Igor Pro graph plots inline with zoom lightbox and image download.
- ⚡ **Real-Time SSE Streaming** — Server-Sent Events client for live status and message streaming.
- 🔬 **Wave Inspector Modal (`WaveModal`)** — Inspect wave dimensions, memory status, raw `WaveInfo`, and execute one-click fits/plots.
- 💻 **Direct Macro Console (`MacroConsole`)** — Power-user collapsible terminal for executing raw IPF commands with execution logs.
- 📝 **IPF Syntax Highlighting (`CodeBlock`)** — Syntax highlighting for Igor Pro macro language with one-click "Run in Igor".
- 📁 **Live Workspace Inspector (`Sidebar`)** — Searchable active wave list, data folder hierarchy, and COM connection monitor.
- 🎨 **Scientific Dark Theme** — Tailwind CSS v4 design tokens, glassmorphic panels, and animated pulse indicators.

## Architecture

```
┌─────────────────────────────────┐     SSE / REST     ┌─────────────────────────┐
│       Next.js 15 Frontend       │ ◄────────────────► │     FastAPI Backend     │
│                                 │                    │                         │
│  • MessageList & MessageItem    │                    │  • Gemini Agent Loop    │
│  • WaveModal & MacroConsole     │                    │  • COM Bridge to Igor   │
│  • IPF CodeBlock & ToolTrace    │                    │  • Graph Export API     │
└─────────────────────────────────┘                    └─────────────────────────┘
```

### Component Architecture

| Component | Responsibility |
|---|---|
| `Header.tsx` | App branding, COM connectivity badge, terminal toggle, and new chat action |
| `Sidebar.tsx` | Dual-tab drawer for Chat Sessions and Live Igor Pro Workspace Explorer |
| `MessageList.tsx` | Auto-scrolling conversation feed and quick-prompt empty-state cards |
| `MessageItem.tsx` | Message bubbles supporting markdown, IPF code, tool timelines, and graphs |
| `CodeBlock.tsx` | IPF syntax highlighter with copy and direct "Run in Igor" buttons |
| `ToolTrace.tsx` | Collapsible step viewer showing tools executed in real time |
| `GraphPreview.tsx` | Inline graph viewer with manipulation toolbar and fullscreen lightbox |
| `WaveModal.tsx` | Wave property inspector with quick copilot actions (fit, plot, stats) |
| `MacroConsole.tsx` | Bottom drawer console for executing raw IPF scripts directly |
| `ChatInput.tsx` | Auto-expanding input with keyboard shortcuts and macro chip shortcuts |
| `StatusBadge.tsx` | Real-time Igor COM bridge status with manual refresh trigger |

## Tech Stack

| Component | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict mode) |
| UI Library | React 19 |
| Styling | Tailwind CSS v4 |
| Linting | ESLint + eslint-config-next |
| Testing | Vitest + Testing Library (Phase 4) |
| Containerization | Docker |

## Prerequisites

- **Node.js 22+**
- **npm 11+**

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/pramishpy/igor-copilot-frontend.git
cd igor-copilot-frontend
npm install
```

### 2. Configure Environment

```bash
copy .env.example .env.local
# Edit .env.local — set NEXT_PUBLIC_API_URL to your backend URL
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Lint & Type Check

```bash
npm run lint
npx tsc --noEmit
```

### 5. Build for Production

```bash
npm run build
```

## Docker

```bash
docker compose up --build
```

The app will be available at `http://localhost:3000`.

## Contributing

1. Create a feature branch from `main`: `git checkout -b feat/<issue-id>-description`
2. Make changes with [Conventional Commits](https://www.conventionalcommits.org/)
3. Ensure all checks pass: `npm run lint && npx tsc --noEmit && npm run build`
4. Open a Pull Request targeting `main`

## Related Repositories

- **Backend:** [igor-copilot-backend](https://github.com/pramishpy/igor-copilot-backend) — Python FastAPI orchestration layer

## License

[Apache License 2.0](LICENSE)
