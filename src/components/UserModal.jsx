import { useMemo, useState, useEffect } from "react";
import { useAppState } from "../state/AppState.jsx";

function makeTemplateFourByTen() {
  const yellow = () => Array(24).fill("yellow");
  const tpl = {
    mon: yellow(),
    tue: yellow(),
    wed: yellow(),
    thu: yellow(),
    fri: yellow(),
    sat: yellow(),
    sun: yellow(),
  };
  // Mon–Thu 06:00–16:00 (10 hours: 6..15) as green (preferred)
  for (const d of ["mon", "tue", "wed", "thu"]) {
    for (let h = 6; h < 16; h += 1) tpl[d][h] = "green";
  }
  return tpl;
}

export default function UserModal({ onClose }) {
  const { state, actions } = useAppState();

  // ESC to close
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
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
        ? makeTemplateFourByTen()
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
                Set basic availability to <strong>Mon–Thu 06:00–16:00</strong>{" "}
                (4 × 10hr shifts)
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
