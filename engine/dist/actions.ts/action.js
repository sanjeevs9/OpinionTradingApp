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
exports.getBalance = getBalance;
exports.getStock = getStock;
exports.getOrderbook = getOrderbook;
exports.reset = reset;
exports.createUser = createUser;
exports.createStock = createStock;
exports.addMoney = addMoney;
exports.buyStock = buyStock;
exports.sellStock = sellStock;
const publihser_1 = __importDefault(require("../publihser"));
const schema_1 = require("../schema");
const purchase_1 = require("./purchase");
const sell_1 = require("./sell");
function getBalance(id, data) {
    const userId = data.userId;
    if (!schema_1.inr_balance[userId]) {
        const message = "User not found";
        (0, publihser_1.default)(id, JSON.stringify(message));
        return;
    }
    let balance = schema_1.inr_balance[userId].balance;
    balance = balance / 100;
    (0, publihser_1.default)(id, JSON.stringify(balance));
}
function getStock(id, data) {
    const userId = data.userId;
    if (!schema_1.stock_balance[userId]) {
        const message = "User has no stocks";
        (0, publihser_1.default)(id, JSON.stringify(message));
        return;
    }
    let balance = schema_1.stock_balance[userId];
    (0, publihser_1.default)(id, JSON.stringify(balance));
}
function getOrderbook(id, data) {
    const stockSymbol = data.stockSymbol;
    if (!schema_1.Orderbook[stockSymbol]) {
        const message = "no stocks found";
        (0, publihser_1.default)(id, JSON.stringify(message));
        return;
    }
    let stock = schema_1.Orderbook[stockSymbol];
    (0, publihser_1.default)(id, JSON.stringify(stock));
}
function reset(id) {
    for (const key in schema_1.inr_balance) {
        delete schema_1.inr_balance[key];
    }
    for (const key in schema_1.Orderbook) {
        delete schema_1.Orderbook[key];
    }
    for (const key in schema_1.stock_balance) {
        delete schema_1.stock_balance[key];
    }
    const message = "your game is rest";
    (0, publihser_1.default)(id, JSON.stringify(message));
}
function createUser(id, data) {
    const userId = data.userId;
    const user = {
        balance: 0,
        locked: 0
    };
    schema_1.inr_balance[userId] = user;
    schema_1.stock_balance[userId] = {};
    const message = "user created";
    (0, publihser_1.default)(id, JSON.stringify(message));
}
function createStock(id, data) {
    const stockSymbol = data.stockSymbol;
    schema_1.Orderbook[stockSymbol] = {
        "yes": {},
        "no": {}
    };
    const message = "stock created";
    (0, publihser_1.default)(id, JSON.stringify(message));
}
function addMoney(id, data) {
    const userId = data.userId;
    const amount = data.amount;
    if (!schema_1.inr_balance[userId]) {
        const message = "user not found";
        (0, publihser_1.default)(id, JSON.stringify(message));
        return;
    }
    schema_1.inr_balance[userId].balance += amount;
    const message = `${amount / 100} added to your account`;
    (0, publihser_1.default)(id, JSON.stringify(message));
}
function buyStock(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = data.userId;
        const stockSymbol = data.stockSymbol;
        const quantity = data.quantity;
        const price = data.price;
        const stockType = data.stockType;
        if (!schema_1.inr_balance[userId]) {
            const message = "user not found";
            (0, publihser_1.default)(id, JSON.stringify(message));
            return;
        }
        if (!schema_1.Orderbook[stockSymbol]) {
            const message = "stock not found please try again later";
            (0, publihser_1.default)(id, JSON.stringify(message));
            return;
        }
        const message = (0, purchase_1.buy)(userId, stockSymbol, quantity, price, stockType);
        (0, publihser_1.default)(id, JSON.stringify(message));
        const value = schema_1.Orderbook[stockSymbol];
        // console.log(value);
        console.log(stockSymbol);
        yield (0, publihser_1.default)(stockSymbol, JSON.stringify(value));
    });
}
function sellStock(id, data) {
    const userId = data.userId;
    const stockSymbol = data.stockSymbol;
    const quantity = data.quantity;
    const price = data.price;
    const stockType = data.stockType;
    if (!schema_1.inr_balance[userId]) {
        const message = "user not found";
        (0, publihser_1.default)(id, JSON.stringify(message));
        return;
    }
    if (!schema_1.Orderbook[stockSymbol]) {
        const message = "stock not found please try again later";
        (0, publihser_1.default)(id, JSON.stringify(message));
        return;
    }
    const message = (0, sell_1.sell)(userId, stockSymbol, quantity, price, stockType);
    (0, publihser_1.default)(id, JSON.stringify(message));
    const value = schema_1.Orderbook[stockSymbol];
    (0, publihser_1.default)(stockSymbol, JSON.stringify(value));
}
