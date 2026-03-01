# Pokemon Catalog App

A small React app that lets users:
- browse a paginated Pokemon list,
- search Pokemon by name across the full catalog,
- open a detail page with key profile data.

The UI is built with a lightweight atomic structure (`atoms`, `molecules`, `organisms`) and a small service layer for API access.

## Tech Stack
- React 19
- React Router v6
- Create React App (react-scripts)
- Testing Library + Jest
- PokeAPI as data source

## Setup Instructions

### 1. Prerequisites
- Node.js 18+ recommended
- npm 9+ recommended

### 2. Install dependencies
```bash
npm install
```

### 3. Run locally
```bash
npm start
```
Then open `http://localhost:3000`.

### 4. Run tests
```bash
npm test -- --watchAll=false
```

### 5. Create production build
```bash
npm run build
```

## Project Structure
```text
src/
  api/                  # API and data-fetching helpers
  pages/                # Route-level pages
  components/
    atoms/              # Small reusable UI pieces
    molecules/          # Composed UI units (e.g., card)
    organisms/          # Feature-level sections
    __tests__/          # Component tests by layer
  test-utils/           # Router/mock helpers and fixtures
```

## Architectural Decisions

### 1. Service layer for API calls
All network calls live in `src/api/pokemonService.js`.  
Reason: keeps components focused on rendering and user interaction, not URL-building or parsing.

### 2. Lazy-loaded routes
Catalog and detail pages are loaded with `React.lazy` + `Suspense`.  
Reason: reduces initial bundle cost and keeps first-load payload smaller.

### 3. Atomic component organization
UI is separated into atoms/molecules/organisms.  
Reason: predictable composition, easier test targeting, and clearer ownership of UI concerns.

### 4. Catalog caching for search
Search uses a cached full catalog list for name filtering.  
Reason: avoids repeated full-catalog fetches after the first request and keeps search responsive.

### 5. Route-driven detail view
Detail view uses `/pokemon/:pokemonName` with router params.  
Reason: shareable URLs and browser navigation works naturally.

## Trade-offs Made

### 1. Client-side universal search
The app fetches up to 2000 Pokemon names and filters on the client.  
Trade-off: fast subsequent searches, but first universal search has a larger network cost.

### 2. No global state library
State is kept with local React hooks in pages/sections.  
Trade-off: simpler code for this scope, but cross-feature state orchestration would be harder at larger scale.

### 3. Styling with plain CSS
The UI uses handcrafted CSS tokens and classes instead of CSS-in-JS or utility frameworks.  
Trade-off: no dependency overhead and straightforward output, but less built-in theming/composition tooling.

### 4. API error handling kept simple
Errors surface as friendly messages without advanced retry/backoff strategies.  
Trade-off: predictable UX, but not as resilient as production-grade data clients.

## Testing Notes
- Routing + lazy loading behavior is covered.
- List behavior (loading, pagination, search, retry) is covered.
- Detail behavior (profile fetch, fallback image, error state) is covered.
- Card and input behavior are covered at component level.

Run all tests:
```bash
npm test -- --watchAll=false
```

## AI Usage Details
AI was used as an implementation assistant for:
- accelerating UI iteration,
- generating/refining test updates after UI changes,
- improving wording and structure of technical documentation.
