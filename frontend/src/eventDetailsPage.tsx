import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { EventsCompo } from "./component/eventComponent";

export const EventDetailsPage = () => {
  const { stockSymbol } = useParams<{ stockSymbol: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [stockSymbol]);

  return (
    <div className="bg-bg min-h-screen">
      <EventsCompo stockSymbol={stockSymbol || ""} />
    </div>
  );
};
