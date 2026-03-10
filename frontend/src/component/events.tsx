import { useRef, useState } from "react";
import { events } from "../db/data";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import type { SymbolCardData } from "../types";
import { OptimizedImage } from "./OptimizedImage";

function symbolAvatar(seed: string) {
  return `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(seed)}&size=20&backgroundColor=f1f5f9`;
}

interface EventsProps {
  symbolCards: SymbolCardData[];
}

export const Events = ({ symbolCards }: EventsProps) => {
  const [activeTab, setActiveTab] = useState(1);
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -700, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 700, behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="hidden lg:flex items-center gap-1 border-b border-slate-200 mb-4">
        {events.map((item) => (
          <button
            key={item.eventId}
            onClick={() => setActiveTab(item.eventId)}
            className={`px-4 py-3 text-sm relative transition-colors cursor-pointer ${
              activeTab === item.eventId
                ? "font-semibold text-slate-900"
                : "font-medium text-slate-400 hover:text-slate-600"
            }`}
          >
            {item.title}
            {activeTab === item.eventId && (
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-slate-900 rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 py-3">
        <button onClick={scrollLeft} className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
          <IoIosArrowBack size={16} className="text-slate-500" />
        </button>
        <div
          ref={sliderRef}
          style={{ scrollBehavior: "smooth" }}
          className="flex-1 overflow-x-auto scrollbar-hide flex gap-2"
        >
          {symbolCards.map((card) => (
            <button
              key={card.stockSymbol}
              className="min-w-fit border border-slate-200 bg-white shadow-card rounded-lg py-1.5 px-3 flex items-center gap-2 text-sm font-medium text-slate-700 hover:border-slate-300 hover:shadow-card-hover transition-all cursor-pointer"
            >
              <OptimizedImage
                className="rounded flex-shrink-0"
                width={18}
                height={18}
                src={symbolAvatar(card.stockSymbol)}
                alt={card.stockSymbol}
              />
              {card.stockSymbol}
            </button>
          ))}
        </div>
        <button onClick={scrollRight} className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
          <IoIosArrowForward size={16} className="text-slate-500" />
        </button>
      </div>
    </div>
  );
};
