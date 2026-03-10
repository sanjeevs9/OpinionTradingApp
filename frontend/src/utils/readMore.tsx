import { useState } from "react";

export const ReadMoreText = (text: string) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleReadMore = () => setIsExpanded(!isExpanded);
  const preText = text.slice(0, 190);

  return (
    <p className="text-sm text-slate-500 leading-relaxed">
      {isExpanded ? text : `${preText}...`}
      <button
        onClick={toggleReadMore}
        className="text-slate-800 font-semibold cursor-pointer text-sm ml-1 hover:text-slate-600 transition-colors"
      >
        {isExpanded ? "Show less" : "Read more"}
      </button>
    </p>
  );
};
