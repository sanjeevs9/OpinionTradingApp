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
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="w-[35%] rounded-lg relative h-fit border bg-white shadow-xl p-10 pb-5">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-semibold">
              We are excited to get you onboard!
            </h1>
            {androidBtn ? (
              <img
                className="flex mt-5"
                width={200}
                height={200}
                src={android}
                alt="android"
              />
            ) : (
              <img
                className="flex mt-5"
                width={200}
                height={200}
                src={ios}
                alt="ios"
              />
            )}

            <div className="flex gap-4 mt-5">
              <button
                onClick={() => setAndroidBtn(true)}
                className={`border-2 ${
                  androidBtn ? "border-[#35ADFC] bg-[#ECF7FE]" : ""
                } text-base font-semibold p-3 flex gap-2 rounded-lg px-12`}
              >
                <img
                  width={20}
                  height={20}
                  src={androidIcon}
                  alt="androidicon"
                />
                Android
              </button>
              <button
                onClick={() => setAndroidBtn(false)}
                className={`border-2 ${
                  !androidBtn ? "border-[#35ADFC] bg-[#ECF7FE]" : ""
                } text-base font-semibold p-3 flex gap-2 rounded-lg px-12`}
              >
                <img width={20} height={20} src={iosIcon} alt="iosIcon" />
                App Store
              </button>
            </div>
            <span className="text-sm mt-5 mb-0 font-light text-black">
              You can scan the QR code from Paytm or any QR Scanner app.
            </span>
          </div>
          <button
            className="absolute top-4 right-4 text-gray-500"
            onClick={() => {setIsDownload(false)}}
          >
            <IoCloseOutline size={30} />
          </button>
        </div>
      </div>
    </>
  );
};
