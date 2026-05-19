# Changelog

All notable changes to the **Ask Dreeso Memory** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-05-02

### Added

#### 20-Screen Demo Flow
- Complete 20-screen narrative sequence orchestrated by `DemoFlowManager`.
- Screen definitions with persona assignments, query mappings, transition metadata, and screen type resolution (`home`, `query`, `response`, `action`, `confirmation`).
- Automatic persona synchronisation when navigating across persona group boundaries.
- Screen progress indicator in the header with progress bar and screen number badge.

#### Persona Login & Switching
- Demo login screen with Dreeso & Sommers branding, SSO buttons (Microsoft/Google — UI only), and email/password fields (UI only).
- Four quick-login persona cards: Lukas Müller (Project Director), Elena Rossi (Senior Quantity Surveyor), Sophie Dubois (Project Manager), James Carter (Sales Director).
- Persona context provider with localStorage persistence and cross-tab synchronisation.
- Keyboard shortcut (`N`) to cycle through personas with automatic navigation to each persona's first screen.

#### Persistent Query Bar with Autosuggest
- Fixed bottom query bar with glassmorphism styling, persona indicator badge, and expand-on-focus animation.
- Autosuggest dropdown with 4–6 persona-specific suggestions filtered by input text.
- Keyboard navigation within suggestions (ArrowUp, ArrowDown, Enter, Escape).
- Mock query engine with simulated 1–2 second processing delay and word-overlap matching.
- Query history tracking via `SessionContext` with localStorage persistence (capped at 50 entries).

#### Intelligence Clusters
- Six intelligence cluster cards per persona (24 total) covering budget/cost, schedule, risk, compliance, resource, and commercial intelligence.
- Responsive 12-column grid layout (3×2 desktop, 2×3 tablet, 1×6 mobile).
- Trend indicators (up/down/stable) with colour-coded arrows and labels.
- Source system badges on each cluster card.
- Expand-on-click detail text with slide-in stagger animation.
- Highlight state support for related clusters during query responses.

#### CTA Bubbles
- Contextual follow-up query suggestion pills rendered below query responses.
- Click-to-submit behaviour that auto-populates the query bar and triggers submission.
- Staggered slide-in animation with disabled state support.

#### Source Transparency Panel
- Horizontal strip of enterprise system dots beneath the query bar.
- Active systems pulse green during query execution; inactive systems remain muted grey.
- Hover tooltips showing system name and mocked last-read timestamp relative to the reference date.
- System name labels visible on medium screens and above.
- 11 integrated enterprise systems: Procore, SAP MM, SAP FI, Navisworks, Primavera P6, Salesforce, Workday, Vendor Compliance DB, ESG Registry, Amsterdam Authority Portal, NEN Compliance DB.

#### Query Response Display
- Structured mock responses with answer text, inline system badges, and source citations.
- Citation badges with system name, document reference, and relative date.
- Action trigger buttons (navigate, export, notify, schedule, approve) with type-specific icons and colours.
- Source attribution footer summarising citation and system counts.

#### Action Confirmation Panels
- 10 action confirmations across all four personas covering export, notify, schedule, approve, and navigate action types.
- Confirmation card with action title, description, type badge, estimated duration, and status indicator (pending → in-progress → completed/cancelled).
- Affected systems section with access type icons (read/write/notify) and impact descriptions.
- Expected outcomes section with metric tracking and expected change descriptions.
- Confirm/cancel buttons with processing animation and state management.

#### Cross-Domain Propagation
- Visual flow of system nodes with animated connection lines showing how actions propagate across enterprise systems.
- Propagation effect cards with domain labels, timing badges (immediate/deferred/scheduled), and target persona indicators.
- Summary footer with effect and source system counts.

#### Keyboard Navigation
- Global keyboard shortcuts suppressed when input/textarea/select is focused.
- `F` / `Space` / `ArrowRight`: Advance to next screen.
- `ArrowLeft`: Go to previous screen.
- `N`: Switch to next persona.
- `R`: Restart demo.
- `L`: Logout (clear session and persona).
- Modifier key guard (Ctrl, Meta, Alt) to prevent conflicts with browser shortcuts.
- Toggleable keyboard shortcut hint overlay in the bottom-right corner.

#### Responsive Desktop/Tablet UI
- Glassmorphism card system with three intensity levels (`glass`, `glass-sm`, `glass-heavy`).
- Blue gradient backgrounds with subtle and dark mode variants.
- Urbanist font family with responsive typography.
- Custom scrollbar styling for WebKit and Firefox.
- Tailwind CSS responsive breakpoints: xs (375px), sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px).
- Dark mode support via `dark:` Tailwind prefix with class-based toggling.

#### localStorage Persistence
- Safe JSON serialisation/deserialisation with error handling for all storage operations.
- Session state persistence: dark mode, current screen, selected persona, user preferences, timeline state.
- Query history persistence with 50-entry cap and most-recent-first ordering.
- Demo screen index persistence with cross-tab synchronisation via `storage` event listener.
- Persona selection persistence with cross-tab synchronisation.

#### Application Architecture
- React 18 with Vite 5 build tooling.
- React Router v6 with `BrowserRouter` for client-side routing.
- Three context providers: `SessionProvider`, `PersonaProvider`, `DemoProvider`.
- Custom hooks: `useAutosuggest`, `useKeyboardNavigation`, `useQueryEngine`.
- Reusable UI components: `Badge`, `PersonaAvatar`, `Tooltip`, `LoadingSpinner`, `KeyboardHint`.
- Comprehensive mock data layer: 4 personas, 24 clusters, 20 query responses, 22 autosuggest entries, 10 action confirmations, 20 screen definitions.
- Utility modules: `formatters` (formatDate, formatCurrency, formatPercentage, formatTimestamp, truncateText), `storage` (localStorage CRUD with error handling).

#### Testing
- Vitest test runner with jsdom environment and `@testing-library/react`.
- Test suites for: `ActionConfirmationPanel`, `IntelligenceClusters`, `DemoFlowManager`, `QueryBar`, `SourcePanel`, `LoginScreen`, storage utilities.
- ESLint configuration with React, React Hooks, and import sorting rules.

#### Deployment
- Vercel configuration with SPA rewrite rules.
- Environment variable support via `.env` with `VITE_APP_TITLE` and `VITE_REFERENCE_DATE`.