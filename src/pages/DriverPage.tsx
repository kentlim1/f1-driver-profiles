import React from "react";
import { useParams, Link } from "react-router-dom";
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


type Props = {
  standings: DriverStanding[];
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
  bearman: bearmanImg
};

const DriverPage: React.FC<Props> = ({ standings }) => {
  const { driverId } = useParams<{ driverId: string }>();

  const driverStanding = standings.find(
    (s) => s.Driver.driverId.toLowerCase() === driverId?.toLowerCase()
  );

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

  // get driver image, fallback to placeholder
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
    </div>
  );
};

export default DriverPage;