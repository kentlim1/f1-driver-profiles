import React from "react";
import { useNavigate } from "react-router-dom";
import type { DriverStanding } from "../api";
import {
  driverImages,
  teamImages,
  getTeamName,
  getTeamColor,
  getConstructorId,
  positionColors,
  getNationalityFlagUrl,
} from "../lib/constants";

type Props = {
  standing: DriverStanding;
  position: number;
};

const DriverCard: React.FC<Props> = ({ standing, position }) => {
  const navigate = useNavigate();
  const driver = standing.Driver;
  const driverId = driver.driverId.toLowerCase();
  const driverImgSrc = driverImages[driverId];
  const team = getTeamName(driverId, standing.Constructors[0]?.name);
  const constructorId = getConstructorId(driverId, standing.Constructors[0]?.constructorId);
  const teamImgSrc = teamImages[constructorId];
  const teamColor = getTeamColor(team);
  const posColor = positionColors[position] ?? "#6b7280";

  return (
    <div
      onClick={() => navigate(`/${driverId}`)}
      className="group relative flex items-center gap-3 rounded-xl overflow-hidden bg-[#141414] border border-white/[0.07] cursor-pointer hover:border-white/15 transition-all duration-200 hover:shadow-lg"
      style={{
        boxShadow: `inset 3px 0 0 ${teamColor}`,
      }}
    >
      {/* Driver image */}
      <div className="flex-shrink-0 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ background: `linear-gradient(135deg, ${teamColor}, transparent)` }}
        />
        <img
          src={driverImgSrc}
          alt={driver.familyName}
          className="w-20 h-20 object-cover object-top group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 py-2">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-black tabular-nums"
            style={{ color: posColor }}
          >
            P{position}
          </span>
          {getNationalityFlagUrl(driver.nationality) && (
            <img src={getNationalityFlagUrl(driver.nationality)!} alt="" className="h-3 w-auto rounded-[2px]" />
          )}
          <span className="text-sm font-bold text-white truncate">
            {driver.givenName} <span className="font-black">{driver.familyName}</span>
          </span>
        </div>
        <p className="text-xs font-medium mt-0.5 truncate" style={{ color: teamColor }}>
          {team}
        </p>
      </div>

      {/* Right side: team logo + points */}
      <div className="flex items-center gap-3 pr-3 flex-shrink-0">
        {teamImgSrc && (
          <img
            src={teamImgSrc}
            alt={team}
            className="w-7 h-7 object-contain opacity-30 group-hover:opacity-60 transition-opacity hidden sm:block"
          />
        )}
        <div className="text-right">
          <span className="text-lg font-black text-white tabular-nums">{standing.points}</span>
          <p className="text-[10px] text-gray-600 uppercase tracking-wider">pts</p>
        </div>
      </div>
    </div>
  );
};

export default DriverCard;
