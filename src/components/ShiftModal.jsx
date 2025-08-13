import { useMemo, useState } from "react";
import { useAppState, availabilityForSpan } from "../state/AppState.jsx";
import { toISO, addHoursISO, ymd, overlaps } from "../lib/time.js";

const QUAL_MAP = { or: "OR", fluoro: "Fluoro", dexa: "Dexa" };

export default function ShiftModal({ date, onClose, existing }) {
  const { state, actions } = useAppState();

  const [userId, setUserId] = useState(
    existing?.userId || (state.users[0]?._id ?? "")
  );
  const [siteId, setSiteId] = useState(
    existing?.siteId || (state.sites[0]?._id ?? "general")
  );
  const [startTime, setStartTime] = useState(
    existing ? existing.start.slice(11, 16) : "07:00"
  );
  const [duration, setDuration] = useState(
    existing
      ? Math.max(
          1,
          Math.round((new Date(existing.end) - new Date(existing.start)) / 36e5)
        )
      : 10
  );

  const user = useMemo(
    () => state.users.find((u) => u._id === userId),
    [state.users, userId]
  );
  const site = useMemo(
    () => state.sites.find((s) => s._id === siteId),
    [state.sites, siteId]
  );

  // Build times
  const startISO = toISO(date, startTime);
  const endISO = addHoursISO(startISO, Number(duration) || 1);

  // Double-booking detection
  const conflict = useMemo(() => {
    return state.shifts.find(
      (sh) =>
        sh.userId === userId &&
        sh._id !== (existing?._id || null) &&
        overlaps(startISO, endISO, sh.start, sh.end)
    );
  }, [state.shifts, userId, startISO, endISO, existing]);

  const conflictSiteName = conflict
    ? state.sites.find((s) => s._id === conflict.siteId)?.name ||
      conflict.siteId
    : "";

  // Availability status along the span
  const statuses = user
    ? availabilityForSpan(user, startISO, Number(duration) || 1)
    : new Set(["red"]);
  const hasRed = statuses.has("red");
  const hasYellow = statuses.has("yellow");

  // Qualification rule for specialized sites
  const needsQual = QUAL_MAP[siteId];
  const hasQual = !needsQual || user?.qualifications?.[needsQual] === true;

  // Validation
  const errors = [];
  if (!user) errors.push("Select a user");
  if (!site) errors.push("Select a site");
  if (!hasQual) errors.push(`User lacks qualification for ${site?.name}`);
  if (conflict) {
    errors.push(
      `User already booked ${conflict.start.slice(11, 16)}–${conflict.end.slice(
        11,
        16
      )} (${conflictSiteName}).`
    );
  }

  const warning =
    hasYellow && !hasRed ? "This shift intersects yellow (can work) time." : "";
  const canSave = errors.length === 0 && !hasRed && !conflict;

  function onSubmit(e) {
    e.preventDefault();
    if (!canSave) return;
    if (existing) {
      actions.updateShift(existing._id, {
        userId,
        siteId,
        start: startISO,
        end: endISO,
      });
    } else {
      actions.addShift({ userId, siteId, startISO, endISO });
    }
    onClose();
  }

  return (
    <div className="modal">
      <div className="modal__scrim" onClick={onClose} />
      <div
        className="modal__card"
        role="dialog"
        aria-modal="true"
        aria-label="Shift editor"
      >
        <header className="modal__head">
          <h3>{existing ? "Edit shift" : "Add shift"}</h3>
          <button className="btn btn--ghost" onClick={onClose}>
            ✕
          </button>
        </header>

        <form onSubmit={onSubmit} className="form">
          <div className="row">
            <label style={{ flex: 1 }}>
              Date
              <input value={ymd(date)} readOnly />
            </label>
            <label style={{ flex: 1 }}>
              Start
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </label>
            <label style={{ width: 110 }}>
              Hours
              <input
                type="number"
                min="1"
                max="24"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </label>
          </div>

          <div className="row">
            <label style={{ flex: 1 }}>
              User
              <select
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              >
                {state.users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </label>
            <label style={{ flex: 1 }}>
              Site
              <select
                value={siteId}
                onChange={(e) => setSiteId(e.target.value)}
                required
              >
                {state.sites.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {errors.length > 0 && (
            <div className="alert alert--error">
              {errors.map((e, i) => (
                <div key={i}>• {e}</div>
              ))}
            </div>
          )}
          {warning && <div className="alert alert--warn">{warning}</div>}
          {hasRed && (
            <div className="alert alert--error">
              This shift overlaps red (cannot work) time.
            </div>
          )}

          <footer className="modal__actions">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={!canSave}
            >
              {existing ? "Save changes" : "Add shift"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
