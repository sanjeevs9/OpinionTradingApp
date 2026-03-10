import { RoutingCompo } from "../utils/routingComp";
import { useState, useEffect } from "react";
import { OptimizedImage } from "./OptimizedImage";
import { PriceTable } from "./pricingTable";
import userProfile from "../assets/userprofile.avif";
import { ProgressBar } from "./progressBar";
import { ReadMoreText } from "../utils/readMore";
import { BuySellCard } from "./buySellCard";
import { getOrderbook } from "../services/api";
import { subscribeToOrderbook, unsubscribeFromOrderbook } from "../services/websocket";
import { orderbookSideToPriceLevels } from "../utils/price";
import type { Orderbook } from "../types";
import { symbolIconMap } from "../db/data";

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

const description =
  "Bitcoin is a decentralized digital currency that can be transferred on the peer-to-peer bitcoin network. Bitcoin transactions are verified by network nodes through cryptography and recorded in a public distributed ledger called a blockchain. Open price at expiry time as displayed on the source of truth will be considered";

interface EventsCompoProps {
  stockSymbol: string;
}

export const EventsCompo = ({ stockSymbol }: EventsCompoProps) => {
  const [navigatioName, setNavigationName] = useState<string>("");
  const [activeTab, setActiveTab] = useState(1);
  const [orderbook, setOrderbook] = useState<Orderbook | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!stockSymbol) return;

    const fetchOrderbook = async () => {
      try {
        const data = await getOrderbook(stockSymbol);
        const book = data[stockSymbol] || data;
        setOrderbook(book as Orderbook);
      } catch (err) {
        console.error("Failed to fetch orderbook:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderbook();

    subscribeToOrderbook(stockSymbol, (data: any) => {
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
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="xl:flex gap-8">
        <div className="xl:w-2/3 w-full space-y-8">
          <RoutingCompo />

          <div className="flex items-center gap-5">
            <OptimizedImage
              className="rounded-2xl object-cover"
              width={80}
              height={80}
              src={(symbolIconMap as Record<string, any>)[stockSymbol]?.url || `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(stockSymbol)}&size=100&backgroundColor=f1f5f9`}
              alt={(symbolIconMap as Record<string, any>)[stockSymbol]?.mainTitle || stockSymbol}
              lazy={false}
            />
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {(symbolIconMap as Record<string, any>)[stockSymbol]?.mainTitle || stockSymbol}
              </span>
              <h1 className="font-display font-bold text-2xl text-slate-900 leading-snug mt-1">
                {(symbolIconMap as Record<string, any>)[stockSymbol]?.title || stockSymbol}
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <div className="border-b border-slate-200">
            <ul className="flex gap-8">
              {navigationBar.map((item) => (
                <li
                  onClick={() => handleNavigationClick(item.value, item.value)}
                  key={item.id}
                  className={`pb-3 text-sm cursor-pointer transition-colors ${
                    navigatioName === item.value
                      ? "border-b-2 border-slate-900 font-semibold text-slate-900"
                      : "text-slate-400 hover:text-slate-600 font-medium"
                  }`}
                >
                  {item.title}
                </li>
              ))}
            </ul>
          </div>

          {/* Order book */}
          <div
            id="orderbook"
            className={`${
              activeTab === 2 ? "h-72" : ""
            } border border-slate-200/60 rounded-2xl overflow-hidden bg-white shadow-card`}
          >
            <div className="text-sm cursor-pointer border-b border-slate-100 bg-white z-10 sticky top-0 flex gap-8 px-6">
              {orderBookTab.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`py-4 text-sm cursor-pointer relative transition-colors ${
                    activeTab === item.id
                      ? "font-semibold text-slate-900"
                      : "font-medium text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {item.title}
                  {activeTab === item.id && (
                    <span className="absolute left-0 bottom-0 w-full h-0.5 bg-slate-900 rounded-full" />
                  )}
                </button>
              ))}
            </div>
            <div className="p-6">
              {activeTab === 1 ? (
                loading ? (
                  <div className="flex justify-center items-center py-10">
                    <div className="w-7 h-7 border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="flex gap-5">
                    <div className="w-1/2">
                      <PriceTable data={dataYes} qty={"YES"} />
                    </div>
                    <div className="w-1/2">
                      <PriceTable data={dataNo} qty={"NO"} />
                    </div>
                  </div>
                )
              ) : (
                <div className="overflow-y-auto max-h-60">
                  {progressData.map((val) => (
                    <ProgressBar
                      key={val.id}
                      value1={val.yesValue}
                      value2={val.noValue}
                      userNames={["Prober", "Prober"]}
                      userIcon={userProfile}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div id="stats" className="border border-slate-200/60 p-6 bg-white rounded-2xl shadow-card">
            <h3 className="font-display text-lg font-bold text-slate-900 mb-4">Stats</h3>
            <div className="border border-slate-100 rounded-xl p-5">
              <h4 className="font-semibold text-sm text-slate-800 mb-2">Overview</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Bitcoin is a decentralized digital currency that can be
                transferred on the peer-to-peer bitcoin network. Bitcoin
                transactions are verified by network nodes through cryptography
                and recorded in a public distributed ledger called a blockchain.
                <br />
                Open price at expiry time as displayed on the source of truth
                will be considered
              </p>
            </div>
          </div>

          {/* About */}
          <div id="overview" className="border border-slate-200/60 p-6 bg-white rounded-2xl shadow-card">
            <h1 className="font-display text-lg font-bold text-slate-900 mb-6">About the event</h1>
            <div className="xl:flex gap-6 space-y-4 xl:space-y-0">
              <div className="flex-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Source of Truth</span>
                <a
                  href="https://in.tradingview.com/chart/?symbol=BINANCE%3ABTCUSDT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yes hover:underline text-sm block mt-1 break-all"
                >
                  in.tradingview.com
                </a>
              </div>
              <div className="flex-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Trading started on</span>
                <span className="text-sm text-slate-800 block mt-1">26 Oct, 2024</span>
              </div>
              <div className="flex-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Event expires on</span>
                <span className="text-sm text-slate-800 block mt-1">26 Oct, 2024</span>
              </div>
            </div>
            <div className="mt-6">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Event Overview & Statistics
              </span>
              <div className="mt-2">
                {ReadMoreText(description)}
              </div>
            </div>
          </div>
        </div>
        <BuySellCard stockSymbol={stockSymbol} orderbook={orderbook} />
      </div>
    </div>
  );
};
