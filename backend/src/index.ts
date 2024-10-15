const express =require("express");
const app=express();
import { Request,Response } from "express";

interface user{
    balance:Number,
    locked:Number
}

interface inr_balance{
    [userid:string]:user
}


function uniqueID(){
    const num=[1,2,3,4,5];
    let id="";
    for(let i=0;i<4;i++){
        const random=Math.floor(Math.random()*num.length);
        id+=num[random];
    }
    return id;
  }

let INR_BALANCES:inr_balance={};

 

  let ORDERBOOK:any = {
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
             "no": {
             
             }
    }
 }
 
 let STOCK_BALANCES:any = {
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
}

app.post("/user/create/:userId",(req:Request,res:Response)=>{
    const id=req.params.userId;
    const user:user={
            balance:0,
            locked:0
    }
    INR_BALANCES[id]=user;
   
    console.log(INR_BALANCES)
    return res.json({
        message:"user created"
    })
})

app.get("/oderbook",(res:Response)=>{
    return ORDERBOOK;
})

app.get("/balanve/inr",(res:Response)=>{
    return INR_BALANCES;
})

app.get("/balances/stock",(res:Response)=>{
    return STOCK_BALANCES;
})

app.post("/reset",(res:Response)=>{
    INR_BALANCES={};
    ORDERBOOK={};
    STOCK_BALANCES={};

})


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





app.get("/",function(req:Request,res:Response){
    return res.json({
        message:"sanjeev"
    })
});

app.listen(3000,()=>{
    console.log("backend connected");
});