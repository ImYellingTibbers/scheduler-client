import { useState, useMemo } from "react";
import { useAppState } from "../state/AppState.jsx";
import UsersTable from "../components/UsersTable.jsx";
import SitesTable from "../components/SitesTable.jsx";
import AvailabilityMatrix from "../components/AvailabilityMatrix.jsx";
import CoverageDefaults from "../components/CoverageDefaults.jsx";
import UserModal from "../components/UserModal.jsx";

export default function SettingsPage() {
  const { state } = useAppState();
  const [showAdd, setShowAdd] = useState(false);
  const [selectedId, setSelectedId] = useState(state.users[0]?._id || null);

  const selectedUser = useMemo(
    () => state.users.find((u) => u._id === selectedId) || state.users[0],
    [state.users, selectedId]
  );

  return (
    <section className="page">
      <h2>Settings</h2>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          margin: "8px 0 16px",
        }}
      >
        <button className="btn btn--primary" onClick={() => setShowAdd(true)}>
          + Add employee
        </button>
      </div>
      {showAdd && <UserModal onClose={() => setShowAdd(false)} />}

      <h3>Existing users</h3>
      <UsersTable />

      <div
        style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16 }}
      >
        <label>Edit availability for</label>
        <select
          value={selectedUser?._id || ""}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          {state.users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>

      <h3 style={{ marginTop: 8 }}>
        Weekly availability for {selectedUser?.name}
      </h3>
      <AvailabilityMatrix user={selectedUser} />

      <hr style={{ borderColor: "var(--border)", margin: "16px 0" }} />

      <h3>Sites</h3>
      <SitesTable />

      <CoverageDefaults />
    </section>
  );
}
