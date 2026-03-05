import { useEffect, useState } from "react";
import { BodyContent } from "./component/body";
import { getOrderbooks } from "./services/api";
import { getBestPrice, paiseToRupees } from "./utils/price";
import type { SymbolCardData } from "./types";

export const EventPage = () => {
  const [symbolCards, setSymbolCards] = useState<SymbolCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orderbooks = await getOrderbooks();
        const cards: SymbolCardData[] = Object.entries(orderbooks).map(
          ([stockSymbol, book]) => {
            const bestYesPaise = getBestPrice(book.yes);
            const bestNoPaise = getBestPrice(book.no);
            return {
              stockSymbol,
              yesPrice: bestYesPaise ? paiseToRupees(bestYesPaise) : 5,
              noPrice: bestNoPaise ? paiseToRupees(bestNoPaise) : 5,
              orderbook: book,
            };
          }
        );
        setSymbolCards(cards);
      } catch (err) {
        console.error("Failed to fetch orderbooks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <BodyContent symbolCards={symbolCards} loading={loading} />
  );
};
