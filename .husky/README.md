# Git Hooks with Husky

This project uses [Husky](https://typicode.github.io/husky/) to manage Git hooks.

## Pre-commit Hook

Before each commit, the following checks are automatically run:

1. **Type Checking** (`npm run type-check`)
   - Ensures there are no TypeScript errors

2. **Linting & Formatting** (`npx lint-staged`)
   - Runs ESLint with auto-fix on staged `.ts`, `.tsx`, `.js`, `.jsx` files
   - Formats staged files with Prettier

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
