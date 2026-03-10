import { useState } from "react";
import watchlist from "../assets/watchlist.svg";
import { FaAngleUp } from "react-icons/fa6";

function Watchlist() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleWatchlist = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`fixed bottom-2 lg:block hidden z-10 w-[280px] right-0 transform transition-transform duration-300 ${
        isOpen ? "translate-y-0" : "translate-y-full"
      } m-6`}
    >
      <div
        className="bg-white border border-slate-200 border-b-0 rounded-t-xl flex items-center justify-between p-3.5 shadow-elevated cursor-pointer"
        onClick={toggleWatchlist}
      >
        <div className="flex items-center gap-2">
          <img className="w-6 h-6" src={watchlist} alt="Watchlist" />
          <h3 className="font-semibold text-sm text-slate-800">Watchlist</h3>
        </div>
        <span className={`transform transition-transform duration-200 text-slate-400 ${isOpen ? "rotate-180" : ""}`}>
          <FaAngleUp size={16} />
        </span>
      </div>

      {isOpen && (
        <div className="bg-white border border-t-0 border-slate-200 -mb-20 p-4 shadow-elevated">
          <p className="text-sm text-slate-500">Your Watchlist is Empty</p>
          <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
            <h4 className="font-semibold text-sm text-slate-700">Tip</h4>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              Add to watchlist by clicking the plus button on the left of the event.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Watchlist;
