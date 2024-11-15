import trades from "../assets/trades.avif";
import coma from "../assets/coma.avif";
import { Button } from "../utils/buttons";

interface TradeCardType {
  symbol: any;
  url: any;
  yesPrice: string;
  noPrice: string;
  totalTrades: string;
  title: string;
  description: string;
}

export const TradeCard = ({
  symbol,
  url,
  yesPrice,
  noPrice,
  totalTrades,
  title,
  description,
}: TradeCardType) => {
  return (
    <>
      <div
        key={symbol.id}
        className="border grid-flow-row w-full p-3 rounded-xl bg-white shadow-md mt-3"
      >
        <span className="flex text-xs">
          <img
            className="mr-1"
            width={15}
            height={15}
            src={trades}
            alt="trades"
          />
          {totalTrades} traders
        </span>
        <div className="flex space-x-4">
          <img
            className="rounded-lg mt-2"
            width={70}
            height={70}
            src={url}
            alt="tradeicon"
          />
          <h2 className="text-lg py-2 font-medium">{title}</h2>
        </div>
        <span className="flex text-[#5E5E5E] text-xs mt-4">
          <img
            className="object-contain"
            width={15}
            height={15}
            src={coma}
            alt="coma"
          />
          {description}
        </span>
        <div className="flex p-1 mt-4 gap-2">
          <Button
            text={"Yes"}
            price={yesPrice}
            customClasses={"bg-[#F1F7FF] text-[#1A7BFE] w-1/2"}
          />
          <Button
            text={"No"}
            price={noPrice}
            customClasses={"bg-[#FEF5F5] text-[#E05852] w-1/2"}
          />
        </div>
      </div>
    </>
  );
};
