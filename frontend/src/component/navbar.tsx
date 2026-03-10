import logo from "../assets/probo.avif";
import profile from "../assets/profile.avif";
import { GoHome } from "react-icons/go";
import {
  IoWalletOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";

export const Navbar = () => {
  const [showTopup, setShowTopup] = useState(false);
  const { balance, userId, addFunds } = useUser();

  const handleTopup = async (amount: number) => {
    await addFunds(amount);
    setShowTopup(false);
  };

  return (
    <nav className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img className="h-7" src={logo} alt="Probo" decoding="async" />
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/" className="hidden md:flex items-center justify-center w-9 h-9 rounded-lg hover:bg-slate-100 transition-colors">
            <GoHome size={20} className="text-slate-600" />
          </Link>
          <a href="/admin" className="hidden md:flex items-center justify-center w-9 h-9 rounded-lg hover:bg-slate-100 transition-colors" title="Admin">
            <IoSettingsOutline size={20} className="text-slate-600" />
          </a>

          <div className="relative">
            <button
              onClick={() => setShowTopup(!showTopup)}
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

          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <img
              className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100"
              src={profile}
              alt="profile"
              decoding="async"
            />
            <span className="text-xs text-slate-400 font-mono hidden md:block max-w-[72px] truncate" title={userId}>
              {userId.slice(0, 8)}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};
