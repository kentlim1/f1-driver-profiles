import React from "react";
import type { DriverStanding } from "../api";
import DriverCard from "./DriverCard";

type Props = {
  standings: DriverStanding[];
};

const StandingsList: React.FC<Props> = ({ standings }) => (
  <div className="flex flex-col items-center gap-2">
    {standings.map((s) => (
      <DriverCard key={s.Driver.driverId} standing={s} />
    ))}
  </div>
);

export default StandingsList;
