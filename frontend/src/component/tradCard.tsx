import trades from "../assets/trades.avif";
import { useNavigate } from "react-router-dom";
import { OptimizedImage } from "./OptimizedImage";
import { symbolIconMap } from "../db/data";

interface TradeCardType {
  stockSymbol: string;
  yesPrice: number;
  noPrice: number;
}

export const TradeCard = ({
  stockSymbol,
  yesPrice,
  noPrice,
}: TradeCardType) => {
  const navigate = useNavigate();
  const yesPct = Math.round((yesPrice / 10) * 100);
  const iconInfo = (symbolIconMap as Record<string, any>)[stockSymbol];

  return (
    <div
      onClick={() => navigate(`/event-details/${stockSymbol}`)}
      className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-card hover-lift hover:shadow-card-hover transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-center gap-3.5">
        <OptimizedImage
          className="rounded-xl flex-shrink-0 object-cover"
          width={52}
          height={52}
          src={iconInfo?.url || `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(stockSymbol)}&size=70&backgroundColor=f1f5f9`}
          alt={iconInfo?.mainTitle || stockSymbol}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <OptimizedImage
              className="opacity-50"
              width={12}
              height={12}
              src={trades}
              alt="trades"
            />
            <span className="text-[11px] text-slate-400 font-medium">{iconInfo?.traders ? `${Number(iconInfo.traders).toLocaleString("en-IN")} traders` : "0 traders"}</span>
          </div>
          <h2 className="text-[15px] font-semibold text-slate-800 leading-snug mt-0.5 group-hover:text-slate-950 transition-colors">
            {iconInfo?.title || stockSymbol}
          </h2>
        </div>
      </div>

      {/* Probability bar */}
      <div className="flex items-center gap-2.5 mt-4">
        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-yes transition-all"
            style={{ width: `${yesPct}%` }}
          />
        </div>
        <span className="text-[11px] font-bold text-yes">{yesPct}%</span>
      </div>

      <div className="flex mt-4 gap-2">
        <button
          className="flex-1 min-w-0 rounded-xl text-sm font-bold py-2.5 px-4 cursor-pointer transition-all bg-yes-light text-yes hover:bg-yes-mid active:scale-[0.98]"
        >
          Yes ₹{yesPrice}
        </button>
        <button
          className="flex-1 min-w-0 rounded-xl text-sm font-bold py-2.5 px-4 cursor-pointer transition-all bg-no-light text-no hover:bg-no-mid active:scale-[0.98]"
        >
          No ₹{noPrice}
        </button>
      </div>
    </div>
  );
};
