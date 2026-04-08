import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { DriverStanding } from "../api";
import DriverPointsChart from "../components/DriverPointsChart.tsx";
import DriverPlacementChart from "../components/DriverPlacementChart.tsx";
import driverDescriptions from "../data/driverDescriptions.json";
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

type ChartRow = {
  round: number;
  race: string;
  points: number;
};

type PlacementRow = {
  round: number;
  race: string;
  position: number;
};

const DriverPage: React.FC<Props> = ({ standings }) => {
  const { driverId } = useParams<{ driverId: string }>();
  const [progression, setProgression] = useState<ChartRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [placementProgression, setPlacementProgression] = useState<PlacementRow[]>([]);

  const driverStanding = standings.find(
    (s) => s.Driver.driverId.toLowerCase() === driverId?.toLowerCase()
  );

  useEffect(() => {
    if (!driverId) return;
    let cancelled = false;

    (async () => {
      try {
        const scheduleRes = await fetch("https://api.jolpi.ca/ergast/f1/2026.json");
        const scheduleJson = await scheduleRes.json();
        const races = scheduleJson?.MRData?.RaceTable?.Races ?? [];

        let cumulative = 0;
        const rows: ChartRow[] = [];
        const placementRows: PlacementRow[] = [];

        for (const race of races) {
          let roundPoints = 0;
          let position: number | null = null;

          const res = await fetch(
            `https://api.jolpi.ca/ergast/f1/2026/${race.round}/results.json`
          );
          const json = await res.json();
          const raceData = json?.MRData?.RaceTable?.Races?.[0];

          if (raceData?.Results) {
            const result = raceData.Results.find(
              (r: any) => r?.Driver?.driverId?.toLowerCase() === driverId.toLowerCase()
            );
            if (result) {
              roundPoints += Number(result.points) || 0;
              position = Number(result.position) || null;
            }
          }

          const sprintRes = await fetch(
            `https://api.jolpi.ca/ergast/f1/2026/${race.round}/sprint.json`
          );
          const sprintJson = await sprintRes.json();
          const sprintData = sprintJson?.MRData?.RaceTable?.Races?.[0];

          if (sprintData?.SprintResults) {
            const sprintResult = sprintData.SprintResults.find(
              (r: any) => r?.Driver?.driverId?.toLowerCase() === driverId.toLowerCase()
            );
            if (sprintResult) roundPoints += Number(sprintResult.points) || 0;
          }

          if (roundPoints > 0 || raceData?.Results?.length) {
            cumulative += roundPoints;
            rows.push({
              round: Number(race.round),
              race: race.raceName,
              points: cumulative,
            } as ChartRow & { roundPoints: number });
            placementRows.push({
              round: Number(race.round),
              race: race.raceName,
              position: position ?? 0,
              points: roundPoints,
            } as PlacementRow);
          }
        }

        if (!cancelled) {
          setProgression(rows);
          setPlacementProgression(placementRows);
        }
      } catch (e) {
        console.error("Failed to fetch driver progression", e);
        if (!cancelled) {
          setProgression([]);
          setPlacementProgression([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [driverId]);

  if (!driverStanding) {
    return (
      <div className="p-6 text-white">
        <p>Driver not found.</p>
        <Link to="/" className="text-red-400 hover:text-white transition-colors">
          ← Back to standings
        </Link>
      </div>
    );
  }

  const { Driver, Constructors, points, position } = driverStanding;
  const driverImage = driverImages[Driver.driverId];
  const typedDriverId = Driver.driverId as keyof typeof driverDescriptions;
  const description = driverDescriptions[typedDriverId] || "No description available.";

  const teamName = getTeamName(Driver.driverId, Constructors[0]?.name);
  const teamColor = getTeamColor(teamName);
  const constructorId = getConstructorId(Driver.driverId, Constructors[0]?.constructorId);
  const teamImg = teamImages[constructorId];

  // Calculate stats from progression data
  const bestFinish = placementProgression.length > 0
    ? Math.min(...placementProgression.filter(p => p.position > 0).map(p => p.position))
    : null;
  const racesCompleted = placementProgression.length;
  const podiums = placementProgression.filter(p => p.position >= 1 && p.position <= 3).length;

  return (
    <div className="text-white max-w-6xl mx-auto">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors mb-6 group"
      >
        <svg
          className="h-4 w-4 group-hover:-translate-x-1 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to standings
      </Link>

      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 mb-8">
        {/* Gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${teamColor}25, transparent 50%, ${teamColor}08)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-transparent to-transparent" />

        <div className="relative flex flex-col md:flex-row">
          {/* Driver image */}
          <div className="relative flex-shrink-0 flex items-end justify-center md:justify-start">
            <img
              src={driverImage}
              alt={`${Driver.givenName} ${Driver.familyName}`}
              className="w-64 h-72 md:w-72 md:h-80 object-cover object-top"
            />
          </div>

          {/* Info */}
          <div className="flex-1 p-6 md:p-8 flex flex-col justify-center gap-5">
            <div>
              {/* Number + nationality */}
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border"
                  style={{
                    color: teamColor,
                    borderColor: `${teamColor}40`,
                    backgroundColor: `${teamColor}15`,
                  }}
                >
                  P{position}
                </span>
                <span className="text-xs uppercase tracking-widest text-gray-500">
                  {Driver.nationality}
                </span>
              </div>

              {/* Name */}
              <h1 className="text-4xl md:text-6xl font-black leading-none tracking-tight">
                <span className="text-gray-400 font-bold">{Driver.givenName}</span>
                <br />
                <span className="text-white">{Driver.familyName}</span>
              </h1>

              {/* Team badge */}
              <div className="flex items-center gap-2.5 mt-3">
                {teamImg && (
                  <img src={teamImg} alt={teamName} className="h-6 w-6 object-contain" />
                )}
                <span className="text-sm font-semibold" style={{ color: teamColor }}>
                  {teamName}
                </span>
              </div>
            </div>

            {/* Stat cards */}
            <div className="flex flex-wrap gap-3 mt-1">
              <StatCard label="Points" value={points} color={teamColor} large />
              <StatCard label="Races" value={racesCompleted} color={teamColor} />
              {bestFinish !== null && bestFinish !== Infinity && (
                <StatCard label="Best Finish" value={`P${bestFinish}`} color={teamColor} />
              )}
              {podiums > 0 && (
                <StatCard label="Podiums" value={podiums} color={teamColor} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="rounded-2xl bg-[#141414] border border-white/[0.07] p-6 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-4 w-1 rounded-full" style={{ backgroundColor: teamColor }} />
          <h2 className="text-xs uppercase tracking-widest font-bold text-gray-400">
            Driver Overview
          </h2>
        </div>
        <p className="text-[15px] leading-relaxed text-gray-300">{description}</p>
      </div>

      {/* Charts */}
      <div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SkeletonChart />
            <SkeletonChart />
          </div>
        ) : progression.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-[#141414] border border-white/[0.07] p-5">
              <DriverPointsChart
                data={progression}
                driverName={`${Driver.givenName} ${Driver.familyName}`}
                teamColor={teamColor}
              />
            </div>
            <div className="rounded-2xl bg-[#141414] border border-white/[0.07] p-5">
              <DriverPlacementChart
                data={placementProgression}
                driverName={`${Driver.givenName} ${Driver.familyName}`}
                teamColor={teamColor}
              />
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-[#141414] border border-white/[0.07] p-12 text-center">
            <p className="text-gray-500 text-sm">No race data available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

function StatCard({
  label,
  value,
  color,
  large,
}: {
  label: string;
  value: string | number;
  color: string;
  large?: boolean;
}) {
  return (
    <div
      className="rounded-xl border px-4 py-3 min-w-[80px]"
      style={{
        borderColor: `${color}20`,
        backgroundColor: `${color}08`,
      }}
    >
      <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-0.5">{label}</p>
      <p
        className={`font-black ${large ? "text-3xl" : "text-xl"}`}
        style={{ color }}
      >
        {value}
      </p>
    </div>
  );
}

function SkeletonChart() {
  return (
    <div className="rounded-2xl bg-[#141414] border border-white/[0.07] p-5">
      <div className="h-5 w-40 bg-white/5 rounded mb-4 animate-pulse" />
      <div className="h-[300px] bg-white/[0.02] rounded-xl animate-pulse" />
    </div>
  );
}

export default DriverPage;
