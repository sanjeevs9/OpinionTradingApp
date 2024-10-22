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
const subscriber = (0, redis_1.createClient)();
subscriber.connect();
const wss = new ws_1.WebSocketServer({ port: 8080 });
const subscribedFolks = {};
wss.on("connection", function connection(socket) {
    socket.on("message", function message(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(data.toString());
            const receivedmsg = JSON.parse(data.toString());
            const { stockName, eventType } = receivedmsg;
            socket.send(data.toString());
            if (eventType === "subscribe") {
                console.log("subscribed");
                if (!subscribedFolks[stockName]) {
                    subscribedFolks[stockName] = new Set();
                }
                subscribedFolks[stockName].add(socket);
                console.log(stockName);
                yield subscriber.subscribe(stockName, (message) => {
                    console.log(message);
                    if (subscribedFolks[stockName]) {
                        subscribedFolks[stockName].forEach(client => {
                            if (client.readyState === ws_1.WebSocket.OPEN) {
                                client.send(message);
                            }
                        });
                    }
                });
            }
            else if (eventType === "unsubscribe") {
                if (subscribedFolks[stockName] && subscribedFolks[stockName].has(socket)) {
                    console.log("unsubscribe");
                    subscribedFolks[stockName].delete(socket);
                }
            }
        });
    });
    socket.send("connection established");
    socket.on("close", () => {
        socket.send("connection lost");
    });
});
