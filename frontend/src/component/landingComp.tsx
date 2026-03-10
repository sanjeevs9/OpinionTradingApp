import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { symbols } from "../db/data";
import { OptimizedImage } from "./OptimizedImage";
import {
  IoTrendingUp,
  IoFlash,
  IoShieldCheckmark,
  IoArrowForward,
  IoChevronForward,
} from "react-icons/io5";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  YAxis,
} from "recharts";

function seededRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return () => {
    h = (h ^ (h >>> 16)) * 0x45d9f3b;
    h = (h ^ (h >>> 16)) * 0x45d9f3b;
    h = h ^ (h >>> 16);
    return (h >>> 0) / 4294967296;
  };
}

function generateMiniChart(seed: string, base: number) {
  const rng = seededRandom(seed);
  const data = [];
  let value = base;
  for (let i = 0; i < 16; i++) {
    value = Math.max(1, Math.min(9.5, value + (rng() - 0.48) * 1.2));
    data.push({ v: Math.round(value * 10) / 10 });
  }
  return data;
}

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1500;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          animate();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

const categories = [
  { name: "Cricket", emoji: "🏏" },
  { name: "Crypto", emoji: "₿" },
  { name: "Stocks", emoji: "📈" },
  { name: "Football", emoji: "⚽" },
  { name: "Politics", emoji: "🏛" },
  { name: "Entertainment", emoji: "🎬" },
  { name: "Weather", emoji: "🌦" },
  { name: "Esports", emoji: "🎮" },
];

const steps = [
  {
    icon: IoTrendingUp,
    title: "Pick an event",
    desc: "Browse live events across sports, crypto, politics, entertainment and more.",
    color: "text-yes",
    bg: "bg-yes-light",
    border: "border-yes/10",
  },
  {
    icon: IoFlash,
    title: "Make your prediction",
    desc: "Buy YES or NO based on your opinion. Set your price and quantity.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  {
    icon: IoShieldCheckmark,
    title: "Earn returns",
    desc: "If your prediction is right, earn up to 10x. Trade anytime before expiry.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const featuredEvents = symbols.slice(0, 6);

export const LandingComp = () => {
  const [validAge, setValidAge] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="bg-bg">
      {/* Demo Banner */}
      <div className="bg-yes text-white text-center py-2.5 px-6 text-sm flex items-center justify-center gap-3">
        <span className="bg-white/20 backdrop-blur text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
          Demo
        </span>
        <span className="text-blue-100">
          Start with <strong className="text-white">₹5,000</strong> free demo funds
        </span>
        <button
          onClick={() => navigate("/events")}
          className="ml-1 bg-white text-yes text-xs font-bold px-4 py-1.5 rounded-full cursor-pointer hover:bg-blue-50 transition-colors"
        >
          Try now
        </button>
      </div>

      {/* ===== HERO ===== */}
      <section className="bg-white border-b border-slate-200/60 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-full px-4 py-1.5 mb-6"
              >
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-sm text-emerald-700 font-medium">Live events trading</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 }}
                className="font-display text-5xl md:text-6xl font-bold text-slate-900 leading-[1.08] tracking-tight"
              >
                Trade on your
                <br />
                <span className="text-yes">opinions</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.18 }}
                className="text-lg text-slate-500 mt-5 leading-relaxed max-w-lg"
              >
                Predict outcomes of real-world events in sports, crypto, politics
                and entertainment. Your knowledge is your edge.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.28 }}
                className="mt-8 flex flex-wrap gap-3"
              >
                <button
                  onClick={() => navigate("/events")}
                  disabled={!validAge}
                  className={`group font-display rounded-xl px-8 py-3.5 font-semibold text-sm transition-all flex items-center gap-2 ${
                    validAge
                      ? "text-white bg-slate-900 cursor-pointer hover:bg-slate-800 active:scale-[0.98]"
                      : "text-white bg-slate-300 cursor-not-allowed"
                  }`}
                >
                  Start Trading
                  <IoArrowForward className="group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => {
                    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="rounded-xl px-8 py-3.5 font-semibold text-sm text-slate-600 border border-slate-200 cursor-pointer hover:bg-slate-50 hover:border-slate-300 transition-all"
                >
                  How it works
                </button>
              </motion.div>

              <motion.label
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-2.5 mt-5 cursor-pointer"
              >
                <input
                  checked={validAge}
                  onChange={() => setValidAge(!validAge)}
                  className="w-4 h-4 accent-slate-900 rounded"
                  type="checkbox"
                />
                <span className="text-xs text-slate-400">For 18 years and above only</span>
              </motion.label>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.45 }}
                className="flex gap-10 mt-10 pt-8 border-t border-slate-200/60"
              >
                {[
                  { value: 23000, suffix: "+", label: "Active Traders" },
                  { value: 50, suffix: "+", label: "Live Events" },
                  { value: 10, suffix: "x", label: "Max Returns" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="font-display text-2xl md:text-3xl font-bold text-slate-900">
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right - Featured Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Main card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-elevated p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <OptimizedImage
                      className="rounded-xl"
                      width={44}
                      height={44}
                      src={symbols[0].url}
                      alt={symbols[0].mainTitle}
                      lazy={false}
                    />
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {symbols[0].mainTitle}
                      </span>
                      <h3 className="text-sm font-semibold text-slate-800 leading-tight">
                        {symbols[0].title}
                      </h3>
                    </div>
                  </div>

                  <div className="h-20 mb-4 -mx-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={generateMiniChart(symbols[0].mainTitle, parseFloat(symbols[0].yesPrice))}>
                        <defs>
                          <linearGradient id="hero-g" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2563EB" stopOpacity={0.15} />
                            <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <YAxis domain={[0, 10]} hide />
                        <Area type="monotone" dataKey="v" stroke="#2563EB" strokeWidth={2} fill="url(#hero-g)" dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-yes-light text-yes text-sm font-bold py-2.5 rounded-xl hover:bg-yes-mid transition-colors cursor-pointer">
                      Yes ₹{symbols[0].yesPrice}
                    </button>
                    <button className="flex-1 bg-no-light text-no text-sm font-bold py-2.5 rounded-xl hover:bg-no-mid transition-colors cursor-pointer">
                      No ₹{symbols[0].noPrice}
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[11px] text-slate-400">
                      {Number(symbols[0].traders).toLocaleString("en-IN")} traders
                    </span>
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      Live
                    </span>
                  </div>
                </div>

                {/* Floating mini cards */}
                <div className="absolute -right-6 top-6 bg-white rounded-xl border border-slate-200 shadow-card-hover p-3 w-48 animate-float" style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center gap-2.5">
                    <OptimizedImage className="rounded-lg" width={32} height={32} src={symbols[3].url} alt={symbols[3].mainTitle} lazy={false} />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{symbols[3].mainTitle}</p>
                      <div className="flex gap-1.5 mt-1">
                        <span className="text-[10px] font-bold text-yes bg-yes-light px-1.5 py-0.5 rounded">Y ₹{symbols[3].yesPrice}</span>
                        <span className="text-[10px] font-bold text-no bg-no-light px-1.5 py-0.5 rounded">N ₹{symbols[3].noPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -left-6 bottom-12 bg-white rounded-xl border border-slate-200 shadow-card-hover p-3 w-48 animate-float" style={{ animationDelay: '1.5s' }}>
                  <div className="flex items-center gap-2.5">
                    <OptimizedImage className="rounded-lg" width={32} height={32} src={symbols[6].url} alt={symbols[6].mainTitle} lazy={false} />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{symbols[6].mainTitle}</p>
                      <div className="flex gap-1.5 mt-1">
                        <span className="text-[10px] font-bold text-yes bg-yes-light px-1.5 py-0.5 rounded">Y ₹{symbols[6].yesPrice}</span>
                        <span className="text-[10px] font-bold text-no bg-no-light px-1.5 py-0.5 rounded">N ₹{symbols[6].noPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
            <span className="text-sm font-semibold text-slate-400 whitespace-nowrap mr-2">Popular:</span>
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => navigate("/events")}
                className="category-pill flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-full border border-slate-200 text-sm font-medium text-slate-600 cursor-pointer"
              >
                <span>{cat.emoji}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED EVENTS ===== */}
      <section className="py-14 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-900">
                Trending events
              </h2>
              <p className="text-slate-400 mt-1.5">Most traded events right now</p>
            </div>
            <button
              onClick={() => navigate("/events")}
              className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-yes cursor-pointer hover:text-yes-dark transition-colors"
            >
              View all
              <IoChevronForward size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredEvents.map((sym, i) => {
              const chartData = generateMiniChart(sym.mainTitle, parseFloat(sym.yesPrice));
              const yesNum = parseFloat(sym.yesPrice);
              const isYesFavored = yesNum >= 5;

              return (
                <motion.div
                  key={sym.id}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  variants={fadeUp}
                  onClick={() => navigate("/events")}
                  className="bg-white rounded-2xl border border-slate-200/60 p-5 cursor-pointer hover-lift hover:shadow-card-hover group"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <OptimizedImage
                      className="rounded-xl flex-shrink-0 object-cover"
                      width={42}
                      height={42}
                      src={sym.url}
                      alt={sym.mainTitle}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {sym.mainTitle}
                        </span>
                        <span className="text-[10px] text-slate-300">
                          {Number(sym.traders).toLocaleString("en-IN")} traders
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2 mt-0.5 group-hover:text-slate-950 transition-colors">
                        {sym.title}
                      </h3>
                    </div>
                  </div>

                  <div className="h-12 -mx-2 mb-3">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id={`lg-${sym.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={isYesFavored ? "#2563EB" : "#E11D48"} stopOpacity={0.12} />
                            <stop offset="100%" stopColor={isYesFavored ? "#2563EB" : "#E11D48"} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <YAxis domain={[0, 10]} hide />
                        <Area
                          type="monotone"
                          dataKey="v"
                          stroke={isYesFavored ? "#2563EB" : "#E11D48"}
                          strokeWidth={1.5}
                          fill={`url(#lg-${sym.id})`}
                          dot={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex gap-2">
                    <span className="flex-1 text-center text-xs font-bold px-3 py-2 rounded-lg bg-yes-light text-yes">
                      Yes ₹{sym.yesPrice}
                    </span>
                    <span className="flex-1 text-center text-xs font-bold px-3 py-2 rounded-lg bg-no-light text-no">
                      No ₹{sym.noPrice}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="flex justify-center mt-8 md:hidden">
            <button
              onClick={() => navigate("/events")}
              className="flex items-center gap-1.5 text-sm font-semibold text-yes cursor-pointer"
            >
              View all events
              <IoChevronForward size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="bg-white border-y border-slate-200/60 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-2xl md:text-3xl font-bold text-slate-900"
            >
              How it works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="text-slate-400 mt-2"
            >
              Three steps to start trading on your knowledge
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className={`text-center bg-white border ${step.border} rounded-2xl p-6`}
              >
                <div className={`w-12 h-12 ${step.bg} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <step.icon size={22} className={step.color} />
                </div>
                <div className="font-display text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Step {i + 1}
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRADE EXAMPLE ===== */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-xs font-bold text-yes uppercase tracking-widest">Example Trade</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mt-3 leading-tight">
                Your knowledge,
                <br />your returns
              </h2>
              <p className="text-slate-500 mt-4 leading-relaxed">
                Think India will win the next match? Buy YES at ₹2.5.
                If you're right, you get ₹10 per share — a 4x return
                on your investment.
              </p>
              <div className="mt-8 flex gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex-1">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">You invest</p>
                  <p className="font-display text-2xl font-bold text-slate-900 mt-1">₹2.50</p>
                  <p className="text-xs text-slate-400 mt-0.5">per YES share</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex-1">
                  <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">You earn</p>
                  <p className="font-display text-2xl font-bold text-emerald-600 mt-1">₹10.00</p>
                  <p className="text-xs text-emerald-500 mt-0.5">if prediction is correct</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-elevated p-6">
                <div className="flex items-center gap-3 mb-5">
                  <OptimizedImage
                    className="rounded-xl"
                    width={48}
                    height={48}
                    src={symbols[0].url}
                    alt={symbols[0].mainTitle}
                  />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{symbols[0].mainTitle}</span>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">{symbols[0].title}</h3>
                  </div>
                </div>
                <div className="flex gap-2 mb-4">
                  <div className="flex-1 bg-yes text-white text-center py-3 rounded-xl font-bold text-sm">
                    YES ₹{symbols[0].yesPrice}
                  </div>
                  <div className="flex-1 bg-slate-100 text-slate-400 text-center py-3 rounded-xl font-bold text-sm">
                    NO ₹{symbols[0].noPrice}
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 flex justify-around">
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-800">₹2.50</p>
                    <p className="text-[11px] text-slate-400">You put</p>
                  </div>
                  <div className="w-px bg-slate-200" />
                  <div className="text-center">
                    <p className="text-sm font-bold text-emerald-600">₹10.00</p>
                    <p className="text-[11px] text-slate-400">You get</p>
                  </div>
                </div>
                <button className="w-full mt-4 bg-yes text-white font-bold text-sm py-3.5 rounded-xl cursor-pointer hover:bg-yes-dark transition-colors">
                  Place order
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="bg-white border-t border-slate-200/60 py-20 md:py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-5xl font-bold text-slate-900 leading-tight tracking-tight"
          >
            Ready to trade on
            <br />
            what you know?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="text-slate-400 text-lg mt-4"
          >
            Start with ₹5,000 demo funds. No signup required.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.16 }}
            className="mt-8"
          >
            <button
              onClick={() => navigate("/events")}
              className="group font-display bg-slate-900 text-white font-semibold text-sm px-10 py-4 rounded-xl cursor-pointer hover:bg-slate-800 transition-all active:scale-[0.98] inline-flex items-center gap-2"
            >
              Start Trading Now
              <IoArrowForward className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
