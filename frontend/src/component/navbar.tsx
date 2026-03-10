import logo from "../assets/probo.avif";
import { GoHome } from "react-icons/go";
import {
  IoWalletOutline,
} from "react-icons/io5";
import { HiOutlineBriefcase } from "react-icons/hi2";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getStockBalance } from "../services/api";
import { symbolIconMap } from "../db/data";
import { OptimizedImage } from "./OptimizedImage";

interface StockHolding {
  symbol: string;
  yes: { quantity: number; locked: number };
  no: { quantity: number; locked: number };
}

export const Navbar = () => {
  const [showTopup, setShowTopup] = useState(false);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [holdings, setHoldings] = useState<StockHolding[]>([]);
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);
  const { balance, userId, addFunds } = useUser();
  const navigate = useNavigate();

  const handleTopup = async (amount: number) => {
    await addFunds(amount);
    setShowTopup(false);
  };

  const fetchPortfolio = async () => {
    setLoadingPortfolio(true);
    try {
      const res = await getStockBalance(userId);
      const data = res.message || res;
      const list: StockHolding[] = Object.entries(data).map(([symbol, val]: [string, any]) => ({
        symbol,
        yes: val.yes || { quantity: 0, locked: 0 },
        no: val.no || { quantity: 0, locked: 0 },
      })).filter((h) => h.yes.quantity > 0 || h.no.quantity > 0 || h.yes.locked > 0 || h.no.locked > 0);
      setHoldings(list);
    } catch {
      setHoldings([]);
    } finally {
      setLoadingPortfolio(false);
    }
  };

  const togglePortfolio = () => {
    if (!showPortfolio) fetchPortfolio();
    setShowPortfolio(!showPortfolio);
    setShowTopup(false);
  };

  return (
    <nav className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img className="h-7" src={logo} alt="Probo" decoding="async" />
        </Link>

        <div className="flex items-center gap-5">
          <Link
            to="/"
            className="hidden md:flex items-center justify-center w-9 h-9 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <GoHome size={20} className="text-slate-600" />
          </Link>
          <Link
            to="/events"
            className="hidden md:flex items-center text-sm font-medium text-slate-600 px-4 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Events
          </Link>

          {/* Portfolio */}
          <div className="relative">
            <button
              onClick={togglePortfolio}
              className="hidden md:flex items-center gap-1.5 text-sm font-medium text-slate-600 px-3 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Portfolio"
            >
              <HiOutlineBriefcase size={18} />
              <span className="hidden lg:inline">Portfolio</span>
            </button>
            {showPortfolio && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowPortfolio(false)} />
                <div className="absolute top-11 right-0 w-80 z-20 bg-white shadow-elevated rounded-xl border border-slate-100 py-3 px-1.5 max-h-96 overflow-y-auto">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider px-3 block mb-2">
                    Your Holdings
                  </span>
                  {loadingPortfolio ? (
                    <div className="flex justify-center py-6">
                      <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin" />
                    </div>
                  ) : holdings.length === 0 ? (
                    <div className="text-center py-6 px-3">
                      <p className="text-sm text-slate-500">No holdings yet</p>
                      <p className="text-xs text-slate-400 mt-1">Start trading to build your portfolio</p>
                    </div>
                  ) : (
                    holdings.map((h) => {
                      const icon = (symbolIconMap as Record<string, any>)[h.symbol];
                      return (
                        <div
                          key={h.symbol}
                          onClick={() => { navigate(`/event-details/${h.symbol}`); setShowPortfolio(false); }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                        >
                          <OptimizedImage
                            className="rounded-lg flex-shrink-0 object-cover"
                            width={32}
                            height={32}
                            src={icon?.url || `https://api.dicebear.com/9.x/shapes/svg?seed=${h.symbol}&size=32`}
                            alt={h.symbol}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">
                              {icon?.mainTitle || h.symbol}
                            </p>
                            <div className="flex gap-3 mt-0.5">
                              {h.yes.quantity > 0 && (
                                <span className="text-[11px] font-medium text-yes">
                                  YES: {h.yes.quantity}
                                </span>
                              )}
                              {h.no.quantity > 0 && (
                                <span className="text-[11px] font-medium text-no">
                                  NO: {h.no.quantity}
                                </span>
                              )}
                              {h.yes.locked > 0 && (
                                <span className="text-[11px] text-slate-400">
                                  Y locked: {h.yes.locked}
                                </span>
                              )}
                              {h.no.locked > 0 && (
                                <span className="text-[11px] text-slate-400">
                                  N locked: {h.no.locked}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => { setShowTopup(!showTopup); setShowPortfolio(false); }}
              className="flex items-center gap-2 h-9 px-4 rounded-lg border border-slate-200 hover:border-slate-300 bg-white transition-colors cursor-pointer"
            >
              <IoWalletOutline className="text-slate-500" size={16} />
              <span className="font-semibold text-sm text-slate-800">
                ₹{balance.toFixed(1)}
              </span>
            </button>
            {showTopup && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowTopup(false)}
                />
                <div className="absolute top-11 right-0 w-48 z-20 bg-white shadow-elevated rounded-xl border border-slate-100 py-2 px-1.5">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider px-2.5 block mb-1">
                    Add funds
                  </span>
                  {[500, 1000, 5000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => handleTopup(amt)}
                      className="w-full text-sm font-medium text-slate-700 rounded-lg px-2.5 py-2 cursor-pointer text-left hover:bg-slate-50 active:bg-slate-100 transition-colors"
                    >
                      + ₹{amt.toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2.5 pl-4 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-slate-100 text-slate-600">
              {userId.slice(0, 2).toUpperCase()}
            </div>
            <span className="text-xs text-slate-400 font-mono hidden md:block max-w-[72px] truncate" title={userId}>
              {userId.slice(0, 8)}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};
