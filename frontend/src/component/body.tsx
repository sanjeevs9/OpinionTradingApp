import { TradeCard } from "./tradCard";
import { TrendingEvents, TopMovers, PopularInSports } from "./trendingEvents";
import { TopStories } from "./topStories";
import type { SymbolCardData } from "../types";

interface BodyContentProps {
  symbolCards: SymbolCardData[];
  loading: boolean;
}

export const BodyContent = ({ symbolCards, loading }: BodyContentProps) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Top stories */}
      <div className="mb-10">
        <h2 className="font-display text-xl font-bold text-slate-900 mb-1">Top Story</h2>
        <p className="text-sm text-slate-400 mb-5">Featured event with live probability</p>
        <TopStories />
      </div>

      {/* All events */}
      <div id="allevents">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h1 className="font-display text-xl font-bold text-slate-900 mb-1">All events</h1>
            <p className="text-sm text-slate-400">Browse and trade on live events</p>
          </div>
          {symbolCards.length > 0 && (
            <span className="text-sm text-slate-400">{symbolCards.length} events</span>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-slate-200 border-t-yes rounded-full animate-spin" />
          </div>
        ) : symbolCards.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200/60">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-base font-semibold text-slate-600">No events available</p>
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
