import { useEffect, useState } from "react";
import { useAppState } from "../state/AppState.jsx";

const QUALS = ["OR", "Fluoro", "Dexa"];

export default function EditQualModal({ user, onClose }) {
  const { actions } = useAppState();

  const [quals, setQuals] = useState(() => ({
    OR: !!user?.qualifications?.OR,
    Fluoro: !!user?.qualifications?.Fluoro,
    Dexa: !!user?.qualifications?.Dexa,
  }));

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function toggle(k) { setQuals((q) => ({ ...q, [k]: !q[k] })); }

  function onSave(e) {
    e.preventDefault();
    actions.updateUser(user._id, { qualifications: { ...quals } });
    onClose();
  }

  return (
    <div className="modal">
      <div className="modal__scrim" onClick={onClose} />
      <div className="modal__card" role="dialog" aria-modal="true" aria-label="Edit qualifications">
        <header className="modal__head">
          <h3>Edit qualifications</h3>
          <button type="button" className="btn btn--ghost" onClick={onClose}>✕</button>
        </header>

        <div className="muted" style={{ marginBottom: 8 }}>
          {user.name} — ID {user.employeeId || "—"}
        </div>

        <form onSubmit={onSave} className="form">
          <div className="row" style={{ gap: 18 }}>
            {QUALS.map((k) => (
              <label key={k} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="checkbox" checked={!!quals[k]} onChange={() => toggle(k)} /> {k}
              </label>
            ))}
          </div>

          <div className="modal__actions">
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn--primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
