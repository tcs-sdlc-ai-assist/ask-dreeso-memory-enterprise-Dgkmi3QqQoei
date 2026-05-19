# Ask Dreeso Memory

A multi-persona enterprise intelligence demo application built with React, Vite, and Tailwind CSS. The app simulates a 20-screen narrative flow across four construction-project personas, showcasing cross-domain query responses, action confirmations, and real-time source transparency from 11 integrated enterprise systems.

## Tech Stack

- **Framework:** [React 18](https://react.dev/) with JSX
- **Build Tool:** [Vite 5](https://vitejs.dev/)
- **Styling:** [Tailwind CSS 3](https://tailwindcss.com/) with glassmorphism design system
- **Routing:** [React Router v6](https://reactrouter.com/) (BrowserRouter)
- **Font:** [Urbanist](https://fonts.google.com/specimen/Urbanist) via Google Fonts
- **Testing:** [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **Linting:** [ESLint](https://eslint.org/) with React and React Hooks plugins
- **Deployment:** [Vercel](https://vercel.com/)

## Prerequisites

- [Node.js](https://nodejs.org/) >= 18.x
- npm >= 9.x

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd ask-dreeso-memory
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file and update values as needed:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `VITE_APP_TITLE` | Application title displayed in the UI | `Ask Dreeso Memory` |
| `VITE_REFERENCE_DATE` | Reference date for memory/timeline calculations (ISO 8601) | `2026-05-02` |

### 4. Start the development server

```bash
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173).

### 5. Build for production

```bash
npm run build
```

The production build output is written to the `dist/` directory.

### 6. Preview the production build

```bash
npm run preview
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server with HMR |
| `npm run build` | Create an optimised production build |
| `npm run preview` | Serve the production build locally |
| `npm run test` | Run tests in watch mode with Vitest |
| `npm run test:run` | Run all tests once and exit |
| `npm run lint` | Lint all `.js` and `.jsx` files with ESLint |

## Folder Structure

```
ask-dreeso-memory/
├── public/                          # Static assets
├── src/
│   ├── components/
│   │   ├── ActionPanel/             # ActionConfirmationPanel, CrossDomainPropagation
│   │   ├── Clusters/                # IntelligenceCluster, IntelligenceClusters grid
│   │   ├── CTABubbles/              # Follow-up query suggestion pills
│   │   ├── DemoFlow/                # DemoFlowManager (master orchestrator)
│   │   ├── Layout/                  # Header, Layout (app shell)
│   │   ├── QueryBar/                # QueryBar, AutosuggestDropdown
│   │   ├── QueryResponse/           # QueryResponse display
│   │   ├── SourcePanel/             # SourcePanel, SystemDot
│   │   └── common/                  # Badge, PersonaAvatar, Tooltip, LoadingSpinner, KeyboardHint
│   ├── context/
│   │   ├── DemoContext.jsx           # Demo flow navigation state
│   │   ├── PersonaContext.jsx        # Persona selection and switching
│   │   └── SessionContext.jsx        # Session, query history, dark mode
│   ├── data/
│   │   ├── actions.js                # 10 action confirmations
│   │   ├── clusters.js               # 24 intelligence clusters (6 per persona)
│   │   ├── personas.js               # 4 persona definitions
│   │   ├── queries.js                # 20 query responses, 22 autosuggest entries
│   │   └── screens.js                # 20-screen demo flow definitions
│   ├── hooks/
│   │   ├── useAutosuggest.js         # Autosuggest filtering and keyboard navigation
│   │   ├── useKeyboardNavigation.js  # Global keyboard shortcuts
│   │   └── useQueryEngine.js         # Mock query execution with simulated delay
│   ├── pages/
│   │   ├── ActionScreen.jsx          # Action confirmation screen
│   │   ├── DemoSummary.jsx           # End-of-demo session summary
│   │   ├── LoginScreen.jsx           # Demo login with persona quick-select
│   │   ├── PersonaHome.jsx           # Persona home with intelligence clusters
│   │   └── QueryScreen.jsx           # Query interaction and response display
│   ├── utils/
│   │   ├── formatters.js             # Date, currency, percentage, timestamp formatters
│   │   └── storage.js                # localStorage CRUD with error handling
│   ├── constants.js                  # App-wide constants (systems, shortcuts, keys)
│   ├── index.css                     # Tailwind directives, glassmorphism, animations
│   ├── main.jsx                      # React DOM entry point
│   ├── App.jsx                       # Root component with providers
│   └── setupTests.js                 # Test setup (jest-dom)
├── .env.example                      # Environment variable template
├── .eslintrc.cjs                     # ESLint configuration
├── index.html                        # HTML entry point
├── package.json                      # Dependencies and scripts
├── postcss.config.js                 # PostCSS with Tailwind and Autoprefixer
├── tailwind.config.js                # Tailwind theme, colours, animations
├── vercel.json                       # Vercel SPA rewrite rules
├── vite.config.js                    # Vite build configuration
└── vitest.config.js                  # Vitest test configuration
```

## Demo Usage Guide

### Personas

The demo features four enterprise personas, each with five dedicated screens:

| Persona | Role | Screens |
|---|---|---|
| **Lukas Müller** | Project Director | 1–5 |
| **Elena Rossi** | Senior Quantity Surveyor | 6–10 |
| **Sophie Dubois** | Project Manager | 11–15 |
| **James Carter** | Sales Director | 16–20 |

### Navigating the Demo

Select a persona from the login screen to begin. The demo advances through a 20-screen narrative sequence. Each screen displays a query, structured response, source citations, and contextual follow-up suggestions.

### Keyboard Shortcuts

All shortcuts are suppressed when an input field is focused.

| Key | Action |
|---|---|
| `F` / `Space` / `→` | Advance to next screen |
| `←` | Go to previous screen |
| `N` | Switch to next persona |
| `R` | Restart demo from screen 1 |
| `L` | Logout (clear session and persona) |

A toggleable keyboard shortcut hint overlay is available in the bottom-right corner of the screen when a persona is active.

### Persona Switching

Press `N` to cycle through personas. The demo automatically navigates to the first screen of the next persona group and synchronises the persona context.

### Query Bar

The persistent query bar at the bottom of every screen supports:

- Typing a question to trigger persona-specific autosuggest
- Keyboard navigation within suggestions (Arrow keys, Enter, Escape)
- Submitting queries via Enter or the send button
- Simulated 1–2 second processing delay with source panel animation

### Source Transparency Panel

The horizontal strip of system dots beneath the query bar shows 11 integrated enterprise systems. Active systems pulse green during query execution. Hover over any dot to see the system name and last-read timestamp.

### Action Confirmations

Screens with available actions display a confirmation panel with:

- Action description and type badge
- Affected systems with access type indicators (read/write/notify)
- Expected outcomes with metric tracking
- Cross-domain propagation effects with timing badges
- Confirm and cancel buttons with processing animation

### Dark Mode

Dark mode is supported via the `dark:` Tailwind prefix with class-based toggling. The preference is persisted to localStorage.

## Enterprise Systems

The demo integrates with 11 mocked enterprise systems:

- Procore
- SAP MM
- SAP FI
- Navisworks
- Primavera P6
- Salesforce
- Workday
- Vendor Compliance DB
- ESG Registry
- Amsterdam Authority Portal
- NEN Compliance DB

## Testing

Run the full test suite:

```bash
npm run test:run
```

Run tests in watch mode during development:

```bash
npm run test
```

Test suites cover:

- `ActionConfirmationPanel` — action rendering, confirm/cancel flows, status transitions
- `IntelligenceClusters` — cluster rendering, highlight state, expand/collapse
- `DemoFlowManager` — screen routing, keyboard navigation, persona synchronisation
- `QueryBar` — input, autosuggest, submission, processing state
- `SourcePanel` — system dots, active/inactive states, tooltips
- `LoginScreen` — branding, SSO buttons, persona quick-login
- `storage` — localStorage CRUD, error handling, round-trip persistence

## Deployment

### Vercel

The project includes a `vercel.json` with SPA rewrite rules. To deploy:

1. Connect the repository to [Vercel](https://vercel.com/)
2. Set the framework preset to **Vite**
3. Configure environment variables (`VITE_APP_TITLE`, `VITE_REFERENCE_DATE`) in the Vercel dashboard
4. Deploy

All routes are rewritten to `/index.html` for client-side routing support.

### Manual Deployment

Build the project and serve the `dist/` directory with any static file server:

```bash
npm run build
npx serve dist
```

## License

This project is private and proprietary.