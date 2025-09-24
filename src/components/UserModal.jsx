import { useMemo, useState, useEffect } from "react";
import { useAppState } from "../state/AppState.jsx";

// Build a 48-slot (30-min) weekly template with Mon–Thu 06:00–16:30 green
function makeTemplateFourByTen48() {
  const makeDay = () => Array(48).fill("yellow"); // base = can work
  const tpl = {
    mon: makeDay(),
    tue: makeDay(),
    wed: makeDay(),
    thu: makeDay(),
    fri: makeDay(),
    sat: makeDay(),
    sun: makeDay(),
  };
  // slots: 06:00 = 12, 16:30 end means 21 slots total => last slot index = 32
  const startSlot = 6 * 2; // 12
  const endSlotInclusive = 16 * 2; // 32 (covers 16:00–16:30)
  for (const d of ["mon", "tue", "wed", "thu"]) {
    for (let s = startSlot; s <= endSlotInclusive; s += 1) {
      tpl[d][s] = "green";
    }
  }
  return tpl;
}

export default function UserModal({ onClose }) {
  const { state, actions } = useAppState();

  // ESC to close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const [name, setName] = useState("");
  const [empId, setEmpId] = useState("");
  const [qualOR, setQualOR] = useState(false);
  const [qualFluoro, setQualFluoro] = useState(false);
  const [qualDexa, setQualDexa] = useState(false);
  const [useDefaultAvail, setUseDefaultAvail] = useState(true);

  const empIdTrim = (empId || "").trim();
  const duplicateId = useMemo(() => {
    if (!empIdTrim) return false;
    return state.users.some(
      (u) =>
        (u.employeeId || "").trim().toLowerCase() === empIdTrim.toLowerCase()
    );
  }, [state.users, empIdTrim]);

  const canSave = name.trim().length > 0 && !duplicateId;

  function submit(e) {
    e.preventDefault();
    if (!canSave) return;
    actions.addUser({
      name,
      employeeId: empIdTrim,
      qualOR,
      qualFluoro,
      qualDexa,
      availabilityTemplate: useDefaultAvail
        ? makeTemplateFourByTen48()
        : undefined,
    });
    onClose();
  }

  return (
    <div className="modal">
      <div className="modal__scrim" onClick={onClose} />
      <div
        className="modal__card"
        role="dialog"
        aria-modal="true"
        aria-label="Add employee"
      >
        <header className="modal__head">
          <h3>Add employee</h3>
          <button
            type="button"
            aria-label="Close"
            className="btn btn--ghost"
            onClick={onClose}
          >
            ✕
          </button>
        </header>

        <form onSubmit={submit} className="form form--dialog">
          <div className="formgrid">
            <label className="field">
              <span className="field__label">Name</span>
              <input
                className="field__control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                required
              />
            </label>

            <label className="field">
              <span className="field__label">Employee ID</span>
              <input
                className="field__control"
                value={empId}
                onChange={(e) => setEmpId(e.target.value)}
                aria-invalid={duplicateId ? "true" : "false"}
                title="Must be unique"
              />
            </label>

            <div className="field field--inline">
              <span className="field__label">Qualified for</span>
              <div className="checks">
                <label>
                  <input
                    type="checkbox"
                    checked={qualOR}
                    onChange={(e) => setQualOR(e.target.checked)}
                  />{" "}
                  OR
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={qualFluoro}
                    onChange={(e) => setQualFluoro(e.target.checked)}
                  />{" "}
                  Fluoro
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={qualDexa}
                    onChange={(e) => setQualDexa(e.target.checked)}
                  />{" "}
                  Dexa
                </label>
              </div>
            </div>

            <label className="field field--inline">
              <span>
                <input
                  type="checkbox"
                  checked={useDefaultAvail}
                  onChange={(e) => setUseDefaultAvail(e.target.checked)}
                />{" "}
                Set basic availability to <strong>Mon–Thu 06:00–16:30</strong>{" "}
                (4 × 10.5 hr)
              </span>
            </label>

            {duplicateId && (
              <div
                className="alert alert--error"
                role="alert"
                style={{ gridColumn: "1 / -1" }}
              >
                Employee ID “{empIdTrim}” already exists.
              </div>
            )}
          </div>

          <div className="modal__actions">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={!canSave}
            >
              Add employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
