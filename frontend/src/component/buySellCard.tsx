import { LuSettings } from "react-icons/lu";
import { IoIosArrowDown } from "react-icons/io";
import errorIcon from "../assets/error.avif";
import { Switch } from "../utils/switch";
import { useState, useEffect, useRef } from "react";
import { useUser } from "../context/UserContext";
import { placeBuyOrder } from "../services/api";
import { getBestPrice, getCumulativeQty, paiseToRupees, rupeesToPaise } from "../utils/price";
import type { Orderbook } from "../types";

interface BuySellCardProps {
  stockSymbol: string;
  orderbook: Orderbook | null;
}

export const BuySellCard = ({ stockSymbol, orderbook }: BuySellCardProps) => {
  const [buyTab, setBuyTab] = useState<"yes" | "no">("yes");
  const [price, setPrice] = useState(0.5);
  const [quantity, setQuantity] = useState(1);
  const [advancedOption, setAdvancedOption] = useState(false);
  const [placing, setPlacing] = useState(false);
  const initializedRef = useRef<{ yes: boolean; no: boolean }>({ yes: false, no: false });

  const { userId, balance, refreshBalance, addFunds } = useUser();

  const bestYesPaise = getBestPrice(orderbook?.yes);
  const bestNoPaise = getBestPrice(orderbook?.no);
  const bestYesPrice = bestYesPaise ? paiseToRupees(bestYesPaise) : 5;
  const bestNoPrice = bestNoPaise ? paiseToRupees(bestNoPaise) : 5;

  useEffect(() => {
    const bestPaise = buyTab === "yes" ? bestYesPaise : bestNoPaise;
    if (bestPaise && !initializedRef.current[buyTab]) {
      setPrice(paiseToRupees(bestPaise));
      initializedRef.current[buyTab] = true;
    }
  }, [bestYesPaise, bestNoPaise, buyTab]);

  const selectedSide = buyTab === "yes" ? orderbook?.yes : orderbook?.no;
  const availableQty = getCumulativeQty(selectedSide, rupeesToPaise(price));

  const totalCostRupees = price * quantity;
  const hasEnoughBalance = balance >= totalCostRupees;

  const handlePlaceOrder = async () => {
    if (!userId || placing) return;
    setPlacing(true);
    try {
      await placeBuyOrder({
        userId,
        stockSymbol,
        quantity,
        price: rupeesToPaise(price),
        stockType: buyTab,
      });
      await refreshBalance();
    } catch (err) {
      console.error("Failed to place order:", err);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="border border-slate-200/60 sticky top-20 rounded-2xl xl:w-1/3 w-full flex flex-col p-5 h-fit bg-white shadow-card mt-10 xl:mt-0">
      {/* YES/NO toggle */}
      <div className="w-full rounded-xl flex bg-slate-100 p-1 h-11 items-center font-semibold text-sm">
        <button
          onClick={() => {
            setBuyTab("yes");
            if (bestYesPaise) setPrice(paiseToRupees(bestYesPaise));
          }}
          className={`w-1/2 rounded-lg h-full cursor-pointer transition-all duration-200 ${
            buyTab === "yes"
              ? "bg-yes text-white shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          YES ₹{bestYesPrice}
        </button>
        <button
          onClick={() => {
            setBuyTab("no");
            if (bestNoPaise) setPrice(paiseToRupees(bestNoPaise));
          }}
          className={`w-1/2 rounded-lg h-full cursor-pointer transition-all duration-200 ${
            buyTab === "no"
              ? "bg-no text-white shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          NO ₹{bestNoPrice}
        </button>
      </div>

      <span className="inline-flex items-center text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 mt-4 w-fit">
        Set price
      </span>

      {/* Price/Qty card */}
      <div className="relative bg-white border border-slate-200 mt-4 p-5 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Price</h2>
            <span className="text-xs text-slate-400">{availableQty} qty available</span>
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 p-0.5">
            <button
              onClick={() => price > 0.5 && setPrice(p => p - 0.5)}
              className={`w-8 h-8 rounded-md flex items-center justify-center cursor-pointer transition-colors ${
                price === 0.5 ? "text-slate-300" : "text-yes hover:bg-slate-50"
              } bg-slate-50`}
            >
              -
            </button>
            <span className="font-bold text-sm w-14 text-center">₹{price}</span>
            <button
              onClick={() => price < 10 && setPrice(p => p + 0.5)}
              className={`w-8 h-8 rounded-md flex items-center justify-center cursor-pointer transition-colors ${
                price === 10 ? "text-slate-300" : "text-yes hover:bg-slate-50"
              } bg-slate-50`}
            >
              +
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-8">
          <div>
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1">
              Quantity <LuSettings className="text-slate-400" size={14} />
            </h2>
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 p-0.5">
            <button
              onClick={() => quantity > 1 && setQuantity(q => q - 1)}
              className={`w-8 h-8 rounded-md flex items-center justify-center cursor-pointer transition-colors ${
                quantity === 1 ? "text-slate-300" : "text-yes hover:bg-slate-50"
              } bg-slate-50`}
            >
              -
            </button>
            <span className="font-bold text-sm w-14 text-center">{quantity}</span>
            <button
              onClick={() => quantity < 5 && setQuantity(q => q + 1)}
              className={`w-8 h-8 rounded-md flex items-center justify-center cursor-pointer transition-colors ${
                quantity === 5 ? "text-slate-300" : "text-yes hover:bg-slate-50"
              } bg-slate-50`}
            >
              +
            </button>
          </div>
        </div>

        <div className="flex justify-around mt-8 py-4 bg-slate-50 -mx-5 -mb-5 rounded-b-xl border-t border-slate-100">
          <span className="flex flex-col items-center">
            <span className="font-bold text-base text-slate-800">₹{price * quantity}</span>
            <span className="text-xs text-slate-400">You put</span>
          </span>
          <span className="flex flex-col items-center">
            <span className="font-bold text-base text-emerald-600">₹{10 * quantity}</span>
            <span className="text-xs text-slate-400">You get</span>
          </span>
        </div>

        <div className="absolute -top-2.5 left-9 w-4 h-4 bg-white border-l border-t border-slate-200 rotate-45"></div>
      </div>

      {/* Advanced options */}
      <div className="flex flex-col items-center mt-4">
        {advancedOption && (
          <div className="border border-slate-200 rounded-xl w-full mb-3 overflow-hidden">
            <div className="border-b border-slate-100 flex justify-between p-3.5">
              <div className="flex items-center gap-3">
                <span className="bg-emerald-50 text-emerald-600 p-1.5 rounded-md text-xs font-bold">BP</span>
                <h3 className="font-semibold text-sm text-slate-700">Book Profit</h3>
              </div>
              <Switch />
            </div>
            <div className="border-b border-slate-100 flex justify-between p-3.5">
              <div className="flex items-center gap-3">
                <span className="bg-red-50 text-red-600 p-1.5 rounded-md text-xs font-bold">SL</span>
                <h3 className="font-semibold text-sm text-slate-700">Stop Loss</h3>
              </div>
              <Switch />
            </div>
            <div className="flex justify-between p-3.5">
              <div className="flex items-center gap-3">
                <span className="bg-blue-50 text-blue-600 p-1.5 rounded-md text-xs font-bold">AC</span>
                <h3 className="font-semibold text-sm text-slate-700">Auto Cancel</h3>
              </div>
              <Switch />
            </div>
          </div>
        )}
        <button
          onClick={() => setAdvancedOption(!advancedOption)}
          className="flex text-slate-400 text-sm items-center gap-1.5 cursor-pointer hover:text-slate-600 transition-colors"
        >
          Advanced Options
          <IoIosArrowDown
            size={16}
            className={`transition-transform duration-200 ${advancedOption ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {!hasEnoughBalance && (
        <div className="flex items-center justify-between mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-center gap-3">
            <img className="object-contain w-5 h-5" src={errorIcon} alt="low_balance" />
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Insufficient balance</h3>
              <span className="text-xs text-slate-400">Click to add funds</span>
            </div>
          </div>
          <button
            onClick={() => addFunds(5000)}
            className="rounded-lg py-2 px-4 text-white bg-slate-900 text-sm font-semibold cursor-pointer hover:bg-slate-800 transition-colors"
          >
            Recharge
          </button>
        </div>
      )}

      <button
        disabled={!hasEnoughBalance || placing}
        onClick={handlePlaceOrder}
        className={`w-full py-3.5 text-white rounded-xl mt-4 font-bold text-sm transition-all ${
          hasEnoughBalance
            ? buyTab === "yes"
              ? "bg-yes cursor-pointer hover:bg-blue-700 active:scale-[0.99]"
              : "bg-no cursor-pointer hover:bg-rose-700 active:scale-[0.99]"
            : "bg-slate-200 text-slate-400 cursor-not-allowed"
        }`}
      >
        {placing ? "Placing..." : "Place order"}
      </button>
    </div>
  );
};
