import { Request, Response } from "express";
import { inr_balance, Orderbook, stock_balance } from "../schema";

const express=require("express");
const router=express.Router();
export default router; 

router.get("/orderbook",(req:Request,res:Response)=>{
    return res.send(Orderbook);
})
router.get("/balances/inr",(req:Request,res:Response)=>{
    return res.send(inr_balance)
})
router.get("/balances/stock",(req:Request,res:Response)=>{
    return res.send(stock_balance)
})
router.get("/balance/inr/:userId",(req:Request,res:Response)=>{
    const userId=req.params.userId;

    if(!inr_balance[userId]){
        return res.status(404).json({
            message:"user not found"
        })
    }
    console.log(userId)
    let balance=inr_balance[userId].balance;
    balance=balance/100;
    console.log(balance)

    return res.json({message:balance});

    
})
router.get("/balance/stock/:userId",(req:Request,res:Response)=>{
    const id=req.params.userId;
    if(!stock_balance[id]){
        return res.status(404).json({
            message:"user has no stocks"
        })
    }
    console.log(id)
    return res.send (stock_balance[id])
})
router.get("/orderbook/:stockSymbol",(req:Request,res:Response)=>{
    const stockSymbol=req.params.stockSymbol;
    
    if(!Orderbook[stockSymbol]){
        return res.status(404).json({
            message:"stock not found"
        })
    }
    return res.send(Orderbook[stockSymbol]);
})



router.post("/reset",(req:Request,res:Response)=>{
    for (const key in inr_balance) {
       delete inr_balance[key];
    }
    for(const key in Orderbook){
        delete Orderbook[key];
    }
    for (const key in stock_balance) {
       delete stock_balance[key];
    }
})