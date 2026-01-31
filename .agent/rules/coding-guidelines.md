# Coding Guidelines

## File Organization & Naming

- **Files**: Use kebab-case for files (e.g., `swimming-hall-card.tsx`).
- **Components**: Use PascalCase (e.g., `SwimmingHallCard`).
- **Types/Interfaces**: Use PascalCase with descriptive names.
- **Constants**: Use UPPER_SNAKE_CASE (e.g., `FREE_PRACTICE_TEXT`).
- **Functions**: Use camelCase (e.g., `getTimeWindow`).

## React & TypeScript

- **Server Components**: Default for pages and layouts.
- **Client Components**: Use `'use client'` only when needed (hooks, browser APIs).
- **Type Safety**:
  - Use strict TypeScript for all new files.
  - Define interfaces/types for all data structures and props.
  - Always type function parameters and return values.
  - **Forbidden**: Do not use `any` types.
- **Performance**:
  - Use `React.memo` for components receiving complex props.
  - Use `useCallback` for event handlers passed to children.
  - Use `useMemo` for expensive calculations.

## Styling (Tailwind CSS v4)

- Use `cn()` utility from `@/lib/utils` for conditional classes.
- Follow mobile-first approach with Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`).
- Keep dark mode compatibility using CSS variables (e.g., `hsl(var(--primary))`).
- Avoid `@apply` directives in CSS.

## Data Fetching

- **Client-Side**: Used for real-time data that changes frequently.
- Use the provided proxy (`proxy.aleksi-nokelainen.workers.dev`) to bypass CORS if needed.
- Always include proper error handling and loading states.
