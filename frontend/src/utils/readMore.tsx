import { useState } from "react";

export const ReadMoreText = (text: string) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleReadMore = () => setIsExpanded(!isExpanded);
    const preText = text.slice(0, 190);
  
    return (
      <>
        <p className="text-sm text-[#545454]">
          {isExpanded ? text : `${preText}...`}
          <span
            onClick={toggleReadMore}
            className="text-black font-semibold cursor-pointer text-sm"
          >
            {isExpanded ? " Show less" : " Read more"}
          </span>
        </p>
      </>
    );
  };