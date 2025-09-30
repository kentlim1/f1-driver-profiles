import React from "react";
import { useNavigate } from "react-router-dom";
import type { DriverStanding } from "../api";
import { Link } from "react-router-dom";

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

// import team images
import mclarenImg from "../assets/teams/mclaren.png";
import ferrariImg from "../assets/teams/ferrari.png";
import mercedesImg from "../assets/teams/mercedes.png";
import redbullImg from "../assets/teams/red-bull.png";
import williamsImg from "../assets/teams/williams.png";
import rbImg from "../assets/teams/rb.png";
import astonmartinImg from "../assets/teams/aston-martin.png";
import haasImg from "../assets/teams/haas.png";
import sauberImg from "../assets/teams/kick.png";
import alpineImg from "../assets/teams/alpine.png";

// driver image map
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

// team image map
const teamImages: Record<string, string> = {
  mclaren: mclarenImg,
  ferrari: ferrariImg,
  mercedes: mercedesImg,
  red_bull: redbullImg,
  williams: williamsImg,
  aston_martin: astonmartinImg,
  rb: rbImg,
  sauber: sauberImg,
  haas: haasImg,
  alpine: alpineImg,
};

const teamColors: Record<string, string> = {
  "Red Bull": "border-blue-900",
  "Ferrari": "border-red-600",
  "McLaren": "border-orange-500",
  "Mercedes": "border-teal-500",
  "Aston Martin": "border-green-800",
  "Williams": "border-blue-500",
  "RB F1 Team": "border-indigo-600",
  "Sauber": "border-green-500",
  "Haas F1 Team": "border-gray-500",
  "Alpine F1 Team": "border-pink-400",
};

// overrides (Yuki/Liam swap)
const driverTeamOverride: Record<string, string> = {
  tsunoda: "Red Bull",
  lawson: "RB F1 Team",
};

const driverTeamOverrideId: Record<string, string> = {
  tsunoda: "red_bull",
  lawson: "rb",
};

type Props = {
  standing: DriverStanding;
};

const DriverCard: React.FC<Props> = ({ standing }) => {
  const navigate = useNavigate();
  const driver = standing.Driver;
  const driverId = driver.driverId.toLowerCase();
  const driverImgSrc = driverImages[driverId];
  const team = driverTeamOverride[driverId] || standing.Constructors[0]?.name;
  const borderColorClass = teamColors[team];
  const constructorId =
    driverTeamOverrideId[driverId] || standing.Constructors[0]?.constructorId;
  const teamImgSrc = teamImages[constructorId];

  return (
    <div
      onClick={() => navigate(`/${driverId}`)}
      className={`flex items-center justify-start border-4 ${borderColorClass} bg-[#242424] p-4 rounded-xl shadow-xl/40 w-full h-40 cursor-pointer hover:scale-105 transition-transform`}
    >
      <Link to={`/driver/${driver.driverId}`}></Link>
      <div className="flex items-center">
        <img
          src={driverImgSrc}
          alt={driver.familyName}
          className="w-40 h-40 object-cover object-top border-gray-500"
        />
        <div className="flex items-center ml-4 space-x-4">
          <div className="text-left text-white">
            <p className="text-xl font-bold">
              {driver.givenName} {driver.familyName}
            </p>
            <p className="text-med text-gray-200">{team}</p>
          </div>
          <img
            src={teamImgSrc}
            alt={team}
            className="w-20 h-20 object-contain scale-80"
          />
        </div>
      </div>
      <div className="text-right text-white p-10 ml-auto">
        <p className="text-lg font-bold">{standing.points} pts</p>
      </div>
      <Link to={`/driver/${driver.driverId}`}></Link>
    </div>
  );
};

export default DriverCard;
