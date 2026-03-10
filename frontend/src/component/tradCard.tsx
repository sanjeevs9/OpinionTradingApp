import trades from "../assets/trades.avif";
import coma from "../assets/coma.avif";
import { Button } from "../utils/buttons";
import { useNavigate } from "react-router-dom";
import { OptimizedImage } from "./OptimizedImage";

function symbolAvatar(seed: string) {
  return `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(seed)}&size=70&backgroundColor=f1f5f9`;
}

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

  return (
    <div
      onClick={() => navigate(`/event-details/${stockSymbol}`)}
      className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer group"
    >
      <span className="flex items-center text-xs text-slate-400 font-medium">
        <OptimizedImage
          className="mr-1.5 opacity-60"
          width={14}
          height={14}
          src={trades}
          alt="trades"
        />
        0 traders
      </span>

      <div className="flex items-center gap-3.5 mt-3">
        <OptimizedImage
          className="rounded-xl flex-shrink-0"
          width={56}
          height={56}
          src={symbolAvatar(stockSymbol)}
          alt={stockSymbol}
        />
        <h2 className="text-base font-semibold text-slate-800 leading-snug group-hover:text-slate-950 transition-colors">
          {stockSymbol}
        </h2>
      </div>

      <span className="flex items-center text-slate-400 text-xs mt-3.5">
        <OptimizedImage
          className="object-contain opacity-50 mr-1"
          width={13}
          height={13}
          src={coma}
          alt="coma"
        />
        Trade on {stockSymbol}
      </span>

      <div className="flex mt-4 gap-2">
        <Button
          text={"Yes"}
          price={yesPrice}
          customClasses={"bg-yes-light text-yes w-1/2 hover:bg-yes-mid"}
        />
        <Button
          text={"No"}
          price={noPrice}
          customClasses={"bg-no-light text-no w-1/2 hover:bg-no-mid"}
        />
      </div>
    </div>
  );
};
