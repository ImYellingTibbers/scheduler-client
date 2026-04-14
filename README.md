<<<<<<< stage1-work
# Scheduler (Stage 1)

Hospital team scheduler (React + Vite) with holiday awareness, site qualifications, 30-minute availability, manual shift creation with validation, and coverage planning. Data is stored locally (no backend yet).

## Project summary (Stage 1)

- React SPA (Vite) with routes: **Schedule**, **Settings**, **About**
- **Public Holidays API** (Nager.Date) integrated and shown in UI
- Month calendar + day details with coverage **have / required** (italic = per-date override)
- **Shifts:** add/edit/delete; double-booking prevention; qualification checks; availability warnings/blocks
- **Availability editor:** 30-minute slots, paint tool (Preferred / Can work / Cannot), default **Mon–Thu 06:00–16:30** (4×10.5)
- **Sites & coverage:** manage sites, coverage defaults, bulk per-date overrides
- **Users:** add with preset, duplicate Employee-ID guard, delete confirm, **edit qualifications** modal
- Persistence via **localStorage**; time zone: `America/Denver`
- Scope: no backend/auth yet; automation planned for Stage 2/3

## Features

- **Calendar & holidays:** month view with holiday badges (Nager.Date); selected-day panel
- **Coverage:** defaults per site; per-date overrides via inline edit or bulk editor; calendar badges show **Under** when not met
- **Shifts & validation:** blocks red hours; warns on yellow; blocks overlaps; enforces OR/Fluoro/Dexa quals
- **Availability:** weekly 7×24 grid (48 half-hour slots per day); click/drag painting
- **Settings UX:** add employee modal (optional 4×10.5 preset), edit qualifications, sites list with add/delete

## Tech

- React (Vite), React Router
- date-fns
- Fetch API
- CSS modules by page/component (no UI framework)

## Data model (client-side)

- **User:** `{ _id, name, employeeId, qualifications:{OR,Fluoro,Dexa}, availabilityTemplate:{mon..sun:[48]}, overrides:[{date,status}] }`
- **Site:** `{ _id, name }` (seeded: `general`, `or`, `fluoro`, `dexa`)
- **Coverage:** `{ _id, date:'YYYY-MM-DD', siteId, requiredCount }`
- **Shift:** `{ _id, userId, siteId, start:ISO, end:ISO, status }`

## Third-party API

- **Nager.Date** Public Holidays  
  `https://date.nager.at/api/v3/PublicHolidays/{year}/US`  
  Called in `src/api/holidays.js`; results merged into app state and shown on the calendar/day panel.

## Local development

```bash
npm i
npm run dev
```
=======
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
>>>>>>> main
