import { useState } from "react";
import { TradeCard } from "./tradCard";
import { TrendingEvents, TopMovers, PopularInSports } from "./trendingEvents";
import { TopStories } from "./topStories";
import type { SymbolCardData } from "../types";

const INITIAL_COUNT = 9;

// Map seedNames to categories for filtering
const categoryMap: Record<string, string> = {
  INDvsNZ: "Cricket",
  PAKvsENG: "Cricket",
  UEL: "Football",
  ISL: "Football",
  NBA: "Basketball",
  PATvTAM_KABBADI: "Kabbadi",
  BLRvsPUN_KABBADI: "Kabbadi",
  Bitcoin: "Crypto",
  STOCKS_JPY: "Stocks",
  YouTube: "YouTube",
  Esports: "Gaming",
  GTA6: "Gaming",
  BGMI: "Gaming",
  Politics: "Politics",
  TAX_REFUND: "Politics",
  BREAKING_NEWS: "News",
  Weather: "Weather",
  Climate: "Weather",
};

const categories = ["All", "Cricket", "Football", "Crypto", "Gaming", "Politics", "Kabbadi", "Basketball", "Stocks", "News", "Weather", "YouTube"];

interface BodyContentProps {
  symbolCards: SymbolCardData[];
  loading: boolean;
}

export const BodyContent = ({ symbolCards, loading }: BodyContentProps) => {
  const [showAll, setShowAll] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredCards = activeCategory === "All"
    ? symbolCards
    : symbolCards.filter((c) => categoryMap[c.stockSymbol] === activeCategory);

  const visibleCards = showAll ? filteredCards : filteredCards.slice(0, INITIAL_COUNT);
  const hasMore = filteredCards.length > INITIAL_COUNT;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Top stories */}
      <div className="mb-10">
        <h2 className="font-display text-xl font-bold text-slate-900 mb-1">Top Story</h2>
        <p className="text-sm text-slate-400 mb-5">Featured event with live probability</p>
        <TopStories />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setShowAll(false); }}
            className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap cursor-pointer transition-all ${
              activeCategory === cat
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-slate-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* All events */}
      <div id="allevents">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h1 className="font-display text-xl font-bold text-slate-900 mb-1">
              {activeCategory === "All" ? "All events" : activeCategory}
            </h1>
            <p className="text-sm text-slate-400">Browse and trade on live events</p>
          </div>
          {filteredCards.length > 0 && (
            <span className="text-sm text-slate-400">{filteredCards.length} events</span>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-slate-200 border-t-yes rounded-full animate-spin" />
          </div>
        ) : filteredCards.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200/60">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-base font-semibold text-slate-600">No events in {activeCategory}</p>
            <p className="text-sm text-slate-400 mt-1">Try selecting a different category</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visibleCards.map((card) => (
                <TradeCard
                  key={card.stockSymbol}
                  stockSymbol={card.stockSymbol}
                  yesPrice={card.yesPrice}
                  noPrice={card.noPrice}
                />
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="px-6 py-2.5 text-sm font-semibold rounded-xl border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
                >
                  {showAll ? "Show less" : `View more (${filteredCards.length - INITIAL_COUNT} more)`}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <TrendingEvents />
      <TopMovers />
      <PopularInSports />

      <div className="h-10" />
    </div>
  );
};
