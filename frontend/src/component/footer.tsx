import { GoHome } from "react-icons/go";
import { technology } from "../db/data";
import { IoBagRemoveOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <>
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-slate-600 mb-10">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Company</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-sm hover:text-slate-900 transition-colors">About Us</a></li>
                <li><a href="#" className="text-sm hover:text-slate-900 transition-colors">Culture</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Resources</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-sm hover:text-slate-900 transition-colors">Help Centre</a></li>
                <li><a href="#" className="text-sm hover:text-slate-900 transition-colors">Contact Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Careers</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-sm hover:text-slate-900 transition-colors">Open Roles</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Contact</h4>
              <ul className="space-y-2.5">
                <li><a href="mailto:help@probo.in" className="text-sm hover:text-slate-900 transition-colors">help@probo.in</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {technology.map((item) => (
                <img
                  key={item.title}
                  className="object-contain opacity-40 hover:opacity-80 transition-opacity"
                  width={36}
                  height={36}
                  src={item.icon}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </div>
            <p className="text-xs text-slate-400">&copy; 2024 Probo. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Mobile bottom nav */}
      <div className="p-4 sticky bottom-0 z-10 md:hidden flex justify-around bg-white border-t border-slate-200">
        <Link to="/" className="cursor-pointer flex flex-col items-center gap-0.5">
          <GoHome size={22} className="text-slate-500" />
          <span className="text-xs text-slate-500">Home</span>
        </Link>
        <Link to="/events" className="cursor-pointer flex flex-col items-center gap-0.5">
          <IoBagRemoveOutline size={22} className="text-slate-500" />
          <span className="text-xs text-slate-500">Events</span>
        </Link>
      </div>
    </>
  );
};
