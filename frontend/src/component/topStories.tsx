import { useNavigate } from "react-router-dom";
import { symbols } from "../db/data";
import ProbabilityGraph from "./graph";
import { ReadMoreText } from "../utils/readMore";
import { OptimizedImage } from "./OptimizedImage";

const topStory = symbols.find((s) => s.seedName === "TAX_REFUND") || symbols[0];

export const TopStories = () => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/event-details/${topStory.seedName}`)}
      className="bg-white rounded-2xl border border-slate-200/60 shadow-card min-h-56 md:flex overflow-hidden hover:shadow-card-hover transition-shadow cursor-pointer"
    >
      <div className="p-6 space-y-3 md:w-[65%] w-full">
        <div className="flex items-start gap-3">
          <OptimizedImage
            className="rounded-xl flex-shrink-0"
            width={48}
            height={48}
            src={topStory.url}
            alt={topStory.mainTitle}
          />
          <div className="flex-1">
            <span className="text-[10px] font-bold text-yes uppercase tracking-widest">Featured</span>
            <h1 className="font-display text-xl font-bold text-slate-900 leading-snug mt-1">
              {topStory.title}
            </h1>
          </div>
        </div>

        <p className="text-sm text-slate-500 leading-relaxed">
          {topStory.description}
        </p>
        {ReadMoreText(topStory.description + " " + topStory.description)}

        <div className="flex justify-between items-center pt-3">
          <div>
            <p className="text-sm font-bold text-slate-800">{Number(topStory.traders).toLocaleString("en-IN")}</p>
            <span className="text-xs text-slate-400">Traders</span>
          </div>
          <div className="flex gap-2">
            <span className="min-w-[100px] text-center rounded-xl text-sm font-bold py-2.5 px-5 bg-yes-light text-yes">
              Yes ₹{topStory.yesPrice}
            </span>
            <span className="min-w-[100px] text-center rounded-xl text-sm font-bold py-2.5 px-5 bg-no-light text-no">
              No ₹{topStory.noPrice}
            </span>
          </div>
        </div>
      </div>
      <div className="md:w-[35%] w-full flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
        <ProbabilityGraph />
      </div>
    </div>
  );
};
