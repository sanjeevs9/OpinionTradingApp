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
// let STOCK_SYMBOL:stock={}
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
    return res.json({
        message: "user created"
    });
});
app.post("/symbol/create/:stockSymbol", (req, res) => {
    const name = req.params.stockSymbol;
    // STOCK_SYMBOL[name]={
    //     "yes":0,
    //     "no":0
    // }
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
        message: "games are reset"
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
    if (!INR_BALANCES[id]) {
        return res.status(404).json({
            message: "user not found"
        });
    }
    INR_BALANCES[id].balance += amount;
    return res.json({
        message: "money added"
    });
});
app.get("/balance/stock/:userId", (req, res) => {
    const id = req.params.userId;
    if (!STOCK_BALANCES[id]) {
        return res.status(404).json({
            message: "user has no stocks"
        });
    }
    return res.send(STOCK_BALANCES[id]);
});
app.post("/order/buy", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const value = req.body;
    const userId = value.userId;
    const stockSymbol = value.stockSymbol;
    const quantity = value.quantity;
    const price = value.price;
    const stockType = value.stockType;
    if (!INR_BALANCES[userId]) {
        return res.status(404).json({
            message: "user not found"
        });
    }
    if (INR_BALANCES[userId].balance < (quantity * price)) {
        return res.json({
            message: "insufficient balance"
        });
    }
    if (!ORDERBOOK[stockSymbol]) {
        return res.status(404).json({
            message: "stock not found"
        });
    }
    try {
        yield buy(userId, stockSymbol, quantity, price, stockType);
        return res.json({
            ORDERBOOK
        });
    }
    catch (err) {
        return res.status(404).send(err);
    }
}));
app.post("/order/sell", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const value = req.body;
    const userId = value.userId;
    const stockSymbol = value.stockSymbol;
    const quantity = value.quantity;
    const price = value.price;
    const stockType = value.stockType;
    // await sell(userId,stockSymbol,quantity,price,stockType);
    return res.json({
        ORDERBOOK
    });
}));
app.get("/orderbook/:stockSymbol", (req, res) => {
    const stock = req.params.stockSymbol;
    if (!ORDERBOOK[stock]) {
        return res.status(404).json({
            message: "order book not found"
        });
    }
    return res.send(ORDERBOOK[stock]);
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
function buy(userId, stockSymbol, quantity, price, stockType) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ORDERBOOK[stockSymbol]) {
            if (ORDERBOOK[stockSymbol][stockType]) {
                if (ORDERBOOK[stockSymbol][stockType][price] && ORDERBOOK[stockSymbol][stockType][price].total >= quantity) {
                    if (!STOCK_BALANCES[userId][stockSymbol]) {
                        STOCK_BALANCES[userId][stockSymbol] = {
                            yes: {
                                quantity: 0,
                                locked: 0
                            },
                            no: {
                                quantity: 0,
                                locked: 0
                            }
                        };
                    }
                    if (stockType === "yes") {
                        STOCK_BALANCES[userId][stockSymbol].yes.quantity += quantity;
                    }
                    else if (stockType === "no") {
                        STOCK_BALANCES[userId][stockSymbol].no.quantity += quantity;
                    }
                    let remainingQuantity = quantity;
                    const orders = ORDERBOOK[stockSymbol][stockType][price].orders;
                    const prevKey = ORDERBOOK[stockSymbol][stockType][price].prevKey;
                    let key = prevKey + 1;
                    while (orders[key] && remainingQuantity != 0) {
                        const type = ORDERBOOK[stockSymbol][stockType][price].orders[key].type;
                        const userQuantity = ORDERBOOK[stockSymbol][stockType][price].orders[key].quantity;
                        const user = ORDERBOOK[stockSymbol][stockType][price].orders[key].user;
                        if (userQuantity >= remainingQuantity) {
                            //decrease quantity
                            ORDERBOOK[stockSymbol][stockType][price].orders[key].quantity -= remainingQuantity;
                            ORDERBOOK[stockSymbol][stockType][price].total -= remainingQuantity;
                            STOCK_BALANCES[user][stockSymbol][stockType].locked -= remainingQuantity;
                            //add money to probo
                            if (type === "sell") {
                                INR_BALANCES[user].balance += (remainingQuantity * price);
                            }
                            ORDERBOOK[stockSymbol][stockType][price].prevKey++;
                            break;
                        }
                        else {
                            remainingQuantity -= userQuantity;
                            ORDERBOOK[stockSymbol][stockType][price].total -= userQuantity;
                            STOCK_BALANCES[user][stockSymbol][stockType].locked -= userQuantity;
                            if (type === "sell") {
                                INR_BALANCES[user].balance += (userQuantity * price);
                            }
                            delete orders[key];
                        }
                        key++;
                    }
                    INR_BALANCES[userId].balance -= (quantity * price);
                }
                else {
                    //same as below function call
                    const altType = stockType === "yes" ? "no" : "yes";
                    INR_BALANCES[userId].balance -= price;
                    INR_BALANCES[userId].locked += price;
                    const altPrice = 1000 - price;
                    BuySell(userId, stockSymbol, quantity, altPrice, altType, "buy");
                }
            }
            else {
                // stock type is not available-->sell the stock function -->  for alt stock but the type will be buyonly and when the type is buy add money of that stock to probo account
                const altType = stockType === "yes" ? "no" : "yes";
                INR_BALANCES[userId].balance -= price;
                INR_BALANCES[userId].locked += price;
                const altPrice = 1000 - price;
                BuySell(userId, stockSymbol, quantity, altPrice, altType, "buy");
            }
        }
    });
}
//probo sell
function BuySell(userId, stockSymbol, quantity, price, stockType, type) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ORDERBOOK[stockSymbol]) {
            if (!ORDERBOOK[stockSymbol][stockType]) {
                ORDERBOOK[stockSymbol][stockType] = {};
            }
            if (!ORDERBOOK[stockSymbol][stockType][price]) {
                ORDERBOOK[stockSymbol][stockType][price] = {
                    total: 0,
                    prevKey: 0,
                    orders: {}
                };
            }
            STOCK_BALANCES[userId][stockSymbol][stockType].locked += quantity;
            let prevKey = ORDERBOOK[stockSymbol][stockType][price].prevKey;
            const key = prevKey + 1;
            ORDERBOOK[stockSymbol][stockType][price].orders[key] = {
                user: userId,
                type,
                quantity
            };
            ORDERBOOK[stockSymbol][stockType][price].total += quantity;
        }
    });
}
//normal
function sell(userId, stockSymbol, quantity, price, stockType) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ORDERBOOK[stockSymbol]) {
            const STOCK_TYPE = stockType === "yes" ? "no" : "yes";
            const PRICE = 10 - price;
            if (ORDERBOOK[stockSymbol][STOCK_TYPE]) {
                if (ORDERBOOK[stockSymbol][STOCK_TYPE][PRICE] && ORDERBOOK[stockSymbol][STOCK_TYPE][PRICE].total < quantity) {
                    //buy that stock there from probo account 
                    ProboBuy(userId, stockSymbol, quantity, PRICE, STOCK_TYPE);
                    INR_BALANCES[userId].balance += (quantity * price);
                    STOCK_BALANCES[userId][stockSymbol][stockType].quantity -= quantity;
                    INR_BALANCES["probo"].balance -= (quantity * price);
                }
                else {
                    //same as below
                    if (!ORDERBOOK[stockSymbol][STOCK_TYPE]) {
                        ORDERBOOK[stockSymbol][STOCK_TYPE] = {};
                    }
                    if (!ORDERBOOK[stockSymbol][STOCK_TYPE][PRICE]) {
                        ORDERBOOK[stockSymbol][STOCK_TYPE][PRICE] = {
                            total: 0,
                            prevKey: -1,
                            orders: {}
                        };
                    }
                    const key = ORDERBOOK[stockSymbol][STOCK_TYPE][PRICE].prevKey++;
                    ORDERBOOK[stockSymbol][STOCK_TYPE][PRICE].orders = {
                        [key]: {
                            user: userId,
                            type: "buy",
                            quantity
                        }
                    };
                }
            }
            else {
                //create sell order on the opposite side with 10-price and typeOfOrder="Sell"
                if (!ORDERBOOK[stockSymbol][STOCK_TYPE]) {
                    ORDERBOOK[stockSymbol][STOCK_TYPE] = {};
                }
                if (!ORDERBOOK[stockSymbol][STOCK_TYPE][PRICE]) {
                    ORDERBOOK[stockSymbol][STOCK_TYPE][PRICE] = {
                        total: 0,
                        prevKey: -1,
                        orders: {}
                    };
                }
                const key = ORDERBOOK[stockSymbol][STOCK_TYPE][PRICE].prevKey++;
                ORDERBOOK[stockSymbol][STOCK_TYPE][PRICE].orders = {
                    [key]: {
                        user: userId,
                        type: "buy",
                        quantity
                    }
                };
            }
        }
    });
}
//probo buy
function ProboBuy(userId, stockSymbol, quantity, price, stockType) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ORDERBOOK[stockSymbol]) {
            if (ORDERBOOK[stockSymbol][stockType]) {
                const prevKey = ORDERBOOK[stockSymbol][stockType][price].prevKey;
                const orders = ORDERBOOK[stockSymbol][stockType][price].orders;
                let key = prevKey + 1;
                let remainingQuantity = quantity;
                while (orders[key] && remainingQuantity != 0) {
                    const userQuantity = orders[key].quantity;
                    const type = orders[key].type;
                    const sellUser = orders[key].user;
                    if (userQuantity >= remainingQuantity) {
                        //buy all stocks from probo account
                        orders[key].quantity -= remainingQuantity;
                        if (type === "sell") {
                            INR_BALANCES[sellUser].balance += (remainingQuantity * price);
                        }
                        STOCK_BALANCES[sellUser][stockSymbol][stockType].locked -= remainingQuantity;
                        ORDERBOOK[stockSymbol][stockType][price].total -= remainingQuantity;
                        ORDERBOOK[stockSymbol][stockType][price].prevKey++;
                        break;
                    }
                    else {
                        remainingQuantity -= userQuantity;
                        if (type === "sell") {
                            INR_BALANCES[sellUser].balance += (userQuantity * price);
                        }
                        STOCK_BALANCES[sellUser][stockSymbol][stockType].locked -= userQuantity;
                        delete orders[key];
                        ORDERBOOK[stockSymbol][stockType][price].prevKey = key + 1;
                        key++;
                    }
                }
            }
        }
    });
}
