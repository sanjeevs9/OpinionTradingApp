import { useEffect, useState } from "react";
import headerImage from "../assets/lendingheader.avif";
import { useNavigate } from "react-router-dom";
import { OptimizedImage } from "./OptimizedImage";
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
    <div>
      {/* Demo banner */}
      <div className="bg-slate-900 text-white text-center py-3 px-6 text-sm flex items-center justify-center gap-3">
        <span className="bg-white text-slate-900 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
          Demo
        </span>
        <span className="text-slate-300">
          Free demo account with <strong className="text-white">₹5,000</strong> funds to explore trading — no signup needed.
        </span>
        <button
          onClick={() => navigate("/events")}
          className="ml-2 bg-white text-slate-900 text-xs font-semibold px-4 py-1.5 rounded-full cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap"
        >
          Try now
        </button>
      </div>

      {/* Hero */}
      <section className="bg-bg w-full min-h-[600px] flex justify-between overflow-hidden">
        <div className="flex flex-col pl-20 p-10 justify-center max-w-2xl">
          <h1 className="font-display text-7xl font-bold text-slate-900 leading-[1.05] tracking-tight">
            Invest in your
          </h1>
          <h2 className="font-display text-5xl font-medium text-slate-600 mt-1 tracking-tight">
            point of view
          </h2>
          <p className="text-lg text-slate-500 mt-6 leading-relaxed">
            Sports, Entertainment, Economy or Finance.
          </p>
          <div className="mt-8 flex gap-3">
            <button
              onClick={() => navigate("/events")}
              disabled={!validAge}
              className={`rounded-lg px-8 py-3 font-semibold text-sm transition-all ${
                validAge
                  ? "text-white bg-slate-900 cursor-pointer hover:bg-slate-800 active:scale-[0.98]"
                  : "text-white bg-slate-300 cursor-not-allowed"
              }`}
            >
              Start Trading
            </button>
            <button
              onClick={() => navigate("/events")}
              disabled={!validAge}
              className={`rounded-lg px-8 py-3 font-semibold text-sm border transition-all ${
                validAge
                  ? "text-slate-800 bg-white border-slate-200 cursor-pointer hover:bg-slate-50 active:scale-[0.98]"
                  : "text-white bg-slate-300 border-slate-300 cursor-not-allowed"
              }`}
            >
              View Events
            </button>
          </div>
          <label className="flex items-center gap-2 mt-4 cursor-pointer">
            <input
              checked={validAge}
              onChange={() => setValidAge(!validAge)}
              className="w-4 h-4 accent-slate-900 rounded"
              type="checkbox"
              name="age"
            />
            <span className="text-xs text-slate-400">
              For 18 years and above only
            </span>
          </label>
        </div>
        <div className="pr-20 flex items-center">
          <img src={headerImage} alt="header" loading="eager" decoding="async" className="max-h-[520px] object-contain" />
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-slate-900 py-16 px-10 lg:px-36 w-full min-h-[580px] flex justify-between gap-10">
        <div className="w-[55%] py-32">
          <div className="flex gap-5 flex-wrap">
            {(["samachar", "vichaar", "vyapaar"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSectionTab(tab)}
                className={`font-display text-4xl lg:text-5xl cursor-pointer transition-all duration-300 ${
                  sectionTab === tab
                    ? "text-white font-bold"
                    : "text-slate-600 font-normal hover:text-slate-400"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div className="mt-10 flex flex-col gap-4">
            <h3 className="text-white font-display text-3xl font-bold">
              {data[sectionTab].heading}
            </h3>
            <p className="text-slate-400 text-2xl lg:text-3xl font-light leading-snug">
              {data[sectionTab].text}
            </p>
          </div>
        </div>
        <div className="border-[10px] border-slate-700 rounded-[32px] w-72 h-fit flex-shrink-0 overflow-hidden shadow-elevated">
          <video
            className="rounded-[24px] h-fit"
            autoPlay
            playsInline
            muted
            loop
            preload="metadata"
          >
            <source src={video} type="video/mp4" />
          </video>
        </div>
      </section>

      {/* Quotes Section */}
      <section className="bg-bg w-full min-h-[580px] px-10 lg:px-24 py-20">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <OptimizedImage
            width={50}
            height={50}
            className="object-contain opacity-60"
            src={startqoutes}
            alt="quote"
          />
          <span className="font-display text-4xl lg:text-6xl font-bold text-slate-800 text-center leading-tight">
            News that creates trading opportunity, everyday
          </span>
          <OptimizedImage
            width={50}
            height={50}
            className="object-contain opacity-60 rotate-180"
            src={endqoutes}
            alt="quote"
          />
        </div>

        <div onClick={() => navigate('/events')} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 cursor-pointer">
          {[
            { img: nazar, title: "Nazar", desc: "Keep an eye on the happenings around you. Be it Politics, Sports, Entertainment and more." },
            { img: khabar, title: "Khabar", desc: "Understand the news without the noise. Get to the crux of every matter and develop an opinion." },
            { img: jigar, title: "Jigar", desc: "Have the courage to stand by your opinions about upcoming world events by investing in them." },
            { img: sabar, title: "Sabar", desc: "Have the patience to negotiate market ups and downs, and take a decision as events unfold." },
          ].map((item) => (
            <div key={item.title} className="relative flex flex-col items-center group">
              <div className="rounded-2xl overflow-hidden">
                <OptimizedImage src={item.img} alt={item.title} />
              </div>
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] bg-white p-4 text-center shadow-elevated rounded-xl border border-slate-100 group-hover:shadow-card-hover transition-shadow">
                <h4 className="font-display text-lg font-bold text-slate-900 mb-1.5">{item.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900 py-20 px-10 lg:px-36 w-full flex justify-center min-h-[400px] items-center">
        <h1 className="font-display text-white text-5xl lg:text-7xl w-3/4 text-center font-bold leading-tight tracking-tight">
          What will be the return on your opinions?
        </h1>
      </section>
    </div>
  );
};
