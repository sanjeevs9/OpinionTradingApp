export const Switch = () => (
  <div className="flex items-center">
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-[#B0B0B0] peer-checked:bg-blue-600 transition-colors"></div>
      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transform transition-transform peer-checked:translate-x-5"></div>
    </label>
  </div>
);
