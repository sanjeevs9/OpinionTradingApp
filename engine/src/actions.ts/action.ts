import publish from "../publihser";
import { inr_balance, Orderbook, stock_balance } from "../schema";
import { subscriber } from "../start";
import { buy } from "./purchase";
import { sell } from "./sell";

export function getBalance(id:string,data:any){
    const userId=data.userId;
    if(!inr_balance[userId]){
        const message="User not found"
        publish(id,JSON.stringify(message))
        return;
    }
    let balance=inr_balance[userId].balance;
    balance=balance/100;
    publish(id,JSON.stringify(balance));
}

export function getStock(id:string,data:any){
    const userId=data.userId;

    if(!inr_balance[userId]){
        const message="user not found"
        publish(id,JSON.stringify(message));
        return;
    }

    if(!stock_balance[userId]){
        const message="User has no stocks"
        publish(id,JSON.stringify(message));
        return;
    }
    let balance=stock_balance[userId];
    publish(id,JSON.stringify(balance));
}
export function getOrderbook(id:string,data:any){
    const stockSymbol=data.stockSymbol;
    
    if(!Orderbook[stockSymbol]){
        const message="no stocks found"
        publish(id,JSON.stringify(message));
        return
    }
    let stock=Orderbook[stockSymbol];
    publish(id,JSON.stringify(stock));
}
export function reset(id:string){
    for (const key in inr_balance) {
       delete inr_balance[key];
    }
    for(const key in Orderbook){
        delete Orderbook[key];
    }
    for (const key in stock_balance) {
       delete stock_balance[key];
    }
    const message="your game is rest"
    publish(id,JSON.stringify(message));
}

export function createUser(id:string,data:any){
    const userId=data.userId;
    if(inr_balance[userId]){
        const message="user already exists"
        publish(id,JSON.stringify(message));
        return;
    }

    const user={
        balance:0,
        locked:0
    }
    inr_balance[userId]=user;
    stock_balance[userId]={}
    
    const message="user created"

    publish(id,JSON.stringify(message));
}

export function createStock(id:string,data:any){
    const stockSymbol=data.stockSymbol;

    if(Orderbook[stockSymbol]){
        const message="stock already exists"
        publish(id,JSON.stringify(message));
        return ;
    }

    Orderbook[stockSymbol]={
        "yes":{},
        "no":{}
    }
    const message="stock created"
    publish(id,JSON.stringify(message));
}

export function addMoney(id:string,data:any){
    const userId=data.userId;
    const amount=data.amount;
    
    if(!inr_balance[userId]){
        const message="user not found"
        publish(id,JSON.stringify(message));
        return
    }
    inr_balance[userId].balance+=amount;
    const message=`${amount/100} added to your account`
    publish(id,JSON.stringify(message))
}

export async function buyStock(id:string,data:any){
    const userId:string=data.userId;
    const stockSymbol:string=data.stockSymbol;
    const quantity:number=data.quantity;
    const price:number=data.price;
    const stockType: "yes" | "no" =data.stockType;

    if(!inr_balance[userId]){
        const message="user not found"
        publish(id,JSON.stringify(message));
        return
    }
    if(!Orderbook[stockSymbol]){
        const message="stock not found please try again later"
        publish(id,JSON.stringify(message));
        return
    }
    const message=buy(userId,stockSymbol,quantity,price,stockType);
    publish(id,JSON.stringify(message));
    const value=Orderbook[stockSymbol];
    // console.log(value);
    console.log(stockSymbol)
    await publish(stockSymbol,JSON.stringify(value))
}
export function sellStock(id:string,data:any){
        
    const userId:string=data.userId;
    const stockSymbol:string=data.stockSymbol;
    const quantity:number=data.quantity;
    const price:number=data.price;
    const stockType: "yes" | "no" =data.stockType;

     if(!inr_balance[userId]){
        const message="user not found"
        publish(id,JSON.stringify(message));
        return
    }
    if(!Orderbook[stockSymbol]){
        const message="stock not found please try again later"
        publish(id,JSON.stringify(message));
        return
    }
    const message=sell(userId,stockSymbol,quantity,price,stockType);
    publish(id,JSON.stringify(message));
    const value=Orderbook[stockSymbol];
    publish(stockSymbol,JSON.stringify(value))
}