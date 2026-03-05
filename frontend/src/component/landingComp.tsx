import { useEffect, useState } from "react";
import headerImage from "../assets/lendingheader.avif";
import { useNavigate } from "react-router-dom";
import video from "../assets/video/info-video.mp4";
import startqoutes from "../assets/Startquotes.avif";
import endqoutes from "../assets/Endquotes.avif";
import nazar from "../assets/nazar.avif";
import khabar from "../assets/khabar.avif";
import jigar from "../assets/jigar.avif";
import sabar from "../assets/sabar.avif";

const data = {
  samachar: {
    heading: "Be in the know",
    text: "From Sports to Entertainment, Economy, Finance and more. Keep an eye on events in your field of interest.",
  },
  vichaar: {
    heading: "Use what you know",
    text: "Build your knowledge and form your opinions and views about upcoming events in the world.",
  },
  vyapaar: {
    heading: "Trade and grow",
    text: "Invest in your opinions about future events and use your knowledge to trade & benefit.",
  },
};

export const LandingComp = () => {
  const [validAge, setValidAge] = useState(true);
  const [sectionTab, setSectionTab] = useState<
    "samachar" | "vichaar" | "vyapaar"
  >("samachar");
  const navigate = useNavigate();

  useEffect(() => {
    const tabs: ("samachar" | "vichaar" | "vyapaar")[] = [
      "samachar",
      "vichaar",
      "vyapaar",
    ];
    let currentIndex = 0;

    const timeId = setInterval(() => {
      currentIndex = (currentIndex + 1) % tabs.length;
      setSectionTab(tabs[currentIndex]);
    }, 5000);

    return () => clearInterval(timeId);
  }, []);
  return (
    <>
      <div className="">
        {/* Demo banner */}
        <div className="bg-black text-white text-center py-3 px-6 text-sm flex items-center justify-center gap-3">
          <span className="bg-white text-black text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
            Demo
          </span>
          <span>
            You get a free demo account with <strong>₹5,000</strong> funds to explore trading — no signup needed.
          </span>
          <button
            onClick={() => navigate("/events")}
            className="ml-2 bg-white text-black text-xs font-semibold px-4 py-1.5 rounded-full cursor-pointer hover:bg-gray-200 transition-colors whitespace-nowrap"
          >
            Try now
          </button>
        </div>

        <section
          id="header"
          className="bg-[#F5F5F5] w-full min-h-[650px] flex justify-between"
        >
          <div className="flex flex-col pl-20 p-10 justify-center" id="left">
            <h1 className="text-[80px] font-normal work-sans">
              Invest in your
            </h1>
            <h2 className="text-[56px] work-sans font-normal -mt-2">
              point of view
            </h2>
            <h5 className="text-[22px] font-normal work-sans text-[#545454] mt-5">
              Sports, Entertainment, Economy or Finance.
            </h5>
            <div className="mt-10 flex gap-5">
              <button
                onClick={() => navigate("/events")}
                disabled={!validAge}
                className={`border rounded px-10 py-2 font-semibold ${
                  validAge
                    ? "text-white bg-black cursor-pointer hover:bg-gray-800"
                    : "text-white bg-[#ABABAB] cursor-not-allowed"
                }`}
              >
                Start Trading
              </button>
              <button
                onClick={() => navigate("/events")}
                disabled={!validAge}
                className={`border rounded px-10 py-2 font-semibold ${
                  validAge
                    ? "text-black bg-white cursor-pointer hover:bg-gray-100"
                    : "text-white bg-[#ABABAB] cursor-not-allowed"
                }`}
              >
                View Events
              </button>
            </div>
            <span className="flex items-center ">
              <input
                checked={validAge}
                onChange={() => setValidAge(!validAge)}
                className="w-4 h-4 accent-black mt-4"
                type="checkbox"
                name="age"
              />
              <span className="text-xs font-medium mt-4 ml-2 text-[#757575]">
                For 18 years and above only
              </span>
            </span>
          </div>
          <div id="right" className="pr-20">
            <img src={headerImage} alt="header" />
          </div>
        </section>
        <section
          id="info-section"
          className="bg-[#262626] py-14 px-36 w-full min-h-[630px] flex justify-between"
        >
          <div className=" w-[55%] py-44">
            <div
              onClick={(e: any) => {
                if (e.target.nodeName === "BUTTON") {
                  let value = e.target.getAttribute("value");
                  setSectionTab(value);
                  console.log("value", value);
                }
              }}
              className="flex gap-5"
            >
              <button
                value="samachaar"
                className={`${
                  sectionTab === "samachar"
                    ? "text-[#FFFFFF] font-semibold"
                    : "text-[#757575] font-normal"
                }  text-5xl work-sans cursor-pointer`}
              >
                Samachar
              </button>
              <button
                value="vichaar"
                className={`${
                  sectionTab === "vichaar"
                    ? "text-[#FFFFFF] font-semibold"
                    : "text-[#757575] font-normal"
                }  text-5xl work-sans cursor-pointer`}
              >
                Vichaar
              </button>
              <button
                value="vyapaar"
                className={`${
                  sectionTab === "vyapaar"
                    ? "text-[#FFFFFF] font-semibold"
                    : "text-[#757575] font-normal"
                }  text-5xl work-sans cursor-pointer`}
              >
                Vyapaar
              </button>
            </div>
            <div className="mt-10 flex flex-col gap-y-5">
              <h1 className="text-white work-sans text-4xl font-semibold">
                {data[sectionTab].heading}
              </h1>
              <p className="text-white work-sans text-4xl font-normal">
                {data[sectionTab].text}
              </p>
            </div>
          </div>
          <div className="border-[12px] mr-14 border-[#3f3f3f] rounded-[38px] w-80 h-fit">
            <video
              className="rounded-[30px] h-fit"
              id="info-video"
              autoPlay
              playsInline
              muted
              loop
              preload="auto"
            >
              <source src={video} type="video/mp4" />
            </video>
          </div>
        </section>
        <section className="bg-[#F5F5F5] w-full min-h-[630px] px-24 py-20 pb-20">
          <div className="text-[#262626] ml-48 items-center work-sans text-[64px] font-semibold flex">
            <img
              width={70}
              height={70}
              className="object-contain h-fit mr-4"
              src={startqoutes}
              alt="qoute"
            />
            <span className="w-full h-fit">News that creates trading </span>
          </div>
          <div className="text-[#262626]  ml-[40%] items-center work-sans w-fit gap-4 text-[64px] font-semibold flex">
            <span className="w-full h-fit">opportunity, everyday</span>
            <img
              width={70}
              height={70}
              className="object-contain h-fit rotate-180"
              src={endqoutes}
              alt="qoute"
            />
          </div>
          <div onClick={()=>navigate('/events')} className="flex gap-10 mt-20">
            <div className="w-1/4 relative flex flex-col items-center">
              <div className="relative">
                <img src={nazar} alt="nazar" />
                <div className="absolute inset-0 bg-purple-200 rounded-full -z-10"></div>
              </div>
              <div className="absolute bottom-12 transform translate-y-1/2 bg-white p-4 w-11/12 text-center shadow-lg">
                <h1 className="text-black text-xl font-semibold mb-2">Nazar</h1>
                <p className="text-gray-700">
                  Keep an eye on the happenings around you. Be it Politics,
                  Sports, Entertainment and more.
                </p>
              </div>
            </div>

            <div className="w-1/4 relative flex flex-col items-center">
              <div className="relative">
                <img src={khabar} alt="khabar" />
                <div className="absolute inset-0 bg-purple-200 rounded-full -z-10"></div>
              </div>
              <div className="absolute bottom-12 transform translate-y-1/2 bg-white p-4 w-11/12 text-center shadow-lg">
                <h1 className="text-black text-xl font-semibold mb-2">
                  Khabar
                </h1>
                <p className="text-gray-700">
                  Understand the news without the noise. Get to the crux of
                  every matter and develop an opinion.
                </p>
              </div>
            </div>
            <div className="w-1/4 relative flex flex-col items-center">
              <div className="relative">
                <img src={jigar} alt="jigar" />
                <div className="absolute inset-0 bg-purple-200 rounded-full -z-10"></div>
              </div>
              <div className="absolute bottom-12 transform translate-y-1/2 bg-white p-4 w-11/12 text-center shadow-lg">
                <h1 className="text-black text-xl font-semibold mb-2">Jigar</h1>
                <p className="text-gray-700">
                  Have the courage to stand by your opinions about upcoming
                  world events by investing in them.
                </p>
              </div>
            </div>
            <div className="w-1/4 relative flex flex-col items-center">
              <div className="relative">
                <img src={sabar} alt="sabar" />
                <div className="absolute inset-0 bg-purple-200 rounded-full -z-10"></div>
              </div>
              <div className="absolute bottom-12 transform translate-y-1/2 bg-white p-4 w-11/12 text-center shadow-lg">
                <h1 className="text-black text-xl font-semibold mb-2">Sabar</h1>
                <p className="text-gray-700">
                  Have the patience to negotiate market ups and downs, and take
                  a decision as events unfold.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section  className="bg-[#262626] py-14 px-36 w-full flex justify-center min-h-[630px]">
               <h1 className="text-white work sans text-8xl w-3/4 text-center">
               What will be the return on your opinions?
               </h1>
        </section>
      </div>
    </>
  );
};
