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
            const stockName = receivedmsg.stockSymbol || receivedmsg.stockName;
            const eventType = receivedmsg.type || receivedmsg.eventType;
            if (eventType === "subscribe") {
                console.log("subscribed to", stockName);
                if (!subscribedFolks[stockName]) {
                    subscribedFolks[stockName] = new Set();
                    // Subscribe to Redis channel only once per stock
                    yield subscriber.subscribe(stockName, (message) => {
                        console.log("redis message for", stockName);
                        if (subscribedFolks[stockName]) {
                            subscribedFolks[stockName].forEach(client => {
                                if (client.readyState === ws_1.WebSocket.OPEN) {
                                    try {
                                        client.send(message);
                                    }
                                    catch (err) {
                                        console.error("Failed to send to client:", err);
                                    }
                                }
                            });
                        }
                    });
                }
                subscribedFolks[stockName].add(socket);
            }
            else if (eventType === "unsubscribe") {
                if (subscribedFolks[stockName] && subscribedFolks[stockName].has(socket)) {
                    console.log("unsubscribe from", stockName);
                    subscribedFolks[stockName].delete(socket);
                    if (subscribedFolks[stockName].size === 0) {
                        subscriber.unsubscribe(stockName);
                        delete subscribedFolks[stockName];
                    }
                }
            }
        });
    });
    socket.send("connection established");
    socket.on("close", () => {
        // Clean up this socket from all subscriptions
        for (const stockName in subscribedFolks) {
            if (subscribedFolks[stockName].has(socket)) {
                subscribedFolks[stockName].delete(socket);
                if (subscribedFolks[stockName].size === 0) {
                    subscriber.unsubscribe(stockName);
                    delete subscribedFolks[stockName];
                }
            }
        }
    });
});
