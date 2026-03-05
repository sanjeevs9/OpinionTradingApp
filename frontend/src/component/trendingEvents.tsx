import { symbols } from "../db/data";
import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer,
  YAxis,
  XAxis,
  Tooltip,
} from "recharts";

// Deterministic pseudo-random from seed string
function seededRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return () => {
    h = (h ^ (h >>> 16)) * 0x45d9f3b;
    h = (h ^ (h >>> 16)) * 0x45d9f3b;
    h = h ^ (h >>> 16);
    return ((h >>> 0) / 4294967296);
  };
}

function generateChartData(yesPrice: string, seed: string) {
  const base = parseFloat(yesPrice);
  const rng = seededRandom(seed);
  const data = [];
  let value = base;
  for (let i = 0; i < 12; i++) {
    value = Math.max(0.5, Math.min(9.5, value + (rng() - 0.48) * 1.5));
    data.push({ v: Math.round(value * 10) / 10 });
  }
  data.push({ v: base });
  return data;
}

// --- Section 1: Trending (with mini area charts) ---

const trendingSymbols = symbols.slice(0, 6);

export const TrendingEvents = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-1">Trending</h2>
      <p className="text-sm text-gray-400 mb-4">Most traded events right now</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {trendingSymbols.map((sym) => {
          const chartData = generateChartData(sym.yesPrice, sym.mainTitle);
          const yesNum = parseFloat(sym.yesPrice);
          const isYesFavored = yesNum >= 5;

          return (
            <div
              key={sym.id}
              onClick={() => navigate("/events")}
              className="bg-white rounded-xl border shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3 mb-3">
                <img
                  className="rounded-lg flex-shrink-0 object-cover"
                  width={44}
                  height={44}
                  src={sym.url}
                  alt={sym.mainTitle}
                />
                <div className="min-w-0">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                    {sym.mainTitle}
                  </span>
                  <h3 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">
                    {sym.title}
                  </h3>
                </div>
              </div>

              <div className="h-16 -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id={`trend-g-${sym.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={isYesFavored ? "#1A7BFE" : "#E05852"} stopOpacity={0.15} />
                        <stop offset="100%" stopColor={isYesFavored ? "#1A7BFE" : "#E05852"} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <YAxis domain={[0, 10]} hide />
                    <Area
                      type="monotone"
                      dataKey="v"
                      stroke={isYesFavored ? "#1A7BFE" : "#E05852"}
                      strokeWidth={2}
                      fill={`url(#trend-g-${sym.id})`}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="flex gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#F1F7FF] text-[#1A7BFE]">
                    Yes ₹{sym.yesPrice}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#FEF5F5] text-[#E05852]">
                    No ₹{sym.noPrice}
                  </span>
                </div>
                <span className="text-[11px] text-gray-400">
                  {Number(sym.traders).toLocaleString("en-IN")} traders
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Section 2: Top Movers (biggest spread between yes/no) ---

const topMovers = [...symbols]
  .map((s) => ({
    ...s,
    spread: Math.abs(parseFloat(s.yesPrice) - parseFloat(s.noPrice)),
  }))
  .sort((a, b) => b.spread - a.spread)
  .slice(0, 5);

export const TopMovers = () => {
  const navigate = useNavigate();

  const barData = topMovers.map((s) => ({
    name: s.mainTitle.length > 10 ? s.mainTitle.slice(0, 10) + "..." : s.mainTitle,
    yes: parseFloat(s.yesPrice),
    no: parseFloat(s.noPrice),
  }));

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-1">Top Movers</h2>
      <p className="text-sm text-gray-400 mb-4">Events with the biggest price spread</p>
      <div className="bg-white rounded-xl border shadow-sm p-5">
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} barGap={4}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#888" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide domain={[0, 10]} />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid #eee", fontSize: "12px" }}
                formatter={(value: number, name: string) => [`₹${value}`, name === "yes" ? "Yes" : "No"]}
              />
              <Bar dataKey="yes" fill="#1A7BFE" radius={[4, 4, 0, 0]} />
              <Bar dataKey="no" fill="#E05852" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mt-4">
          {topMovers.map((s) => (
            <div
              key={s.id}
              onClick={() => navigate("/events")}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <img className="rounded flex-shrink-0 object-cover" width={32} height={32} src={s.url} alt={s.mainTitle} />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-900 truncate">{s.mainTitle}</p>
                <p className="text-[10px] text-gray-400">Spread ₹{s.spread.toFixed(1)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Section 3: Popular in Sports (horizontal scroll cards) ---

const sportsSymbols = symbols.filter((s) =>
  ["INDvsNZ", "UEL", "NBA", "PATvTAM KABBADI", "PAKvsENG", "BLRvsPUN KABBADI", "ISL"].includes(s.mainTitle)
);

export const PopularInSports = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-1">Popular in Sports</h2>
      <p className="text-sm text-gray-400 mb-4">Cricket, Football, Kabaddi and more</p>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {sportsSymbols.map((sym) => {
          const yesNum = parseFloat(sym.yesPrice);
          const yesPct = Math.round(yesNum * 10);

          return (
            <div
              key={sym.id}
              onClick={() => navigate("/events")}
              className="min-w-[260px] max-w-[260px] bg-white rounded-xl border shadow-sm p-4 flex-shrink-0 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <img className="rounded-lg object-cover" width={40} height={40} src={sym.url} alt={sym.mainTitle} />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{sym.mainTitle}</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2 mb-3">
                {sym.title}
              </h3>
              {/* Probability bar */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#1A7BFE]"
                    style={{ width: `${yesPct}%` }}
                  />
                </div>
                <span className="text-[11px] font-bold text-[#1A7BFE]">{yesPct}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#F1F7FF] text-[#1A7BFE]">
                    Yes ₹{sym.yesPrice}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#FEF5F5] text-[#E05852]">
                    No ₹{sym.noPrice}
                  </span>
                </div>
                <span className="text-[11px] text-gray-400">
                  {Number(sym.traders).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
