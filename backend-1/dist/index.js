"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const {router}=require("../src/routes/index.ts")
const routes_1 = require("./routes");
const cors_1 = __importDefault(require("cors"));
const redis_1 = __importDefault(require("./redis"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
//call redis function 
(0, redis_1.default)();
app.get("/", (req, res) => {
    res.json({
        message: "hi form backend"
    });
    return;
});
//test redis
app.use("/", routes_1.router);
app.listen(PORT, () => {
    console.log(`Backend is up and working on PORT${PORT}`);
});
