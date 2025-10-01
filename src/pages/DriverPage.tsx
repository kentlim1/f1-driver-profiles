import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { DriverStanding } from "../api";
import DriverPointsChart from "../components/DriverPointsChart.tsx";
import DriverPlacementChart from "../components/DriverPlacementChart.tsx";

// import driver images
import verstappenImg from "../assets/drivers/verstappen.png";
import hamiltonImg from "../assets/drivers/hamilton.png";
import tsunodaImg from "../assets/drivers/tsunoda.png";
import lawsonImg from "../assets/drivers/lawson.png";
import leclercImg from "../assets/drivers/leclerc.png";
import norrisImg from "../assets/drivers/norris.png";
import piastriImg from "../assets/drivers/piastri.png";
import albonImg from "../assets/drivers/albon.png";
import sainzImg from "../assets/drivers/sainz.png";
import russellImg from "../assets/drivers/russell.png";
import antonelliImg from "../assets/drivers/antonelli.png";
import hadjarImg from "../assets/drivers/hadjar.png";
import bortoletoImg from "../assets/drivers/bortoleto.png";
import hulkenbergImg from "../assets/drivers/hulkenberg.png";
import gaslyImg from "../assets/drivers/gasly.png";
import colapintoImg from "../assets/drivers/colapinto.png";
import doohanImg from "../assets/drivers/doohan.png";
import alonsoImg from "../assets/drivers/alonso.png";
import strollImg from "../assets/drivers/stroll.png";
import oconImg from "../assets/drivers/ocon.png";
import bearmanImg from "../assets/drivers/bearman.png";

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

const driverImages: Record<string, string> = {
  max_verstappen: verstappenImg,
  hamilton: hamiltonImg,
  tsunoda: tsunodaImg,
  lawson: lawsonImg,
  leclerc: leclercImg,
  norris: norrisImg,
  piastri: piastriImg,
  albon: albonImg,
  sainz: sainzImg,
  russell: russellImg,
  antonelli: antonelliImg,
  hadjar: hadjarImg,
  bortoleto: bortoletoImg,
  hulkenberg: hulkenbergImg,
  gasly: gaslyImg,
  colapinto: colapintoImg,
  doohan: doohanImg,
  alonso: alonsoImg,
  stroll: strollImg,
  ocon: oconImg,
  bearman: bearmanImg,
};

const DriverPage: React.FC<Props> = ({ standings }) => {
  const { driverId } = useParams<{ driverId: string }>();
  const [progression, setProgression] = useState<ChartRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [placementProgression, setPlacementProgression] = useState<
    PlacementRow[]
  >([]);

  const driverStanding = standings.find(
    (s) => s.Driver.driverId.toLowerCase() === driverId?.toLowerCase()
  );

  useEffect(() => {
    if (!driverId) return;
    let cancelled = false;

    (async () => {
      try {
        const scheduleRes = await fetch(
          "https://api.jolpi.ca/ergast/f1/2025.json"
        );
        const scheduleJson = await scheduleRes.json();
        const races = scheduleJson?.MRData?.RaceTable?.Races ?? [];

        let cumulative = 0;
        const rows: ChartRow[] = [];
        const placementRows: PlacementRow[] = [];

        for (const race of races) {
          let roundPoints = 0;
          let position: number | null = null;

          // Fetch normal GP results
          const res = await fetch(
            `https://api.jolpi.ca/ergast/f1/2025/${race.round}/results.json`
          );
          const json = await res.json();
          const raceData = json?.MRData?.RaceTable?.Races?.[0];

          if (raceData?.Results) {
            const result = raceData.Results.find(
              (r: any) =>
                r?.Driver?.driverId?.toLowerCase() === driverId.toLowerCase()
            );
            if (result) {
              roundPoints += Number(result.points) || 0;
              position = Number(result.position) || null;
            }
          }

          // Fetch Sprint results (if exists)
          const sprintRes = await fetch(
            `https://api.jolpi.ca/ergast/f1/2025/${race.round}/sprint.json`
          );
          const sprintJson = await sprintRes.json();
          const sprintData = sprintJson?.MRData?.RaceTable?.Races?.[0];

          if (sprintData?.SprintResults) {
            const sprintResult = sprintData.SprintResults.find(
              (r: any) =>
                r?.Driver?.driverId?.toLowerCase() === driverId.toLowerCase()
            );
            if (sprintResult) roundPoints += Number(sprintResult.points) || 0;
          }

          // Only push if the round has happened
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

    return () => {
      cancelled = true;
    };
  }, [driverId]);

  if (!driverStanding) {
    return (
      <div className="p-6 text-white">
        <p>Driver not found.</p>
        <Link to="/" className="text-blue-400 underline">
          Back to standings
        </Link>
      </div>
    );
  }

  const { Driver, Constructors, points } = driverStanding;
  const driverImage = driverImages[Driver.driverId];

  return (
    <div className="p-6 text-white text-center">
      <Link to="/" className="text-blue-400 underline block mb-4 text-left">
        ← Back to standings
      </Link>

      <img
        src={driverImage}
        alt={`${Driver.givenName} ${Driver.familyName}`}
        className="w-48 h-48 mx-auto rounded-full object-top border-4 border-gray-700 mb-4 object-cover"
      />

      <h1 className="text-3xl font-bold mt-2">
        {Driver.givenName} {Driver.familyName}
      </h1>
      <p className="text-lg text-gray-300">Nationality: {Driver.nationality}</p>
      <p className="text-lg text-gray-300">
        Team: {Constructors[0]?.name ?? "N/A"}
      </p>
      <p className="text-lg text-gray-300">Points: {points}</p>

      <div className="mt-10">
        {loading ? (
          <p className="flex space-x-2 text-align-center justify-center">
            <span className="animate-spin h-5 w-5 border-2 border-t-transparent border-white rounded-full"></span>
            <span>Loading chart…</span>
          </p>
        ) : progression.length > 0 ? (
          <div className="flex flex-col md:flex-row gap-8 justify-center items-start">
            <div className="flex-1 min-w-[450px] md:min-w-[600px]">
              <DriverPointsChart
                data={progression}
                driverName={`${Driver.givenName} ${Driver.familyName}`}
              />
            </div>
            <div className="flex-1 min-w-[450px] md:min-w-[600px]">
              <DriverPlacementChart
                data={placementProgression}
                driverName={`${Driver.givenName} ${Driver.familyName}`}
              />
            </div>
          </div>
        ) : (
          <p>No race data available.</p>
        )}
      </div>
    </div>
  );
};

export default DriverPage;
