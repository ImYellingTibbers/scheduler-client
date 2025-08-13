import { monthGrid, ymd, isSameMonthLocal, isTodayLocal } from "../lib/time.js";

export default function CalendarGrid({
  monthDate, // Date for the visible month
  holidaysByDate, // Map<string, string> date->holiday name
  coverageByDateSite, // Map<`${date}|${siteId}`, requiredCount>
  assignedByDateSite, // Map<`${date}|${siteId}`, count>
  sites, // [{_id,name}]
  onSelectDate, // (date: Date) => void
}) {
  const days = monthGrid(monthDate);
  const monthIdx = monthDate.getMonth();

  return (
    <div className="calendar">
      <div className="calendar__weekdays">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((w) => (
          <div key={w} className="calendar__weekday">
            {w}
          </div>
        ))}
      </div>

      <div className="calendar__grid">
        {days.map((d) => {
          const dateKey = ymd(d);
          const isCurMonth = isSameMonthLocal(d, monthDate);
          const holidayName = holidaysByDate.get(dateKey);
          // compute total shortfall across specialized sites
          let shortfall = 0;
          for (const s of sites) {
            const req = coverageByDateSite.get(`${dateKey}|${s._id}`) || 0;
            const have = assignedByDateSite.get(`${dateKey}|${s._id}`) || 0;
            shortfall += Math.max(0, req - have);
          }
          const understaffed = shortfall > 0;

          const cls = [
            "day",
            isCurMonth ? "" : "day--faded",
            isTodayLocal(d) ? "day--today" : "",
            holidayName ? "day--holiday" : "",
            understaffed ? "day--warn" : "",
          ].join(" ");

          return (
            <button
              key={dateKey}
              className={cls}
              onClick={() => onSelectDate(d)}
              aria-label={`${dateKey}${holidayName ? " — " + holidayName : ""}${
                understaffed ? " — understaffed" : ""
              }`}
            >
              <span className="day__date">{d.getDate()}</span>
              <div className="day__badges">
                {holidayName && (
                  <span className="badge badge--info">Holiday</span>
                )}
                {understaffed && (
                  <span className="badge badge--warn">Under</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
