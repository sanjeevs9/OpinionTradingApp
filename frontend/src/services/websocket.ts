const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8080";

type OrderbookCallback = (data: any) => void;

const subscriptions = new Map<string, { ws: WebSocket; callback: OrderbookCallback }>();

export function subscribeToOrderbook(symbol: string, callback: OrderbookCallback) {
  // Close existing subscription for this symbol
  unsubscribeFromOrderbook(symbol);

  const ws = new WebSocket(WS_URL);

  ws.onopen = () => {
    ws.send(JSON.stringify({ type: "subscribe", stockSymbol: symbol }));
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      callback(data);
    } catch {
      // ignore non-JSON messages
    }
  };

  ws.onerror = (err) => {
    console.error(`WebSocket error for ${symbol}:`, err);
  };

  ws.onclose = () => {
    subscriptions.delete(symbol);
  };

  subscriptions.set(symbol, { ws, callback });
}

export function unsubscribeFromOrderbook(symbol: string) {
  const sub = subscriptions.get(symbol);
  if (sub) {
    sub.ws.close();
    subscriptions.delete(symbol);
  }
}
