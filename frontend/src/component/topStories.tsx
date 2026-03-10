import topStoriesIcon from "../assets/topstories.avif";
import ProbabilityGraph from "./graph";
import { ReadMoreText } from "../utils/readMore";

export const TopStories = () => {
  const description =
    "Tax Refund for states to be increased by the 16th Finance Commission The 15th Finance Commission had recommended 41% of the tax funds collected by states to be paid to the states The finance ministers of these participating states agreed with Vijayan that states need to receive more funds from the Centre. Vijayan said that, as per Article 270 of the Constitution, surcharges and cesses are excluded from the divisible pool of taxes shareable with the states and suggested that they should be part of total tax collected by the Centre so that it can be part of the devolution formula. Kerala chief minister";

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-card min-h-72 md:flex overflow-hidden hover:shadow-card-hover transition-shadow">
      <div className="p-6 space-y-3 md:w-1/2 w-full">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <span className="text-[10px] font-bold text-yes uppercase tracking-widest">Featured</span>
            <h1 className="font-display text-xl font-bold text-slate-900 leading-snug mt-1">
              Tax Refund for states to be increased by the 16th Finance Commission?
            </h1>
          </div>
          <img
            className="object-contain flex-shrink-0"
            width={48}
            height={48}
            src={topStoriesIcon}
            alt="icon"
            loading="lazy"
            decoding="async"
          />
        </div>

        <p className="text-sm text-slate-500 leading-relaxed">
          The 15th Finance Commission had recommended 41% of the tax funds
          collected by states to be paid to the states
        </p>
        {ReadMoreText(description)}

        <div className="flex justify-between items-center pt-3">
          <div>
            <p className="text-sm font-bold text-slate-800">505</p>
            <span className="text-xs text-slate-400">Traders</span>
          </div>
          <div className="flex gap-2">
            <button className="min-w-[100px] rounded-xl text-sm font-bold py-2.5 px-5 cursor-pointer transition-all bg-yes-light text-yes hover:bg-yes-mid active:scale-[0.98]">
              Yes ₹8.0
            </button>
            <button className="min-w-[100px] rounded-xl text-sm font-bold py-2.5 px-5 cursor-pointer transition-all bg-no-light text-no hover:bg-no-mid active:scale-[0.98]">
              No ₹2.0
            </button>
          </div>
        </div>
      </div>
      <div className="md:w-1/2 w-full flex items-center">
        <ProbabilityGraph />
      </div>
    </div>
  );
};
