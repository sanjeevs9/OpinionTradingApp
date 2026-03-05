const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// Orderbooks
export function getOrderbooks() {
  return fetchJson<{ [symbol: string]: { yes: any; no: any } }>(
    `${API_URL}/orderbook`
  );
}

export function getOrderbook(symbol: string) {
  return fetchJson<{ [symbol: string]: { yes: any; no: any } }>(
    `${API_URL}/orderbook/${symbol}`
  );
}

// Balances
export async function getInrBalance(userId: string) {
  const res = await fetchJson<{ message: { [userId: string]: { balance: number; locked: number } } }>(
    `${API_URL}/balance/inr/${userId}`
  );

  return res.message;
}

export function getStockBalance(userId: string) {
  return fetchJson<any>(`${API_URL}/balance/stock/${userId}`);
}

// User
export function createUser(userId: string) {
  return fetchJson<any>(`${API_URL}/user/create/${userId}`, {
    method: "POST",
  });
}

// Symbol
export function createSymbol(symbol: string) {
  return fetchJson<any>(`${API_URL}/symbol/create/${symbol}`, {
    method: "POST",
  });
}

// Onramp
export function onrampInr(userId: string, amount: number) {
  return fetchJson<any>(`${API_URL}/onramp/inr`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, amount }),
  });
}

// Orders
export function placeBuyOrder(order: {
  userId: string;
  stockSymbol: string;
  quantity: number;
  price: number;
  stockType: "yes" | "no";
}) {
  return fetchJson<any>(`${API_URL}/order/buy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });
}

export function placeSellOrder(order: {
  userId: string;
  stockSymbol: string;
  quantity: number;
  price: number;
  stockType: "yes" | "no";
}) {
  return fetchJson<any>(`${API_URL}/order/sell`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });
}
