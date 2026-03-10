import topStoriesIcon from "../assets/topstories.avif";
import { Button } from "../utils/buttons";
import ProbabilityGraph from "./graph";
import { ReadMoreText } from "../utils/readMore";

export const TopStories = () => {
  let description =
    "Tax Refund for states to be increased by the 16th Finance Commission The 15th Finance Commission had recommended 41% of the tax funds collected by states to be paid to the states The finance ministers of these participating states agreed with Vijayan that states need to receive more funds from the Centre. Vijayan said that, as per Article 270 of the Constitution, surcharges and cesses are excluded from the divisible pool of taxes shareable with the states and suggested that they should be part of total tax collected by the Centre so that it can be part of the devolution formula. Kerala chief minister";
  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-card min-h-72 md:flex overflow-hidden">
      <div className="p-5 space-y-3 md:w-1/2 w-full">
        <h1 className="font-display text-xl font-bold text-slate-900 flex items-start gap-3">
          <span className="leading-snug">Tax Refund for states to be increased by the 16th Finance Commission?</span>
          <img
            className="object-contain flex-shrink-0 mt-0.5"
            width={48}
            height={48}
            src={topStoriesIcon}
            alt="icon"
            loading="lazy"
            decoding="async"
          />
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          The 15th Finance Commission had recommended 41% of the tax funds
          collected by states to be paid to the states
        </p>
        {ReadMoreText(description)}

        <div className="flex justify-between items-center pt-2">
          <div>
            <p className="text-sm font-bold text-slate-800">505</p>
            <span className="text-xs text-slate-400">Traders</span>
          </div>
          <div className="flex gap-2">
            <Button
              text={"Yes"}
              price={"8.0"}
              customClasses={"bg-yes-light text-yes hover:bg-yes-mid"}
            />
            <Button
              text={"No"}
              price={"2.0"}
              customClasses={"bg-no-light text-no hover:bg-no-mid"}
            />
          </div>
        </div>
      </div>
      <div className="md:w-1/2 w-full">
        <ProbabilityGraph />
      </div>
    </div>
  );
};
