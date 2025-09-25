import { useState } from "react";
import { useAppState } from "../state/AppState.jsx";

const CORE_SITE_IDS = new Set(["general", "or", "fluoro", "dexa"]);

export default function SitesTable() {
  const { state, actions } = useAppState();
  const [name, setName] = useState("");

  function onAdd() {
    const trimmed = (name || "").trim();
    if (!trimmed) return;
    if (
      state.sites.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())
    ) {
      setName("");
      return;
    }
    actions.addSite(trimmed);
    setName("");
  }

  function ResetButton() {
    return (
      <button
        type="button"
        className="btn"
        onClick={() => {
          if (
            confirm(
              "Reset all local data? This will wipe users, sites, shifts."
            )
          ) {
            localStorage.clear();
            location.reload();
          }
        }}
      >
        Reset all data
      </button>
    );
  }

  return (
    <section className="card card--settings">
      <header className="card__head">
        <h4>Sites</h4>
      </header>

      <div className="card__body">
        <ul className="list__sites-list">
          {state.sites.map((s) => (
            <li className="sites-list__items" key={s._id}>
              <span title={s._id}>{s.name}</span>
              {!CORE_SITE_IDS.has(s._id) && (
                <button
                  type="button"
                  className="sites-list__btn"
                  onClick={() => actions.deleteSite(s._id)}
                  title={`Delete ${s.name}`}
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>

        <div className="form-inline" style={{ marginTop: 12 }}>
          <label htmlFor="new-site" style={{ marginRight: 6 }}>
            <strong>New site</strong>
          </label>
          <input
            id="new-site"
            placeholder="e.g., ICU"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onAdd()}
          />
          <button type="button" className="btn" onClick={onAdd}>
            Add site
          </button>
        </div>
      </div>
    </section>
  );
}
