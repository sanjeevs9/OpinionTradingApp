import type { OrderbookSide, PriceLevel } from "../types";

export function paiseToRupees(paise: number): number {
  return paise / 100;
}

export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

export function getBestPrice(side: OrderbookSide | undefined): number {
  if (!side) return 0;
  const prices = Object.keys(side)
    .map(Number)
    .filter((p) => side[p.toString()] && side[p.toString()].total > 0);
  if (prices.length === 0) return 0;
  // Best price = lowest available price (best for buyer)
  return Math.min(...prices);
}

export function orderbookSideToPriceLevels(
  side: OrderbookSide | undefined,
  limit: number = 5
): PriceLevel[] {
  if (!side) return [];
  const levels: PriceLevel[] = Object.entries(side)
    .map(([price, data]) => ({
      price: paiseToRupees(Number(price)),
      qty: data.total,
    }))
    .filter((l) => l.qty > 0)
    .sort((a, b) => a.price - b.price);

  // Compute cumulative quantities (low → high)
  for (let i = 1; i < levels.length; i++) {
    levels[i].qty += levels[i - 1].qty;
  }

  return levels.slice(0, limit);
}

export function getCumulativeQty(
  side: OrderbookSide | undefined,
  paise: number
): number {
  if (!side) return 0;
  let total = 0;
  for (const [priceKey, data] of Object.entries(side)) {
    if (Number(priceKey) <= paise && data.total > 0) {
      total += data.total;
    }
  }
  return total;
}
