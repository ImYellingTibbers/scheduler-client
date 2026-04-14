import { useState } from "react";
import { ymd, nice } from "../lib/time.js";
import { useAppState } from "../state/AppState.jsx";
import ShiftModal from "./ShiftModal.jsx";
import BulkCoverageModal from "./BulkCoverageModal.jsx";

export default function DayDetails({
  date,
  holidaysByDate,
  sites,
  coverageByDateSite,
  assignedByDateSite,
  coverageDefaults,
  shiftsForDate,
}) {
  const { actions } = useAppState();
  const [showModal, setShowModal] = useState(false);
  const [editShift, setEditShift] = useState(null);
  const [showBulk, setShowBulk] = useState(false);

  if (!date) {
    return (
      <aside className="details">
        <p>Select a day.</p>
      </aside>
    );
  }

  const key = ymd(date);
  const holidayName = holidaysByDate.get(key);

  return (
    <aside className="details">
      <h3>{nice(date)}</h3>
      {holidayName && <p className="details__holiday">🎉 {holidayName}</p>}

      <ul className="details__coverage">
        {sites.map((s) => {
          const override = coverageByDateSite.get(`${key}|${s._id}`);
          const required = override ?? coverageDefaults?.[s._id] ?? 0;
          const have = assignedByDateSite.get(`${key}|${s._id}`) || 0;
          const ok = have >= required;
          const isOverride = override != null;

          return (
            <li key={s._id}>
              <span className="details__coverage-ok">
                <span className={`dot ${ok ? "dot--ok" : "dot--warn"}`} />
                <span className="chip">{s.name}</span>
              </span>

              {/* italicize overridden defaults */}
              <strong
                style={{ fontStyle: isOverride ? "italic" : "normal" }}
                title={isOverride ? "Edited (override)" : "Using default"}
              >
                {have} / {required}
              </strong>
            </li>
          );
        })}
      </ul>
      <p className="details__legend">
        <em>Italic</em> = edited for this date; normal = default.
      </p>

      {/* Bulk editor (range + extra dates) */}
      <button
        type="button"
        className="btn btn--edit-coverage"
        style={{ marginBottom: 8 }}
        onClick={() => setShowBulk(true)}
      >
        Edit Coverage Needs
      </button>
      {showBulk && (
        <BulkCoverageModal
          startDate={date}
          endDate={date}
          onClose={() => setShowBulk(false)}
        />
      )}

      <div className="details__list">
        {shiftsForDate.length === 0 ? (
          <p>No shifts yet.</p>
        ) : (
          shiftsForDate.map((sh) => (
            <article key={sh._id} className="shift">
              <header className="shift__head">
                <strong>{sh.userName}</strong>{" "}
                <span className="chip">{sh.siteName}</span>
                <time>
                  {sh.start.slice(11, 16)}–{sh.end.slice(11, 16)}
                </time>
              </header>
              <footer className="shift__foot">
                <button
                  className="btn"
                  onClick={() => {
                    setEditShift(sh);
                    setShowModal(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn--ghost"
                  onClick={() => actions.deleteShift(sh._id)}
                >
                  Delete
                </button>
              </footer>
            </article>
          ))
        )}
      </div>

      <button
        className="btn btn--primary"
        onClick={() => {
          setEditShift(null);
          setShowModal(true);
        }}
      >
        + Add Shift
      </button>

      {showModal && (
        <ShiftModal
          date={date}
          existing={editShift}
          onClose={() => {
            setShowModal(false);
            setEditShift(null);
          }}
        />
      )}
    </aside>
  );
}
