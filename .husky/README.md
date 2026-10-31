# Git Hooks with Husky

This project uses [Husky](https://typicode.github.io/husky/) to manage Git hooks.

## Pre-commit Hook

Before each commit, these checks run. Type-checking runs in parallel with the staged-file checks to keep the hook fast:

1. **Staged-file checks** (`npx lint-staged`, per staged `.ts/.tsx/.js/.jsx` file, in this order)
   - `vitest related --run`: only tests affected by the staged files
   - `oxlint --quiet`: [oxlint](https://oxc.rs/docs/guide/usage/linter) (config: `.oxlintrc.json`); errors block the commit
   - `prettier --check`: unformatted files block the commit (also applied to staged `.json/.css/.md`)

2. **Type Checking** (`npm run type-check`, incremental)
   - Ensures there are no TypeScript errors

The full test suite, full lint and E2E tests still run in CI (`deploy.yml`).

## Commit Message Hook

Commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <subject>
```

### Allowed types:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semi-colons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `build`: Build system changes
- `ci`: CI/CD changes
- `revert`: Reverting a previous commit

### Examples:

```bash
git commit -m "feat(translations): add Swedish language support"
git commit -m "fix(api): resolve data fetching timeout issue"
git commit -m "docs: update setup instructions in README"
git commit -m "refactor: extract reservation logic into custom hook"
```

## Bypassing Hooks (Not Recommended)

In rare cases where you need to skip the hooks:

```bash
git commit --no-verify -m "your message"
```

⚠️ **Warning:** Only use this when absolutely necessary, as it bypasses important quality checks.
