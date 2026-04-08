import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type PlacementRow = {
  round: number;
  race: string;
  position: number | null;
  points?: number;
};

type Props = {
  data: PlacementRow[];
  driverName: string;
  teamColor?: string;
};

const CustomTooltip = ({
  active,
  payload,
  teamColor,
}: {
  active?: boolean;
  payload?: any;
  teamColor: string;
}) => {
  if (active && payload && payload.length) {
    const row = payload[0].payload;
    return (
      <div className="rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2.5 shadow-xl text-sm">
        <p className="font-bold text-white mb-1">
          Round {row.round}: {row.race}
        </p>
        <p className="text-gray-400">
          {row.status ? (
            <>Status: <span className="font-bold text-amber-400">{row.status}</span></>
          ) : (
            <>Position: <span className="font-bold" style={{ color: teamColor }}>P{row.position}</span></>
          )}
        </p>
        {row.points !== undefined && (
          <p className="text-gray-400">
            Points: <span className="font-bold text-white">{row.points}</span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

const DriverPlacementChart: React.FC<Props> = ({ data, teamColor = "#36a2ff" }) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="h-4 w-1 rounded-full" style={{ backgroundColor: teamColor }} />
        <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
          Race Finishing Positions
        </h2>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
          <XAxis
            dataKey="round"
            stroke="#555"
            tick={{ fill: "#666", fontSize: 11 }}
            axisLine={{ stroke: "#ffffff10" }}
          />
          <YAxis
            stroke="#555"
            tick={{ fill: "#666", fontSize: 11 }}
            axisLine={{ stroke: "#ffffff10" }}
            domain={[1, "dataMax + 2"]}
            reversed
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip teamColor={teamColor} />} />
          <Line
            type="monotone"
            dataKey="position"
            stroke={teamColor}
            strokeWidth={2.5}
            dot={{ r: 3, fill: teamColor, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: teamColor, stroke: "#fff", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DriverPlacementChart;
