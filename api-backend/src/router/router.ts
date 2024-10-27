import express, { json, Request, response, Response } from "express";
import {client,subscriber,publisher} from "../redis.ts/start";
import { generate, queue } from "../functions";

const router=express.Router();
export default router

router.get("/orderbook", async (req:Request,res:Response)=>{
    const id=generate();
  console.log(id);
  
    queue("/orderbook",{},id)

    await subscriber.subscribe(`${id}`,(message:string)=>{      
        const value=JSON.parse(message);  
        res.send(value);
        return;
    });
})

router.get("/balances/inr", async (req:Request,res:Response)=>{
    const id=generate();

    queue("/balances/inr",{},id);

    await subscriber.subscribe(id,(message:any)=>{
        const value=JSON.parse(message);
        res.send(value);
        return 
    })
})
router.get("/balances/stock",async (req:Request,res:Response)=>{
    const id=generate();
    queue("/balances/stock",{},id);
    await subscriber.subscribe(id,(message:any)=>{
        const value=JSON.parse(message);
        res.send(value);
        return;
    })
     
})
router.get("/balance/inr/:userId",async (req:Request,res:Response)=>{
    const userId=req.params.userId;
    const id=generate();
    const data={
        userId:userId
    }
    console.log(data);

    await subscriber.subscribe(id,(message:any)=>{

        const value=JSON.parse(message);
        console.log(value);
        
        res.json({
            message:value
        })
        return 
    });
    queue("/balance/inr/:userId",data,id);
    
})

router.get("/balance/stock/:userId",async (req:Request,res:Response)=>{
    const userId=req.params.userId;
    const data={
        userId:userId
    }
    const id=generate();
    queue("/balance/stock/:userId",data,id);
    subscriber.subscribe(id,(message:any)=>{
        const value=JSON.parse(message);
        res.json({message:value});
        return 
    })
     
})
router.get("/orderbook/:stockSymbol",async (req:Request,res:Response)=>{
    const stockSymbol=req.params.stockSymbol;
    const id=generate();
    const data={
        stockSymbol
    }
    
    queue("/orderbook/:stockSymbol",data,id);

    await subscriber.subscribe(id,(message:any)=>{
        const value=JSON.parse(message)
        res.send(value)
        return 
    })
})



