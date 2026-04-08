import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { DriverStanding } from "../api";
import DriverCard from "./DriverCard";
import {
  driverImages,
  teamImages,
  getTeamName,
  getTeamColor,
  getConstructorId,
} from "../lib/constants";

type Props = {
  standings: DriverStanding[];
};

function PodiumCard({
  standing,
  position,
}: {
  standing: DriverStanding;
  position: number;
}) {
  const navigate = useNavigate();
  const driverId = standing.Driver.driverId.toLowerCase();
  const teamName = getTeamName(driverId, standing.Constructors[0]?.name);
  const teamColor = getTeamColor(teamName);
  const constructorId = getConstructorId(driverId, standing.Constructors[0]?.constructorId);
  const driverImg = driverImages[driverId];
  const teamImg = teamImages[constructorId];

  const podiumHeight = position === 1 ? "h-72" : position === 2 ? "h-64" : "h-60";
  const order = position === 1 ? "order-2" : position === 2 ? "order-1" : "order-3";
  const medalColor =
    position === 1 ? "#FFD700" : position === 2 ? "#C0C0C0" : "#CD7F32";

  return (
    <div
      className={`${order} flex-1 min-w-0 cursor-pointer group`}
      onClick={() => navigate(`/${driverId}`)}
    >
      <div
        className={`relative ${podiumHeight} rounded-2xl overflow-hidden border border-white/10 bg-[#141414] transition-all duration-300 group-hover:scale-[1.03] group-hover:border-white/20 group-hover:shadow-2xl`}
        style={{
          boxShadow: `0 0 40px ${teamColor}15`,
        }}
      >
        {/* Team color gradient background */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            background: `linear-gradient(135deg, ${teamColor}40, transparent 60%)`,
          }}
        />

        {/* Position badge */}
        <div
          className="absolute top-3 left-3 z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm font-black shadow-lg"
          style={{
            backgroundColor: medalColor,
            color: position === 2 ? "#333" : "#1a1a1a",
          }}
        >
          {position}
        </div>

        {/* Team logo */}
        {teamImg && (
          <img
            src={teamImg}
            alt={teamName}
            className="absolute top-3 right-3 z-10 h-8 w-8 object-contain opacity-50 group-hover:opacity-80 transition-opacity"
          />
        )}

        {/* Driver image */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full">
          {driverImg && (
            <img
              src={driverImg}
              alt={standing.Driver.familyName}
              className="mx-auto h-40 w-40 object-cover object-top drop-shadow-2xl group-hover:scale-105 transition-transform duration-300"
            />
          )}
        </div>

        {/* Info overlay at top */}
        <div className="absolute top-10 left-0 right-0 px-3 text-center z-10">
          <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500">
            {standing.Driver.givenName}
          </p>
          <p className="text-lg font-black text-white leading-tight">
            {standing.Driver.familyName}
          </p>
          <p className="mt-1 text-xs font-semibold" style={{ color: teamColor }}>
            {teamName}
          </p>
        </div>
      </div>

      {/* Points below card */}
      <div className="mt-3 text-center">
        <span className="text-2xl font-black text-white">{standing.points}</span>
        <span className="ml-1 text-xs text-gray-500 uppercase">pts</span>
      </div>
    </div>
  );
}

const StandingsList: React.FC<Props> = ({ standings }) => {
  const [search, setSearch] = useState("");

  const top3 = standings.slice(0, 3);
  const rest = standings.slice(3);

  const filteredRest = search.trim()
    ? standings.filter(
        (s) =>
          s.Driver.givenName.toLowerCase().includes(search.toLowerCase()) ||
          s.Driver.familyName.toLowerCase().includes(search.toLowerCase()) ||
          s.Constructors[0]?.name.toLowerCase().includes(search.toLowerCase())
      )
    : rest;

  return (
    <div className="w-full">
      {/* Podium Section */}
      {!search.trim() && (
        <section className="mb-10">
          <div className="flex items-end gap-3 sm:gap-4 max-w-2xl mx-auto px-2">
            {top3.map((s, i) => (
              <PodiumCard key={s.Driver.driverId} standing={s} position={i + 1} />
            ))}
          </div>
        </section>
      )}

      {/* Search Bar */}
      <div className="mb-6 max-w-md mx-auto px-2">
        <div className="relative">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search drivers or teams..."
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 outline-none focus:border-white/20 focus:bg-white/[0.07] transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Standings Header */}
      <div className="flex items-center gap-3 mb-4 px-2">
        <h2 className="text-lg font-bold text-white">
          {search.trim() ? "Search Results" : "Full Standings"}
        </h2>
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs text-gray-500">
          {filteredRest.length} driver{filteredRest.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Driver Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-2">
        {filteredRest.map((s) => (
          <DriverCard
            key={s.Driver.driverId}
            standing={s}
            position={Number(s.position)}
          />
        ))}
      </div>

      {filteredRest.length === 0 && (
        <p className="text-center text-gray-500 py-12 text-sm">No drivers found.</p>
      )}
    </div>
  );
};

export default StandingsList;
