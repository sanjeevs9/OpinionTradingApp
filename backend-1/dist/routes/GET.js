"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("../schema");
const express = require("express");
const router = express.Router();
exports.default = router;
router.get("/orderbook", (req, res) => {
    return res.send(schema_1.Orderbook);
});
router.get("/balances/inr", (req, res) => {
    return res.send(schema_1.inr_balance);
});
router.get("/balances/stock", (req, res) => {
    return res.send(schema_1.stock_balance);
});
router.get("/balance/inr/:userId", (req, res) => {
    const userId = req.params.userId;
    if (!schema_1.inr_balance[userId]) {
        return res.status(404).json({
            message: "user not found"
        });
    }
    console.log(userId);
    let balance = schema_1.inr_balance[userId].balance;
    balance = balance / 100;
    console.log(balance);
    return res.json({ message: balance });
});
router.get("/balance/stock/:userId", (req, res) => {
    const id = req.params.userId;
    if (!schema_1.stock_balance[id]) {
        return res.status(404).json({
            message: "user has no stocks"
        });
    }
    console.log(id);
    return res.send(schema_1.stock_balance[id]);
});
router.get("/orderbook/:stockSymbol", (req, res) => {
    const stockSymbol = req.params.stockSymbol;
    if (!schema_1.Orderbook[stockSymbol]) {
        return res.status(404).json({
            message: "stock not found"
        });
    }
    return res.send(schema_1.Orderbook[stockSymbol]);
});
router.post("/reset", (req, res) => {
    for (const key in schema_1.inr_balance) {
        delete schema_1.inr_balance[key];
    }
    for (const key in schema_1.Orderbook) {
        delete schema_1.Orderbook[key];
    }
    for (const key in schema_1.stock_balance) {
        delete schema_1.stock_balance[key];
    }
});
