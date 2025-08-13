import { useMemo } from 'react';
import { useAppState } from '../state/AppState.jsx';

const days = ['mon','tue','wed','thu','fri','sat','sun'];
const labels = { mon:'Mon', tue:'Tue', wed:'Wed', thu:'Thu', fri:'Fri', sat:'Sat', sun:'Sun' };
const nextState = { green: 'yellow', yellow: 'red', red: 'green', undefined: 'green' };

export default function AvailabilityMatrix({ userId }) {
  const { state, actions } = useAppState();
  const user = useMemo(() => state.users.find((u) => u._id === userId), [state.users, userId]);
  if (!user) return <p>Select or create a user first.</p>;

  function cellClass(val) {
    if (val === 'green') return 'avail__cell avail--green';
    if (val === 'yellow') return 'avail__cell avail--yellow';
    return 'avail__cell avail--red';
  }

  return (
    <section className="avail">
      <h3>Weekly availability for {user.name}</h3>
      <div className="avail__legend">
        <span className="legend legend--green">Preferred</span>
        <span className="legend legend--yellow">Can work</span>
        <span className="legend legend--red">Cannot</span>
      </div>
      <div className="avail__grid" role="grid" aria-label="Availability grid">
        {days.map((d) => (
          <div key={d} className="avail__col" role="rowgroup" aria-label={labels[d]}>
            <div className="avail__daylabel">{labels[d]}</div>
            {Array.from({ length: 24 }, (_, h) => {
              const val = user.availabilityTemplate[d][h];
              return (
                <button
                  key={`${d}-${h}`}
                  className={cellClass(val)}
                  aria-label={`${labels[d]} ${String(h).padStart(2,'0')}:00 ${val || 'red'}`}
                  onClick={() => actions.setAvailabilityCell(userId, d, h, nextState[val])}
                />
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
