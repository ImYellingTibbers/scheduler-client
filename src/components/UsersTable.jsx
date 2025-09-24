import { useAppState } from "../state/AppState.jsx";

export default function UsersTable() {
  const { state, actions } = useAppState();
  return (
    <table className="tbl">
      <thead>
        <tr>
          <th>Name</th>
          <th>Employee ID</th>
          <th>OR</th>
          <th>Fluoro</th>
          <th>Dexa</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {state.users.map((u) => (
          <tr key={u._id}>
            <td>{u.name}</td>
            <td>{u.employeeId || "—"}</td>
            <td>{u.qualifications?.OR ? "✓" : "—"}</td>
            <td>{u.qualifications?.Fluoro ? "✓" : "—"}</td>
            <td>{u.qualifications?.Dexa ? "✓" : "—"}</td>
            <td>
              <button
                className="btn btn--ghost"
                onClick={() => {
                  const idText = u.employeeId ? ` — ID ${u.employeeId}` : "";
                  if (
                    window.confirm(
                      `Are you sure you want to delete "${u.name}"${idText}? This will also remove their assigned shifts.`
                    )
                  ) {
                    actions.deleteUser(u._id);
                  }
                }}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
