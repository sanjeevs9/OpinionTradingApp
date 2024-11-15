import { LuSettings } from "react-icons/lu";
import { IoIosArrowDown } from "react-icons/io";
import errorIcon from "../assets/error.avif";
import { Switch } from "../utils/switch";
import { useState } from "react";

export const BuySellCard = () => {
  const [buyTab, setBuyTab] = useState("yes");
  const [price, setPrice] = useState(0.5);
  const [quantity, setQuantity] = useState(1);
  const [advancedOption, setAdvancedOption] = useState(false);

  return (
    <>
      <div className="border sticky top-20 rounded-xl xl:w-1/3 w-full flex flex-col justify-center p-5 h-fit bg-white mt-24">
        <div
          onClick={(e: any) => {
            if (e.target.nodeName === "BUTTON") {
              let value = e.target.getAttribute("value");
              setBuyTab(value);
            }
          }}
          className="w-full rounded-3xl flex border-2 h-10 items-center justify-around font-bold text-sm"
        >
          <button
            value="yes"
            className={`w-1/2 rounded-2xl h-full ${
              buyTab === "yes"
                ? "bg-[#197BFF] text-white"
                : "bg-white text-black"
            } `}
          >
            YES ₹9.5
          </button>
          <button
            value="no"
            className={`w-1/2 rounded-2xl h-full ${
              buyTab === "no"
                ? "bg-[#E6675A] text-white"
                : "bg-white text-black"
            } `}
          >
            NO ₹0.5
          </button>
        </div>
        <div className="border w-24 rounded-2xl px-2 flex justify-center py-1 font-bold mt-4">
          Set price
        </div>
        <div className="relative bg-white border mt-5 border-gray-300 p-6 rounded-xl w-full">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h2 className="text-lg font-bold">Price</h2>
              <span className="text-sm text-gray-400">0 qty available</span>
            </div>
            <div
              onClick={(e: any) => {
                if (e.target.nodeName === "BUTTON") {
                  let value = e.target.value;
                  if (value === "+" && price < 10) {
                    setPrice((pre) => (pre += 0.5));
                  }
                  if (value === "-" && price > 0.5) {
                    setPrice((pre) => (pre -= 0.5));
                  }
                }
              }}
              className="w-36 flex justify-between rounded-lg border p-1"
            >
              <button
                value="-"
                className={`border rounded w-1/5 ${
                  price === 0.5 ? "text-gray-300" : "text-[#9EC2FC]"
                } bg-[#F6F6F6]`}
              >
                -
              </button>
              <span className="font-bold text-lg">₹{price}</span>
              <button
                value="+"
                className={`border rounded w-1/5 ${
                  price === 10 ? "text-gray-300" : "text-[#9EC2FC]"
                } bg-[#F6F6F6]`}
              >
                +
              </button>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mt-10">
              <div className="flex flex-col">
                <h2 className="text-lg font-bold flex items-center gap-1">
                  Quantity <LuSettings className="mt-1" size={17} />
                </h2>
              </div>
              <div
                onClick={(e: any) => {
                  if (e.target.nodeName === "BUTTON") {
                    let value = e.target.value;
                    if (value === "+" && quantity < 5) {
                      setQuantity((pre) => (pre += 1));
                    }
                    if (value === "-" && quantity > 1) {
                      setQuantity((pre) => (pre -= 1));
                    }
                  }
                }}
                className="w-36 flex justify-between rounded-lg border p-1"
              >
                <button
                  value="-"
                  className={`border rounded w-1/5 ${
                    quantity === 1 ? "text-gray-300" : "text-[#9EC2FC]"
                  } bg-[#F6F6F6]`}
                >
                  -
                </button>
                <span className="font-bold text-lg">{quantity}</span>
                <button
                  value="+"
                  className={`border rounded w-1/5 ${
                    quantity === 5 ? "text-gray-300" : "text-[#9EC2FC]"
                  } bg-[#F6F6F6]`}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-around mt-10">
            <span className="flex flex-col items-center">
              <span className="font-bold text-lg"> ₹{price * quantity}</span>
              <span className="text-md text-[#ACACAC] font-light">You put</span>
            </span>
            <span className="flex flex-col items-center">
              <span className="font-bold text-lg text-green-700">
                {" "}
                ₹{10 * quantity}
              </span>
              <span className="text-md text-[#ACACAC] font-light">You get</span>
            </span>
          </div>
          <div className="absolute -top-3 left-9 w-5 h-5 bg-white border-l border-t border-gray-300 rotate-45"></div>
        </div>
        {/* advanced options */}
        <div className="flex flex-col items-center justify-center mt-4">
          {advancedOption && (
            <div className="border rounded-xl w-full mb-2">
              <div className="border-b flex justify-between p-3">
                <div className="flex justify-start gap-4 items-center w-1/2">
                  <span className="border bg-[#ECF7F1] p-2 rounded-md text-xs font-bold text-[#05935E]">
                    BP
                  </span>
                  <h3 className="font-bold">Book Profit</h3>
                </div>
                <Switch />
              </div>
              <div className="border-b flex justify-between p-3">
                <div className="flex justify-start gap-4 items-center w-1/2">
                  <span className="border bg-[#FDF3F2] p-2 rounded-md text-xs font-bold text-[#DC331D]">
                    SL
                  </span>
                  <h3 className="font-bold">Stop Loss</h3>
                </div>
                <Switch />
              </div>
              <div className="p-3 flex justify-between">
                <div className="flex justify-start gap-4 items-center w-1/2">
                  <span className="border bg-[#E8F2FE] p-2 rounded-md text-xs font-bold text-[#187AFD]">
                    AC
                  </span>
                  <h3 className="font-bold">Auto Cancel</h3>
                </div>
                <Switch />
              </div>
            </div>
          )}
          <button
            onClick={() => setAdvancedOption(!advancedOption)}
            className="flex text-[#808080] text-sm items-center gap-2"
          >
            Advanced Options
            <IoIosArrowDown
              size={20}
              className={`${advancedOption && "rotate-180"}`}
            />
          </button>
        </div>
        <div className="flex justify-around mt-4">
          <div className="flex gap-5">
          <img className="object-contain" src={errorIcon} alt="low_balance" />
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold mb-1">Insufficient balance</h3>
            <span className="text-xs font-light">Learn more</span>
          </div>
          </div>
          <button className="rounded-lg p-2 px-4 text-white bg-black font-semibold">
            Recharge
          </button>
        </div>
        <button
          disabled
          className="w-full p-4 text-white bg-[#E3E3E3] rounded-lg mt-4 font-bold"
        >
          Place order
        </button>
      </div>
    </>
  );
};
