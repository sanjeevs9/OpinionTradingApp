  const express =require("express");
const app=express();
import { Request,Response } from "express";
import {createClient} from "redis";


const client=createClient();
app.use(express.json());

async function start(){
    try{
        await client.connect();
        app.listen(3000,()=>{
            console.log("backend connected");
        });
        console.log("redis connected")
    }catch(err){
        console.log(err);
    }
 
}
start()
app.post("/submit",async (req:Request,res:Response)=>{
    const name=req.body.name;
    const age=req.body.age;
    try{
        await client.lPush("change",JSON.stringify({stockSymbol:"stock",orderbook:{"dfadsfdf":"fsfdf"}}));

        res.json({
            message:"redis queue added"
        })
    }catch(error){
        res.json({
            message:"redis queue not added"
        })
    }
})


interface user{
    balance:number,
    locked:number
}

interface inr_balance{
    [userid:string]:user
}

// interface stock{
//     [name:string]:{
//         yes:number,
//         no:number
//     }
// }

interface publish{
    stock:string,
    orderbook:object
}

interface stock_balance{
    [userid:string]:{
        [name:string]:{
            yes:{
                quantity:number,
                locked:number
            },
            no:{
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
                orders:{
                    user:string,
                    type:"buy" | "sell",
                    quantity:number
            }[]
            }
        };
        "no"?:{
            [price:number]:{
                total:number,
                orders:{
                    user:string,
                    type:"buy" | "sell",
                    quantity:number
            }[]
            }
        }
    }
  }

let INR_BALANCES:inr_balance={
    "probo":{
        balance:0,
        locked:0
    },
    "user1":{
        balance:9000,
        locked:0
    }
};
// let STOCK_SYMBOL:stock={}
let STOCK_BALANCES:stock_balance = {
    "probo":{},
    "user1":{
        "check":{
            "yes":{
                quantity:0,
                locked:0
            },
            "no":{
                quantity:0,
                locked:0
            }
        }
    }
}
let ORDERBOOK:orderbook = {
    "check":{
        "yes":{

        },
        "no":{

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
    STOCK_BALANCES[id]={}
    return res.json({
        message:"user created"
    })
})

app.post("/symbol/create/:stockSymbol",(req:Request,res:Response)=>{
    const name=req.params.stockSymbol;
    // STOCK_SYMBOL[name]={
    //     "yes":0,
    //     "no":0
    // }
    ORDERBOOK[name]={}
    return res.json({
        ORDERBOOK
    })

})

app.get("/orderbook",(req:Request,res:Response)=>{
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
        message:"games are reset"
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
    if(!INR_BALANCES[id]){
        return res.status(404).json({
            message:"user not found"
        })
    }

    INR_BALANCES[id].balance+=amount;
    return res.json({
        message:"money added"
    })
})
app.get("/balance/stock/:userId",(req:Request,res:Response)=>{
    const id=req.params.userId;
    if(!STOCK_BALANCES[id]){
        return res.status(404).json({
            message:"user has no stocks"
        })
    }
    return res.send (STOCK_BALANCES[id])
})




app.post("/order/buy",async (req:Request,res:Response)=>{
    const value=req.body;
  
    const userId:string=value.userId;
    const stockSymbol:string=value.stockSymbol;
    const quantity:number=value.quantity;
    const price:number=value.price;
    const stockType: "yes" | "no" =value.stockType;
    if(!INR_BALANCES[userId]){
        return res.status(404).json({
            message:"user not found"
        })
    }
  
    if(INR_BALANCES[userId].balance<(quantity*price)){
        return res.json({
            message:"insufficient balance"
        })
    }
    if(!ORDERBOOK[stockSymbol]){
        return res.status(404).json({
            message:"stock not found"
        })
    }
  try{
     await buy(userId,stockSymbol,quantity,price,stockType);
 
     await client.lPush("change",JSON.stringify({stockSymbol:stockSymbol,orderbook:ORDERBOOK[stockSymbol]}));
    return res.json({
        ORDERBOOK
    })

  }catch(err){
    return res.status(404).send(err);
  }
})
    
  app.post("/order/sell",async(req:Request,res:Response)=>{
    const value=req.body;
  
    const userId:string=value.userId;
    const stockSymbol:string=value.stockSymbol;
    const quantity:number=value.quantity;
    const price:number=value.price;
    const stockType: "yes" | "no" =value.stockType;
    await client.lPush("change",JSON.stringify({stockSymbol:stockSymbol,orderbook:ORDERBOOK[stockSymbol]}));

     await sell(userId,stockSymbol,quantity,price,stockType);
        return res.json({
            ORDERBOOK
        })
  })  

  app.get("/orderbook/:stockSymbol",(req:Request,res:Response)=>{
    const stock:string=req.params.stockSymbol;
    if(!ORDERBOOK[stock]){
        return  res.status(404).json({
            message:"order book not found"
        })
    }
    return res.send(ORDERBOOK[stock])
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


async function buy(userId:string,stockSymbol:string,quantity:number,price:number,stockType:"yes" | "no"){
    if(ORDERBOOK[stockSymbol]){
        if(ORDERBOOK[stockSymbol][stockType]){
            if(ORDERBOOK[stockSymbol][stockType][price] && ORDERBOOK[stockSymbol][stockType][price].total>=quantity){ 
                if(!STOCK_BALANCES[userId][stockSymbol]){
                    STOCK_BALANCES[userId][stockSymbol]={
                        yes:{
                            quantity:0,
                            locked:0
                        },
                        no:{
                            quantity:0,
                            locked:0
                        }
                    }
                }

                if(stockType==="yes"){
                    STOCK_BALANCES[userId][stockSymbol].yes.quantity+=quantity
                }else if(stockType==="no"){  
                    STOCK_BALANCES[userId][stockSymbol].no.quantity+=quantity;
                }

                let remainingQuantity = quantity;
                const orders= ORDERBOOK[stockSymbol][stockType][price].orders;
                let key=0;
                while(key<orders.length && remainingQuantity!=0){
                    const type=ORDERBOOK[stockSymbol][stockType][price].orders[key].type;
                    const userQuantity=ORDERBOOK[stockSymbol][stockType][price].orders[key].quantity;
                    const user=ORDERBOOK[stockSymbol][stockType][price].orders[key].user;

                        if(userQuantity>=remainingQuantity){
                            console.log({userQuantity});
                            console.log({remainingQuantity});
                            
                            //decrease quantity
                            ORDERBOOK[stockSymbol][stockType][price].orders[key].quantity-=remainingQuantity;
                            ORDERBOOK[stockSymbol][stockType][price].total-=remainingQuantity;

                            
                            STOCK_BALANCES[user][stockSymbol][stockType].locked-=remainingQuantity;
                            
                            if(type==="sell"){
                                INR_BALANCES[user].balance+=(remainingQuantity*(1000-price));
                                INR_BALANCES["probo"].balance+=(remainingQuantity*price);
                                STOCK_BALANCES[user][stockSymbol][stockType].locked-=remainingQuantity;

                                
                            }else{
                                //add money to probo and give stock to the user with opposite type of stock and same quantity and 10-price
                                INR_BALANCES["probo"].balance+=(remainingQuantity*price);
                                const psudoType:"yes" | "no"= stockType==="yes" ? "no" : "yes"
                                const psudoPrice=1000-price;
                                console.log(remainingQuantity*psudoPrice)
                                STOCK_BALANCES[user][stockSymbol][psudoType].quantity+=remainingQuantity;
                                INR_BALANCES[user].locked-=(remainingQuantity*psudoPrice);
                                INR_BALANCES["probo"].balance+=(remainingQuantity*psudoPrice);
                            }
                            if(ORDERBOOK[stockSymbol][stockType][price].orders[key].quantity==0){
                                orders.shift()
                            }
                            break;
                        }else{
                            remainingQuantity-=userQuantity;
                            ORDERBOOK[stockSymbol][stockType][price].total-=userQuantity;
                           
                            STOCK_BALANCES[user][stockSymbol][stockType].locked-=userQuantity;
                            if(type==="sell"){
                                INR_BALANCES[user].balance+=(userQuantity*(1000-price));
                                INR_BALANCES["probo"].balance+=(userQuantity*price);
                                STOCK_BALANCES[user][stockSymbol][stockType].locked-=userQuantity;
                            }else{
                                  //add money to probo and give stock to the user with opposite type of stock and same quantity and 10-price
                                INR_BALANCES["probo"].balance+=(userQuantity*price);
                                const psudoType:"yes" | "no"= stockType==="yes" ? "no" : "yes"
                                const psudoPrice=1000-price;
                                console.log(psudoPrice)
                                STOCK_BALANCES[user][stockSymbol][psudoType].quantity+=userQuantity;
                                INR_BALANCES[user].locked-=(userQuantity*psudoPrice);
                                INR_BALANCES["probo"].balance+=(userQuantity*psudoPrice);
                            }    
                            orders.shift();
                        }
                }

                INR_BALANCES[userId].balance-=(quantity*price);

            }else{

                //same as below function call
                const altType: "yes" | "no" = stockType==="yes" ? "no" : "yes"
                INR_BALANCES[userId].balance-=(price*quantity);
                INR_BALANCES[userId].locked+=(price*quantity);

                const altPrice: number = 1000-price;
                BuySell(userId,stockSymbol,quantity,altPrice,altType,"buy");
            }
        }else{
         // stock type is not available-->sell the stock function -->  for alt stock but the type will be buyonly and when the type is buy add money of that stock to probo account
            const altType: "yes" | "no" = stockType==="yes" ? "no" : "yes"
            INR_BALANCES[userId].balance-=(price*quantity);
            INR_BALANCES[userId].locked+=(price*quantity);

            const altPrice: number = 1000-price;
            BuySell(userId,stockSymbol,quantity,altPrice,altType,"buy");
        }
    }
}
//probo sell
async function BuySell(userId:string,stockSymbol:string,quantity:number,price:number,stockType:"yes" | "no",type: "buy" | "sell"){
   
        if(ORDERBOOK[stockSymbol]){

            if(!ORDERBOOK[stockSymbol][stockType]){
                ORDERBOOK[stockSymbol][stockType]={}
            }
            if(!ORDERBOOK[stockSymbol][stockType][price]){
                ORDERBOOK[stockSymbol][stockType][price]={
                    total:0,
                    orders:[]
                }
            }
            if(!STOCK_BALANCES[userId][stockSymbol]){
                STOCK_BALANCES[userId][stockSymbol]={
                    yes:{
                        quantity:0,
                        locked:0
                    },
                    no:{
                        quantity:0,
                        locked:0
                    }
                }
            }
            STOCK_BALANCES[userId][stockSymbol][stockType].locked+=quantity;
            
            ORDERBOOK[stockSymbol][stockType][price].orders.push({
                    user:userId,
                    type,
                    quantity
            })
            ORDERBOOK[stockSymbol][stockType][price].total+=quantity;
        }
        
}
//normal
async function sell(userId:string,stockSymbol:string,quantity:number,price:number,stockType:"yes" | "no"){
    if(ORDERBOOK[stockSymbol]){
        const STOCK_TYPE=stockType==="yes" ? "no" : "yes";
        const PRICE=10-price;
        if(ORDERBOOK[stockSymbol][STOCK_TYPE]){
            if(ORDERBOOK[stockSymbol][STOCK_TYPE][PRICE] && ORDERBOOK[stockSymbol][STOCK_TYPE][PRICE].total<=quantity){
                //buy that stock there from probo account 
                ProboBuy(userId,stockSymbol,quantity,PRICE,STOCK_TYPE);
                INR_BALANCES[userId].balance+=(quantity*price);
                STOCK_BALANCES[userId][stockSymbol][stockType].quantity-=quantity;
                INR_BALANCES["probo"].balance-=(quantity*price);
            }else{
                //same as below
                if(!ORDERBOOK[stockSymbol][STOCK_TYPE]){
                    ORDERBOOK[stockSymbol][STOCK_TYPE]={}
                }
                if(!ORDERBOOK[stockSymbol][STOCK_TYPE][PRICE]){
                    ORDERBOOK[stockSymbol][STOCK_TYPE][PRICE]={
                        total:0,
                        orders:[]
                    }
                }
                STOCK_BALANCES[userId][stockSymbol][STOCK_TYPE].locked+=quantity;
                STOCK_BALANCES[userId][stockSymbol][stockType].quantity-=quantity;

                ORDERBOOK[stockSymbol][STOCK_TYPE][PRICE].orders.push({
                        user:userId,
                        type:"sell",
                        quantity
                    })
            }
        }else{
            //create sell order on the opposite side with 10-price and typeOfOrder="Sell"
          
            if(!ORDERBOOK[stockSymbol][STOCK_TYPE]){
                ORDERBOOK[stockSymbol][STOCK_TYPE]={}
            }
            if(!ORDERBOOK[stockSymbol][STOCK_TYPE][PRICE]){
                ORDERBOOK[stockSymbol][STOCK_TYPE][PRICE]={
                    total:0,
                    orders:[]
                }
            }
            STOCK_BALANCES[userId][stockSymbol][STOCK_TYPE].locked+=quantity;
            STOCK_BALANCES[userId][stockSymbol][stockType].quantity-=quantity;

            ORDERBOOK[stockSymbol][STOCK_TYPE][PRICE].orders.push({
                user:userId,
                type:"sell",
                quantity
            })
            
    }
}
}

//probo buy
async function ProboBuy(userId:string,stockSymbol:string,quantity:number,price:number,stockType:"yes" | "no"){
    if(ORDERBOOK[stockSymbol]){
        if(ORDERBOOK[stockSymbol][stockType]){
            const orders=ORDERBOOK[stockSymbol][stockType][price].orders;
            let key=0;
            let remainingQuantity=quantity;
            
            
            while(orders[key] && remainingQuantity!=0){
                const userQuantity=orders[key].quantity
                const type=orders[key].type;
                const sellUser=orders[key].user

                if(userQuantity>=remainingQuantity){
                    //buy all stocks from probo account
                    orders[key].quantity-=remainingQuantity;
                    ORDERBOOK[stockSymbol][stockType][price].total-=remainingQuantity;
                    STOCK_BALANCES[sellUser][stockSymbol][stockType].locked-=remainingQuantity;
                    
                    if(type==="sell"){
                        INR_BALANCES[sellUser].balance+=(remainingQuantity*price);
                    }
                    
                    
                    break;
                }else{
                    remainingQuantity-=userQuantity;
                    if(type==="sell"){
                        INR_BALANCES[sellUser].balance+=(userQuantity*price);
                    }
                    STOCK_BALANCES[sellUser][stockSymbol][stockType].locked-=userQuantity;
                    orders.shift();
                }

            }
            
        }
        
    }
    

}

