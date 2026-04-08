// Driver images
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
import alonsoImg from "../assets/drivers/alonso.png";
import strollImg from "../assets/drivers/stroll.png";
import oconImg from "../assets/drivers/ocon.png";
import bearmanImg from "../assets/drivers/bearman.png";
import lindbladImg from "../assets/drivers/lindblad.png";
import perezImg from "../assets/drivers/perez.png";
import bottasImg from "../assets/drivers/bottas.png";

// Team images
import mclarenImg from "../assets/teams/mclaren.png";
import ferrariImg from "../assets/teams/ferrari.png";
import mercedesImg from "../assets/teams/mercedes.png";
import redbullImg from "../assets/teams/red-bull.png";
import williamsImg from "../assets/teams/williams.png";
import rbImg from "../assets/teams/rb.png";
import astonmartinImg from "../assets/teams/aston-martin.png";
import haasImg from "../assets/teams/haas.png";
import audiImg from "../assets/teams/audi.png";
import alpineImg from "../assets/teams/alpine.png";
import cadillacImg from "../assets/teams/cadillac.png";

export const driverImages: Record<string, string> = {
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
  alonso: alonsoImg,
  stroll: strollImg,
  ocon: oconImg,
  bearman: bearmanImg,
  lindblad: lindbladImg,
  arvid_lindblad: lindbladImg,
  perez: perezImg,
  bottas: bottasImg,
};

export const teamImages: Record<string, string> = {
  mclaren: mclarenImg,
  ferrari: ferrariImg,
  mercedes: mercedesImg,
  red_bull: redbullImg,
  williams: williamsImg,
  aston_martin: astonmartinImg,
  rb: rbImg,
  audi: audiImg,
  haas: haasImg,
  alpine: alpineImg,
  cadillac: cadillacImg,
};

export const teamHexColors: Record<string, string> = {
  "Red Bull": "#3671C6",
  "Ferrari": "#E8002D",
  "McLaren": "#FF8000",
  "Mercedes": "#27F4D2",
  "Aston Martin": "#229971",
  "Williams": "#64C4FF",
  "RB F1 Team": "#6692FF",
  "Sauber": "#52E252",
  "Haas F1 Team": "#B6BABD",
  "Alpine F1 Team": "#FF87BC",
  "Cadillac": "#C0C0C0",
};

export const driverTeamOverride: Record<string, string> = {
  tsunoda: "Red Bull",
  lawson: "RB F1 Team",
};

export const driverTeamOverrideId: Record<string, string> = {
  tsunoda: "red_bull",
  lawson: "rb",
};

export const positionColors: Record<number, string> = {
  1: "#FFD700",
  2: "#C0C0C0",
  3: "#CD7F32",
};

export function getTeamName(driverId: string, constructorName: string): string {
  return driverTeamOverride[driverId] || constructorName || "N/A";
}

export function getTeamColor(teamName: string): string {
  return teamHexColors[teamName] ?? "#ff1801";
}

export function getConstructorId(driverId: string, constructorId: string): string {
  return driverTeamOverrideId[driverId] || constructorId;
}
