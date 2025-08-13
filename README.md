# Scheduler (Stage 1)

Hospital team scheduler (React + Vite) with holiday awareness, qualifications, availability templates (green/yellow/red), manual shift creation with validation, and coverage warnings.

## Features (Stage 1)
- Month calendar with **holiday badges** (Nager.Date API).
- **Users**: qualifications for OR/Fluoro/Dexa, employee ID.
- **Availability**: weekly 7×24 matrix (green/yellow/red) + per-date overrides.
- **Shifts**: add/edit/delete; blocks **red** hours, requires **site qualification**, warns on **yellow**, blocks **double booking**.
- **Coverage**: per-date/site required counts; calendar shows **Under** when not met.
- **Responsive** layout; keyboard focus visible; semantic markup.

## Tech
- React (Vite), React Router
- date-fns + date-fns-tz
- Fetch API (no axios/jQuery)

## Third-party API
- **Nager.Date** Public Holidays: `https://date.nager.at/api/v3/PublicHolidays/{year}/US`
  - Called in `src/api/holidays.js` via `fetch().then(res => res.json()).catch()`.
  - Results cached in app state/localStorage and used to flag dates in the calendar.

## Run locally
```bash
npm i
npm run dev
