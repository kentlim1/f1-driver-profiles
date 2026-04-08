import LoginPage from "./pages/LoginPage";
import UsernamePage from "./pages/UsernamePage";
import UsernameGate from "./components/UsernameGate";
import Navbar from "./components/Navbar";
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
        const data = await fetchDriverStandings();
        setStandings(data);
      } catch {
        setError("Failed to load profiles.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <UsernameGate />
      <Navbar />

      {/* Main content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Homepage hero */}
        {location.pathname === "/" && (
          <div className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
              F1 Driver Profiles
            </h1>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              2026 Championship standings, stats, and race progression for every driver on the grid.
            </p>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center gap-3 py-20">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
            <span className="text-sm text-gray-500">Loading standings...</span>
          </div>
        )}

        {error && (
          <div className="mx-auto max-w-md rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center text-sm text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && (
          <Routes>
            <Route path="/" element={<StandingsList standings={standings} />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/:driverId" element={<DriverPage standings={standings} />} />
            <Route path="/username" element={<UsernamePage />} />
          </Routes>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-[8px] font-black text-white">
              F1
            </div>
            <span className="text-xs text-gray-600">Driver Profiles</span>
          </div>
          <p className="text-xs text-gray-600">
            Made with React by Kent Lim
          </p>
        </div>
      </footer>
      <Analytics />
    </div>
  );
};

export default App;
