"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./router/router"));
const start_1 = require("./redis.ts/start");
const post_1 = __importDefault(require("./router/post"));
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json());
(0, start_1.start)();
app.use("/", router_1.default);
app.use("/", post_1.default);
app.listen(PORT, () => {
    console.log(`backend connected on ${PORT}`);
});
