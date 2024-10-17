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
const ws_1 = require("ws");
const redis_1 = require("redis");
const client = (0, redis_1.createClient)();
const wss = new ws_1.WebSocketServer({ port: 8080 });
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            console.log("redis websocket connected");
            while (true) {
                try {
                    const value = yield client.brPop("submission", 0);
                    console.log(value);
                }
                catch (err) {
                    console.log(err);
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    });
}
start();
wss.on("connection", function connection(socket) {
    socket.on("message", function message(data) {
        console.log({ data });
    });
    socket.send("connection established");
});
