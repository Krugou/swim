# Copilot Instructions for Swimming Hall Schedules Project

## Project Overview

This is a Next.js 16 application that displays real-time reservation schedules for Espoo swimming halls. It uses TypeScript, Tailwind CSS v4, and shadcn/ui components to provide a modern, responsive interface for checking swimming hall availability.

## Architecture & Technology Stack

### Core Technologies
- **Next.js 16** - App Router with Server Components
- **TypeScript** - Strict type checking enabled
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components built on Radix UI
- **React 19** - Latest React features

### Project Structure

```
swim/
├── app/                        # Next.js App Router
│   ├── layout.tsx             # Root layout with metadata
│   ├── page.tsx               # Home page (server component)
│   └── globals.css            # Global styles with Tailwind
├── components/                 # React components
│   ├── ui/                    # shadcn/ui components
│   │   └── card.tsx           # Card component
│   └── swimming-hall-card.tsx # Feature component (client component)
├── lib/                       # Utilities and data
│   ├── utils.ts              # Helper functions (cn, etc.)
│   └── swimming-halls-data.ts # Swimming hall data and types
├── public/                    # Static assets
├── originalversion/           # Legacy vanilla JS version
└── .github/workflows/        # CI/CD
    └── deploy.yml            # GitHub Pages deployment
```

## Development Guidelines

### File Organization

#### Components
- **Server Components** (default): Place in `app/` directory for pages, layouts
- **Client Components**: Place in `components/` with `'use client'` directive
- **UI Components**: Place reusable shadcn/ui components in `components/ui/`
- **Feature Components**: Place domain-specific components in `components/`

#### Naming Conventions
- **Files**: Use kebab-case for files: `swimming-hall-card.tsx`
- **Components**: Use PascalCase: `SwimmingHallCard`
- **Types/Interfaces**: Use PascalCase with descriptive names
- **Constants**: Use UPPER_SNAKE_CASE: `FREE_PRACTICE_TEXT`
- **Functions**: Use camelCase: `getTimeWindow`, `buildProxyUrl`

#### Type Definitions
- Define interfaces for all data structures
- Export types from the same file where data is defined
- Use `type` for unions, `interface` for object shapes
- Always type function parameters and return values

### Code Style

#### TypeScript Best Practices
```typescript
// ✅ Good - Explicit types, exported interfaces
export interface SwimmingHall {
  swimmingHallName: string;
  relatedLinks: RelatedLink[];
}

// ✅ Good - Type-safe constants
const FREE_PRACTICE_TEXT = 'Vapaaharjoitte' as const;

// ✅ Good - Proper return type
function getTimeWindow(): { start: number; end: number } {
  // implementation
}

// ❌ Bad - No types
function getData(url) {
  return fetch(url);
}
```

#### Component Patterns
```typescript
// ✅ Good - Server Component (default)
export default function Page() {
  return <div>Content</div>;
}

// ✅ Good - Client Component with proper typing
'use client';

interface Props {
  hallName: string;
  links: RelatedLink[];
}

export function SwimmingHallCard({ hallName, links }: Props) {
  const [status, setStatus] = useState<ReservationStatus>();
  // implementation
}

// ❌ Bad - Missing types
export function Component({ data }) {
  return <div>{data}</div>;
}
```

#### Styling with Tailwind
```typescript
// ✅ Good - Use cn() utility for conditional classes
import { cn } from '@/lib/utils';

<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  className
)} />

// ✅ Good - Consistent spacing and responsive design
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-6" />

// ❌ Bad - String concatenation for classes
<div className={"base " + (condition ? "active" : "")} />
```

### Data Fetching

#### Client-Side Fetching (Current Pattern)
```typescript
// ✅ Good - Used for real-time data that changes frequently
useEffect(() => {
  const timeWindow = getTimeWindow();
  const proxyUrl = buildProxyUrl(link.url, timeWindow);
  
  fetch(proxyUrl)
    .then(response => response.json())
    .then(data => processData(data))
    .catch(error => console.error('Error:', error));
}, [links]);
```

#### Future Considerations
- For static data: Use Server Components with direct API calls
- For dynamic data: Consider React Server Actions for mutations
- For real-time updates: Current client-side fetching is appropriate

### State Management

```typescript
// ✅ Good - Typed state with proper initialization
const [linkStatuses, setLinkStatuses] = useState<Map<string, ReservationStatus>>(new Map());

// ✅ Good - Immutable state updates
setLinkStatuses((prev) => {
  const newMap = new Map(prev);
  newMap.set(key, value);
  return newMap;
});

// ❌ Bad - Mutating state directly
linkStatuses.set(key, value);
```

### Helper Functions

#### Extract Reusable Logic
```typescript
// ✅ Good - Extracted helper functions
const getTimeWindow = () => {
  const nowInSeconds = Math.floor(Date.now() / 1000);
  return {
    start: nowInSeconds - FOUR_HOURS_IN_SECONDS,
    end: nowInSeconds + FOUR_HOURS_IN_SECONDS,
  };
};

// ✅ Good - Pure functions with clear purpose
const buildProxyUrl = (resourceId: string, timeWindow: { start: number; end: number }): string => {
  const cityUrl = `https://resurssivaraus.espoo.fi/...${resourceId}...`;
  return `https://proxy.aleksi-nokelainen.workers.dev/?url=${encodeURIComponent(cityUrl)}`;
};
```

### Performance Optimization

#### React Best Practices
- Prefer Server Components for static content
- Use `'use client'` only when needed (state, effects, browser APIs)
- Memoize expensive computations with `useMemo`
- Avoid inline function definitions in JSX when possible

#### Next.js Optimization
- Images: Use Next.js `Image` component (currently disabled for static export)
- Fonts: Use `next/font` for optimized font loading
- Code Splitting: Leverage dynamic imports for heavy components
- Static Generation: Use `output: 'export'` for GitHub Pages

### Error Handling

```typescript
// ✅ Good - Proper error handling
fetch(url)
  .then(response => {
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  })
  .then(data => processData(data))
  .catch(error => {
    console.error('Error fetching data:', error);
    // Consider user-friendly error states
  });

// ✅ Good - Type-safe error handling
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  if (error instanceof TypeError) {
    // Handle specific error type
  }
  console.error('Error:', error);
}
```

### Accessibility

```typescript
// ✅ Good - Semantic HTML and ARIA attributes
<a
  href={url}
  target="_blank"
  rel="noopener noreferrer"
  aria-label="View reservations"
>
  R
</a>

// ✅ Good - Proper heading hierarchy
<h1>Swimming Hall Schedules</h1>
<h2>{hallName}</h2>

// ❌ Bad - Divs for everything
<div onClick={handleClick}>Click me</div>
```

### Testing

Currently, the project doesn't have tests, but when adding them:

```typescript
// Future: Component tests
describe('SwimmingHallCard', () => {
  it('renders hall name correctly', () => {
    render(<SwimmingHallCard hallName="Test Hall" links={[]} />);
    expect(screen.getByText('Test Hall')).toBeInTheDocument();
  });
});

// Future: Helper function tests
describe('getTimeWindow', () => {
  it('returns correct time window', () => {
    const result = getTimeWindow();
    expect(result).toHaveProperty('start');
    expect(result).toHaveProperty('end');
  });
});
```

## Domain-Specific Guidelines

### Swimming Hall Data
- All swimming hall data is in `lib/swimming-halls-data.ts`
- Each hall has a name and array of related links (pools, gyms, etc.)
- Resource IDs are unique identifiers for Espoo's booking system

### Reservation Status Logic
- **Green**: Available or has "Vapaaharjoitte" (free practice)
- **Red**: Reserved within next hour
- **Circles**: Show reservations in next 1, 2, 3 hours
- Only show circles when NOT free practice

### External APIs
- **Espoo API**: `resurssivaraus.espoo.fi` - Official booking system
- **Proxy**: `proxy.aleksi-nokelainen.workers.dev` - CORS proxy for API access
- Time window: 4 hours before and after current time

## Development Workflow

### Starting Development
```bash
npm install              # Install dependencies
npm run dev:turbo        # Start dev server with Turbopack
npm run lint             # Run ESLint
npm run build            # Build for production
```

### Making Changes
1. Create a new branch for your feature
2. Make changes following the guidelines above
3. Run `npm run lint` to check for issues
4. Run `npm run build` to verify production build
5. Test functionality in browser
6. Commit with clear, descriptive messages

### Before Committing
- [ ] Code follows TypeScript and React best practices
- [ ] Components are properly typed
- [ ] Tailwind classes use `cn()` utility
- [ ] No console.logs in production code
- [ ] ESLint passes without errors
- [ ] Build succeeds without warnings
- [ ] Functionality tested in browser

## Common Tasks

### Adding a New Swimming Hall
1. Add entry to `swimmingHallData` array in `lib/swimming-halls-data.ts`
2. Follow existing structure with `swimmingHallName` and `relatedLinks`
3. Verify resource IDs are correct

### Adding a New Component
1. Create file in `components/` directory
2. Use PascalCase for filename: `new-component.tsx`
3. Add `'use client'` if using hooks or browser APIs
4. Export as named export for non-page components
5. Type all props with an interface

### Modifying Styles
1. Use existing Tailwind classes when possible
2. Add new global styles to `app/globals.css` if needed
3. Maintain responsive design with sm:, md:, lg: breakpoints
4. Keep dark mode compatibility (though not currently used)

### Adding shadcn/ui Components
```bash
# Note: Manual installation since network is limited
# Copy component from shadcn/ui docs to components/ui/
# Update imports to use '@/components/ui/component-name'
```

## Deployment

### GitHub Pages
- Workflow: `.github/workflows/deploy.yml`
- Triggers on push to `main` branch
- Builds Next.js app with static export
- Copies `originalversion/` to `out/originalversion/`
- Deploys to GitHub Pages

### Configuration
- `next.config.ts`: Configured for static export
- `output: 'export'`: Enables static HTML generation
- `images.unoptimized`: Required for static export
- No server-side features (API routes, ISR, etc.)

## Troubleshooting

### Build Issues
- **Error**: Cannot apply unknown utility class
  - Solution: Check Tailwind CSS v4 syntax in `globals.css`
  - Avoid `@apply` directives

- **Error**: Module not found
  - Solution: Check import paths use `@/` alias
  - Verify file exists at specified path

### Type Errors
- **Error**: Property does not exist on type
  - Solution: Add proper interface definitions
  - Check TypeScript strict mode settings

### ESLint Errors
- Run `npm run lint` to see all issues
- Fix auto-fixable issues: `npm run lint -- --fix`
- Check `eslint.config.mjs` for current rules

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [React Documentation](https://react.dev/)

## Questions?

When unsure about implementation:
1. Check existing patterns in the codebase
2. Follow Next.js and React best practices
3. Prioritize type safety and readability
4. Keep components small and focused
5. Extract reusable logic into helpers

## New Features & Guidelines

### Multilingual Support (i18n)

The app supports English, Finnish, and Swedish using `next-intl`:

```typescript
// Using translations in components
import { useTranslations } from 'next-intl';

function MyComponent() {
  const t = useTranslations('namespace');
  return <p>{t('key')}</p>;
}

// Translation files location: /messages/{locale}.json
// Supported locales: en, fi, sv (default: fi)
```

**Guidelines:**
- All user-facing text MUST be internationalized
- Add new translation keys to all locale files (en.json, fi.json, sv.json)
- Use semantic namespace organization (app, navigation, status, etc.)
- Test with all three languages before committing

### Dark Mode & Theming

Using `next-themes` for system-aware dark mode:

```typescript
// Theme provider is in root layout
// Use CSS variables for colors: hsl(var(--primary))
// Support both light and dark themes in all components
```

**Color System:**
- Use CSS variables from `globals.css` for consistent theming
- Test all components in both light and dark modes
- Ensure sufficient contrast for accessibility
- Smooth transitions: `transition: background-color 0.3s ease`

### Animations

Using `framer-motion` for smooth, performant animations:

```typescript
import { motion, AnimatePresence } from 'framer-motion';

// Entry animation
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>

// Conditional rendering with exit
<AnimatePresence>
  {show && <MotionComponent exit={{ opacity: 0 }} />}
</AnimatePresence>
```

**Animation Guidelines:**
- Keep animations under 300ms for snappiness
- Use hardware-accelerated properties (transform, opacity)
- Respect `prefers-reduced-motion` (handled in CSS)
- Animate free reservations with pulse-glow class
- Add loading states with shimmer animation

### Performance Optimization

**React.memo & useCallback:**

```typescript
// Memoize expensive components
export const MyComponent = React.memo(function MyComponent({ data }) {
  // Component logic
});

// Memoize callbacks passed as props
const handleClick = useCallback(() => {
  // Handle click
}, [dependencies]);

// Memoize expensive computations
const processedData = useMemo(() => {
  return expensiveOperation(data);
}, [data]);
```

**When to use:**
- Wrap components that receive complex props in `React.memo`
- Use `useCallback` for event handlers passed to child components
- Use `useMemo` for expensive calculations or data transformations
- Profile with React DevTools before optimizing

### Progressive Web App (PWA)

The app is configured as a PWA with offline support:

**Manifest:** `/public/manifest.json`
- App name, icons, theme colors
- Standalone display mode
- Portrait orientation

**Icons Required:**
- `/public/icon-192x192.png` (192x192px)
- `/public/icon-512x512.png` (512x512px)
- `/public/favicon.ico`

**Testing PWA:**
```bash
npm run build
npx serve out  # Test static build locally
```

### Mobile Optimization

**Responsive Design Checklist:**
- [ ] Use mobile-first approach with Tailwind breakpoints
- [ ] Test on viewport widths: 320px, 375px, 768px, 1024px, 1440px
- [ ] Touch targets minimum 44x44px (iOS HIG)
- [ ] Readable font sizes: base 14px mobile, 16px desktop
- [ ] Optimize images for mobile bandwidth
- [ ] Test with Chrome DevTools mobile emulation

**Breakpoints:**
```typescript
// Tailwind CSS breakpoints
sm:  640px   // Small tablets
md:  768px   // Tablets
lg:  1024px  // Small desktops
xl:  1280px  // Large desktops
```

**Mobile-specific patterns:**
```typescript
// Stack on mobile, row on desktop
<div className="flex flex-col sm:flex-row gap-2">

// Hide on mobile, show on larger screens
<div className="hidden md:block">

// Smaller padding on mobile
<div className="p-4 sm:p-6 lg:p-8">

// Responsive text
<h1 className="text-xl sm:text-2xl md:text-3xl">
```

### Calendar View

Shows reservation timeline for better planning:

```typescript
import { CalendarView } from '@/components/calendar-view';

// Calendar uses react-big-calendar
// Supports month, week, and day views
// Color-coded: blue (reserved), green (free practice)
// Filterable by swimming hall
```

**Guidelines:**
- Load data for 7 days before/after current date
- Show loading state while fetching
- Handle timezone correctly (all times in local timezone)
- Accessible keyboard navigation

### Charts & Analytics

Shows reservation statistics using Recharts:

```typescript
import { ChartsView } from '@/components/charts-view';

// Available charts:
// - Pie chart: Free vs Reserved distribution
// - Bar chart: Reservations by hall
// - Line chart: Occupancy rates
```

**Guidelines:**
- Responsive containers (100% width)
- Accessible color palette
- Clear labels and legends
- Loading states for data fetching

### Best Option Finder

Smart feature to find available slots:

```typescript
import { BestOptionFinder } from '@/components/best-option-finder';

// Algorithm:
// 1. Fetch all current reservations
// 2. Prioritize free practice slots
// 3. Then show available (no reservation in next hour)
// 4. Display sorted results with booking links
```

**Guidelines:**
- Show loading state during search
- Handle errors gracefully
- Animate results entrance
- Provide clear CTAs for booking

### Accessibility (a11y)

**WCAG 2.1 Level AA Compliance:**

```typescript
// Skip to main content
<a href="#main-content" className="skip-to-content">
  Skip to main content
</a>

// Aria labels for icons
<button aria-label="Toggle dark mode">
  <Moon className="h-5 w-5" aria-hidden="true" />
</button>

// Status indicators
<div role="status" aria-live="polite">
  {loadingMessage}
</div>

// Keyboard navigation
<button 
  className="focus-visible:ring-2 focus-visible:ring-ring"
  onKeyDown={handleKeyDown}
>
```

**Checklist:**
- [ ] All interactive elements keyboard accessible (Tab, Enter, Space)
- [ ] Focus indicators visible (focus-visible)
- [ ] Sufficient color contrast (4.5:1 for text)
- [ ] Screen reader tested with NVDA/VoiceOver
- [ ] Alt text for all images
- [ ] Semantic HTML (header, nav, main, footer)
- [ ] ARIA labels for icon-only buttons
- [ ] Form labels associated with inputs

### Code Organization Best Practices

**File Structure:**
```
app/[locale]/          # Internationalized pages
components/            # Reusable components
├── ui/               # shadcn/ui components
├── theme-provider.tsx
├── theme-toggle.tsx
├── language-switcher.tsx
├── best-option-finder.tsx
├── calendar-view.tsx
├── charts-view.tsx
└── swimming-hall-card.tsx
lib/                  # Utilities and data
├── i18n/            # i18n configuration
├── utils.ts         # Helper functions
└── swimming-halls-data.ts
messages/            # Translation files
public/              # Static assets
```

**Import Order:**
1. React and Next.js imports
2. Third-party libraries
3. Internal components (@/components)
4. Internal utilities (@/lib)
5. Types
6. Styles

**Component Structure:**
```typescript
// 1. Imports
import React, { useState, useCallback } from 'react';

// 2. Types/Interfaces
interface MyComponentProps {
  title: string;
}

// 3. Constants
const MAX_ITEMS = 10;

// 4. Helper functions (outside component)
const formatData = (data: any) => { };

// 5. Component
export const MyComponent = React.memo(function MyComponent(props: MyComponentProps) {
  // Hooks
  const [state, setState] = useState();
  
  // Callbacks
  const handleClick = useCallback(() => { }, []);
  
  // Render
  return <div>{props.title}</div>;
});

// 6. Sub-components if needed
function SubComponent() { }
```

### Testing Strategy

**Manual Testing Checklist:**
- [ ] Test all features in light and dark mode
- [ ] Test with all three languages (en, fi, sv)
- [ ] Test on mobile (Chrome DevTools)
- [ ] Test keyboard navigation (Tab, Enter, Esc)
- [ ] Test with screen reader
- [ ] Test slow 3G network (throttling)
- [ ] Verify PWA installation works
- [ ] Check accessibility with Lighthouse
- [ ] Test all interactive animations
- [ ] Verify calendar loads correctly
- [ ] Verify charts render with real data
- [ ] Test best option finder with various scenarios

### Performance Monitoring

**Build Optimization:**
```bash
npm run build        # Check bundle size
npm run lint         # No warnings
npm run type-check   # No type errors
```

**Metrics to Watch:**
- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.8s
- Cumulative Layout Shift (CLS): < 0.1
- Bundle size: Keep under 200KB (gzipped)

### Deployment

**Static Export for GitHub Pages:**
```bash
npm run build  # Generates /out directory
# GitHub Actions copies originalversion/
# to out/originalversion/
```

**Environment:**
- No server-side features (API routes, ISR)
- All data fetching client-side
- Static HTML generation
- Client-side routing with middleware

### Common Pitfalls

**Avoid:**
❌ Hardcoded text (use i18n)
❌ Inline styles (use Tailwind)
❌ Any type (use proper types)
❌ console.log in production
❌ Missing loading states
❌ No error boundaries
❌ Missing accessibility attributes
❌ Ignoring mobile viewport
❌ Heavy dependencies
❌ Blocking animations

**Do:**
✅ Use translations for all text
✅ Use Tailwind utility classes
✅ Proper TypeScript types
✅ Remove debug logs
✅ Show loading skeletons
✅ Add error handling
✅ Add ARIA labels
✅ Mobile-first design
✅ Tree-shakeable imports
✅ Optimized animations

### Quick Commands

```bash
# Development
npm run start              # Install deps + dev with Turbopack
npm run dev:turbo          # Dev server with Turbopack
npm run dev                # Standard dev server

# Code Quality
npm run lint               # Run ESLint
npm run lint:fix           # Fix ESLint issues
npm run type-check         # TypeScript type checking
npm run format             # Format code with Prettier
npm run format:check       # Check formatting

# Production
npm run build              # Build for production
npm start:prod             # Start production server

# Testing
# Manual testing required (no automated tests yet)
```

### Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Framer Motion](https://www.framer.com/motion/)
- [Recharts Documentation](https://recharts.org/)
- [React Big Calendar](https://jquense.github.io/react-big-calendar/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Mobile Web Best Practices](https://web.dev/mobile/)
