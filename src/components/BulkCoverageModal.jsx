import { useMemo, useState } from 'react';
import { useAppState } from '../state/AppState.jsx';
import { ymd, ymdListFromRange } from '../lib/time.js';

export default function BulkCoverageModal({ startDate, endDate, onClose }) {
  const { state, actions } = useAppState();
  const [start, setStart] = useState(ymd(startDate));
  const [end, setEnd] = useState(ymd(endDate ?? startDate));
  const [extraDate, setExtraDate] = useState('');
  const [extras, setExtras] = useState([]); // array of 'YYYY-MM-DD'
  const [perSite, setPerSite] = useState(() => {
    const obj = {};
    for (const s of state.sites) obj[s._id] = '';
    return obj;
  });

  const rangeDates = useMemo(() => {
    const s = new Date(start); const e = new Date(end);
    if (Number.isNaN(s) || Number.isNaN(e)) return [];
    return ymdListFromRange(s, e);
  }, [start, end]);

  const allDates = useMemo(() => {
    const set = new Set([...rangeDates, ...extras]);
    return Array.from(set).sort();
  }, [rangeDates, extras]);

  function apply() {
    // For each site with a number, set coverage for all selected dates
    const updates = Object.entries(perSite).filter(([, v]) => v !== '' && !Number.isNaN(Number(v)));
    for (const [siteId, val] of updates) {
      actions.setCoverageForDates(allDates, siteId, Number(val));
    }
    onClose();
  }

  return (
    <div className="modal">
      <div className="modal__scrim" onClick={onClose} />
      <div className="modal__card" role="dialog" aria-modal="true" aria-label="Bulk coverage">
        <header className="modal__head">
          <h3>Bulk coverage</h3>
          <button className="btn btn--ghost" onClick={onClose}>✕</button>
        </header>

        <div className="form">
          <div className="row">
            <label>From <input type="date" value={start} onChange={(e)=>setStart(e.target.value)} /></label>
            <label>To <input type="date" value={end} onChange={(e)=>setEnd(e.target.value)} /></label>
          </div>

          <div className="row">
            <label style={{ flex: 1 }}>
              Add specific date
              <div style={{ display:'flex', gap:8 }}>
                <input type="date" value={extraDate} onChange={(e)=>setExtraDate(e.target.value)} />
                <button type="button" className="btn" onClick={()=>{
                  if (extraDate && !extras.includes(extraDate)) setExtras([...extras, extraDate]);
                  setExtraDate('');
                }}>Add</button>
              </div>
            </label>
          </div>

          {extras.length > 0 && (
            <div className="alert">
              Extra dates: {extras.join(', ')}
            </div>
          )}

          <div className="coverage">
            <h4>Required per site (leave blank to skip)</h4>
            <div className="coverage__rows">
              {state.sites.map((s)=>(
                <label key={s._id} className="coverage__row">
                  <span className="chip">{s.name}</span>
                  <input
                    type="number" min="0"
                    placeholder={String(state.coverageDefaults?.[s._id] ?? 0)}
                    value={perSite[s._id]}
                    onChange={(e)=>setPerSite({...perSite, [s._id]: e.target.value})}
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="alert alert--warn">
            Applying to <strong>{allDates.length}</strong> date(s).
          </div>

          <div className="modal__actions">
            <button className="btn" onClick={onClose}>Cancel</button>
            <button className="btn btn--primary" onClick={apply} disabled={allDates.length === 0}>
              Apply to selected dates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
