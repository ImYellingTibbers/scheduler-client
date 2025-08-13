import { useMemo } from 'react';
import { useAppState } from '../state/AppState.jsx';
import { ymd } from '../lib/time.js';

export default function CoverageEditor({ date }) {
  const { state, actions } = useAppState();
  const key = ymd(date);

  // quick lookup for existing required counts
  const requiredBySite = useMemo(() => {
    const m = new Map();
    for (const c of state.coverage) {
      if (c.date === key) m.set(c.siteId, Number(c.requiredCount) || 0);
    }
    return m;
  }, [state.coverage, key]);

  if (!date) return null;

  return (
    <div className="coverage">
      <h4>Coverage requirements for {key}</h4>
      <div className="coverage__rows">
        {state.sites.map((s) => {
          const val = requiredBySite.get(s._id) ?? 0;
          return (
            <label key={s._id} className="coverage__row">
              <span className="chip">{s.name}</span>
              <input
                type="number"
                min="0"
                value={val}
                onChange={(e) => actions.setCoverage(key, s._id, Number(e.target.value) || 0)}
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}
