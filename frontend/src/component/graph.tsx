import React, { useState } from "react";
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

  return (
    <div className="bg-white rounded-xl p-6">
      <div className=" flex justify-between">
        <div>
          <h2 className={`text-base font-bold ${!yes ? 'text-[#E05852]' : 'text-blue-600'}`}>{!yes ? '20%' : '80%'}</h2>
          <p className="font-semibold text-[10px] text-[#545454]">
            PROBABILITY OF {!yes ? 'NO': 'YES'}
          </p>
        </div>
        <div className="flex items-center justify-end">
          <button
            onClick={() => setYes(!yes)}
            className={`w-20 px-2 py-[2px] text-xs flex justify-around items-center mr-10 ${yes ? 'text-[#E05852] font-bold border-2 border-[#E05852]': 'text-blue-600 font-bold border-2 border-blue-600'} rounded-lg`}
          >
            <IoIosSwap size={20} />
            {!yes ? 'Yes' : 'No'}
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          data={yes ? nodata : data}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeOpacity={0} />

          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "#888" }}
            axisLine={false}
            tickLine={false}
            tickMargin={10}
          />

          <YAxis
            orientation="right"
            tick={{ fontSize: 12, fill: "#888" }}
            axisLine={false}
            tickLine={false}
            tickMargin={10}
          />

          <Line
            type="monotone"
            dataKey="probability"
            stroke={yes ? "#1A7BFE" : "#E57373"} 
            strokeWidth={3}
            dot={{ r: 0, fill: "#E57373", strokeWidth: 0 }}
            activeDot={{ r: 8, strokeWidth: 2, stroke: yes ? "#1A7BFE" : "#FF5722" }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
            itemStyle={{ fontWeight: "bold", color: yes ? "#1A7BFE" : "#FF5722" }}
            labelStyle={{ color: "#888" }}
            formatter={(value) => [`No: ${value}%`, ""]}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProbabilityGraph;
