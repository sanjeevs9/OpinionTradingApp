import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { IoIosSwap } from "react-icons/io";

const data = [
  { date: "17 Sep", probability: 20 },
  { date: "25 Sep", probability: 40 },
  { date: "03 Oct", probability: 55 },
  { date: "10 Oct", probability: 35 },
  { date: "16 Oct", probability: 55 },
  { date: "17 Oct", probability: 30 },
  { date: "26 Oct", probability: 90 },
  { date: "27 Oct", probability: 70 },
  { date: "28 Oct", probability: 60 },
  { date: "29 Oct", probability: 80 },
  { date: "30 Oct", probability: 20 },
  { date: "31 Oct", probability: 60 },
];

const nodata = [
  { date: "17 Sep", probability: 40 },
  { date: "25 Sep", probability: 80 },
  { date: "03 Oct", probability: 90 },
  { date: "10 Oct", probability: 70 },
  { date: "16 Oct", probability: 90 },
  { date: "17 Oct", probability: 40 },
  { date: "26 Oct", probability: 60 },
  { date: "27 Oct", probability: 20 },
  { date: "28 Oct", probability: 35 },
  { date: "29 Oct", probability: 60 },
  { date: "30 Oct", probability: 40 },
  { date: "31 Oct", probability: 100 },
];

const ProbabilityGraph = () => {
  const [yes, setYes] = useState(false);

  const color = yes ? "#2563EB" : "#E11D48";

  return (
    <div className="bg-white rounded-xl p-5">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className={`text-lg font-bold ${yes ? 'text-yes' : 'text-no'}`}>
            {yes ? '80%' : '20%'}
          </h2>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Probability of {yes ? 'YES' : 'NO'}
          </p>
        </div>
        <button
          onClick={() => setYes(!yes)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border-2 cursor-pointer transition-colors ${
            yes
              ? 'text-no border-no/30 hover:bg-no-light'
              : 'text-yes border-yes/30 hover:bg-yes-light'
          }`}
        >
          <IoIosSwap size={16} />
          {yes ? 'No' : 'Yes'}
        </button>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          data={yes ? nodata : data}
          margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeOpacity={0} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#94A3B8" }}
            axisLine={false}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis
            orientation="right"
            tick={{ fontSize: 11, fill: "#94A3B8" }}
            axisLine={false}
            tickLine={false}
            tickMargin={10}
          />
          <Line
            type="monotone"
            dataKey="probability"
            stroke={color}
            strokeWidth={2}
            dot={{ r: 0, fill: color, strokeWidth: 0 }}
            activeDot={{ r: 6, strokeWidth: 2, stroke: color, fill: "white" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "10px",
              border: "1px solid #E2E8F0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              fontSize: "12px",
            }}
            itemStyle={{ fontWeight: "600", color }}
            labelStyle={{ color: "#94A3B8", fontSize: "11px" }}
            formatter={(value) => [`${value}%`, yes ? "Yes" : "No"]}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProbabilityGraph;
