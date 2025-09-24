import { useEffect, useRef, useState } from "react";
import { useAppState } from "../state/AppState.jsx";

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOTS = 48; // 30-min slots

function hourLabel24(h) {
  return h.toString().padStart(2, "0") + ":00";
}

export default function AvailabilityMatrix({ user }) {
  const { actions } = useAppState();
  const [mode, setMode] = useState("green"); // 'green' | 'yellow' | 'red'
  const paintingRef = useRef(false);

  useEffect(() => {
    const up = () => {
      paintingRef.current = false;
    };
    window.addEventListener("mouseup", up);
    window.addEventListener("mouseleave", up);
    return () => {
      window.removeEventListener("mouseup", up);
      window.removeEventListener("mouseleave", up);
    };
  }, []);

  if (!user) return null;

  function paint(day, slot) {
    actions.setAvailabilityCell(user._id, day, slot, mode);
  }

  return (
    <section className="avail">
      <div className="avail__legend" role="radiogroup" aria-label="Paint mode">
        <button
          type="button"
          className={`legend ${mode === "green" ? "legend--green" : ""}`}
          aria-pressed={mode === "green"}
          onClick={() => setMode("green")}
        >
          Preferred
        </button>
        <button
          type="button"
          className={`legend ${mode === "yellow" ? "legend--yellow" : ""}`}
          aria-pressed={mode === "yellow"}
          onClick={() => setMode("yellow")}
        >
          Can work
        </button>
        <button
          type="button"
          className={`legend ${mode === "red" ? "legend--red" : ""}`}
          aria-pressed={mode === "red"}
          onClick={() => setMode("red")}
        >
          Cannot
        </button>
      </div>

      <div className="avail__grid">
        {/* hour labels (00..23), each spans 2 rows */}
        <div className="avail__hours">
          <div /> {/* header spacer */}
          {Array.from({ length: 24 }, (_, h) => (
            <div key={h} className="avail__hour">
              {hourLabel24(h)}
            </div>
          ))}
        </div>

        {DAYS.map((day, i) => {
          const col = user.availabilityTemplate?.[day] || [];
          return (
            <div key={day} className="avail__col">
              <div className="avail__daylabel">{DAY_LABELS[i]}</div>
              {Array.from({ length: SLOTS }, (_, slot) => {
                const val = col[slot] || "red";
                return (
                  <div
                    key={`${day}-${slot}`}
                    className={`avail__cell avail--${val}`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      paintingRef.current = true;
                      paint(day, slot);
                    }}
                    onMouseEnter={() => {
                      if (paintingRef.current) paint(day, slot);
                    }}
                    onClick={() => paint(day, slot)}
                    role="button"
                    aria-label={`${DAY_LABELS[i]} ${Math.floor(slot / 2)}:${
                      slot % 2 ? "30" : "00"
                    } set ${mode}`}
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
