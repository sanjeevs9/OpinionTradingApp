import { useState } from "react";
import {
  AreaChart,
  Area,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { IoIosSwap } from "react-icons/io";

const data = [
  { probability: 20 },
  { probability: 40 },
  { probability: 55 },
  { probability: 35 },
  { probability: 55 },
  { probability: 30 },
  { probability: 90 },
  { probability: 70 },
  { probability: 60 },
  { probability: 80 },
  { probability: 20 },
  { probability: 60 },
];

const nodata = [
  { probability: 40 },
  { probability: 80 },
  { probability: 90 },
  { probability: 70 },
  { probability: 90 },
  { probability: 40 },
  { probability: 60 },
  { probability: 20 },
  { probability: 35 },
  { probability: 60 },
  { probability: 40 },
  { probability: 100 },
];

const ProbabilityGraph = () => {
  const [yes, setYes] = useState(false);

  const color = yes ? "#2563EB" : "#E11D48";
  const gradientId = yes ? "grad-yes" : "grad-no";

  return (
    <div className="p-4 w-full">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 className={`text-lg font-bold ${yes ? "text-yes" : "text-no"}`}>
            {yes ? "80%" : "20%"}
          </h2>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Probability of {yes ? "YES" : "NO"}
          </p>
        </div>
        <button
          onClick={() => setYes(!yes)}
          className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg border cursor-pointer transition-colors ${
            yes
              ? "text-no border-no/30 hover:bg-no-light"
              : "text-yes border-yes/30 hover:bg-yes-light"
          }`}
        >
          <IoIosSwap size={14} />
          {yes ? "No" : "Yes"}
        </button>
      </div>

      <ResponsiveContainer width="100%" height={140}>
        <AreaChart
          data={yes ? nodata : data}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.15} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis domain={[0, 100]} hide />
          <Area
            type="monotone"
            dataKey="probability"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2, stroke: color, fill: "white" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "10px",
              border: "1px solid #E2E8F0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              fontSize: "12px",
              padding: "6px 10px",
            }}
            itemStyle={{ fontWeight: "600", color }}
            labelStyle={{ display: "none" }}
            formatter={(value) => [`${value}%`, yes ? "Yes" : "No"]}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProbabilityGraph;
