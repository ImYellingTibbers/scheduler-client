export default function AboutPage() {
  const year = new Date().getFullYear();

  return (
    <section className="page page--about">
      <h2>
        About this project <span className="chip">Stage 1</span>
      </h2>

      <p>
        Scheduler is a lightweight staffing tool for Megan’s team. It lets you
        manage people, their qualifications and availability, add shifts with
        guardrails, and spot understaffed days at a glance. U.S. public holidays
        are pulled from a third-party API to help planning.
      </p>

      <h3>What’s implemented in Stage 1</h3>
      <ul>
        <li>
          Month calendar with <em>Holiday</em> badges (Nager.Date API).
        </li>
        <li>People &amp; qualifications (General, OR, Fluoro, Dexa).</li>
        <li>
          Weekly availability template (green / yellow / red) + per-date
          overrides.
        </li>
        <li>
          Shifts: add / edit / delete with validation:
          <ul>
            <li>Blocks red (cannot work) hours.</li>
            <li>Warns on yellow (can work) hours.</li>
            <li>Requires site qualification for OR/Fluoro/Dexa.</li>
            <li>
              Prevents double-booking (overlapping shifts for the same person).
            </li>
          </ul>
        </li>
        <li>
          Coverage needs: per-site defaults + per-date overrides via bulk
          editor.
        </li>
        <li>“Under” indicator on days where required coverage isn’t met.</li>
        <li>Responsive layout and visible keyboard focus rings.</li>
        <li>Local persistence (no backend yet) for fast testing.</li>
      </ul>

      <h3>How to use</h3>
      <ol>
        <li>
          <strong>Settings → People:</strong> add team members and mark
          qualifications.
        </li>
        <li>
          <strong>Settings → People:</strong> set weekly availability (click to
          cycle green → yellow → red).
        </li>
        <li>
          <strong>Schedule:</strong> pick a day and click{" "}
          <em>Edit coverage needs…</em> to set defaults/overrides for a range.
        </li>
        <li>
          <strong>Schedule:</strong> click a day → <em>+ Add Shift</em> to
          assign staff. Validation prevents conflicts.
        </li>
      </ol>

      <h3>Tech stack</h3>
      <ul>
        <li>React (Vite) + React Router</li>
        <li>date-fns / date-fns-tz for time &amp; formatting</li>
        <li>Public Holidays via Nager.Date JSON API</li>
        <li>Deployed to GitHub Pages</li>
      </ul>

      <h3>Data model (client-side)</h3>
      <table className="tbl">
        <thead>
          <tr>
            <th>Entity</th>
            <th>Shape</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>user</code>
            </td>
            <td>
              <code>{`{ _id, name, employeeId, qualifications:{OR,Fluoro,Dexa}, availabilityTemplate:{mon..sun:[24]}, overrides:[{date,status}] }`}</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>shift</code>
            </td>
            <td>
              <code>{`{ _id, userId, siteId, start: ISO, end: ISO, status }`}</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>coverage</code>
            </td>
            <td>
              <code>{`{ _id, date:'YYYY-MM-DD', siteId, requiredCount }`}</code>{" "}
              (overrides)
            </td>
          </tr>
          <tr>
            <td>
              <code>coverageDefaults</code>
            </td>
            <td>
              <code>{`{ general, or, fluoro, dexa }`}</code> (fallbacks)
            </td>
          </tr>
        </tbody>
      </table>

      <h3>Privacy & data</h3>
      <div className="alert">
        No backend in Stage 1. Data is stored in <strong>localStorage</strong>{" "}
        on this device only. The app uses names and an optional employee ID—no
        PII like DOB or SSN.
      </div>

      <h3>Roadmap</h3>
      <ul>
        <li>
          <strong>Stage 2 (Backend):</strong> Express + DB, server-side
          validation, REST API.
        </li>
        <li>
          <strong>Stage 3 (Auth):</strong> JWT login, protected routes, replace
          localStorage with API calls.
        </li>
        <li>
          <strong>Automation (post-S3):</strong> constraint-based
          auto-scheduling using availability, quals, and coverage.
        </li>
      </ul>

      <h3>Licenses & credits</h3>
      <ul>
        <li>Holidays data: Nager.Date.</li>
        <li>Inter font: SIL Open Font License.</li>
      </ul>

      <p style={{ color: "#9fb3c8", fontSize: 12, marginTop: 12 }}>
        © {year} Scheduler. Built for the TripleTen final project.
      </p>
    </section>
  );
}
