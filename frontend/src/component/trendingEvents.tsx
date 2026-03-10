import { symbols } from "../db/data";
import { useNavigate } from "react-router-dom";
import { OptimizedImage } from "./OptimizedImage";
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

const trendingSymbols = symbols.slice(0, 6);

export const TrendingEvents = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-12">
      <h2 className="font-display text-xl font-bold text-slate-900 mb-1">Trending</h2>
      <p className="text-sm text-slate-400 mb-5">Most traded events right now</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {trendingSymbols.map((sym) => {
          const chartData = generateChartData(sym.yesPrice, sym.mainTitle);
          const yesNum = parseFloat(sym.yesPrice);
          const isYesFavored = yesNum >= 5;

          return (
            <div
              key={sym.id}
              onClick={() => navigate(`/event-details/${sym.seedName}`)}
              className="bg-white rounded-2xl border border-slate-200/60 shadow-card p-4 cursor-pointer hover:shadow-card-hover transition-all duration-200 group"
            >
              <div className="flex items-start gap-3 mb-3">
                <OptimizedImage
                  className="rounded-xl flex-shrink-0 object-cover"
                  width={40}
                  height={40}
                  src={sym.url}
                  alt={sym.mainTitle}
                />
                <div className="min-w-0">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {sym.mainTitle}
                  </span>
                  <h3 className="text-sm font-semibold text-slate-800 leading-tight line-clamp-2 group-hover:text-slate-950 transition-colors">
                    {sym.title}
                  </h3>
                </div>
              </div>

              <div className="h-14 -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id={`trend-g-${sym.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={isYesFavored ? "#2563EB" : "#E11D48"} stopOpacity={0.12} />
                        <stop offset="100%" stopColor={isYesFavored ? "#2563EB" : "#E11D48"} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <YAxis domain={[0, 10]} hide />
                    <Area
                      type="monotone"
                      dataKey="v"
                      stroke={isYesFavored ? "#2563EB" : "#E11D48"}
                      strokeWidth={1.5}
                      fill={`url(#trend-g-${sym.id})`}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between mt-2.5">
                <div className="flex gap-1.5">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-yes-light text-yes">
                    Yes ₹{sym.yesPrice}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-no-light text-no">
                    No ₹{sym.noPrice}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
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

// --- Top Movers ---

const topMovers = [...symbols]
  .filter((s, idx, arr) => arr.findIndex((x) => x.seedName === s.seedName) === idx)
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
    <div className="mt-12">
      <h2 className="font-display text-xl font-bold text-slate-900 mb-1">Top Movers</h2>
      <p className="text-sm text-slate-400 mb-5">Events with the biggest price spread</p>
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-card p-5">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} barGap={4}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide domain={[0, 10]} />
              <Tooltip
                contentStyle={{ borderRadius: "10px", border: "1px solid #E2E8F0", fontSize: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}
                formatter={(value: number, name: string) => [`₹${value}`, name === "yes" ? "Yes" : "No"]}
              />
              <Bar dataKey="yes" fill="#2563EB" radius={[6, 6, 0, 0]} />
              <Bar dataKey="no" fill="#E11D48" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mt-4">
          {topMovers.map((s) => (
            <div
              key={s.id}
              onClick={() => navigate(`/event-details/${s.seedName}`)}
              className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <OptimizedImage className="rounded-lg flex-shrink-0 object-cover" width={32} height={32} src={s.url} alt={s.mainTitle} />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">{s.mainTitle}</p>
                <p className="text-[10px] text-slate-400">Spread ₹{s.spread.toFixed(1)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Popular in Sports ---

const sportsSymbols = symbols.filter((s) =>
  ["INDvsNZ", "UEL", "NBA", "PATvTAM KABBADI", "PAKvsENG", "BLRvsPUN KABBADI", "ISL"].includes(s.mainTitle)
);

export const PopularInSports = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-12">
      <h2 className="font-display text-xl font-bold text-slate-900 mb-1">Popular in Sports</h2>
      <p className="text-sm text-slate-400 mb-5">Cricket, Football, Kabaddi and more</p>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {sportsSymbols.map((sym) => {
          const yesNum = parseFloat(sym.yesPrice);
          const yesPct = Math.round(yesNum * 10);

          return (
            <div
              key={sym.id}
              onClick={() => navigate(`/event-details/${sym.seedName}`)}
              className="min-w-[260px] max-w-[260px] bg-white rounded-2xl border border-slate-200/60 shadow-card p-4 flex-shrink-0 cursor-pointer hover:shadow-card-hover transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-3">
                <OptimizedImage className="rounded-xl object-cover" width={36} height={36} src={sym.url} alt={sym.mainTitle} />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{sym.mainTitle}</span>
              </div>
              <h3 className="text-sm font-semibold text-slate-800 leading-tight line-clamp-2 mb-3">
                {sym.title}
              </h3>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-yes"
                    style={{ width: `${yesPct}%` }}
                  />
                </div>
                <span className="text-[11px] font-bold text-yes">{yesPct}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-yes-light text-yes">
                    Yes ₹{sym.yesPrice}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-no-light text-no">
                    No ₹{sym.noPrice}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
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
