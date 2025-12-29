import LoginPage from "./pages/LoginPage";
import AuthButton from "./components/AuthButton";
import UsernamePage from "./pages/UsernamePage";
import UsernameGate from "./components/UsernameGate";
import { Analytics } from "@vercel/analytics/react";
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
      <UsernameGate />
      <AuthButton />
      {/* Show subtitle only on homepage */}
      {location.pathname === "/" && (
        <>
          <h1 className="text-2xl font-bold mb-6">Formula 1 Driver Profiles</h1>
          <h2 className="text-2xl font-semibold mb-4">
            Click on a driver to learn more!
          </h2>
        </>
      )}

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <Routes>
        <Route path="/" element={<StandingsList standings={standings} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/:driverId" element={<DriverPage standings={standings} />} />
        <Route path="/username" element={<UsernamePage />} />
      </Routes>
      <Analytics />
      <footer> 
        <p className="text-sm text-gray-500 mt-8">
          Made with React by Kent Lim
        </p>
      </footer>
    </div>
  );
};

export default App;
