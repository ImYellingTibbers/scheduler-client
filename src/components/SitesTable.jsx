import { useState } from 'react';
import { useAppState } from '../state/AppState.jsx';

export default function SitesTable() {
  const { state, actions } = useAppState();
  const [name, setName] = useState('');

  return (
    <section>
      <form className="form" onSubmit={(e)=>{e.preventDefault(); actions.addSite(name); setName('');}}>
        <label>New site <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="e.g., ICU" /></label>
        <button type="submit">Add site</button>
      </form>
      <ul className="list">
        {state.sites.map((s) => (
          <li key={s._id}>
            {s.name}
            {s._id !== 'general' && <button onClick={()=>actions.deleteSite(s._id)}>Delete</button>}
          </li>
        ))}
      </ul>
    </section>
  );
}
