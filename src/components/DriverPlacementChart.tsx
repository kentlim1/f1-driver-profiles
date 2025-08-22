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
  points?: number; // optional
};

type Props = {
  data: PlacementRow[];
  driverName: string;
};

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: any;
}) => {
  if (active && payload && payload.length) {
    const row = payload[0].payload;
    return (
      <div style={{ background: "#242424", borderRadius: 8, padding: 10, color: "#fff" }}>
        <div><strong>Round {row.round}: {row.race}</strong></div>
        <div>
          {row.status
            ? <span>Status: <strong>{row.status}</strong></span>
            : <span>Position: <strong>P{row.position}</strong></span>
          }
        </div>
        {row.points !== undefined && (
          <div>Points: <strong>{row.points}</strong></div>
        )}
      </div>
    );
  }
  return null;
};

const DriverPlacementChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-[#242424] p-4 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-white text-center">
        Race Finishing Positions
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#555" />
          <XAxis dataKey="round" stroke="#ccc" />
          <YAxis
            stroke="#ccc"
            domain={[1, "dataMax + 2"]}
            reversed // so 1st is at the top
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="position"
            stroke="#36a2ff"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DriverPlacementChart;
