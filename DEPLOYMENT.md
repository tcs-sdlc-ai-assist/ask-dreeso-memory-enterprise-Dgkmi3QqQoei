# Deployment Guide

This document covers deploying the **Ask Dreeso Memory** application to [Vercel](https://vercel.com/), including environment variable configuration, SPA rewrite rules, build settings, and CI/CD integration with GitHub.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Vercel Setup](#vercel-setup)
  - [1. Connect Repository](#1-connect-repository)
  - [2. Configure Project Settings](#2-configure-project-settings)
  - [3. Set Environment Variables](#3-set-environment-variables)
  - [4. Deploy](#4-deploy)
- [Environment Variables](#environment-variables)
- [SPA Rewrite Configuration](#spa-rewrite-configuration)
- [Build Configuration](#build-configuration)
- [CI/CD with GitHub](#cicd-with-github)
  - [Automatic Deployments](#automatic-deployments)
  - [Preview Deployments](#preview-deployments)
  - [Production Deployments](#production-deployments)
- [Manual Deployment](#manual-deployment)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

- A [Vercel](https://vercel.com/) account
- A GitHub repository containing the project source code
- [Node.js](https://nodejs.org/) >= 18.x and npm >= 9.x (for local builds)

---

## Vercel Setup

### 1. Connect Repository

1. Log in to [Vercel](https://vercel.com/dashboard).
2. Click **Add New… → Project**.
3. Select **Import Git Repository** and choose the GitHub repository containing the Ask Dreeso Memory project.
4. Authorise Vercel to access the repository if prompted.

### 2. Configure Project Settings

On the project configuration screen, set the following:

| Setting | Value |
|---|---|
| **Framework Preset** | Vite |
| **Root Directory** | `.` (repository root) |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |
| **Node.js Version** | 18.x (or later) |

> **Note:** Vercel auto-detects Vite projects in most cases. Verify that the framework preset is set to **Vite** and not another framework.

### 3. Set Environment Variables

Navigate to **Settings → Environment Variables** in the Vercel project dashboard and add the following variables:

| Variable | Value | Environments |
|---|---|---|
| `VITE_APP_TITLE` | `Ask Dreeso Memory` | Production, Preview, Development |
| `VITE_REFERENCE_DATE` | `2026-05-02` | Production, Preview, Development |

These variables are embedded at build time by Vite and accessed in the application via `import.meta.env.VITE_APP_TITLE` and `import.meta.env.VITE_REFERENCE_DATE`.

You can override values per environment if needed. For example, you might set a different `VITE_REFERENCE_DATE` for preview deployments to test with an alternate reference date.

### 4. Deploy

Click **Deploy** to trigger the first build. Vercel will:

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `npm run build` to create the production build in the `dist/` directory.
4. Deploy the contents of `dist/` to the Vercel CDN.

Once complete, the application will be available at the assigned `.vercel.app` domain.

---

## Environment Variables

The application uses two environment variables, both prefixed with `VITE_` so that Vite exposes them to the client-side bundle:

| Variable | Description | Default | Required |
|---|---|---|---|
| `VITE_APP_TITLE` | Application title displayed in the UI header and login screen. | `Ask Dreeso Memory` | No |
| `VITE_REFERENCE_DATE` | Reference date used for memory/timeline calculations and relative date formatting. Must be in ISO 8601 format (`YYYY-MM-DD`). | `2026-05-02` | No |

### Local Development

For local development, copy the example environment file and update values as needed:

```bash
cp .env.example .env
```

The `.env` file is listed in `.gitignore` and will not be committed to the repository.

### How Environment Variables Are Used

- **`VITE_APP_TITLE`** — Referenced in `index.html` via the `<title>` tag and in UI components for branding.
- **`VITE_REFERENCE_DATE`** — Imported in `src/constants.js` as `REFERENCE_DATE` and used by:
  - `src/utils/formatters.js` — `formatDate()` calculates relative dates against this reference.
  - `src/components/SourcePanel/SourcePanel.jsx` — Generates mocked last-read timestamps relative to this date.
  - `src/pages/DemoSummary.jsx` — Displays the formatted reference date in the session summary.
  - `src/pages/PersonaHome.jsx` — Generates time-of-day greetings based on the reference date.

---

## SPA Rewrite Configuration

The project includes a `vercel.json` file at the repository root that configures SPA (Single Page Application) rewrite rules:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This configuration ensures that all routes are rewritten to `/index.html`, allowing React Router v6 (`BrowserRouter`) to handle client-side routing. Without this rewrite rule, direct navigation to routes like `/dashboard` or refreshing the browser on a non-root route would return a 404 error.

> **Important:** Do not remove or modify `vercel.json` unless you are changing the routing strategy. The rewrite rule is essential for the SPA to function correctly on Vercel.

---

## Build Configuration

### Build Command

```bash
npm run build
```

This runs `vite build`, which:

1. Bundles all JavaScript, CSS, and assets using Rollup (via Vite).
2. Applies Tailwind CSS purging to remove unused utility classes.
3. Generates optimised, minified output with content hashing for cache busting.
4. Produces source maps for debugging (`sourcemap: true` in `vite.config.js`).

### Output Directory

```
dist/
```

The production build output is written to the `dist/` directory. This is the directory Vercel serves after deployment.

### Preview Command

To preview the production build locally before deploying:

```bash
npm run build
npm run preview
```

The preview server runs at `http://localhost:4173` by default.

### Linting

Run the linter before deploying to catch issues early:

```bash
npm run lint
```

### Testing

Run the full test suite to verify correctness:

```bash
npm run test:run
```

---

## CI/CD with GitHub

### Automatic Deployments

When the GitHub repository is connected to Vercel, deployments are triggered automatically:

| Trigger | Deployment Type | URL |
|---|---|---|
| Push to `main` (or default branch) | **Production** | `your-project.vercel.app` |
| Push to any other branch | **Preview** | `your-project-<hash>.vercel.app` |
| Pull request opened or updated | **Preview** | `your-project-<hash>.vercel.app` |

### Preview Deployments

Every pull request receives a unique preview deployment URL. This allows reviewers to:

- Test changes in a production-like environment before merging.
- Verify that environment variables are correctly applied.
- Share the preview URL with stakeholders for feedback.

Preview deployment URLs are automatically posted as comments on the pull request by the Vercel GitHub integration.

### Production Deployments

Production deployments are triggered when changes are merged into the default branch (typically `main`). The production deployment is served at the primary domain configured in the Vercel project settings.

### Recommended CI Workflow

For teams that want to run tests and linting before Vercel builds, add a GitHub Actions workflow:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run test:run
```

This workflow runs linting and tests on every push and pull request. Vercel deployments proceed independently but can be configured to require CI checks to pass before deploying.

### Skipping Deployments

To skip a Vercel deployment for a specific commit, include `[skip ci]` or `[vercel skip]` in the commit message:

```bash
git commit -m "Update README [skip ci]"
```

---

## Manual Deployment

If you prefer to deploy without connecting a Git repository, you can use the Vercel CLI:

### 1. Install the Vercel CLI

```bash
npm install -g vercel
```

### 2. Log in to Vercel

```bash
vercel login
```

### 3. Build the project

```bash
npm run build
```

### 4. Deploy

```bash
vercel --prod
```

The CLI will prompt you to configure the project on first run. Use the following settings:

- **Framework:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

Alternatively, deploy the pre-built `dist/` directory directly:

```bash
vercel deploy dist --prod
```

### Serving with Other Static Hosts

The production build can be served by any static file server. For example:

```bash
npm run build
npx serve dist
```

Or with Python:

```bash
npm run build
cd dist
python3 -m http.server 8080
```

> **Note:** When using a static file server other than Vercel, you must configure SPA fallback routing (rewrite all routes to `index.html`) to support client-side routing with React Router.

---

## Troubleshooting

### Build Fails with Missing Environment Variables

Ensure that `VITE_APP_TITLE` and `VITE_REFERENCE_DATE` are set in the Vercel project dashboard under **Settings → Environment Variables**. These variables must be available at build time, not just at runtime.

### 404 Errors on Page Refresh

Verify that `vercel.json` is present at the repository root and contains the SPA rewrite rule. If deploying to a non-Vercel host, configure equivalent rewrite rules for your server.

### Styles Missing or Broken

Ensure that Tailwind CSS is correctly configured:

- `tailwind.config.js` must include `./index.html` and `./src/**/*.{js,jsx}` in the `content` array.
- `postcss.config.js` must include `tailwindcss` and `autoprefixer` plugins.
- `src/index.css` must include the `@tailwind base`, `@tailwind components`, and `@tailwind utilities` directives.

### Fonts Not Loading

The application uses [Urbanist](https://fonts.google.com/specimen/Urbanist) via Google Fonts, loaded in `index.html`. Ensure that the `<link>` tags for Google Fonts are present and that the deployment environment allows external font loading.

### Environment Variable Changes Not Reflected

Vite embeds environment variables at build time. After changing environment variables in the Vercel dashboard, you must trigger a new deployment (redeploy) for the changes to take effect. Changing environment variables alone does not update the existing deployment.

### Preview Deployments Using Wrong Environment Variables

Verify that environment variables are configured for the **Preview** environment in the Vercel dashboard, not just **Production**. Each environment (Production, Preview, Development) can have independent variable values.