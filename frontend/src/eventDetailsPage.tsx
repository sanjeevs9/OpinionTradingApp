import { useParams } from "react-router-dom";
import { EventsCompo } from "./component/eventComponent";

export const EventDetailsPage = () => {
  const { stockSymbol } = useParams<{ stockSymbol: string }>();

  return (
    <div className="bg-bg min-h-screen">
      <EventsCompo stockSymbol={stockSymbol || ""} />
    </div>
  );
};
