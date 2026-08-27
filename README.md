# Igor Copilot — Frontend

> AI-driven chat interface for autonomous WaveMetrics Igor Pro orchestration

[![CI](https://github.com/pramishpy/igor-copilot-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/pramishpy/igor-copilot-frontend/actions/workflows/ci.yml)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-Apache%202.0-green.svg)](LICENSE)

## Overview

This is the **web frontend** for [Igor Copilot](https://github.com/pramishpy/igor-copilot-backend) — a natural language interface that lets researchers command WaveMetrics Igor Pro through conversational AI.

### Features (Planned)
- 💬 **Chat Interface** — Send natural language commands, receive streamed AI responses
- 📊 **Graph Rendering** — View Igor Pro-generated graphs inline in the chat
- ⚡ **Real-Time Streaming** — Server-Sent Events for live token-by-token response rendering
- 🔧 **Tool Execution Status** — Visual indicators showing when Igor Pro commands are executing
- 🎨 **Modern UI** — Tailwind CSS v4, responsive design, dark mode

## Architecture

```
┌─────────────────────┐     SSE/REST     ┌─────────────────────────┐
│   This Repo          │ ◄──────────────► │   Backend               │
│   Next.js + React    │                  │   FastAPI + Gemini Agent │
│   Tailwind CSS v4    │                  │                          │
└─────────────────────┘                  └─────────────────────────┘
```

### Key Directories

| Directory | Purpose |
|---|---|
| `src/app/` | Next.js App Router pages and layouts |
| `src/components/` | Reusable React UI components |
| `src/lib/` | API service layer, utilities |
| `src/types/` | Shared TypeScript interfaces |

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
