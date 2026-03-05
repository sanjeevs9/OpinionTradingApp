import topStoriesIcon from "../assets/topstories.avif";
import { Button } from "../utils/buttons";
import ProbabilityGraph from "./graph";
import { ReadMoreText } from "../utils/readMore";

export const TopStories = () => {
  let description =
    "Tax Refund for states to be increased by the 16th Finance Commission The 15th Finance Commission had recommended 41% of the tax funds collected by states to be paid to the states The finance ministers of these participating states agreed with Vijayan that states need to receive more funds from the Centre. Vijayan said that, as per Article 270 of the Constitution, surcharges and cesses are excluded from the divisible pool of taxes shareable with the states and suggested that they should be part of total tax collected by the Centre so that it can be part of the devolution formula. Kerala chief minister";
  return (
    <>
      <div className="rounded-lg bg-white shadow-md min-h-72 md:flex block">
        <div id="containt" className="p-4 space-y-3 md:w-1/2 w-full">
          <h1 className="text-2xl font-bold flex space-x-4">
            Tax Refund for states to be increased by the 16th Finance
            Commission?
            <img
              className="object-contain ml-4 -mt-10"
              width={60}
              height={60}
              src={topStoriesIcon}
              alt="icon"
            />
          </h1>
          <h4 className="text-sm font-bold text-[#6C6C6C]">
            The 15th Finance Commission had recommended 41% of the tax funds
            collected by states to be paid to the states
          </h4>
          {ReadMoreText(description)}

          <div className="flex justify-between mt-3">
            <div>
              <p className="text-sm font-bold text-black -mb-2">505</p>
              <span className="text-xs text-[#6C6C6C] -mt-2">Traders</span>
            </div>

            <div className="flex gap-3">
              <Button
                text={"Yes"}
                price={"8.0"}
                customClasses={"bg-[#F1F7FF] text-[#1A7BFE]"}
              />
              <Button
                text={"No"}
                price={"2.0"}
                customClasses={"bg-[#FEF5F5] text-[#E05852]"}
              />
            </div>
          </div>
        </div>
        <div className="md:w-1/2 w-full" id="graph">
          <ProbabilityGraph />
        </div>
      </div>
    </>
  );
};

