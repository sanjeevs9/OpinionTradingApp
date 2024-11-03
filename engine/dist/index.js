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
const action_1 = require("./actions.ts/action");
const publihser_1 = __importDefault(require("./publihser"));
const schema_1 = require("./schema");
const start_1 = require("./start");
start();
function check() {
    return __awaiter(this, void 0, void 0, function* () {
        while (true) {
            try {
                let value = yield start_1.client.brPop("endpoint", 0);
                const key = value.key; //endpoint
                const element = JSON.parse(value.element);
                console.log(value.element);
                console.log(element);
                const endpoint = element.endpoint;
                const data = element.data;
                const id = element.id;
                console.log(endpoint);
                switch (endpoint) {
                    case "/orderbook":
                        (0, publihser_1.default)(id, JSON.stringify(schema_1.Orderbook));
                        break;
                    case "/balances/inr":
                        (0, publihser_1.default)(id, JSON.stringify(schema_1.inr_balance));
                        break;
                    case "/balances/stock":
                        (0, publihser_1.default)(id, JSON.stringify(schema_1.stock_balance));
                        break;
                    case "/balance/inr/:userId":
                        (0, action_1.getBalance)(id, data);
                        break;
                    case "/balance/stock/:userId":
                        (0, action_1.getStock)(id, data);
                        break;
                    case "/orderbook/:stockSymbol":
                        (0, action_1.getOrderbook)(id, data);
                        break;
                    case "/reset":
                        (0, action_1.reset)(id);
                        break;
                    case "/user/create/:userId":
                        (0, action_1.createUser)(id, data);
                        break;
                    case "/symbol/create/:stockSymbol":
                        (0, action_1.createStock)(id, data);
                        break;
                    case "/onramp/inr":
                        (0, action_1.addMoney)(id, data);
                        break;
                    case "/order/buy":
                        (0, action_1.buyStock)(id, data);
                        break;
                    case "/order/sell":
                        (0, action_1.sellStock)(id, data);
                        break;
                }
            }
            catch (err) {
                console.log(err);
            }
        }
    });
}
check();
