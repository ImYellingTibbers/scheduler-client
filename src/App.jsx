import { useEffect, useState } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";

import { getPublicHolidays } from "./api/holidays.js";
import SchedulePage from "./pages/SchedulePage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import { AppStateProvider } from "./state/AppState.jsx";

export default function App() {
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    getPublicHolidays(new Date().getFullYear(), "US")
      .then(setHolidays)
      .catch((e) => console.error("Holiday fetch failed", e));
  }, []);

  return (
    <AppStateProvider holidaysFromApi={holidays}>
      <div className="app">
        <header className="appbar">
          <h1 className="appbar__brand">
            Megan's Awesome-Perfectly-Functioning-With-No-Problems-Whatsoever
            Scheduler
          </h1>
          <nav className="appbar__nav">
            <Link to="/">Schedule</Link>
            <Link to="/settings">Settings</Link>
            <Link to="/about">About</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<SchedulePage holidays={holidays} />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </AppStateProvider>
  );
}
