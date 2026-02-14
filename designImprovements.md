# Website Design & Experience Improvements

This document outlines suggested improvements for the _Swimming Halls - Espoo_ application, focusing on enhancing the Neobrutalist aesthetic, user experience (UX), and technical performance.

## 1. Visual Aesthetics (Neobrutalism 2.0)

The current Neobrutalist base is strong. We can elevate it with more distinct styling.

- **Typography**:
  - Adopt a characterful display font for headings (e.g., _Space Grotesk_, _Syne_, or _Unbounded_) to contrast with the functional sans-serif body text.
  - Increase contrast in font weights (e.g., ultra-bold headers vs. regular body).
- **Color Palette**:
  - Introduce a broader set of "clashing" accent colors for different statuses (e.g., high-voltage lime for "Open", neon orange for "Maintenance").
  - Use patterns (dots, stripes) in backgrounds or borders to add texture without heavy assets.
- **UI Elements**:
  - **Hard Shadows**: Ensure all interactive elements have consistent hard-edge shadows (`box-shadow: 4px 4px 0px 0px #000`).
  - **Borders**: Thicken borders on primary elements (3px-4px) for a bolder look.

## 2. User Experience (UX) & Interactions

Make the app feel more "alive" and responsive.

- **Micro-interactions**:
  - **Button Clicks**: exaggerated active states (e.g., button presses down 4px to "flat").
  - **Hover Effects**: Slight rotation or scaling on cards when hovered.
- **Page Transitions**:
  - Implement smooth page transitions using `Framer Motion` (e.g., slide-up or fade-in) to maintain flow between views.
- **Loading States**:
  - Replace spinners with **Skeleton Screens** that match the Neobrutalist style (e.g., pulsing blocky shapes) for better perceived performance.
- **Feedback**:
  - Implement **Toast Notifications** (styled neobrutalist) for actions like "Location updated" or "Data refreshed".

## 3. Components & Features

- **Interactive Map**:
  - Add a map view toggle showing all halls on a map with current status indicators.
- **Drawer/Sheet Navigation**:
  - Use a slide-up drawer for "Settings" or "Filters" on mobile instead of navigating to a new page, keeping the user in context.
- **PWA Polish**:
  - Create a custom install prompt to encourage adding to home screen.
  - Ensure offline fallback page is styled consistently.

## 4. Technical & SEO

- **Structured Data (JSON-LD)**:
  - Add `LocalBusiness` or `CivicStructure` schema to swimming hall pages for better Google Maps/Search integration.
- **Image Optimization**:
  - Enforce `AVIF`/`WebP` formats for all static assets.
- **Accessibility**:
  - Audit contrast ratios for new high-vibrancy colors.
  - Ensure focus states are highly visible (e.g., thick dashed outlines), which fits the aesthetic well.
