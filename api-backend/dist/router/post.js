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
        const data = {
            userId
        };
        yield start_1.subscriber.subscribe(id, (message) => {
            start_1.subscriber.unsubscribe(id);
            res.json({
                message: message
            });
        });
        (0, functions_1.queue)("/user/create/:userId", data, id);
    }
    catch (err) {
        console.log(err);
    }
}));
router.post("/user/create/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const id = (0, functions_1.generate)();
        const data = {
            userId
        };
        yield new Promise((res, rej) => {
            start_1.subscriber.subscribe(id, (message) => {
                start_1.subscriber.unsubscribe(id);
                res(message);
            });
            (0, functions_1.queue)("/user/create/:userId", data, id);
        });
        res.send('hi there');
        return;
    }
    catch (err) {
        console.log(err);
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
