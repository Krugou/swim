# Project Architecture & Overview

## Overview

This is a Next.js 16 application that displays real-time reservation schedules for Espoo swimming halls. It uses TypeScript, Tailwind CSS v4, and shadcn/ui components to provide a modern, responsive interface for checking swimming hall availability.

## Technology Stack

- **Next.js 16** - App Router with Server Components
- **TypeScript** - Strict type checking enabled
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components built on Radix UI
- **React 19** - Latest React features
- **framer-motion** - For animations
- **next-intl** - For multilingual support (EN, FI, SV)
- **next-themes** - For light/dark mode

## Project Structure

```
swim/
├── app/                        # Next.js App Router
│   ├── [locale]/              # Internationalized pages
│   ├── layout.tsx             # Root layout with metadata
│   ├── page.tsx               # Home page (server component)
│   └── globals.css            # Global styles with Tailwind
├── components/                 # React components
│   ├── ui/                    # shadcn/ui components
│   ├── swimming-hall-card.tsx # Feature component
│   ├── calendar-view.tsx      # Timeline view
│   └── charts-view.tsx        # Analytics view
├── lib/                       # Utilities and data
│   ├── utils.ts              # Helper functions (cn, etc.)
│   └── swimming-halls-data.ts # Swimming hall data and types
├── messages/                  # Translation files (en.json, fi.json, sv.json)
├── public/                    # Static assets
└── .github/workflows/        # CI/CD
    └── deploy.yml            # GitHub Pages deployment
```
