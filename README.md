# Swimming Hall Schedules Viewer

A web application that displays real-time reservation schedules for Espoo swimming halls. This project helps swimmers quickly check availability and make informed decisions about when to visit their favorite pools.

## Features

- **Real-time availability**: Displays current reservation status for multiple swimming halls
- **Visual indicators**: Color-coded buttons show availability status
  - 🟢 Green: Available or free practice time
  - 🔴 Red: Reserved in the next hour
  - Small red circles: Show reservations in the next 1, 2, and 3 hours
- **Multiple venues**: Tracks 5 different swimming halls in Espoo
- **Responsive design**: Works on desktop, tablet, and mobile devices

## Technologies

- **Next.js 16**: React framework with static site generation
- **TypeScript**: Type-safe development
- **Tailwind CSS v4**: Modern utility-first CSS framework
- **shadcn/ui**: High-quality UI components built with Radix UI

## Project Structure

```
swim/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles with Tailwind
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   │   └── card.tsx
│   └── swimming-hall-card.tsx
├── lib/                   # Utility functions and data
│   ├── utils.ts          # Helper utilities (cn function)
│   └── swimming-halls-data.ts
├── originalversion/       # Original vanilla JS version
│   ├── index.html
│   └── swimming.js
└── .github/workflows/     # CI/CD workflows
    └── deploy.yml         # GitHub Pages deployment
```

## Getting Started

### Prerequisites

- Node.js 22 (see `.nvmrc`)
- npm

### Installation

```bash
npm install
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
npm run build
```

The static files will be generated in the `out/` directory.

### Quality Checks

```bash
npm run lint
npm run type-check
npm test
```

Run the browser end-to-end test locally after installing Chromium:

```bash
npx playwright install chromium
npm run test:e2e
```

The GitHub Actions workflow runs these checks and builds the static site for pull
requests; deployment runs only for pushes to `main` or a manual dispatch.

## Deployment

This project automatically deploys to GitHub Pages when changes are pushed to the main branch.

- **Main site**: Next.js version at the root URL
- **Original version**: Accessible at `/originalversion` path

### GitHub Pages Setup

1. Go to repository Settings → Pages
2. Set Source to "GitHub Actions"
3. The workflow will automatically deploy on push to main

## Copilot Instructions

When working on this project with GitHub Copilot:

### Code Style

- Use TypeScript with strict type checking
- Follow React Server Components patterns (default in Next.js App Router)
- Use `'use client'` directive only when needed (state, effects, event handlers)
- Prefer functional components with hooks
- Use Tailwind CSS utility classes for styling
- Follow the shadcn/ui component patterns for consistency

### Component Guidelines

- Keep components small and focused on single responsibility
- Extract reusable logic into custom hooks
- Use the `cn()` utility from `@/lib/utils` for conditional classNames
- Place UI components in `components/ui/`
- Place feature components in `components/`

### Data Management

- Keep static data in `lib/` directory
- Use proper TypeScript interfaces for all data structures
- Follow the existing pattern in `swimming-halls-data.ts`

### Styling

- Use Tailwind CSS classes directly in components
- Reference color palette variables defined in `globals.css`
- Ensure responsive design with Tailwind breakpoints (sm:, md:, lg:)
- Maintain consistent spacing and sizing

### Testing Changes

- Always run `npm run build` before committing to verify static export works
- Test responsive layouts at different screen sizes
- Verify that the original version remains functional at `/originalversion`

### Git Workflow

- Write clear, descriptive commit messages
- Keep commits focused and atomic
- Update README if adding new features or changing setup

### Performance Considerations

- Minimize client-side JavaScript (favor Server Components)
- Optimize images (use Next.js Image component when needed)
- Keep bundle size small for fast page loads

## Original Version

The `originalversion/` folder contains the original vanilla JavaScript implementation. This version is:

- Standalone HTML/JS without build process
- Uses CDN for Tailwind CSS
- Accessible at `/originalversion` when deployed
- Maintained for reference and backwards compatibility

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## License

MIT
