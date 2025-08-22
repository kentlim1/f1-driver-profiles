import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type ChartRow = {
  round: number;
  race: string;
  points: number;
};

type Props = {
  data: ChartRow[];
  driverName: string;
};

const DriverPointsChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-[#242424] p-4 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-white text-center">
        Points Progression
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#888" />
          <XAxis dataKey="round" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip
            contentStyle={{ backgroundColor: "#1f2937", borderRadius: "8px" }}
            labelFormatter={(round) => `Round ${round}`}
            formatter={(value) => [`${value} pts`, "Cumulative"]}
          />
          <Line
            type="monotone"
            dataKey="points"
            stroke="#ff4136"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DriverPointsChart;
