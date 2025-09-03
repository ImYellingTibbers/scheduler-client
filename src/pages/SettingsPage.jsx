import { useMemo, useState } from "react";
import { useAppState } from "../state/AppState.jsx";
import UsersTable from "../components/UsersTable.jsx";
import UserForm from "../components/UserForm.jsx";
import SitesTable from "../components/SitesTable.jsx";
import AvailabilityMatrix from "../components/AvailabilityMatrix.jsx";
import CoverageDefaults from "../components/CoverageDefaults.jsx";

export default function SettingsPage() {
  const { state } = useAppState();
  const [selectedUserId, setSelectedUserId] = useState(null);

  const usersOptions = useMemo(
    () => state.users.map((u) => ({ id: u._id, name: u.name })),
    [state.users]
  );

  return (
    <section className="page">
      <h2>Settings</h2>

      <h3>People</h3>
      <UserForm />
      <UsersTable />
      {usersOptions.length > 0 && (
        <div className="form" style={{ marginTop: 16 }}>
          <label>
            Edit availability for:
            <select
              value={selectedUserId || ""}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <option value="">— Select user —</option>
              {usersOptions.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
      {selectedUserId && <AvailabilityMatrix userId={selectedUserId} />}

      <hr style={{ borderColor: "var(--border)", margin: "24px 0" }} />

      <h3>Sites</h3>
      <SitesTable />

      <CoverageDefaults />
      <p style={{ color: "#9fb3c8", fontSize: 14 }}>
        Default sites: General (everyone), OR, Fluoro, Dexa (require
        qualifications).
      </p>
    </section>
  );
}
