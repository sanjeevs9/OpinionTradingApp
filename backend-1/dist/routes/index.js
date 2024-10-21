"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
exports.router = express_1.default.Router();
const GET_1 = __importDefault(require("../routes/GET"));
const create_1 = __importDefault(require("../routes/create"));
//get routes
exports.router.use("/", GET_1.default);
exports.router.use("/", create_1.default);
