import { useState } from "react";
import android from "../assets/androidQR.png";
import ios from "../assets/iosQR.png";
import androidIcon from "../assets/androidicon.svg";
import iosIcon from "../assets/iosicon.svg";
import { IoCloseOutline } from "react-icons/io5";

interface downloadType {
  setIsDownload: (val: boolean) => void;
}

export const Download = ({ setIsDownload }: downloadType) => {
  const [androidBtn, setAndroidBtn] = useState(true);
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="w-full max-w-md rounded-2xl relative border border-slate-200 bg-white shadow-elevated p-8">
        <div className="flex flex-col items-center">
          <h1 className="font-display text-xl font-bold text-slate-900 text-center">
            We are excited to get you onboard!
          </h1>
          <div className="mt-6">
            <img
              className="rounded-xl"
              width={180}
              height={180}
              src={androidBtn ? android : ios}
              alt={androidBtn ? "android" : "ios"}
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setAndroidBtn(true)}
              className={`border-2 ${
                androidBtn ? "border-yes bg-yes-light" : "border-slate-200"
              } text-sm font-semibold py-2.5 px-8 flex items-center gap-2 rounded-xl transition-colors cursor-pointer`}
            >
              <img width={18} height={18} src={androidIcon} alt="android" />
              Android
            </button>
            <button
              onClick={() => setAndroidBtn(false)}
              className={`border-2 ${
                !androidBtn ? "border-yes bg-yes-light" : "border-slate-200"
              } text-sm font-semibold py-2.5 px-8 flex items-center gap-2 rounded-xl transition-colors cursor-pointer`}
            >
              <img width={18} height={18} src={iosIcon} alt="ios" />
              App Store
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-5 text-center">
            Scan the QR code from Paytm or any QR Scanner app.
          </p>
        </div>
        <button
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          onClick={() => setIsDownload(false)}
        >
          <IoCloseOutline size={24} />
        </button>
      </div>
    </div>
  );
};
