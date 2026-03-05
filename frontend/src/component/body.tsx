import { TradeCard } from "./tradCard";
import { TrendingEvents, TopMovers, PopularInSports } from "./trendingEvents";
import type { SymbolCardData } from "../types";

interface BodyContentProps {
  symbolCards: SymbolCardData[];
  loading: boolean;
}

export const BodyContent = ({ symbolCards, loading }: BodyContentProps) => {
  return (
    <div className="p-4 px-10">
      <div id="allevents" className="pt-4">
        <h1 className="text-xl font-semibold mb-3">All events</h1>
        <hr />

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
          </div>
        ) : symbolCards.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg font-medium">No events available</p>
            <p className="text-sm mt-1">Create symbols via the admin panel to see them here</p>
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
