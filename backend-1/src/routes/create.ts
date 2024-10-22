import  express, { Request,Response }  from "express";
import { inr_balance, Orderbook, stock_balance } from "../schema";
import { buy } from "../Purchase";
import { sell } from "../sell";
const router =express.Router();
import { client } from "../redis";
export default router
//create user
router.post("/user/create/:userId",(req:Request,res:Response):any=>{
    const userId=req.params.userId;
    const user={
        balance:0,
        locked:0
    }
    inr_balance[userId]=user;
    stock_balance[userId]={};
    res.json({
        message:"user created"
    })
    return;
})

//create stockSymbol
router.post("/symbol/create/:stockSymbol",(req:Request,res:Response)=>{
    const stockSymbol=req.params.stockSymbol;
    Orderbook[stockSymbol]={
        "yes":{},
        "no":{}
    };

    res.json({
        message:"stock created"
    })
    return
})

//add money to user account
router.post("/onramp/inr",(req:Request,res:Response)=>{
    const value=req.body;
    const id=value.id;
    const amount=value.amount;
    const paise=amount *100;
    if(!inr_balance[id]){
        res.status(404).json({
            message:"user not found"
        })
        return 
    }
    inr_balance[id].balance+=paise;
    
    res.json({
        message:`${amount} added to your account`
    })
    return
})

//buy order place
router.post("/order/buy",async (req:Request,res:Response)=>{
    const value=req.body;

    const userId:string=value.userId;
    const stockSymbol:string=value.stockSymbol;
    const quantity:number=value.quantity;
    const price:number=value.price;
    const stockType: "yes" | "no" =value.stockType;

    if(!inr_balance[userId]){
        res.status(404).json({
            message:"user not found"
        })
        return
    }
    if(!Orderbook[stockSymbol]){
        res.status(404).json({
            message:"stock not found please try again later"
        })
        return
    }
    const message=buy(userId,stockSymbol,quantity,price,stockType);
    await client.lPush("change",JSON.stringify({stockSymbol:stockSymbol,orderbook:Orderbook[stockSymbol]}));

    res.json({
        message:message
    })
    return;
})

router.post("/order/sell",async (req:Request,res:Response)=>{
    const value=req.body;

    const userId:string=value.userId;
    const stockSymbol:string=value.stockSymbol;
    const quantity:number=value.quantity;
    const price:number=value.price;
    const stockType: "yes" | "no" =value.stockType;

    if(!inr_balance[userId]){
        res.status(404).json({
            message:"user not found"
        })
        return
    }
    if(!Orderbook[stockSymbol]){
        res.status(404).json({
            message:"stock not found please try again later"
        })
        return
    }
    const message=sell(userId,stockSymbol,quantity,price,stockType);
    await client.lPush("change",JSON.stringify({stockSymbol:stockSymbol,orderbook:Orderbook[stockSymbol]}));

    res.json({
        message:message
    })
    return;
    
})