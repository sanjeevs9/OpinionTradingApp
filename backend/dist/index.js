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
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
const redis_1 = require("redis");
const client = (0, redis_1.createClient)();
app.use(express.json());
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            app.listen(3000, () => {
                console.log("backend connected");
            });
            console.log("redis connected");
        }
        catch (err) {
            console.log(err);
        }
    });
}
start();
app.post("/submit", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.name;
    const age = req.body.age;
    try {
        yield client.lPush("submission", JSON.stringify({ name, age }));
        res.json({
            message: "redis queue added"
        });
    }
    catch (error) {
        res.json({
            message: "redis queue not added"
        });
    }
}));
function uniqueID() {
    const num = [1, 2, 3, 4, 5];
    let id = "";
    for (let i = 0; i < 4; i++) {
        const random = Math.floor(Math.random() * num.length);
        id += num[random];
    }
    return id;
}
let INR_BALANCES = {
    "probo": {
        balance: 0,
        locked: 0
    }
};
let STOCK_SYMBOL = {};
let STOCK_BALANCES = {
    "probo": {}
};
let ORDERBOOK = {};
app.post("/user/create/:userId", (req, res) => {
    const id = req.params.userId;
    const user = {
        balance: 0,
        locked: 0
    };
    INR_BALANCES[id] = user;
    STOCK_BALANCES[id] = {};
    console.log(INR_BALANCES);
    return res.json({
        message: "user created"
    });
});
app.post("/symbol/create/:stockSymbol", (req, res) => {
    const name = req.params.stockSymbol;
    STOCK_SYMBOL[name] = {
        "yes": 0,
        "no": 0
    };
    ORDERBOOK[name] = {};
    return res.json({
        ORDERBOOK
    });
});
app.get("/oderbook", (req, res) => {
    return res.send(ORDERBOOK);
});
app.get("/balances/inr", (req, res) => {
    return res.send(INR_BALANCES);
});
app.get("/balances/stock", (req, res) => {
    return res.send(STOCK_BALANCES);
});
app.post("/reset", (req, res) => {
    INR_BALANCES = {};
    ORDERBOOK = {};
    STOCK_BALANCES = {};
    return res.json({
        message: "stocks are reset"
    });
});
app.get("/balance/inr/:userId", (req, res) => {
    const id = req.params.userId;
    if (!INR_BALANCES[id]) {
        return res.json({
            message: "user not found"
        });
    }
    return res.json({
        balance: INR_BALANCES[id].balance
    });
});
app.post("/onramp/inr", (req, res) => {
    const value = req.body;
    const id = value.userId;
    const amount = value.amount;
    INR_BALANCES[id].balance += amount;
    return res.json({
        message: "money added"
    });
});
app.get("/balance/stock/:userId", (req, res) => {
    const id = req.params.userId;
    return res.send(STOCK_BALANCES[id]);
});
function buy(userId, stockSymbol, quantity, price, stockType) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ORDERBOOK[stockSymbol]) {
            if (ORDERBOOK[stockSymbol][stockType]) {
                if (ORDERBOOK[stockSymbol][stockType][price] && ORDERBOOK[stockSymbol][stockType][price].total >= quantity) {
                    if (!STOCK_BALANCES[userId]) {
                        STOCK_BALANCES[userId] = {};
                    }
                    if (!STOCK_BALANCES[userId][stockSymbol]) {
                        STOCK_BALANCES[userId][stockSymbol] = {};
                    }
                    if (stockType === "yes") {
                        if (!STOCK_BALANCES[userId][stockSymbol].yes) {
                            STOCK_BALANCES[userId][stockSymbol].yes = {
                                quantity: 0,
                                locked: 0
                            };
                        }
                        STOCK_BALANCES[userId][stockSymbol].yes.quantity += quantity;
                    }
                    else if (stockType === "no") {
                        if (!STOCK_BALANCES[userId][stockSymbol].no) {
                            STOCK_BALANCES[userId][stockSymbol].no = {
                                quantity: 0,
                                locked: 0
                            };
                        }
                        STOCK_BALANCES[userId][stockSymbol].no.quantity += quantity;
                    }
                    let remainingQuantity = quantity;
                    const orders = ORDERBOOK[stockSymbol][stockType][price].orders;
                    for (const user in orders) {
                        if (orders.hasOwnProperty(user)) {
                            const userQuantity = orders[user];
                            if (userQuantity >= remainingQuantity) {
                                orders[user] -= remainingQuantity;
                                ORDERBOOK[stockSymbol][stockType][price].total -= remainingQuantity;
                                if (!STOCK_BALANCES[user][stockSymbol]) {
                                    STOCK_BALANCES[user][stockSymbol] = {};
                                }
                                if (!STOCK_BALANCES[user][stockSymbol][stockType]) {
                                    STOCK_BALANCES[user][stockSymbol][stockType] = {
                                        quantity: 0,
                                        locked: 0
                                    };
                                }
                                STOCK_BALANCES[user][stockSymbol][stockType].locked -= remainingQuantity;
                                INR_BALANCES[user].balance += (remainingQuantity * price);
                                break;
                            }
                            else {
                                remainingQuantity -= userQuantity;
                                ORDERBOOK[stockSymbol][stockType][price].total -= userQuantity;
                                if (!STOCK_BALANCES[user][stockSymbol]) {
                                    STOCK_BALANCES[user][stockSymbol] = {};
                                }
                                if (!STOCK_BALANCES[user][stockSymbol][stockType]) {
                                    STOCK_BALANCES[user][stockSymbol][stockType] = {
                                        quantity: 0,
                                        locked: 0
                                    };
                                }
                                STOCK_BALANCES[user][stockSymbol][stockType].locked -= userQuantity;
                                INR_BALANCES[user].balance += (userQuantity * price);
                                orders[user] = 0;
                            }
                        }
                    }
                    INR_BALANCES[userId].balance -= (quantity * price);
                }
                else {
                    const altType = stockType === "yes" ? "no" : "yes";
                    const altPrice = 1000 - price;
                    sell(userId, stockSymbol, quantity, altPrice, altType);
                }
            }
            else {
                const altType = stockType === "yes" ? "no" : "yes";
                const altPrice = 1000 - price;
                sell(userId, stockSymbol, quantity, altPrice, altType);
            }
        }
    });
}
//probo sell
function sell(userId, stockSymbol, quantity, price, stockType) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ORDERBOOK[stockSymbol]) {
            if (!ORDERBOOK[stockSymbol][stockType]) {
                ORDERBOOK[stockSymbol][stockType] = {};
            }
            if (!ORDERBOOK[stockSymbol][stockType][price]) {
                ORDERBOOK[stockSymbol][stockType][price] = {
                    total: 0,
                    orders: {}
                };
            }
            ORDERBOOK[stockSymbol][stockType][price].total += quantity;
            if (!ORDERBOOK[stockSymbol][stockType][price].orders["probo"]) {
                ORDERBOOK[stockSymbol][stockType][price].orders["probo"] = 0;
            }
            ORDERBOOK[stockSymbol][stockType][price].orders["probo"] += quantity;
            if (!STOCK_BALANCES["probo"][stockSymbol]) {
                STOCK_BALANCES["probo"][stockSymbol] = {};
            }
            if (!STOCK_BALANCES["probo"][stockSymbol][stockType]) {
                STOCK_BALANCES["probo"][stockSymbol][stockType] = {
                    quantity: 0,
                    locked: 0
                };
            }
            STOCK_BALANCES["probo"][stockSymbol][stockType].locked += quantity;
            INR_BALANCES[userId].balance -= price;
            INR_BALANCES[userId].locked += price;
        }
    });
}
app.post("/order/buy", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const value = req.body;
    const userId = value.userId;
    const stockSymbol = value.stockSymbol;
    const quantity = value.quantity;
    const price = value.price;
    const stockType = value.stockType;
    if (INR_BALANCES[userId].balance < (quantity * price)) {
        return res.json({
            message: "insufficient balance"
        });
    }
    yield buy(userId, stockSymbol, quantity, price, stockType);
    return res.json({
        ORDERBOOK
    });
}));
app.post("/order/sell", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const value = req.body;
    const userId = value.userId;
    const stockSymbol = value.stockSymbol;
    const quantity = value.quantity;
    const price = value.price;
    const stockType = value.stockType;
    yield sell(userId, stockSymbol, quantity, price, stockType);
    return res.json({
        ORDERBOOK
    });
}));
app.get("/orderbook/:stockSymbol", (req, res) => {
    const stock = req.query.stockSymbol || "";
    return res.send(ORDERBOOK[stock.toString()]);
});
// app.get("/user/create/:userId",(req,res)=>{
//     const id=req.params.userId;
//     console.log(req.query.name);
//     console.log(id);
//     const uId=uniqueID();
//     console.log(uId);
// return res.json({
//     message:"faskdfn"
// })
// })
app.get("/", function (req, res) {
    return res.json({
        message: "sanjeev"
    });
});
