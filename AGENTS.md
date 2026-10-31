<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Git workflow

- Always commit and push every change directly to `main` (`git push origin HEAD:refs/heads/main`).
- Commit after each completed change, using Conventional Commits messages.
- Run `npm run type-check`, `npm run lint -- --quiet` and `npm test` before committing.
- The husky pre-commit hook runs related tests, oxlint and `prettier --check` on staged files (in parallel with an incremental type-check). Full tests, lint and E2E run in CI. Fix failures instead of bypassing the hook.
