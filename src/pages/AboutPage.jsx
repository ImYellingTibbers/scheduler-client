export default function AboutPage() {
  const year = new Date().getFullYear();

  return (
    <section className="page">
      <h2>About</h2>

      <p>
        This app is a scheduling tool for a small hospital team. It lets a
        scheduler plan coverage by day and location, enforce basic constraints,
        and persist everything locally. A public-holidays API is used to surface
        holiday context while planning. Stage 2/3 will add a backend, auth, and
        automation.
      </p>

      <h3>What it does (Stage 1)</h3>
      <ul>
        <li>
          <strong>Calendar + day panel.</strong> Click a date to view/edit
          shifts and coverage. Holiday names appear for that day.
        </li>
        <li>
          <strong>Shifts with validation.</strong> Add/edit/delete shifts.
          Blocks double-booking per user, warns on “can work” (yellow), and
          blocks “cannot” (red). Enforces qualifications per site.
        </li>
        <li>
          <strong>Availability editor (30-minute slots).</strong> Paint
          Preferred / Can work / Cannot across a weekly grid; drag or click to
          fill. Default preset for new users: Mon–Thu 06:00–16:30 (4×10.5).
        </li>
        <li>
          <strong>Sites & coverage.</strong> Manage sites (seeded:
          General/OR/Fluoro/Dexa). Set coverage <em>defaults</em> per site and
          create per-date <em>overrides</em> (inline or via bulk editor for
          ranges/extra dates). Day panel shows “have / required” (italic =
          override).
        </li>
        <li>
          <strong>User management.</strong> Add with preset, duplicate Employee
          ID guard, delete (with confirm), and <em>Edit qualifications</em>{" "}
          (toggle OR/Fluoro/Dexa).
        </li>
        <li>
          <strong>Persistence.</strong> All data is saved to the browser’s
          localStorage. Time zone fixed to <code>America/Denver</code>.
        </li>
        <li>
          <strong>API integration.</strong> Public holidays fetched from the
          Nager.Date “Public Holidays” API and cached client-side.
        </li>
      </ul>

      <h3>Scheduling rules implemented</h3>
      <ul>
        <li>No overlapping shifts for the same user.</li>
        <li>
          Availability: <strong>green</strong> = preferred,{" "}
          <strong>yellow</strong> = can work (warn), <strong>red</strong> =
          cannot (block). Resolution: 30 minutes.
        </li>
        <li>
          Site qualifications: OR, Fluoro, and Dexa require explicit user
          qualification; General is open to all.
        </li>
      </ul>

      <h3>Data model (client-side)</h3>
      <dl>
        <dt>User</dt>
        <dd>
          <code>
            &#123; _id, name, employeeId, qualifications: &#123;OR, Fluoro,
            Dexa&#125;, availabilityTemplate: mon..sun[48], overrides:
            [&#123;date,status&#125;] &#125;
          </code>
        </dd>
        <dt>Site</dt>
        <dd>
          <code>&#123; _id, name &#125;</code>
        </dd>
        <dt>Coverage</dt>
        <dd>
          <code>&#123; _id, date, siteId, requiredCount &#125;</code>
        </dd>
        <dt>Shift</dt>
        <dd>
          <code>&#123; _id, userId, siteId, start, end, status &#125;</code>
        </dd>
      </dl>

      <h3>Tech</h3>
      <ul>
        <li>React + Vite, React Router, date-fns</li>
        <li>LocalStorage for persistence</li>
        <li>Nager.Date Public Holidays API</li>
      </ul>

      <h3>Privacy</h3>
      <p>
        No PHI is stored. The app keeps names and optional employee IDs only,
        and all data stays in the browser unless exported in later stages.
      </p>

      <h3>Limitations / next steps</h3>
      <ul>
        <li>No backend or authentication yet (planned Stage 2/3).</li>
        <li>Single time zone; DST/UTC edge cases not handled.</li>
        <li>
          Automation (auto-assigner), Slack/ICS export, and templates are
          planned for later stages.
        </li>
      </ul>
    </section>
  );
}
