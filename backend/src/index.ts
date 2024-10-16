const express =require("express");
const app=express();
import { Request,Response } from "express";

app.use(express.json());

interface user{
    balance:number,
    locked:number
}

interface inr_balance{
    [userid:string]:user
}

interface stock{
    [name:string]:{
        yes:number,
        no:number
    }
}

interface stock_balance{
    [userid:string]:{
        [name:string]:{
            yes?:{
                quantity:number,
                locked:number
            },
            no?:{
                quantity:number,
                locked:number
            }
        }
    }
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

  interface orderbook{
    [name:string]:{
        "yes"?:{
            [price:number]:{
                total:number,
                orders:{[user:string]:number}
            }
        };
        "no"?:{
            [price:number]:{
                total:number,
                orders:{[user:string]:number}
            }
        }
    }
  }

let INR_BALANCES:inr_balance={
    "probo":{
        balance:0,
        locked:0
    }
};
let STOCK_SYMBOL:stock={}
let STOCK_BALANCES:stock_balance = {
    "probo":{}
}
let ORDERBOOK:orderbook = {}



app.post("/user/create/:userId",(req:Request,res:Response)=>{
    const id=req.params.userId;
    const user:user={
            balance:0,
            locked:0
    }
    INR_BALANCES[id]=user;
    STOCK_BALANCES[id]={}
   
    console.log(INR_BALANCES)
    return res.json({
        message:"user created"
    })
})

app.post("/symbol/create/:stockSymbol",(req:Request,res:Response)=>{
    const name=req.params.stockSymbol;
    STOCK_SYMBOL[name]={
        "yes":0,
        "no":0
    }
    ORDERBOOK[name]={}
    return res.json({
        ORDERBOOK
    })

})

app.get("/oderbook",(req:Request,res:Response)=>{
    return res.send( ORDERBOOK);
})

app.get("/balances/inr",(req:Request,res:Response)=>{
    return res.send(INR_BALANCES);
})

app.get("/balances/stock",(req:Request,res:Response)=>{
    return res.send(STOCK_BALANCES);
})

app.post("/reset",(req:Request,res:Response)=>{
    INR_BALANCES={};
    ORDERBOOK={};
    STOCK_BALANCES={};
    return res.json({
        message:"stocks are reset"
    })
})

app.get("/balance/inr/:userId",(req:Request,res:Response)=>{
    const id=req.params.userId;
    if(!INR_BALANCES[id]){
        return res.json({
            message:"user not found"
        })
    }
    return res.json({
        balance:INR_BALANCES[id].balance
    })
})

app.post("/onramp/inr",(req:Request,res:Response)=>{
    const value=req.body;

    const id=value.userId;
    const amount=value.amount;

    INR_BALANCES[id].balance+=amount;
    return res.json({
        message:"money added"
    })
})
app.get("/balance/stock/:userId",(req:Request,res:Response)=>{
    const id=req.params.userId;
    return res.send (STOCK_BALANCES[id])
})

async function buy(userId:string,stockSymbol:string,quantity:number,price:number,stockType:"yes" | "no"){
  
    
    
    if(ORDERBOOK[stockSymbol]){
        if(ORDERBOOK[stockSymbol][stockType]){
            if(ORDERBOOK[stockSymbol][stockType][price] && ORDERBOOK[stockSymbol][stockType][price].total>=quantity){

                if(!STOCK_BALANCES[userId]){
                    STOCK_BALANCES[userId]={}
                }
                if(!STOCK_BALANCES[userId][stockSymbol]){
                    STOCK_BALANCES[userId][stockSymbol]={}
                }

                if(stockType==="yes"){
                    if(!STOCK_BALANCES[userId][stockSymbol].yes){
                        STOCK_BALANCES[userId][stockSymbol].yes={
                            quantity:0,
                            locked:0
                        }
                    }    
                    STOCK_BALANCES[userId][stockSymbol].yes.quantity+=quantity
                }else if(stockType==="no"){
                    if(!STOCK_BALANCES[userId][stockSymbol].no){
                        STOCK_BALANCES[userId][stockSymbol].no={
                            quantity:0,
                            locked:0
                        }
                    }    
                    STOCK_BALANCES[userId][stockSymbol].no.quantity+=quantity;
                }
                let remainingQuantity = quantity;
                const orders = ORDERBOOK[stockSymbol][stockType][price].orders;

                for(const user in orders){
                    if(orders.hasOwnProperty(user)){
                        const userQuantity=orders[user];
                        if(userQuantity>=remainingQuantity){
                            orders[user]-=remainingQuantity;
                            ORDERBOOK[stockSymbol][stockType][price].total-=remainingQuantity;
                            
                            if(!STOCK_BALANCES[user][stockSymbol]){
                                STOCK_BALANCES[user][stockSymbol]={};
                            }
                            if(!STOCK_BALANCES[user][stockSymbol][stockType]){
                                STOCK_BALANCES[user][stockSymbol][stockType]={
                                    quantity:0,
                                    locked:0
                                };
                            }
                            STOCK_BALANCES[user][stockSymbol][stockType].locked-=remainingQuantity;
                            INR_BALANCES[user].balance+=(remainingQuantity*price);
                            break;
                        }else{
                            remainingQuantity-=userQuantity;
                            ORDERBOOK[stockSymbol][stockType][price].total-=userQuantity;
                            if(!STOCK_BALANCES[user][stockSymbol]){
                                STOCK_BALANCES[user][stockSymbol]={};
                            }
                            if(!STOCK_BALANCES[user][stockSymbol][stockType]){
                                STOCK_BALANCES[user][stockSymbol][stockType]={
                                    quantity:0,
                                    locked:0
                                };
                            }
                            STOCK_BALANCES[user][stockSymbol][stockType].locked-=userQuantity;
                            INR_BALANCES[user].balance+=(userQuantity*price);
                            orders[user]=0;
                        }
                    }
                }

                INR_BALANCES[userId].balance-=(quantity*price);
            }else{
                const altType: "yes" | "no" = stockType==="yes" ? "no" : "yes"
                const altPrice: number = 1000-price;
                sell(userId,stockSymbol,quantity,altPrice,altType);
            }
        }else{
         
            const altType: "yes" | "no" = stockType==="yes" ? "no" : "yes"
          
            const altPrice: number = 1000-price;
            sell(userId,stockSymbol,quantity,altPrice,altType);
        }
    }
}
//probo sell
async function sell(userId:string,stockSymbol:string,quantity:number,price:number,stockType:"yes" | "no"){
   
        if(ORDERBOOK[stockSymbol]){

            if(!ORDERBOOK[stockSymbol][stockType]){
                ORDERBOOK[stockSymbol][stockType]={}
            }
            if(!ORDERBOOK[stockSymbol][stockType][price]){
                ORDERBOOK[stockSymbol][stockType][price]={
                    total:0,
                    orders:{}
                }
            }
            ORDERBOOK[stockSymbol][stockType][price].total+=quantity;
            if(!ORDERBOOK[stockSymbol][stockType][price].orders["probo"]){
                ORDERBOOK[stockSymbol][stockType][price].orders["probo"]=0;
            }
            ORDERBOOK[stockSymbol][stockType][price].orders["probo"]+=quantity;

            if(!STOCK_BALANCES["probo"][stockSymbol]){
                STOCK_BALANCES["probo"][stockSymbol]={}
            }

           if(!STOCK_BALANCES["probo"][stockSymbol][stockType]){
            STOCK_BALANCES["probo"][stockSymbol][stockType]={
                quantity:0,
                locked:0
            }
        }
            STOCK_BALANCES["probo"][stockSymbol][stockType].locked+=quantity;
            
            INR_BALANCES[userId].balance-=price;
            INR_BALANCES[userId].locked+=price;
        }
        
}


app.post("/order/buy",async (req:Request,res:Response)=>{
    const value=req.body;
  
    const userId:string=value.userId;
    const stockSymbol:string=value.stockSymbol;
    const quantity:number=value.quantity;
    const price:number=value.price;
    const stockType: "yes" | "no" =value.stockType;
  
    if(INR_BALANCES[userId].balance<(quantity*price)){
        return res.json({
            message:"insufficient balance"
        })
    }
  
    await buy(userId,stockSymbol,quantity,price,stockType);
        return res.json({
            ORDERBOOK
        })
    })
  app.post("/order/sell",async(req:Request,res:Response)=>{
    const value=req.body;
  
    const userId:string=value.userId;
    const stockSymbol:string=value.stockSymbol;
    const quantity:number=value.quantity;
    const price:number=value.price;
    const stockType: "yes" | "no" =value.stockType;

    await sell(userId,stockSymbol,quantity,price,stockType);
        return res.json({
            ORDERBOOK
        })
  })  

  app.get("/orderbook/:stockSymbol",(req:Request,res:Response)=>{
    const stock=req.query.stockSymbol || "" ;

    return res.send(ORDERBOOK[stock.toString()])
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