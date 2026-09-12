# FlyRank FE-09 — Testing Pass

A production-style React UI used to demonstrate component and end-to-end testing for an AI-assisted workflow.

## Run locally

```bash
npm install
npm run dev
```

## Verify

```bash
npm run build
npm test
npm run test:e2e
```

## What is covered

- 8 meaningful component tests using Vitest + React Testing Library.
- Chat message rendering for text, image, code, and tool-result parts.
- Chat pending, streaming, and error states.
- A validated prompt form, queried by accessible label rather than test IDs.
- The AI route is mocked in component tests; tests never call a real AI API.
- One Playwright test walks the primary submit-and-response flow.
- GitHub Actions runs build, component tests, and Playwright on pushes and pull requests to `main`.
- Playwright reports are uploaded as CI artifacts, including screenshots/traces when relevant.
