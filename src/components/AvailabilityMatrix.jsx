import { useEffect, useMemo, useRef, useState } from "react";
import { useAppState } from "../state/AppState.jsx";

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function hourLabel(h) {
  const ampm = h < 12 ? "a" : "p";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}${ampm}`;
}

export default function AvailabilityMatrix({ user }) {
  const { actions } = useAppState();
  const [mode, setMode] = useState("green"); // 'green' | 'yellow' | 'red'
  const paintingRef = useRef(false);

  useEffect(() => {
    function up() {
      paintingRef.current = false;
    }
    window.addEventListener("mouseup", up);
    window.addEventListener("mouseleave", up);
    return () => {
      window.removeEventListener("mouseup", up);
      window.removeEventListener("mouseleave", up);
    };
  }, []);

  if (!user) return null;

  function paint(day, hour) {
    actions.setAvailabilityCell(user._id, day, hour, mode);
  }

  return (
    <section className="avail">
      {/* toolbar */}
      <div className="avail__legend" role="radiogroup" aria-label="Paint mode">
        <button
          type="button"
          className={`legend ${mode === "green" ? "legend--green" : ""}`}
          aria-pressed={mode === "green"}
          onClick={() => setMode("green")}
          title="Preferred"
        >
          Preferred
        </button>
        <button
          type="button"
          className={`legend ${mode === "yellow" ? "legend--yellow" : ""}`}
          aria-pressed={mode === "yellow"}
          onClick={() => setMode("yellow")}
          title="Can work"
        >
          Can work
        </button>
        <button
          type="button"
          className={`legend ${mode === "red" ? "legend--red" : ""}`}
          aria-pressed={mode === "red"}
          onClick={() => setMode("red")}
          title="Cannot"
        >
          Cannot
        </button>
      </div>

      <div className="avail__grid">
        {/* hours column */}
        <div className="avail__hours">
          <div />
          {/* header spacer */}
          {Array.from({ length: 25 }, (_, h) => (
            <div key={h} className="avail__hour" aria-hidden="true">
              {hourLabel(h)}
            </div>
          ))}
        </div>

        {/* 7 day columns */}
        {DAYS.map((day, i) => {
          const col = user.availabilityTemplate?.[day] || [];
          return (
            <div key={day} className="avail__col">
              <div className="avail__daylabel">{DAY_LABELS[i]}</div>
              {Array.from({ length: 24 }, (_, h) => {
                const val = col[h] || "red";
                return (
                  <div
                    key={`${day}-${h}`}
                    className={`avail__cell avail--${val}`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      paintingRef.current = true;
                      paint(day, h);
                    }}
                    onMouseEnter={() => {
                      if (paintingRef.current) paint(day, h);
                    }}
                    onClick={() => paint(day, h)} // single click also paints
                    role="button"
                    aria-label={`${DAY_LABELS[i]} ${h}:00 set ${mode}`}
                    tabIndex={0}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </section>
  );
}
