import { useAppState } from '../state/AppState.jsx';

export default function CoverageDefaults() {
  const { state, actions } = useAppState();
  return (
    <section style={{ marginTop: 24 }}>
      <h3>Coverage defaults</h3>
      <p style={{ color: '#9fb3c8', fontSize: 14 }}>
        Used when a date doesn’t have an override.
      </p>
      <div style={{ display: 'grid', gap: 8, maxWidth: 360 }}>
        {state.sites.map((s) => (
          <label key={s._id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="chip" style={{ minWidth: 80 }}>{s.name}</span>
            <input
              type="number"
              min="0"
              value={state.coverageDefaults?.[s._id] ?? 0}
              onChange={(e) => actions.setCoverageDefault(s._id, Number(e.target.value) || 0)}
            />
          </label>
        ))}
      </div>
    </section>
  );
}
