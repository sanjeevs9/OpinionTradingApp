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
const schema_1 = require("./schema");
const start_1 = require("./start");
(0, start_1.start)();
function check() {
    return __awaiter(this, void 0, void 0, function* () {
        while (true) {
            try {
                let data = yield start_1.client.brPop("endpoint", 0);
                const key = data.key;
                const element = JSON.parse(data.element);
                const endpoint = element.endpoint;
                const value = element.data;
                yield start_1.publisher.publish("result", JSON.stringify(schema_1.inr_balance));
            }
            catch (err) {
                console.log(err);
            }
        }
    });
}
check();
