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
exports.generate = generate;
exports.queue = queue;
const start_1 = require("./redis.ts/start");
function generate() {
    let num = "";
    const alpha = "ABCDEFGHIJKLMNOPQRSTUVQXYZ";
    for (let i = 0; i < 5; i++) {
        const n = Math.floor(Math.random() * 10);
        num += n;
        const char = alpha.charAt(Math.floor(Math.random() * alpha.length));
        num += char;
    }
    return num;
}
function queue(endpoint, data, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const message = {
            endpoint: endpoint,
            data: data,
            id: id
        };
        console.log(endpoint);
        yield start_1.client.lPush("endpoint", JSON.stringify(message));
    });
}
