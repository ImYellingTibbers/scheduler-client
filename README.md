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
