"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const functions_1 = require("../functions");
const start_1 = require("../redis.ts/start");
const router = express_1.default.Router();
exports.default = router;
router.post("/reset", (req, res) => {
    const id = (0, functions_1.generate)();
    start_1.subscriber.subscribe(id, (message) => {
        const value = JSON.parse(message);
        res.json({
            message: value
        });
        return;
    });
    (0, functions_1.queue)("/reset", {}, id);
});
router.post("/user/create/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const id = (0, functions_1.generate)();
        const data = { userId };
        const response = yield new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                start_1.subscriber.unsubscribe(id);
                reject(new Error('Request timeout'));
            }, 5000);
            start_1.subscriber.subscribe(id, (message) => {
                clearTimeout(timeout);
                start_1.subscriber.unsubscribe(id);
                resolve(message);
            });
            (0, functions_1.queue)("/user/create/:userId", data, id);
        });
        res.json({ message: response });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create user' });
    }
}));
//create stockSymbol
router.post("/symbol/create/:stockSymbol", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = (0, functions_1.generate)();
    const stockSymbol = req.params.stockSymbol;
    const data = {
        stockSymbol
    };
    yield start_1.subscriber.subscribe(id, (message) => {
        res.json({
            message: message
        });
        return;
    });
    (0, functions_1.queue)("/symbol/create/:stockSymbol", data, id);
}));
//add money to user account
router.post("/onramp/inr", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const value = req.body;
        const userId = value.userId;
        //take amount as rs
        const amount = value.amount;
        const paise = amount * 100;
        const id = (0, functions_1.generate)();
        const data = {
            userId,
            amount: paise,
        };
        start_1.subscriber.subscribe(id, (message) => {
            res.json({
                message: message
            });
            return;
        });
        (0, functions_1.queue)("/onramp/inr", data, id);
    }
    catch (err) {
        console.log(err);
    }
}));
//buy order place
router.post("/order/buy", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const value = req.body;
    const userId = value.userId;
    const stockSymbol = value.stockSymbol;
    const quantity = value.quantity;
    const price = value.price;
    const stockType = value.stockType;
    const id = (0, functions_1.generate)();
    const data = {
        userId,
        stockSymbol,
        quantity,
        price,
        stockType,
    };
    (0, functions_1.queue)("/order/buy", data, id);
    start_1.subscriber.subscribe(id, (message) => {
        res.json({
            message: message
        });
        return;
    });
}));
router.post("/order/sell", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const value = req.body;
    const userId = value.userId;
    const stockSymbol = value.stockSymbol;
    const quantity = value.quantity;
    const price = value.price;
    const stockType = value.stockType;
    const data = {
        userId,
        stockSymbol,
        quantity,
        price,
        stockType
    };
    const id = (0, functions_1.generate)();
    (0, functions_1.queue)("/order/sell", data, id);
    start_1.subscriber.subscribe(id, (message) => {
        res.json({
            message: message
        });
        return;
    });
}));
// --- Bot Market Maker ---
function queueAndWait(endpoint, data) {
    return new Promise((resolve, reject) => {
        const id = (0, functions_1.generate)();
        const timeout = setTimeout(() => {
            start_1.subscriber.unsubscribe(id);
            reject(new Error(`Timeout waiting for ${endpoint}`));
        }, 5000);
        start_1.subscriber.subscribe(id, (message) => {
            clearTimeout(timeout);
            start_1.subscriber.unsubscribe(id);
            resolve(message);
        });
        (0, functions_1.queue)(endpoint, data, id);
    });
}
function queueFireAndForget(endpoint, data) {
    const id = (0, functions_1.generate)();
    (0, functions_1.queue)(endpoint, data, id);
}
function normalRandom(mean, stddev) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + z * stddev;
}
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function clampPrice(p) {
    return Math.max(50, Math.min(950, Math.round(p / 50) * 50));
}
function generateOrders(stockSymbol, botUsers) {
    let fairPrice = clampPrice(500 + randInt(-1, 1) * 50);
    let orderCount = 0;
    // BUY YES below fair → creates NO orders above (1000-fair)
    // BUY NO below (1000-fair) → creates YES orders above fair
    // This prevents orders from matching each other
    for (let round = 0; round < 5; round++) {
        // YES bids below fair price
        for (let i = 0; i < 3; i++) {
            const price = clampPrice(fairPrice - randInt(1, 4) * 50);
            const quantity = randInt(1, 15);
            const userId = botUsers[randInt(0, botUsers.length - 1)];
            queueFireAndForget("/order/buy", { userId, stockSymbol, quantity, price, stockType: "yes" });
            orderCount++;
        }
        // NO bids below noFair price
        const noFair = 1000 - fairPrice;
        for (let i = 0; i < 3; i++) {
            const noPrice = clampPrice(noFair - randInt(1, 4) * 50);
            const quantity = randInt(1, 15);
            const userId = botUsers[randInt(0, botUsers.length - 1)];
            queueFireAndForget("/order/buy", { userId, stockSymbol, quantity, price: noPrice, stockType: "no" });
            orderCount++;
        }
        // Price drift in steps of 50
        fairPrice += randInt(-1, 1) * 50;
        fairPrice = Math.max(150, Math.min(850, fairPrice));
    }
    return orderCount;
}
// --- Seed All Events ---
const seedSymbols = [
    { name: "INDvsNZ", yesBase: 250 },
    { name: "UEL", yesBase: 600 },
    { name: "YouTube", yesBase: 900 },
    { name: "Bitcoin", yesBase: 300 },
    { name: "NBA", yesBase: 500 },
    { name: "PATvTAM_KABBADI", yesBase: 700 },
    { name: "PAKvsENG", yesBase: 500 },
    { name: "BLRvsPUN_KABBADI", yesBase: 300 },
    { name: "ISL", yesBase: 750 },
    { name: "BREAKING_NEWS", yesBase: 450 },
    { name: "Weather", yesBase: 450 },
    { name: "STOCKS_JPY", yesBase: 650 },
    { name: "Politics", yesBase: 850 },
    { name: "Esports", yesBase: 450 },
    { name: "GTA6", yesBase: 300 },
    { name: "Climate", yesBase: 250 },
    { name: "BGMI", yesBase: 400 },
    { name: "TAX_REFUND", yesBase: 800 },
];
router.post("/seed", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create 10 bot users with big balances
        const botUsers = [];
        for (let i = 0; i < 10; i++) {
            const userId = `seed_bot_${i}_${Date.now()}`;
            yield queueAndWait("/user/create/:userId", { userId });
            yield queueAndWait("/onramp/inr", { userId, amount: 10000000 }); // 100,000 Rs in paise
            botUsers.push(userId);
        }
        let totalOrders = 0;
        for (const sym of seedSymbols) {
            // Create symbol
            yield queueAndWait("/symbol/create/:stockSymbol", { stockSymbol: sym.name });
            const fair = sym.yesBase; // in paise (e.g. 250 = ₹2.50)
            const noFair = 1000 - fair;
            // ── HOW IT WORKS ──
            // BUY YES at X (no match) → engine creates NO order at (1000-X)
            // BUY NO  at Y (no match) → engine creates YES order at (1000-Y)
            //
            // To avoid orders matching each other:
            //   - BUY YES at prices BELOW fair → creates NO orders ABOVE noFair
            //   - BUY NO at prices BELOW noFair → creates YES orders ABOVE fair
            //   - The NO buys won't match the high-priced NO orders (engine matches ≤ price)
            //
            // Example: INDvsNZ (fair=250, noFair=750)
            //   BUY YES at 200,150,100 → NO orderbook gets 800,850,900
            //   BUY NO  at 700,650,600 → YES orderbook gets 300,350,400
            //   Result: YES side shows ₹3.0,3.5,4.0  |  NO side shows ₹8.0,8.5,9.0
            // Step 1: BUY YES below fair → populates NO orderbook above noFair
            for (let step = 1; step <= 6; step++) {
                const price = clampPrice(fair - step * 50);
                if (price < 50)
                    continue;
                const qty = randInt(5, 25);
                const userId = botUsers[randInt(0, botUsers.length - 1)];
                queueFireAndForget("/order/buy", {
                    userId, stockSymbol: sym.name, quantity: qty, price, stockType: "yes",
                });
                totalOrders++;
            }
            // Step 2: BUY NO below noFair → populates YES orderbook above fair
            for (let step = 1; step <= 6; step++) {
                const price = clampPrice(noFair - step * 50);
                if (price < 50)
                    continue;
                const qty = randInt(5, 25);
                const userId = botUsers[randInt(0, botUsers.length - 1)];
                queueFireAndForget("/order/buy", {
                    userId, stockSymbol: sym.name, quantity: qty, price, stockType: "no",
                });
                totalOrders++;
            }
            // Step 3: Extra depth at tighter prices (1-2 steps below fair)
            for (let i = 0; i < 3; i++) {
                const yesPrice = clampPrice(fair - randInt(1, 2) * 50);
                const noPrice = clampPrice(noFair - randInt(1, 2) * 50);
                if (yesPrice >= 50) {
                    const userId = botUsers[randInt(0, botUsers.length - 1)];
                    queueFireAndForget("/order/buy", {
                        userId, stockSymbol: sym.name, quantity: randInt(5, 20), price: yesPrice, stockType: "yes",
                    });
                    totalOrders++;
                }
                if (noPrice >= 50) {
                    const userId = botUsers[randInt(0, botUsers.length - 1)];
                    queueFireAndForget("/order/buy", {
                        userId, stockSymbol: sym.name, quantity: randInt(5, 20), price: noPrice, stockType: "no",
                    });
                    totalOrders++;
                }
            }
        }
        res.json({
            message: "Seed complete",
            symbolsCreated: seedSymbols.length,
            botsCreated: botUsers.length,
            totalOrders,
            symbols: seedSymbols.map(s => s.name),
        });
    }
    catch (err) {
        console.error("Seed error:", err);
        res.status(500).json({ error: "Seed failed" });
    }
}));
router.post("/bot", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { stockSymbol } = req.body;
        if (!stockSymbol) {
            res.status(400).json({ error: "stockSymbol is required" });
            return;
        }
        // Phase 1: Create bot users, fund them, create symbol
        const botUsers = [];
        for (let i = 0; i < 5; i++) {
            const userId = `bot_${stockSymbol}_${i}_${Date.now()}`;
            yield queueAndWait("/user/create/:userId", { userId });
            // Amount in paise (bypassing Express route, no ×100 conversion)
            yield queueAndWait("/onramp/inr", { userId, amount: 500000 });
            botUsers.push(userId);
        }
        yield queueAndWait("/symbol/create/:stockSymbol", { stockSymbol });
        // Phase 2: Generate orders (fire & forget)
        const ordersPlaced = generateOrders(stockSymbol, botUsers);
        // Phase 3: Return summary
        res.json({
            message: "Bot market maker started",
            botsCreated: botUsers.length,
            ordersPlaced,
            stockSymbol,
        });
    }
    catch (err) {
        console.error("Bot error:", err);
        res.status(500).json({ error: "Bot market maker failed" });
    }
}));
