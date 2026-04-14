import { useState } from "react";
import { useAppState } from "../state/AppState.jsx";

export default function UserForm() {
  const { actions } = useAppState();
  const [form, setForm] = useState({
    name: "",
    employeeId: "",
    qualOR: false,
    qualFluoro: false,
    qualDexa: false,
  });

  function onSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    actions.addUser(form);
    setForm({
      name: "",
      employeeId: "",
      qualOR: false,
      qualFluoro: false,
      qualDexa: false,
    });
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="row">
        <label>
          {" "}
          Name{" "}
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </label>
        <label>
          {" "}
          Employee ID{" "}
          <input
            value={form.employeeId}
            onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
          />
        </label>
      </div>
      <div className="row">
        <label>
          <input
            type="checkbox"
            checked={form.qualOR}
            onChange={(e) => setForm({ ...form, qualOR: e.target.checked })}
          />{" "}
          OR
        </label>
        <label>
          <input
            type="checkbox"
            checked={form.qualFluoro}
            onChange={(e) => setForm({ ...form, qualFluoro: e.target.checked })}
          />{" "}
          Fluoro
        </label>
        <label>
          <input
            type="checkbox"
            checked={form.qualDexa}
            onChange={(e) => setForm({ ...form, qualDexa: e.target.checked })}
          />{" "}
          Dexa
        </label>
      </div>
      <button type="submit">Add user</button>
    </form>
  );
}
