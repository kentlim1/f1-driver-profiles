import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

type ChartRow = {
  round: number;
  race: string;
  points: number;
};

type Props = {
  data: ChartRow[];
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
        {row.points !== undefined && (
          <p className="text-gray-400">
            Points: <span className="font-bold" style={{ color: teamColor }}>{row.points}</span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

const DriverPointsChart: React.FC<Props> = ({ data, teamColor = "#ff4136" }) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="h-4 w-1 rounded-full" style={{ backgroundColor: teamColor }} />
        <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
          Points Progression
        </h2>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="pointsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={teamColor} stopOpacity={0.3} />
              <stop offset="100%" stopColor={teamColor} stopOpacity={0} />
            </linearGradient>
          </defs>
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
          />
          <Tooltip content={<CustomTooltip teamColor={teamColor} />} />
          <Area
            type="monotone"
            dataKey="points"
            stroke={teamColor}
            strokeWidth={2.5}
            fill="url(#pointsGradient)"
            dot={{ r: 3, fill: teamColor, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: teamColor, stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DriverPointsChart;
