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
const start_1 = require("../redis.ts/start");
const functions_1 = require("../functions");
const router = express_1.default.Router();
exports.default = router;
router.get("/orderbook", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = (0, functions_1.generate)();
    console.log(id);
    (0, functions_1.queue)("/orderbook", {}, id);
    yield start_1.subscriber.subscribe(`${id}`, (message) => {
        const value = JSON.parse(message);
        res.send(value);
        return;
    });
}));
router.get("/balances/inr", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = (0, functions_1.generate)();
    (0, functions_1.queue)("/balances/inr", {}, id);
    yield start_1.subscriber.subscribe(id, (message) => {
        const value = JSON.parse(message);
        res.send(value);
        return;
    });
}));
router.get("/balances/stock", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = (0, functions_1.generate)();
    (0, functions_1.queue)("/balances/stock", {}, id);
    yield start_1.subscriber.subscribe(id, (message) => {
        const value = JSON.parse(message);
        res.send(value);
        return;
    });
}));
router.get("/balance/inr/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const id = (0, functions_1.generate)();
    const data = {
        userId: userId
    };
    console.log(data);
    yield start_1.subscriber.subscribe(id, (message) => {
        const value = JSON.parse(message);
        console.log(value);
        res.json({
            message: value
        });
        return;
    });
    (0, functions_1.queue)("/balance/inr/:userId", data, id);
}));
router.get("/balance/stock/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const data = {
        userId: userId
    };
    const id = (0, functions_1.generate)();
    (0, functions_1.queue)("/balance/stock/:userId", data, id);
    start_1.subscriber.subscribe(id, (message) => {
        const value = JSON.parse(message);
        res.json({ message: value });
        return;
    });
}));
router.get("/orderbook/:stockSymbol", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const stockSymbol = req.params.stockSymbol;
    const id = (0, functions_1.generate)();
    const data = {
        stockSymbol
    };
    (0, functions_1.queue)("/orderbook/:stockSymbol", data, id);
    yield start_1.subscriber.subscribe(id, (message) => {
        const value = JSON.parse(message);
        res.send(value);
        return;
    });
}));
