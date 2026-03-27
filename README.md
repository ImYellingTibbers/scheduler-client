# Scheduler
**A React scheduling app built with React 19, React Router v7, and timezone-aware date handling**

---

<!-- 
  ⚠️  FILL THIS IN: One or two sentences describing what the app actually does.
  Example: "Scheduler is a shift management tool for small teams — employees can view their weekly schedule, request time off, and managers can assign and edit shifts from a shared dashboard."
  Once you fill this in, delete this comment block.
-->

---

## Features

<!-- 
  ⚠️  FILL THIS IN: List the main things a user can do in the app.
  Example:
  - View weekly/monthly schedule in a calendar grid
  - Create, edit, and delete appointments or shifts
  - Timezone-aware time display using date-fns-tz
  - Client-side routing between views (schedule, profile, settings)
-->

---

## Tech stack

| | |
|---|---|
| Framework | React 19 |
| Routing | React Router v7 |
| Date handling | date-fns + date-fns-tz (timezone-aware) |
| Build tool | Vite 7 |
| Language | JavaScript (ES modules) |
| Linting | ESLint 9 with react-hooks and react-refresh plugins |

A few things worth noting about the stack choices:

**React 19** is very fresh — this project was built on the latest stable release, picking up the new compiler optimizations and concurrent features that shipped with it.

**React Router v7** introduced a significant API shift toward a more framework-like pattern with route loaders and actions. Using v7 from the start means the routing architecture is current rather than using patterns that are being phased out.

**date-fns-tz** alongside date-fns means all date/time handling is timezone-aware out of the box — no `moment.js` bloat, no UTC conversion bugs.

**Vite 7** gives near-instant dev server startup and fast HMR, which paired with React 19's Fast Refresh makes for a tight development loop.

---

## Running locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

---

## Project context

Built as the capstone project for a full-stack web development bootcamp, focusing on React architecture, client-side routing patterns, and working with date/time data in a real application context.
