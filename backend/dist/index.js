"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
function uniqueID() {
    const num = [1, 2, 3, 4, 5];
    let id = "";
    for (let i = 0; i < 4; i++) {
        const random = Math.floor(Math.random() * num.length);
        id += num[random];
    }
    return id;
}
const INR_BALANCES = {};
const ORDERBOOK = {
    "BTC_USDT_10_Oct_2024_9_30": {
        "yes": {
            "9.5": {
                "total": 12,
                orders: {
                    "user1": 2,
                    "user2": 10
                }
            },
            "8.5": {
                "total": 12,
                "orders": {
                    "user1": 3,
                    "user2": 3,
                    "user3": 6
                }
            },
        },
        "no": {}
    }
};
const STOCK_BALANCES = {
    user1: {
        "BTC_USDT_10_Oct_2024_9_30": {
            "yes": {
                "quantity": 1,
                "locked": 0
            }
        }
    },
    user2: {
        "BTC_USDT_10_Oct_2024_9_30": {
            "no": {
                "quantity": 3,
                "locked": 4
            }
        }
    }
};
app.post("/user/create/:userId", (req, res) => {
    const id = req.params.userId;
    const user = {
        balance: 0,
        locked: 0
    };
    INR_BALANCES[id] = user;
    console.log(INR_BALANCES);
    return res.json({
        balance: INR_BALANCES
    });
});
// app.get("/user/create/:userId",(req,res)=>{
//     const id=req.params.userId;
//     console.log(req.query.name);
//     console.log(id);
//     const uId=uniqueID();
//     console.log(uId);
// return res.json({
//     message:"faskdfn"
// })
// })
app.get("/", function (req, res) {
    return res.json({
        message: "sanjeev"
    });
});
app.listen(3000, () => {
    console.log("backend connected");
});
