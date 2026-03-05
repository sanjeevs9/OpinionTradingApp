export interface OrderbookSide {
  [price: string]: {
    total: number;
    orders: { [userId: string]: number };
  };
}

export interface Orderbook {
  yes: OrderbookSide;
  no: OrderbookSide;
}

export interface OrderPayload {
  userId: string;
  stockSymbol: string;
  quantity: number;
  price: number;
  stockType: "yes" | "no";
}

export interface PriceLevel {
  price: number;
  qty: number;
}

export interface SymbolCardData {
  stockSymbol: string;
  yesPrice: number;
  noPrice: number;
  orderbook: Orderbook;
}
