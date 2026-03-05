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
    return Math.max(10, Math.min(990, Math.round(p / 10) * 10));
}
function generateOrders(stockSymbol, botUsers) {
    let fairPrice = 500 + randInt(-50, 50);
    let orderCount = 0;
    for (let round = 0; round < 5; round++) {
        // Bids: 3 buy YES orders below fair price
        for (let i = 0; i < 3; i++) {
            const price = clampPrice(normalRandom(fairPrice - 40, 30));
            const quantity = randInt(1, 15);
            const userId = botUsers[randInt(0, botUsers.length - 1)];
            queueFireAndForget("/order/buy", { userId, stockSymbol, quantity, price, stockType: "yes" });
            orderCount++;
        }
        // Asks: 3 buy NO orders (appears as YES sell side)
        for (let i = 0; i < 3; i++) {
            const noPrice = clampPrice(normalRandom((1000 - fairPrice) - 40, 30));
            const quantity = randInt(1, 15);
            const userId = botUsers[randInt(0, botUsers.length - 1)];
            queueFireAndForget("/order/buy", { userId, stockSymbol, quantity, price: noPrice, stockType: "no" });
            orderCount++;
        }
        // Crossing trades: 1-2 aggressive orders that cross the spread
        const crossCount = randInt(1, 2);
        for (let i = 0; i < crossCount; i++) {
            const userId = botUsers[randInt(0, botUsers.length - 1)];
            if (Math.random() > 0.5) {
                // Aggressive YES buy at/above fair
                const price = clampPrice(fairPrice + randInt(0, 20));
                queueFireAndForget("/order/buy", { userId, stockSymbol, quantity: randInt(1, 5), price, stockType: "yes" });
            }
            else {
                // Aggressive NO buy at/above complement
                const price = clampPrice((1000 - fairPrice) + randInt(0, 20));
                queueFireAndForget("/order/buy", { userId, stockSymbol, quantity: randInt(1, 5), price, stockType: "no" });
            }
            orderCount++;
        }
        // Price drift
        fairPrice += randInt(-15, 15);
        fairPrice = Math.max(100, Math.min(900, fairPrice));
    }
    return orderCount;
}
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
