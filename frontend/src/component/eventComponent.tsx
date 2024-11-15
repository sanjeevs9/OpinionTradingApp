import { RoutingCompo } from "../utils/routingComp";
import bitcoing from "../assets/bitcoin.avif";
import { useState } from "react";
import { PriceTable } from "./pricingTable";
import userProfile from "../assets/userprofile.avif";
import { ProgressBar } from "./progressBar";
import { CustomChart } from "./timelineChart";
import { ReadMoreText } from "../utils/readMore";
import { BuySellCard } from "./buySellCard";


const navigationBar = [
  {
    id: 1,
    title: "Order book",
    value: "orderbook",
  },
  {
    id: 2,
    title: "Timeline",
    value: "timeline",
  },
  {
    id: 3,
    title: "Overview",
    value: "overview",
  },
];

const orderBookTab = [
  {
    id: 1,
    title: "Order Book",
  },
  {
    id: 2,
    title: "Activity",
  },
];

const progressData = [
  {
    id: 1,
    userIcon: userProfile,
    userName: ["Prober", "Prober"],
    yesValue: 6.5,
    noValue: 3.5,
  },
  {
    id: 2,
    userIcon: userProfile,
    userName: ["Prober", "Prober"],
    yesValue: 4,
    noValue: 6,
  },
  {
    id: 3,
    userIcon: userProfile,
    userName: ["Prober", "Prober"],
    yesValue: 5,
    noValue: 5,
  },
  {
    id: 4,
    userIcon: userProfile,
    userName: ["Prober", "Prober"],
    yesValue: 2,
    noValue: 8,
  },
  {
    id: 5,
    userIcon: userProfile,
    userName: ["Prober", "Prober"],
    yesValue: 4,
    noValue: 6,
  },
];

const dataYes = [
  { price: 7, qty: 465510, width: "w-1/12" },
  { price: 7.5, qty: 290450, width: "w-5/12" },
  { price: 8, qty: 105919, width: "w-8/12" },
  { price: 8.5, qty: 94744, width: "w-0" },
  { price: 9, qty: 120071, width: "w-0" },
];

const dataNo = [
  { price: 3.5, qty: 358537, width: "w-1/12" },
  { price: 4, qty: 242664, width: "w-5/12" },
  { price: 4.5, qty: 72327, width: "w-8/12" },
  { price: 5, qty: 50544, width: "w-0" },
  { price: 5.5, qty: 56733, width: "w-0" },
];

interface navigationType {
  orderbook?: string;
  timeline?: string;
  overview?: string;
}

const description =
  "Bitcoin is a decentralized digital currency that can be transferred on the peer-to-peer bitcoin network. Bitcoin transactions are verified by network nodes through cryptography and recorded in a public distributed ledger called a blockchain. Open price at expiry time as displayed on the source of truth will be considered";

export const EventsCompo = () => {
  const [navigatioName, setNavigationName] = useState<
    navigationType | "" | string
  >("");
  const [activeTab, setActiveTab] = useState(1);


  const handleNavigationClick = (id: string, value: string) => {
    setNavigationName(value);

    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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
              src={bitcoing}
              alt="bitcoin"
            />
            <h1 className="font-bold text-4xl object-contain">
              Bitcoin to be priced at 67364.34 USDT or more at 03:55 AM?
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
              <div className="pt-5 flex gap-5">
                <div className="w-1/2">
                  <PriceTable data={dataYes} qty={"YES"} />
                </div>
                <div className="w-1/2">
                  <PriceTable data={dataNo} qty={"NO"} />
                </div>
              </div>
            ) : (
              progressData.map((val) => (
                <ProgressBar
                  value1={val.yesValue}
                  value2={val.noValue}
                  userNames={["Prober", "Prober"]}
                  userIcon={userProfile}
                />
              ))
            )}
          </div>
          
          
        </div>
       <BuySellCard/>       
      </div>
    </>
  );
};
