import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Label,
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
      <div
        style={{
          background: "#242424",
          borderRadius: 8,
          padding: 10,
          color: "#fff",
        }}
      >
        <div>
          <strong>
            Round {row.round}: {row.race}
          </strong>
        </div>
        {row.points !== undefined && (
          <div>
            Points: <strong>{row.points}</strong>
          </div>
        )}
      </div>
    );
  }
  return null;
};

const DriverPointsChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-[#242424] p-4 rounded-2xl shadow-xl/70 hover:scale-[1.02] transition-transform duration-300">
      <h2 className="text-xl font-bold mb-4 text-white text-center">
        Points Progression
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} >
          <CartesianGrid strokeDasharray="3 3" stroke="#555" />
          <XAxis dataKey="round" stroke="#ccc">
            <Label value="Round" offset={-5} position="insideBottom" fill="#ccc" />
          </XAxis>
          <YAxis stroke="#ccc">
            <Label
              value="Points"
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: "middle" }}
              fill="#ccc"
            />
          </YAxis>
          <Tooltip content={<CustomTooltip />} />
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
