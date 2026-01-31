# Development Workflow

## Quick Commands

- `npm run dev:turbo` - Start dev server with Turbopack.
- `npm run lint` - Run ESLint.
- `npm run build` - Build for production (static export).
- `npm run type-check` - TypeScript type checking.

## Making Changes

1. Create a new branch for features.
2. Follow code style and typing rules.
3. **Verify**: Run `npm run lint` and `npm run build` before committing.
4. **Test**: Verify functionality in the browser (use the browser tool if possible).

## Deployment

- Deployment is automated via GitHub Actions on push to `main`.
- Site is hosted on GitHub Pages.
- Output is a static export in the `out/` directory.

## Common Tasks

- **Adding a Hall**: Update `lib/swimming-halls-data.ts`.
- **Adding a Component**: Create in `components/`, use PascalCase, type all props.
- **Adding Translations**: Update all files in `/messages/`.
