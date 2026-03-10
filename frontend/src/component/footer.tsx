import { GoHome } from "react-icons/go";
import { technology } from "../db/data";
import { IoBagRemoveOutline } from "react-icons/io5";

export const Footer = () => {
  return (
    <>
      <div className="max-w-7xl mx-auto px-6 pt-10">
        <div className="border-t border-slate-200" />
        <footer className="py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-slate-600 mb-8">
            <div>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-sm hover:text-slate-900 transition-colors">About Us</a></li>
                <li><a href="#" className="text-sm hover:text-slate-900 transition-colors">Culture</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Resources</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-sm hover:text-slate-900 transition-colors">Help Centre</a></li>
                <li><a href="#" className="text-sm hover:text-slate-900 transition-colors">Contact Support</a></li>
                <li><a href="#" className="text-sm hover:text-slate-900 transition-colors">What's New</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Careers</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-sm hover:text-slate-900 transition-colors">Open Roles</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Contact Us</h4>
              <ul className="space-y-2.5">
                <li><a href="mailto:help@probo.in" className="text-sm hover:text-slate-900 transition-colors">help@probo.in</a></li>
                <li><a href="mailto:communication@probo.in" className="text-sm hover:text-slate-900 transition-colors">communication@probo.in</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8">
            <div className="md:flex gap-10">
              <div className="md:w-1/2">
                <h5 className="font-bold text-sm text-slate-900 mb-2">Probo Partnerships</h5>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Probo's experience is made possible by our partnerships with{" "}
                  <strong className="text-slate-700">TradingView</strong> (track upcoming events with Economic Calendar),{" "}
                  <strong className="text-slate-700">Authbridge</strong> for verification technology,{" "}
                  <strong className="text-slate-700">DataMuni</strong> for data & analytics,{" "}
                  <strong className="text-slate-700">Google Firebase, Google Cloud</strong> &{" "}
                  <strong className="text-slate-700">AWS</strong>. Probo is also a member of{" "}
                  <strong className="text-slate-700">FICCI</strong> and{" "}
                  <strong className="text-slate-700">ASSOCHAM</strong>.
                </p>
              </div>
              <div className="md:w-1/2 flex justify-end items-start gap-4 mt-5 md:mt-0">
                {technology.map((item) => (
                  <img
                    key={item.title}
                    className="object-contain opacity-60 hover:opacity-100 transition-opacity"
                    width={48}
                    height={48}
                    src={item.icon}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                  />
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile bottom nav */}
      <div className="p-4 sticky bottom-0 z-10 md:hidden flex justify-around bg-white border-t border-slate-200">
        <span className="cursor-pointer flex flex-col items-center gap-0.5">
          <GoHome size={22} className="text-slate-500" />
          <span className="text-xs text-slate-500">Home</span>
        </span>
        <span className="cursor-pointer flex flex-col items-center gap-0.5">
          <IoBagRemoveOutline size={22} className="text-slate-500" />
          <span className="text-xs text-slate-500">Portfolio</span>
        </span>
      </div>
    </>
  );
};
