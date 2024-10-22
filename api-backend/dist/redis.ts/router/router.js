"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const start_1 = __importDefault(require("../start"));
const router = express_1.default.Router();
exports.default = router;
router.get("/orderbook", (req, res) => {
    const endpoint = {
        endpoint: "/orderbook",
        data: {}
    };
    start_1.default.lPush("endpoint", JSON.stringify(endpoint));
    start_1.default.subscribe("result", (message) => {
        const data = JSON.parse(message);
        res.send(data);
    });
    return;
});
// router.get("/balances/inr",(req:Request,res:Response)=>{
//     res.send(inr_balance)
//     return 
// })
// router.get("/balances/stock",(req:Request,res:Response)=>{
//      res.send(stock_balance)
//      return
// })
// router.get("/balance/inr/:userId",(req:Request,res:Response)=>{
//     const userId=req.params.userId;
//     if(!inr_balance[userId]){
//          res.status(404).json({
//             message:"user not found"
//         })
//         return 
//     }
//     console.log(userId)
//     let balance=inr_balance[userId].balance;
//     balance=balance/100;
//     console.log(balance)
//      res.json({message:balance});
//      return 
// })
// router.get("/balance/stock/:userId",(req:Request,res:Response)=>{
//     const id=req.params.userId;
//     if(!stock_balance[id]){
//          res.status(404).json({
//             message:"user has no stocks"
//         })
//         return 
//     }
//     console.log(id)
//      res.send (stock_balance[id])
//      return 
// })
// router.get("/orderbook/:stockSymbol",(req:Request,res:Response)=>{
//     const stockSymbol=req.params.stockSymbol;
//     if(!Orderbook[stockSymbol]){
//         res.status(404).json({
//             message:"stock not found"
//         })
//         return 
//     }
//      res.send(Orderbook[stockSymbol]);
//      return 
// })
