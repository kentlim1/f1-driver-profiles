import React from "react";
import type { DriverStanding } from "../api";

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
  bearman: bearmanImg
  // add others here
};

type Props = {
  standing: DriverStanding;
};

const driverTeamOverride: Record<string, string> = {
  tsunoda: "Red Bull",
  lawson: "RB F1 Team",
};

const DriverCard: React.FC<Props> = ({ standing }) => {
  const driver = standing.Driver;
  const driverId = driver.driverId.toLowerCase();
  const imgSrc = driverImages[driverId];
  const team = driverTeamOverride[driverId] || standing.Constructors[0]?.name;

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-md w-300 h-40">
      <div className="flex items-center">
        <img
          src={imgSrc}
          alt={driver.familyName}
          className="w-40 h-40 rounded-full object-cover object-top border border-gray-300"
        />
        <div className="ml-4 text-left text-gray-800">
          <p className="text-xl font-bold">
            {driver.givenName} {driver.familyName}
          </p>
          <p className="text-med text-gray-500">{team}</p>
        </div>
      </div>

      <div className="text-right text-gray-800 p-10">
        <p className="text-lg font-bold">{standing.points} pts</p>
      </div>
    </div>
  );
};

export default DriverCard;
