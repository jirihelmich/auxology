# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Auxology is an Electron desktop application for monitoring the growth of prematurely born children (neonatology). Built with React 19 + TypeScript + Tailwind CSS 4 + Recharts, using LoveField (client-side relational DB on IndexedDB). The UI is in Czech.

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start Vite dev server (browser-only, hot reload)
npm start            # Build renderer + launch Electron
npm run build:renderer  # Build renderer to dist-renderer/
npm run build:mac    # Package for macOS (outputs to dist/)
npm run build:win    # Package for Windows (outputs to dist/)
npm run build        # Package for both macOS and Windows
npx tsc --noEmit     # Type-check without emitting
```

There are no test or lint commands configured.

## Architecture

**Entry flow:** `main.js` (Electron main process) → `dist-renderer/index.html` (Vite build output) → `src/main.tsx` → `src/App.tsx` (DatabaseProvider → AuthProvider → HashRouter → routes)

**Electron security:** The app runs with `contextIsolation: true`, `nodeIntegration: false`, and `sandbox: true`.

**Tech stack:** React 19, TypeScript, Vite 6, Tailwind CSS 4, Recharts, React Router (HashRouter), react-hot-toast, react-idle-timer, dayjs, bcryptjs, lovefield, lucide-react.

**Source structure:**
- `src/pages/` — Page components, one per route. `PatientDetailPage.tsx` is the most complex (charts + tabulated data + stats).
- `src/components/` — Reusable components organized as `layout/`, `ui/`, `charts/`, `forms/`.
- `src/hooks/` — Data access hooks wrapping LoveField queries: `usePatients`, `useExaminations`, `useUser`, `usePerson`, `useChartData`, `useIdleLogout`.
- `src/contexts/` — `DatabaseContext` (LoveField singleton), `AuthContext` (signIn/signOut/currentUser via sessionStorage).
- `src/lib/lovefield.ts` — LoveField schema (DB name `auxology`, version 20). **Must stay identical to preserve existing IndexedDB data.**
- `src/lib/statistical-data/` — Typed percentile + LMS arrays: `{male,female}/{under,above}/{weight,length,circumference,weightForLength}.ts`. Assembled by `index.ts`.
- `src/utils/` — Pure utility functions: `birth-number.ts`, `age.ts`, `formatting.ts`, `statistics.ts`, `color.ts`, `slug.ts`.
- `src/types/` — TypeScript interfaces: `database.ts` (Address, Person, User, Patient, Examination), `statistical.ts` (PercentileRow, LmsRow, StatisticalData), `lovefield.d.ts`.

**Routing:** HashRouter with routes defined in `App.tsx`. Auth guard via `ProtectedRoute`. Layout via `AppLayout` (sidebar + topnav + outlet).

## Key Design Decisions

- **Multi-tenancy via doctorId**: Each doctor only sees their own patients. All patient/examination queries filter by the logged-in doctor's ID.
- **Fully offline**: No backend server. All data lives in LoveField (IndexedDB-backed) in the user's browser/Electron instance.
- **Czech birth number (rodné číslo)**: Format YYMMDD/XXXX with gender encoding (females +50 to month) and checksum validation.
- **Corrected age for prematurity**: Age adjusted by subtracting (40 - birthWeek) weeks from actual age.
- **Statistical data threshold**: under/above refers to 1500g birth weight. Four measures: weight, length, headCircumference, weightForLength. Percentiles: 2nd, 5th, 50th, 95th, 98th.
- **Session auth**: Current user stored in `sessionStorage` under key `auxology.currentUser`. Auto-logout after 2 minutes idle.

## Legacy Code

The `app/` directory contains the old AngularJS 1.x codebase (kept for reference). It is no longer used by the application.
