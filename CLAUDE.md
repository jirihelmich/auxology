# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Auxology is an Electron desktop application for monitoring the growth of prematurely born children (neonatology). Built with AngularJS 1.x and LoveField (client-side relational DB). The UI is in Czech.

## Commands

```bash
npm install          # Install dev dependencies (electron + electron-builder)
npm start            # Run the app in Electron
npm run build:mac    # Package for macOS (outputs to dist/)
npm run build:win    # Package for Windows (outputs to dist/)
npm run build        # Package for both macOS and Windows
```

There are no test or lint commands configured.

## Architecture

**Entry flow:** `main.js` (Electron main process) → `app/index.html` → AngularJS bootstrap (`app/js/app.js` module `auxology`) → `app/js/config.js` (UI-Router states + auth guards + idle timeout)

**Electron security:** The app runs with `contextIsolation: true`, `nodeIntegration: false`, and `sandbox: true`. The renderer has no access to Node.js APIs — all libraries are loaded via `<script>` tags from vendored files.

**MVC layers:**
- **Controllers** (`app/js/controllers/`): AngularJS controllers for each view (login, patient CRUD, examinations, charts, dashboard)
- **Services** (`app/js/services/`): Business logic — `patientModel.js`, `userModel.js`, `examinationModel.js`, `sessionModel.js`, `chartService.js`, `passwordService.js`
- **Views** (`app/views/`): HTML templates organized by feature (user/, patient/, examination/, common/)
- **Database schema** (`app/js/database/schema.js`): LoveField schema v20 with tables: Address, Person, User, Patient, Examination

**Statistical growth data** (`app/js/services/statisticalData/`): Hardcoded percentile arrays (2nd, 5th, 50th, 95th, 98th) organized as `{male,female}/{under,above}/` where under/above refers to 2500g birth weight threshold. Four measures: weight, length, circumference, weightForLength.

**Utility functions** (`app/js/functions.js`): Global helpers for age calculation (gestational/corrected), z-score/percentile statistics, Czech birth number validation (rodné číslo), and formatting.

## Key Design Decisions

- **Multi-tenancy via doctorId**: Each doctor only sees their own patients. All patient/examination queries filter by the logged-in doctor's ID.
- **Fully offline**: No backend server. All data lives in LoveField (IndexedDB-backed) in the user's browser/Electron instance.
- **Czech birth number (rodné číslo)**: Format YYMMDD/XXXX with gender encoding (females +50 to month) and checksum validation.
- **Corrected age for prematurity**: Age adjusted by subtracting (40 - birthWeek) weeks from actual age.

## Dependencies Note

All libraries are vendored directly into `app/js/` and `app/css/` — there are no runtime npm dependencies. Vendored libraries in `app/js/lib/` include: lovefield, moment, bcryptjs, ng-google-chart, ng-lovefield, angular-local-storage, and angularjs-toaster. The only npm packages are dev dependencies: electron and electron-builder.
