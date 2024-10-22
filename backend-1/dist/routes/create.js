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
const schema_1 = require("../schema");
const Purchase_1 = require("../Purchase");
const sell_1 = require("../sell");
const router = express_1.default.Router();
const redis_1 = require("../redis");
exports.default = router;
//create user
router.post("/user/create/:userId", (req, res) => {
    const userId = req.params.userId;
    const user = {
        balance: 0,
        locked: 0
    };
    schema_1.inr_balance[userId] = user;
    schema_1.stock_balance[userId] = {};
    res.json({
        message: "user created"
    });
    return;
});
//create stockSymbol
router.post("/symbol/create/:stockSymbol", (req, res) => {
    const stockSymbol = req.params.stockSymbol;
    schema_1.Orderbook[stockSymbol] = {
        "yes": {},
        "no": {}
    };
    res.json({
        message: "stock created"
    });
    return;
});
//add money to user account
router.post("/onramp/inr", (req, res) => {
    const value = req.body;
    const id = value.id;
    const amount = value.amount;
    const paise = amount * 100;
    if (!schema_1.inr_balance[id]) {
        res.status(404).json({
            message: "user not found"
        });
        return;
    }
    schema_1.inr_balance[id].balance += paise;
    res.json({
        message: `${amount} added to your account`
    });
    return;
});
//buy order place
router.post("/order/buy", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const value = req.body;
    const userId = value.userId;
    const stockSymbol = value.stockSymbol;
    const quantity = value.quantity;
    const price = value.price;
    const stockType = value.stockType;
    if (!schema_1.inr_balance[userId]) {
        res.status(404).json({
            message: "user not found"
        });
        return;
    }
    if (!schema_1.Orderbook[stockSymbol]) {
        res.status(404).json({
            message: "stock not found please try again later"
        });
        return;
    }
    const message = (0, Purchase_1.buy)(userId, stockSymbol, quantity, price, stockType);
    yield redis_1.client.lPush("change", JSON.stringify({ stockSymbol: stockSymbol, orderbook: schema_1.Orderbook[stockSymbol] }));
    res.json({
        message: message
    });
    return;
}));
router.post("/order/sell", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const value = req.body;
    const userId = value.userId;
    const stockSymbol = value.stockSymbol;
    const quantity = value.quantity;
    const price = value.price;
    const stockType = value.stockType;
    if (!schema_1.inr_balance[userId]) {
        res.status(404).json({
            message: "user not found"
        });
        return;
    }
    if (!schema_1.Orderbook[stockSymbol]) {
        res.status(404).json({
            message: "stock not found please try again later"
        });
        return;
    }
    const message = (0, sell_1.sell)(userId, stockSymbol, quantity, price, stockType);
    yield redis_1.client.lPush("change", JSON.stringify({ stockSymbol: stockSymbol, orderbook: schema_1.Orderbook[stockSymbol] }));
    res.json({
        message: message
    });
    return;
}));
