import { Analytics } from "@vercel/analytics/next"
import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { fetchDriverStandings, type DriverStanding } from "./api";
import StandingsList from "./components/StandingsList";
import DriverPage from "./pages/DriverPage";

const App: React.FC = () => {
  const [standings, setStandings] = useState<DriverStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchDriverStandings("2025");
        setStandings(data);
      } catch {
        setError("Failed to load profiles.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", textAlign: "center" }}>

      {/* Show subtitle only on homepage */}
      {location.pathname === "/" && (
        <><h1 className="text-2xl font-bold mb-6">Formula 1 Driver Profiles</h1><h2 className="text-2xl font-semibold mb-4">
          Click on a driver to learn more!
        </h2></>
      )}

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <Routes>
        <Route path="/" element={<StandingsList standings={standings} />} />
        <Route path="/:driverId" element={<DriverPage standings={standings} />} />
      </Routes>
      <Analytics/>
    </div>
  );
};

export default App;
