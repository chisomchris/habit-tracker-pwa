# Habit Tracker PWA

A high-performance, offline-first Habit Tracking application built with Next.js 15, TypeScript, and Tailwind CSS. This project features a custom-built local persistence layer and a manual Service Worker implementation to ensure a seamless experience on mobile devices like the Redmi Note 14.

## 🚀 Project Overview

This application allows users to create, track, and complete daily habits. It is designed as a Progressive Web App (PWA), prioritizing local-first data storage and offline reliability. Unlike traditional apps that rely on a central database, this tool manages data directly on the user's device for maximum privacy and speed.

## 🛠 Setup & Run Instructions

Prerequisites

1. Node.js (v18 or higher)

2. mkcert (For local HTTPS/PWA testing)

### Installation

Clone the repository and navigate to the root:

```bash
npm install
```

Install Browsers for Testing:

```bash
npx playwright install
```

### Running the App

To test PWA features locally, you must run the server with HTTPS:

Open your terminal as an Administrator.

Generate certificates:

```bash
mkcert -install
mkcert localhost 127.0.0.1 ::1
```

Start the development server:

```bash
npm run dev
```

The app will be available at https://localhost:3000.

## 🧪 Test Instructions

The project uses a dual-testing strategy to ensure both logic and UI stability.

Units Tests (Vitest): Tests business logic.

```bash
npm run test:unit
```

Integration Tests (Vitest): Tests business logic and component interactions.

```bash
npm run test:integration
```

End-to-End Tests (Playwright): Tests full user flows in real browsers.

```Bash
npm run test:e2e
```

### Test Mapping

|Test File |Verified Behavior|
|----|----|
|app.spec.ts| E2E: Splash screen redirects, habit creation, and completion toggle.|
|auth.spec.ts| E2E: Login flow, session persistence, and logout redirection.|
|habit-form.test.tsx| Integration: Form validation and habit submission logic.|
|habit-list.test.tsx| Integration: Correct filtering of habits by the authenticated user.|

## 💾 Local Persistence Structure

Instead of a standard backend, this app uses a Custom External Store pattern powered by useSyncExternalStore and localStorage.

- Reactivity: The store listens for storage events, allowing the app to stay in sync across multiple browser tabs.

- Hydration Safety: To prevent Next.js hydration mismatches, the store initializes as undefined. This allows the UI to show a loading state while the store reads from the disk, preventing the "unauthenticated flicker."

- Store Factory: A generic createLocalStorageStore handles the heavy lifting for users, habits, and sessions.

## 📱 PWA Implementation

The PWA support is implemented manually via a custom Service Worker (public/sw.js) to provide full control over the caching strategy.

- Strategy: Cache-First, Network Fallback. Core assets (App Shell) are cached during the install event.

- Registration: A client-side PWARegistry component handles registration in the root layout.

- Offline Fallback: If the network is unavailable, the fetch handler serves the cached index page, allowing the SPA to handle routing offline.

## ⚖️ Trade-offs & Limitations

- Single-Device Sync: Since data is stored in localStorage, habits do not sync across different devices (e.g., from PC to Phone) unless an export/import feature is used.

- Storage Limits: Data is limited by the browser's localStorage quota (typically ~5-10MB), which is more than enough for thousands of habits but unsuitable for large media files.

- Self-Signed Certificates: Testing on mobile requires USB Port Forwarding or manual certificate installation on the device due to the strict HTTPS requirement for Service Workers.
