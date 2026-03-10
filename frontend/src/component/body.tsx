import { TradeCard } from "./tradCard";
import { TrendingEvents, TopMovers, PopularInSports } from "./trendingEvents";
import type { SymbolCardData } from "../types";

interface BodyContentProps {
  symbolCards: SymbolCardData[];
  loading: boolean;
}

export const BodyContent = ({ symbolCards, loading }: BodyContentProps) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div id="allevents">
        <h1 className="font-display text-xl font-bold text-slate-900 mb-1">All events</h1>
        <p className="text-sm text-slate-400 mb-5">Browse and trade on live events</p>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin"></div>
          </div>
        ) : symbolCards.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200/60">
            <p className="text-base font-medium text-slate-500">No events available</p>
            <p className="text-sm text-slate-400 mt-1">Create symbols via the admin panel to see them here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {symbolCards.map((card) => (
              <TradeCard
                key={card.stockSymbol}
                stockSymbol={card.stockSymbol}
                yesPrice={card.yesPrice}
                noPrice={card.noPrice}
              />
            ))}
          </div>
        )}
      </div>

      <TrendingEvents />
      <TopMovers />
      <PopularInSports />

      <div className="h-10" />
    </div>
  );
};
