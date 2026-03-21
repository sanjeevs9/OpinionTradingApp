import { createClient } from "redis";

// Dedicated Redis clients for bot operations
let queueClient: ReturnType<typeof createClient> | null = null;
let botSub: ReturnType<typeof createClient> | null = null;

async function ensureRedis() {
  if (!queueClient) {
    queueClient = createClient();
    await queueClient.connect();
  }
  if (!botSub) {
    botSub = createClient();
    await botSub.connect();
  }
}

function generate(): string {
  let num = "";
  const alpha = "ABCDEFGHIJKLMNOPQRSTUVQXYZ";
  for (let i = 0; i < 5; i++) {
    num += Math.floor(Math.random() * 10);
    num += alpha.charAt(Math.floor(Math.random() * alpha.length));
  }
  return num;
}

function queueAndWait(endpoint: string, data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const id = generate();
    const timeout = setTimeout(() => {
      botSub!.unsubscribe(id);
      reject(new Error(`Timeout: ${endpoint}`));
    }, 5000);

    botSub!.subscribe(id, (message: any) => {
      clearTimeout(timeout);
      botSub!.unsubscribe(id);
      resolve(message);
    });

    queueClient!.lPush("endpoint", JSON.stringify({ endpoint, data, id }));
  });
}

function queueFireAndForget(endpoint: string, data: any): void {
  const id = generate();
  queueClient!.lPush("endpoint", JSON.stringify({ endpoint, data, id }));
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clampPrice(p: number): number {
  return Math.max(50, Math.min(950, Math.round(p / 50) * 50));
}

// --- Bot State ---

interface BotState {
  timer: ReturnType<typeof setTimeout>;
  users: string[];
  fairPrice: number;
  running: boolean;
}

const activeBots = new Map<string, BotState>();
const initializingBots = new Set<string>();

async function createBotUsers(stockSymbol: string): Promise<string[]> {
  // Ensure symbol exists (no-op if already created by /seed)
  try {
    await queueAndWait("/symbol/create/:stockSymbol", { stockSymbol });
  } catch {
    // already exists, fine
  }

  const users: string[] = [];
  for (let i = 0; i < 5; i++) {
    const userId = `livebot_${stockSymbol}_${i}_${Date.now()}`;
    try {
      await queueAndWait("/user/create/:userId", { userId });
      await queueAndWait("/onramp/inr", { userId, amount: 10000000 }); // 100k Rs in paise
      users.push(userId);
    } catch (err) {
      console.error(`[BOT] Failed to create user ${userId}:`, err);
    }
  }
  return users;
}

function seedDepth(stockSymbol: string, users: string[], fairPrice: number) {
  const noFair = 1000 - fairPrice;
  for (let step = 1; step <= 4; step++) {
    const yesPrice = clampPrice(fairPrice - step * 50);
    const noPrice = clampPrice(noFair - step * 50);
    if (yesPrice >= 50) {
      queueFireAndForget("/order/buy", {
        userId: users[randInt(0, users.length - 1)],
        stockSymbol,
        quantity: randInt(5, 20),
        price: yesPrice,
        stockType: "yes",
      });
    }
    if (noPrice >= 50) {
      queueFireAndForget("/order/buy", {
        userId: users[randInt(0, users.length - 1)],
        stockSymbol,
        quantity: randInt(5, 20),
        price: noPrice,
        stockType: "no",
      });
    }
  }
}

function executeTrade(stockSymbol: string, bot: BotState) {
  // Place 1-2 orders per tick for active movement
  const numOrders = randInt(1, 2);
  for (let i = 0; i < numOrders; i++) {
    const userId = bot.users[randInt(0, bot.users.length - 1)];
    const side: "yes" | "no" = Math.random() > 0.5 ? "yes" : "no";
    const noFair = 1000 - bot.fairPrice;
    const baseFair = side === "yes" ? bot.fairPrice : noFair;

    if (Math.random() < 0.65) {
      // Passive: limit order below fair price (adds depth, updates orderbook)
      const price = clampPrice(baseFair - randInt(1, 3) * 50);
      queueFireAndForget("/order/buy", {
        userId, stockSymbol, quantity: randInt(1, 10), price, stockType: side,
      });
    } else {
      // Aggressive: at or above fair price (crosses spread, creates trades)
      const price = clampPrice(baseFair + randInt(0, 2) * 50);
      queueFireAndForget("/order/buy", {
        userId, stockSymbol, quantity: randInt(1, 5), price, stockType: side,
      });
    }
  }

  // Drift fair price randomly
  bot.fairPrice += randInt(-1, 1) * 50;
  bot.fairPrice = Math.max(150, Math.min(850, bot.fairPrice));
}

function scheduleNext(stockSymbol: string) {
  const bot = activeBots.get(stockSymbol);
  if (!bot || !bot.running) return;

  const delay = randInt(800, 2000);
  bot.timer = setTimeout(() => {
    if (!bot.running) return;
    executeTrade(stockSymbol, bot);
    scheduleNext(stockSymbol);
  }, delay);
}

// --- Public API ---

export async function startBot(stockSymbol: string): Promise<void> {
  if (activeBots.has(stockSymbol) || initializingBots.has(stockSymbol)) return;

  initializingBots.add(stockSymbol);
  console.log(`[BOT] Initializing live bot for ${stockSymbol}...`);

  try {
    await ensureRedis();

    const users = await createBotUsers(stockSymbol);
    if (users.length === 0) {
      console.error(`[BOT] No users created for ${stockSymbol}`);
      return;
    }

    // If stop was called while we were initializing, abort
    if (!initializingBots.has(stockSymbol)) {
      console.log(`[BOT] Init cancelled for ${stockSymbol} (user left)`);
      return;
    }

    const fairPrice = 500;
    const bot: BotState = {
      timer: setTimeout(() => {}, 0),
      users,
      fairPrice,
      running: true,
    };

    activeBots.set(stockSymbol, bot);

    // Seed initial orderbook depth
    seedDepth(stockSymbol, users, fairPrice);

    // Start the trading loop
    scheduleNext(stockSymbol);
    console.log(`[BOT] Live bot started for ${stockSymbol} (${users.length} users)`);
  } finally {
    initializingBots.delete(stockSymbol);
  }
}

export function stopBot(stockSymbol: string): void {
  // Cancel initialization if still in progress
  initializingBots.delete(stockSymbol);

  const bot = activeBots.get(stockSymbol);
  if (bot) {
    bot.running = false;
    clearTimeout(bot.timer);
    activeBots.delete(stockSymbol);
    console.log(`[BOT] Live bot stopped for ${stockSymbol}`);
  }
}
