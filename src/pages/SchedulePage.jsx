import { useMemo, useState } from "react";
import { useAppState } from "../state/AppState.jsx";
import CalendarGrid from "../components/CalendarGrid.jsx";
import DayDetails from "../components/DayDetails.jsx";
import { ymd } from "../lib/time.js";

export default function SchedulePage() {
  const { state } = useAppState();
  const [monthDate, setMonthDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Build quick lookup maps
  const holidaysByDate = useMemo(() => {
    const m = new Map();
    for (const h of state.holidays)
      m.set(h.date, h.localName || h.name || "Holiday");
    return m;
  }, [state.holidays]);

  const coverageByDateSite = useMemo(() => {
    const m = new Map();
    for (const c of state.coverage)
      m.set(`${c.date}|${c.siteId}`, Number(c.requiredCount) || 0);
    return m;
  }, [state.coverage]);

  const assignedByDateSite = useMemo(() => {
    const m = new Map();
    for (const sh of state.shifts) {
      const k = `${sh.start.slice(0, 10)}|${sh.siteId}`;
      m.set(k, (m.get(k) || 0) + 1);
    }
    return m;
  }, [state.shifts]);

  const shiftsForSelected = useMemo(() => {
    const k = ymd(selectedDate);
    return state.shifts
      .filter((sh) => sh.start.startsWith(k))
      .map((sh) => ({
        ...sh,
        userName:
          state.users.find((u) => u._id === sh.userId)?.name || "Unknown",
        siteName:
          state.sites.find((s) => s._id === sh.siteId)?.name || sh.siteId,
      }));
  }, [state.shifts, state.users, state.sites, selectedDate]);

  return (
    <section className="page page--schedule">
      <div className="toolbar">
        <button
          className="toolbar__button previous"
          onClick={() =>
            setMonthDate(
              new Date(monthDate.getFullYear(), monthDate.getMonth() - 1, 1)
            )
          }
          aria-label="Previous month"
        >
          ‹
        </button>
        <h2>
          {monthDate.toLocaleString("default", { month: "long" })}{" "}
          {monthDate.getFullYear()}
        </h2>
        <button
          className="toolbar__button next"
          onClick={() =>
            setMonthDate(
              new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1)
            )
          }
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div className="layout">
        <CalendarGrid
          monthDate={monthDate}
          selectedDate={selectedDate}
          holidaysByDate={holidaysByDate}
          coverageByDateSite={coverageByDateSite}
          assignedByDateSite={assignedByDateSite}
          sites={state.sites}
          onSelectDate={(d) => setSelectedDate(d)}
        />

        <DayDetails
          date={selectedDate}
          holidaysByDate={holidaysByDate}
          sites={state.sites}
          coverageByDateSite={coverageByDateSite}
          assignedByDateSite={assignedByDateSite}
          shiftsForDate={shiftsForSelected}
        />
      </div>
    </section>
  );
}
