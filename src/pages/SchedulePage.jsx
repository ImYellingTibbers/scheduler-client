export default function SchedulePage({ holidays }) {
  return (
    <section className="page">
      <h2>Schedule</h2>
      <p>Holidays loaded: {holidays.length}</p>
      <ul>
        {holidays.slice(0, 5).map((h) => (
          <li key={h.date}>{h.date} — {h.name}</li>
        ))}
      </ul>
    </section>
  );
}
