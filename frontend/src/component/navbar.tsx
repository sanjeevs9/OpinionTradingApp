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
    <>
      <div className="p-6 sticky top-0 z-10 bg-[#F5F5F5] pb-0">
        <div className="border-b border-b-[#E3E3E3] flex justify-between">
          <Link to="/" className="cursor-pointer">
            <img className="cursor-pointer" width={100} height={10} src={logo} alt="logo" />
          </Link>
          <div className="w-fit gap-10 flex px-4 -mt-4 items-center">
            <Link to="/" className="cursor-pointer hidden md:block">
              <GoHome size={25} />
            </Link>
            <a
              href="/admin"
              className="cursor-pointer hidden md:block"
              title="Admin"
            >
              <IoSettingsOutline size={25} />
            </a>
            <div className="relative">
              <button
                onClick={() => setShowTopup(!showTopup)}
                className="border-[1px] p-3 h-10 w-28 rounded flex items-center justify-around cursor-pointer"
              >
                <span>
                  <IoWalletOutline />
                </span>
                <span className="font-bold text-sm -mt-[1px]">
                  ₹{balance.toFixed(1)}
                </span>
              </button>
              {showTopup && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowTopup(false)}
                  />
                  <div className="absolute top-12 right-0 w-44 z-20 bg-white shadow-xl rounded-xl border border-gray-100 py-2 px-2">
                    <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wide px-2">
                      Add funds
                    </span>
                    <div className="flex flex-col gap-1 mt-1.5">
                      {[500, 1000, 5000].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => handleTopup(amt)}
                          className="text-sm font-medium text-gray-700 rounded-lg px-3 py-2 cursor-pointer text-left hover:bg-gray-50 active:bg-gray-100 transition-colors"
                        >
                          + ₹{amt.toLocaleString("en-IN")}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            <span className="mt-2 h-12 flex items-center gap-2">
              <img
                className="w-10 h-10 rounded-full object-fill"
                src={profile}
                alt="profile"
              />
              <span className="text-xs text-gray-500 font-mono hidden md:block max-w-[80px] truncate" title={userId}>
                {userId.slice(0, 8)}
              </span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
