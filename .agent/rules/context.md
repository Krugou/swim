# Project Context & Goals

## Goal

The primary goal of this project is to provide a user-friendly, real-time dashboard for checking the availability of swimming halls and gyms in Espoo, Finland. It acts as a more accessible frontend for the official city booking system.

## Key Features

- **Real-time Status**: Color-coded indicators (Green for available/free practice, Red for reserved).
- **Timeline View**: Shows upcoming reservations over the next few hours.
- **Multilingual**: Supports Finnish, English, and Swedish.
- **Mobile Optimized**: Designed for quick checks on the go.
- **PWA**: Can be installed on mobile devices for offline access to static info.

## Domain Logic

- **Free Practice (Vapaaharjoitte)**: This is a specific reservation type in the Espoo system that actually means the pool is open to the public. These should be treated as "Available" (Green).
- **Time Window**: We typically fetch data for a 4-hour window around the current time.
- **Proxy**: Direct requests to `resurssivaraus.espoo.fi` from the browser are blocked by CORS. We use a Cloudflare Worker proxy (`proxy.aleksi-nokelainen.workers.dev`) to fetch this data.
