import { useState, Fragment } from "react";
import { useAppState } from "../state/AppState.jsx";
import EditQualModal from "./EditQualModal.jsx";

export default function UsersTable() {
  const { state, actions } = useAppState();
  const [editingUser, setEditingUser] = useState(null);

  return (
    <Fragment>
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
          {state.users.length === 0 ? (
            <tr>
              <td className="tbl__empty" colSpan={6}>
                No users yet.
              </td>
            </tr>
          ) : (
            state.users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.employeeId || "—"}</td>
                <td className="tbl__qual">
                  {u.qualifications?.OR ? "✓" : "—"}
                </td>
                <td className="tbl__qual">
                  {u.qualifications?.Fluoro ? "✓" : "—"}
                </td>
                <td className="tbl__qual">
                  {u.qualifications?.Dexa ? "✓" : "—"}
                </td>
                <td className="tbl__actions">
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setEditingUser(u)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => {
                      const idText = u.employeeId
                        ? ` — ID ${u.employeeId}`
                        : "";
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
            ))
          )}
        </tbody>
      </table>

      {editingUser && (
        <EditQualModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
        />
      )}
    </Fragment>
  );
}
