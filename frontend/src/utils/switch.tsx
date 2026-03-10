export const Switch = () => (
  <div className="flex items-center">
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" />
      <div className="w-10 h-[22px] bg-slate-200 rounded-full peer peer-checked:bg-yes transition-colors"></div>
      <div className="absolute left-0.5 top-0.5 w-[18px] h-[18px] bg-white rounded-full shadow-sm transform transition-transform peer-checked:translate-x-[18px]"></div>
    </label>
  </div>
);
