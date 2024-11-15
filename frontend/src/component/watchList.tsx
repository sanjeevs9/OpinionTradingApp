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
      className={`fixed bottom-2 lg:block hidden z-10 w-[22%] right-0 transform transition-transform duration-300 ${
        isOpen ? "translate-y-0" : "translate-y-full"
      } m-10`}
    >
      <div
        className="w-[100%] bg-white border-b-0 rounded-t-xl flex items-center justify-between p-4 shadow-lg cursor-pointer"
        onClick={toggleWatchlist}
      >
        <div className="flex items-center">
          <img className="w-8 h-8 mr-2" src={watchlist} alt="Watchlist" />
          <h3 className="font-semibold">Watchlist</h3>
        </div>
        <span className={`transform transition ${isOpen ? "rotate-180" : ""}`}>
          <FaAngleUp size={20} />
        </span>
      </div>

      {isOpen && (
        <div className="w-[100%] h-96 bg-white -mb-20 p-4 pb-0 shadow-lg">
          <p>Your Watchlist is Empty</p>
          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <h4 className="font-medium">Tip</h4>
            <p className="text-sm text-gray-600">
              Add to watchlist by clicking the plus button on the left of the
              event.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Watchlist;
