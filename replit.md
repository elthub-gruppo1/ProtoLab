# ProtoLab - Prototype Management MVP

## Overview
ProtoLab is a web application for managing prototypes and their test plans in R&D/engineering contexts. It allows engineers to track prototype status (DESIGN/BUILD/TEST/READY), manage test cases, calculate readiness metrics, and apply gate rules before marking prototypes as ready.

## Architecture
- **Frontend**: React + Vite + TailwindCSS + shadcn/ui components
- **Backend**: Express.js REST API
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: TanStack React Query

## Project Structure
- `shared/schema.ts` - Data models (Prototype, TestCase) and Zod schemas
- `server/db.ts` - Database connection pool
- `server/storage.ts` - Storage interface with CRUD operations + gate logic
- `server/routes.ts` - REST API endpoints
- `server/seed.ts` - Database seed data
- `client/src/pages/home.tsx` - Main page with list + detail view
- `client/src/components/prototypes/` - Prototype components (Form, List, ListRow, DetailPanel, Header, StatusStepper, ReadinessIndicator, GateStatusMessage)
- `client/src/components/tests/` - Test components (TestCaseForm, TestCaseList, TestCaseRow, TestResultSelect)
- `client/src/components/ui/` - Reusable UI components (modal, inline-alert, empty-state, progress-bar + shadcn)

## Key Features
- CRUD prototypes with validation (name >=3 chars, owner >=2 chars, valid date)
- Status workflow: DESIGN -> BUILD -> TEST -> READY
- Test case management with results (NOT_RUN/PASS/FAIL)
- Readiness calculation: PASS/total*100
- Gate rules for READY: readiness >= 80%, no FAIL tests, at least 1 test

## API Routes
- GET /api/prototypes - List all with tests and readiness
- POST /api/prototypes - Create new
- POST /api/prototypes/:id/advance - Advance status
- DELETE /api/prototypes/:id - Delete
- POST /api/test-cases - Create test case
- PATCH /api/test-cases/:id - Update result
- DELETE /api/test-cases/:id - Delete test case
