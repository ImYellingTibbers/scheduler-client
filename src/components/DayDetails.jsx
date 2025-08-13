import { ymd, nice } from '../lib/time.js';

export default function DayDetails({
  date, holidaysByDate, sites, coverageByDateSite, assignedByDateSite, shiftsForDate,
}) {
  if (!date) return <aside className="details"><p>Select a day.</p></aside>;
  const key = ymd(date);
  const holidayName = holidaysByDate.get(key);

  return (
    <aside className="details">
      <h3>{nice(date)}</h3>
      {holidayName && <p className="details__holiday">🎉 {holidayName}</p>}

      <ul className="details__coverage">
        {sites.map((s) => {
          const req = coverageByDateSite.get(`${key}|${s._id}`) || 0;
          const have = assignedByDateSite.get(`${key}|${s._id}`) || 0;
          const ok = have >= req;
          return (
            <li key={s._id}>
              <span className="chip">{s.name}</span>
              <strong>{have} / {req}</strong>
              <span className={`dot ${ok ? 'dot--ok' : 'dot--warn'}`} />
            </li>
          );
        })}
      </ul>

      <div className="details__list">
        {shiftsForDate.length === 0 ? (
          <p>No shifts yet.</p>
        ) : (
          shiftsForDate.map((sh) => (
            <article key={sh._id} className="shift">
              <header className="shift__head">
                <strong>{sh.userName}</strong> <span className="chip">{sh.siteName}</span>
                <time>{sh.start.slice(11,16)}–{sh.end.slice(11,16)}</time>
              </header>
            </article>
          ))
        )}
      </div>

      {/* Next step will add a real modal */}
      <button className="btn btn--primary" disabled title="Add Shift coming in next step">+ Add Shift</button>
    </aside>
  );
}
