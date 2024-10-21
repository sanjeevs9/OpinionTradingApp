"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sell = sell;
exports.transaction = transaction;
const Purchase_1 = require("./Purchase");
const schema_1 = require("./schema");
const schema_2 = require("./schema");
function sell(userId, stockSymbol, quantity, price, stockType) {
    let message = "your stocks are sold";
    const altType = stockType === "yes" ? "no" : "yes";
    const altPrice = 1000 - price;
    const obj = schema_1.Orderbook[stockSymbol][altType];
    const keys = Object.keys(obj);
    //no sell order directly no alt buy order present
    if (keys.length === 0) {
        (0, Purchase_1.createOrder)(userId, stockSymbol, quantity, price, stockType, "sell");
        schema_1.stock_balance[userId][stockSymbol][stockType].locked += quantity;
        message = "bid submitted";
        return message;
    }
    const minPrice = Number(keys[0]);
    //create sell order directly no alt buy order of same price is present 
    if (minPrice > altPrice) {
        (0, Purchase_1.createOrder)(userId, stockSymbol, quantity, price, stockType, "sell");
        schema_1.stock_balance[userId][stockSymbol][stockType].locked += quantity;
        message = "bid submitted";
        return message;
    }
    let remainingQuantity = quantity;
    for (let key in obj) {
        const value = Number(key);
        if (remainingQuantity === 0) {
            break;
        }
        if (value >= altPrice && remainingQuantity != 0) {
            const orders = obj[value].orders;
            while (orders.length != 0) {
                const Seller = orders[0].user;
                const SellerType = orders[0].type;
                const sellerQuantity = orders[0].quantity;
                if (sellerQuantity >= remainingQuantity) {
                    transaction(userId, Seller, SellerType, remainingQuantity, value, altType, stockSymbol, stockType);
                    if (orders[0].quantity === 0) {
                        orders.shift();
                    }
                    remainingQuantity = 0;
                    break;
                }
                else {
                    transaction(userId, Seller, SellerType, sellerQuantity, value, altType, stockSymbol, stockType);
                    schema_1.Orderbook[stockSymbol][altType][value].orders.shift();
                    remainingQuantity -= sellerQuantity;
                }
            }
        }
    }
    if (remainingQuantity !== 0) {
        (0, Purchase_1.createOrder)(userId, stockSymbol, remainingQuantity, price, stockType, "sell");
        message = `${quantity - remainingQuantity} sold  and ${remainingQuantity} bid is submitted`;
        return message;
    }
    return message;
}
function transaction(userId, sellerId, SellerType, quantity, price, stockType, stockSymbol, altType) {
    schema_1.Orderbook[stockSymbol][stockType][price].total -= quantity;
    schema_1.Orderbook[stockSymbol][stockType][price].orders[0].quantity -= quantity;
    if (SellerType === "buy") {
        //seller case
        const lockedMoney = (1000 - price) * quantity;
        schema_2.inr_balance["probo"].balance += lockedMoney;
        schema_2.inr_balance[sellerId].locked -= lockedMoney;
        if (!schema_1.stock_balance[sellerId]) {
            schema_1.stock_balance[sellerId] = {};
        }
        if (!schema_1.stock_balance[sellerId][stockSymbol]) {
            schema_1.stock_balance[sellerId][stockSymbol] = {
                "yes": {
                    quantity: 0,
                    locked: 0
                },
                "no": {
                    quantity: 0,
                    locked: 0
                }
            };
        }
        schema_1.stock_balance[sellerId][stockSymbol][altType].quantity += quantity;
        //buyer case
        if (!schema_1.stock_balance[userId]) {
            schema_1.stock_balance[userId] = {};
        }
        if (!schema_1.stock_balance[userId][stockSymbol]) {
            schema_1.stock_balance[userId][stockSymbol] = {
                "yes": {
                    quantity: 0,
                    locked: 0
                },
                "no": {
                    quantity: 0,
                    locked: 0
                }
            };
        }
        schema_1.stock_balance[userId][stockSymbol][altType].quantity -= quantity;
        schema_2.inr_balance[userId].balance += price * quantity;
    }
    else {
        //seller case
        if (!schema_1.stock_balance[sellerId][stockSymbol]) {
            schema_1.stock_balance[sellerId][stockSymbol] = {
                "yes": {
                    quantity: 0,
                    locked: 0
                },
                "no": {
                    quantity: 0,
                    locked: 0
                }
            };
        }
        schema_1.stock_balance[sellerId][stockSymbol][altType].locked -= quantity;
        schema_2.inr_balance[sellerId].balance += price * quantity;
        //buyer case
        if (!schema_1.stock_balance[userId][stockSymbol]) {
            schema_1.stock_balance[userId][stockSymbol] = {
                "yes": {
                    quantity: 0,
                    locked: 0
                },
                "no": {
                    quantity: 0,
                    locked: 0
                }
            };
        }
        schema_1.stock_balance[userId][stockSymbol][altType].quantity -= quantity;
        schema_2.inr_balance[userId].balance += price * quantity;
    }
}
