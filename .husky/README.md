# Git Hooks with Husky

This project uses [Husky](https://typicode.github.io/husky/) to manage Git hooks.

## Pre-commit Hook

Before each commit, the following checks are automatically run:

1. **Tests** (`npm test`)
   - Runs the Vitest suite first

2. **Linting** (`npm run lint -- --quiet`)
   - Runs [oxlint](https://oxc.rs/docs/guide/usage/linter) (config: `.oxlintrc.json`); errors block the commit

3. **Type Checking** (`npm run type-check`)
   - Ensures there are no TypeScript errors

4. **Formatting** (`npx lint-staged`)
   - Runs `prettier --check` on staged files; unformatted files block the commit

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
