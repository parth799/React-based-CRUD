# Anti-Cheat Assessment System

A secure, high-stakes assessment platform with browser restrictions, event logging, and complete audit trail. Built with Next.js, Material-UI, and TypeScript.

## Live Demo

[View Live Application](https://react-based-crud-iota.vercel.app/)

## Features

### 🔒 Anti-Cheat Protection
- Block Ctrl/Cmd + C (Copy)
- Block Ctrl/Cmd + V (Paste)
- Block Ctrl/Cmd + X (Cut)
- Block right-click context menu
- Disable text selection on protected content
- Warning toasts on restricted actions
- Typing in input fields still works normally

### 📋 Unified Event Logging
- Complete audit trail of candidate behavior
- Events: copy/paste/cut attempts, right-clicks, tab switches, fullscreen changes
- Local persistence using IndexedDB (survives refresh)
- Automatic batch sync to backend every 30 seconds
- Immutable logs post-submission

### ⏱️ Assessment Features
- Fullscreen enforcement
- Countdown timer with heartbeat logging
- Auto-submit on timeout
- Question navigation with progress tracking

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Library**: Material-UI (MUI)
- **Language**: TypeScript
- **Storage**: IndexedDB (client), In-memory (server API)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/parth799/React-based-CRUD.git
cd React-based-CRUD
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Taking an Assessment
1. Visit the home page
2. Click **"Start Assessment"** to begin
3. Answer questions (MCQ and text-based)
4. Submit when done

### Viewing Event Logs
1. Click **"Check Logs"** button (opens in new tab)
2. Or visit `/audit-logs` directly
3. View all captured events with timestamps

## Project Structure

```
src/
├── app/
│   ├── api/audit/logs/     # Audit event sync API
│   ├── audit-logs/         # Event log viewer page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main assessment page
│   └── providers.tsx       # Theme provider
├── components/
│   └── assessment/
│       └── AssessmentWrapper.tsx  # Anti-cheat wrapper
├── hooks/
│   ├── useAntiCheat.ts     # Copy/paste/right-click blocking
│   ├── useEventLogger.ts   # Unified logging & sync
│   ├── useFullscreenGuard.ts # Fullscreen enforcement
│   └── useAssessmentTimer.ts # Timer with heartbeat
├── types/
│   └── audit.types.ts      # Event type definitions
└── utils/
    ├── auditStorage.ts     # IndexedDB persistence
    └── browserDetect.ts    # Browser/OS detection
```

## Event Schema

Each audit event contains:

| Field | Description |
|-------|-------------|
| `id` | Unique event ID |
| `type` | Event type (COPY_ATTEMPT, TAB_BLUR, etc.) |
| `timestamp` | Unix timestamp |
| `attemptId` | Assessment attempt ID |
| `userId` | Candidate user ID |
| `questionId` | Current question (if applicable) |
| `metadata` | Browser, OS, focus state, fullscreen status |

## Events Captured

| Event | Trigger |
|-------|---------|
| `COPY_ATTEMPT` | Ctrl+C pressed |
| `PASTE_ATTEMPT` | Ctrl+V pressed |
| `CUT_ATTEMPT` | Ctrl+X pressed |
| `RIGHT_CLICK_ATTEMPT` | Context menu opened |
| `TAB_BLUR` / `TAB_FOCUS` | Tab visibility change |
| `WINDOW_BLUR` / `WINDOW_FOCUS` | Window focus change |
| `FULLSCREEN_ENTER` / `FULLSCREEN_EXIT` | Fullscreen toggle |
| `HEARTBEAT` | Every 60 seconds |
| `TEST_START` / `TEST_SUBMIT` | Assessment lifecycle |
| `TIME_EXPIRED` | Timer reaches zero |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/audit/logs | Sync audit events |
| GET | /api/audit/logs | Get all synced events |

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Deploy

The application will be automatically deployed.

## License

MIT
