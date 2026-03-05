import { RoutingCompo } from "../utils/routingComp";
function symbolAvatar(seed: string) {
  return `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(seed)}&size=100&backgroundColor=f1f5f9`;
}
import { useState, useEffect } from "react";
import { PriceTable } from "./pricingTable";
import userProfile from "../assets/userprofile.avif";
import { ProgressBar } from "./progressBar";
import { ReadMoreText } from "../utils/readMore";
import { BuySellCard } from "./buySellCard";
import { getOrderbook } from "../services/api";
import { subscribeToOrderbook, unsubscribeFromOrderbook } from "../services/websocket";
import { orderbookSideToPriceLevels } from "../utils/price";
import type { Orderbook } from "../types";

const navigationBar = [
  { id: 1, title: "Order book", value: "orderbook" },
  { id: 3, title: "Overview", value: "overview" },
];

const orderBookTab = [
  { id: 1, title: "Order Book" },
  { id: 2, title: "Activity" },
];

const progressData = [
  { id: 1, userIcon: userProfile, userName: ["Prober", "Prober"], yesValue: 6.5, noValue: 3.5 },
  { id: 2, userIcon: userProfile, userName: ["Prober", "Prober"], yesValue: 4, noValue: 6 },
  { id: 3, userIcon: userProfile, userName: ["Prober", "Prober"], yesValue: 5, noValue: 5 },
  { id: 4, userIcon: userProfile, userName: ["Prober", "Prober"], yesValue: 2, noValue: 8 },
  { id: 5, userIcon: userProfile, userName: ["Prober", "Prober"], yesValue: 4, noValue: 6 },
];

interface navigationType {
  orderbook?: string;
  timeline?: string;
  overview?: string;
}

const description =
  "Bitcoin is a decentralized digital currency that can be transferred on the peer-to-peer bitcoin network. Bitcoin transactions are verified by network nodes through cryptography and recorded in a public distributed ledger called a blockchain. Open price at expiry time as displayed on the source of truth will be considered";

interface EventsCompoProps {
  stockSymbol: string;
}

export const EventsCompo = ({ stockSymbol }: EventsCompoProps) => {
  const [navigatioName, setNavigationName] = useState<navigationType | "" | string>("");
  const [activeTab, setActiveTab] = useState(1);
  const [orderbook, setOrderbook] = useState<Orderbook | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!stockSymbol) return;

    const fetchOrderbook = async () => {
      try {
        const data = await getOrderbook(stockSymbol);
        // Response may be { symbol: { yes, no } } or { yes, no } directly
        const book = data[stockSymbol] || data;
        setOrderbook(book as Orderbook);
      } catch (err) {
        console.error("Failed to fetch orderbook:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderbook();

    // Subscribe to WebSocket for live updates
    subscribeToOrderbook(stockSymbol, (data: any) => {
      // The WS may send the orderbook directly or nested
      const book = data[stockSymbol] || data;
      if (book && (book.yes || book.no)) {
        setOrderbook(book as Orderbook);
      }
    });

    return () => {
      unsubscribeFromOrderbook(stockSymbol);
    };
  }, [stockSymbol]);

  const handleNavigationClick = (id: string, value: string) => {
    setNavigationName(value);
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const dataYes = orderbookSideToPriceLevels(orderbook?.yes);
  const dataNo = orderbookSideToPriceLevels(orderbook?.no);

  return (
    <>
      <div className="xl:flex px-24 block pt-10">
        <div className="pr-24 xl:w-2/3 w-full space-y-10">
          <RoutingCompo />

          <div className="pt-10 flex gap-5">
            <img
              className="rounded-[50%] object-contain"
              width={100}
              height={100}
              src={symbolAvatar(stockSymbol)}
              alt={stockSymbol}
            />
            <h1 className="font-bold text-4xl object-contain">
              {stockSymbol}
            </h1>
          </div>
          {/* navigation bar */}
          <div id="navigation-bar" className="mt-5 w-fit">
            <ul className="flex gap-10 font-light text-lg text-[#545454] cursor-pointer">
              {navigationBar.map((item) => (
                <li
                  onClick={() => handleNavigationClick(item.value, item.value)}
                  key={item.id}
                  value={item.value}
                  className={`${
                    navigatioName === item.value
                      ? "border-b-2 border-black pb-3"
                      : ""
                  }`}
                >
                  {item.title}
                </li>
              ))}
            </ul>
          </div>
          {/* order book */}
          <div
            id="orderbook"
            className={`${
              activeTab === 2 && "h-72"
            }  border px-8 rounded-xl overflow-scroll bg-white`}
          >
            <div className="text-sm cursor-pointer border-b-[#E3E3E3] bg-white z-10 border-b-2 sticky top-0 flex gap-10 px-2">
              {orderBookTab.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`pb-3 text-[16px] text-[#545454] pt-5 cursor-pointer relative transition-all duration-300 ease-in-out ${
                    activeTab === item.id
                      ? "font-bold text-black"
                      : "font-normal text-[#575757]"
                  }`}
                >
                  {item.title}
                  {activeTab === item.id && (
                    <span
                      className="absolute left-0 bottom-0 w-full h-[2px] bg-black
              transition-transform duration-1000 ease-in-out transform translate-y-[2px]"
                    />
                  )}
                </button>
              ))}
            </div>
            {activeTab === 1 ? (
              loading ? (
                <div className="flex justify-center items-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                </div>
              ) : (
                <div className="pt-5 flex gap-5">
                  <div className="w-1/2">
                    <PriceTable data={dataYes} qty={"YES"} />
                  </div>
                  <div className="w-1/2">
                    <PriceTable data={dataNo} qty={"NO"} />
                  </div>
                </div>
              )
            ) : (
              progressData.map((val) => (
                <ProgressBar
                  key={val.id}
                  value1={val.yesValue}
                  value2={val.noValue}
                  userNames={["Prober", "Prober"]}
                  userIcon={userProfile}
                />
              ))
            )}
          </div>
          {/* Stats */}
          <div id="stats" className=" border p-8 bg-white rounded-xl">
            <h3 className="text-2xl font-semibold mb-5">Stats</h3>
            <div className="border rounded-lg p-5">
              <h1 className="font-semibold pt-2 text-md pb-3">Overview</h1>
              <p className="text-sm font-light w-[85%]">
                Bitcoin is a decentralized digital currency that can be
                transferred on the peer-to-peer bitcoin network. Bitcoin
                transactions are verified by network nodes through cryptography
                and recorded in a public distributed ledger called a blockchain.{" "}
                <br />
                Open price at expiry time as displayed on the source of truth
                will be considered
              </p>
            </div>
          </div>
          {/* About */}
          <div id="overview" className=" border p-8 bg-white rounded-xl">
            <h1 className="text-2xl font-bold">About the event</h1>
            <div className="xl:flex block space-y-5 mt-8 items-start justify-between w-full text-sm font-medium text-gray-800">
              <div className="flex w-1/3 flex-col">
                <span className="text-xs font-semibold text-black">
                  Source of Truth
                </span>
                <a
                  href="https://in.tradingview.com/chart/?symbol=BINANCE%3ABTCUSDT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline w-20"
                >
                  in.tradingview.com/chart/?symbol=BINANCE%3ABTCUSDT
                </a>
              </div>
              <div className="flex w-1/3 flex-col">
                <span className="text-xs text-black font-semibold">
                  Trading started on
                </span>
                <span>26 Oct, 2024</span>
              </div>
              <div className="flex w-1/3 flex-col">
                <span className="text-xs text-black font-semibold">
                  Event expires on
                </span>
                <span>26 Oct, 2024</span>
              </div>
            </div>
            <div className="mt-5">
              <span className="text-xs font-semibold text-black">
                Event Overview & Statistics
              </span>
              {ReadMoreText(description)}
            </div>
          </div>
        </div>
        <BuySellCard stockSymbol={stockSymbol} orderbook={orderbook} />
      </div>
    </>
  );
};
