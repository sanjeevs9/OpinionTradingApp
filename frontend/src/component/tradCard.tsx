import trades from "../assets/trades.avif";
import coma from "../assets/coma.avif";
import { Button } from "../utils/buttons";
import { useNavigate } from "react-router-dom";

function symbolAvatar(seed: string) {
  return `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(seed)}&size=70&backgroundColor=f1f5f9`;
}

interface TradeCardType {
  stockSymbol: string;
  yesPrice: number;
  noPrice: number;
}

export const TradeCard = ({
  stockSymbol,
  yesPrice,
  noPrice,
}: TradeCardType) => {
  const navigate = useNavigate();

  return (
    <>
      <div
        onClick={() => navigate(`/event-details/${stockSymbol}`)}
        className="border grid-flow-row w-full p-3 rounded-xl bg-white shadow-md mt-3 cursor-pointer"
      >
        <span className="flex text-xs">
          <img
            className="mr-1"
            width={15}
            height={15}
            src={trades}
            alt="trades"
          />
          0 traders
        </span>
        <div className="flex space-x-4">
          <img
            className="rounded-lg mt-2"
            width={70}
            height={70}
            src={symbolAvatar(stockSymbol)}
            alt={stockSymbol}
          />
          <h2 className="text-lg py-2 font-medium">{stockSymbol}</h2>
        </div>
        <span className="flex text-[#5E5E5E] text-xs mt-4">
          <img
            className="object-contain"
            width={15}
            height={15}
            src={coma}
            alt="coma"
          />
          Trade on {stockSymbol}
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
