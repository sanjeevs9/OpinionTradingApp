import { GoHome } from "react-icons/go";
import { technology } from "../db/data";
import { IoBagRemoveOutline } from "react-icons/io5";

export const Footer = () => {
  const spanClass = "font-bold text-black";
  return (
    <>
      <div className="p-4 pl-10 pt-10">
        <hr />
        <footer className="bg-gray-100 py-10 px-0">
          <div className="max-w-screen-xl grid grid-cols-1 md:grid-cols-4 gap-10 text-gray-800 mb-5">
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:underline">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Culture
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:underline">
                    Help Centre
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Contact Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    What's New
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Careers</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:underline">
                    Open Roles
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:help@probo.in" className="hover:underline">
                    help@probo.in
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:communication@probo.in"
                    className="hover:underline"
                  >
                    communication@probo.in
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <hr />
            <div className="md:flex block w-full">
              <div className="w-1/2 pt-10">
                <h1 className="mb-4 font-bold text-ls">Probo Partnerships</h1>
                <p className="font-light">
                  Probo’s experience is made possible by our partnerships with
                  <span className={spanClass}>TradingView</span> (track upcoming
                  events with Economic Calendar or browse stocks in the
                  Screener), <span className={spanClass}>Authbridge</span> for
                  verification technology,{" "}
                  <span className={spanClass}>DataMuni</span> for data &
                  analytics,{" "}
                  <span className={spanClass}>
                    Google Firebase, Google Cloud
                  </span>{" "}
                  & <span className={spanClass}>AWS</span>. Probo is also a
                  member of <span className={spanClass}>FICCI</span> and{" "}
                  <span className={spanClass}>ASSOCHAM.</span>
                </p>
              </div>
              <div className="w-1/2 flex justify-end md:pr-10 mt-5 space-x-4">
                {technology.map((item) => (
                  <img
                    className="object-contain"
                    width={60}
                    height={60}
                    src={item.icon}
                    alt={item.title}
                  />
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
      <div className="p-6 sticky bottom-0 z-10 md:hidden flex justify-around bg-[#ffff]">
        <span className="cursor-pointer flex flex-col items-center">
          <GoHome size={25} className="text-gray-500" />
          <h2 className="text-gray-500 font-normal">Home</h2>
        </span>
        <span className="cursor-pointer flex flex-col items-center">
          <IoBagRemoveOutline size={25} className="text-gray-500" />
          <h2 className="text-gray-500 font-normal">Portfolio</h2>
        </span>
      </div>
    </>
  );
};
