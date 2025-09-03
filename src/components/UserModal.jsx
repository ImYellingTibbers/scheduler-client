import { useMemo, useState } from "react";
import { useAppState } from "../state/AppState.jsx";

function makeTemplateFourByTen() {
  // 24 red hours
  const red = () => Array(24).fill("red");
  const tpl = { mon: red(), tue: red(), wed: red(), thu: red(), fri: red(), sat: red(), sun: red() };
  // Mon–Thu, 06:00–16:00 (10 hours: 6..15)
  for (const d of ["mon", "tue", "wed", "thu"]) {
    for (let h = 6; h < 16; h += 1) tpl[d][h] = "green";
  }
  return tpl;
}

export default function UserModal({ onClose }) {
  const { actions } = useAppState();
  const [name, setName] = useState("");
  const [empId, setEmpId] = useState("");
  const [qualOR, setQualOR] = useState(false);
  const [qualFluoro, setQualFluoro] = useState(false);
  const [qualDexa, setQualDexa] = useState(false);
  const [useDefaultAvail, setUseDefaultAvail] = useState(true);

  const canSave = name.trim().length > 0;

  function submit(e) {
    e.preventDefault();
    if (!canSave) return;

    actions.addUser({
      name,
      employeeId: empId,
      qualOR,
      qualFluoro,
      qualDexa,
      availabilityTemplate: useDefaultAvail ? makeTemplateFourByTen() : undefined,
    });
    onClose();
  }

  return (
    <div className="modal">
      <div className="modal__scrim" onClick={onClose} />
      <div className="modal__card" role="dialog" aria-modal="true" aria-label="Add employee">
        <header className="modal__head">
          <h3>Add employee</h3>
          <button className="btn btn--ghost" onClick={onClose}>✕</button>
        </header>

        <form onSubmit={submit} className="form">
          <div className="row">
            <label style={{ flex: 1 }}>
              Name
              <input value={name} onChange={(e)=>setName(e.target.value)} required />
            </label>
            <label style={{ width: 180 }}>
              Employee ID
              <input value={empId} onChange={(e)=>setEmpId(e.target.value)} />
            </label>
          </div>

          <div className="row" style={{ gap: 16 }}>
            <label><input type="checkbox" checked={qualOR} onChange={(e)=>setQualOR(e.target.checked)} /> OR</label>
            <label><input type="checkbox" checked={qualFluoro} onChange={(e)=>setQualFluoro(e.target.checked)} /> Fluoro</label>
            <label><input type="checkbox" checked={qualDexa} onChange={(e)=>setQualDexa(e.target.checked)} /> Dexa</label>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" checked={useDefaultAvail} onChange={(e)=>setUseDefaultAvail(e.target.checked)} />
            Set basic availability to <strong>Mon–Thu 06:00–16:00</strong> (4×10)
          </label>

          <div className="modal__actions">
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn--primary" disabled={!canSave}>Add employee</button>
          </div>
        </form>
      </div>
    </div>
  );
}
