import { addMoney, buyStock, createStock, createUser, getBalance, getOrderbook, getStock, reset, sellStock } from "./actions.ts/action";
import publish from "./publihser";
import { inr_balance, Orderbook, stock_balance } from "./schema";
import {client,,publisher,subscriber } from "./start";
start();

async function check(){
    while(true){
        try{
            let value=await client.brPop("endpoint",0);
            const key=value.key;//endpoint
            const element=JSON.parse(value.element);
            console.log(value.element)
            console.log(element);
            
            const endpoint=element.endpoint;
            const data=element.data;
            const id=element.id;

            console.log(endpoint);
            
            switch(endpoint){
                case "/orderbook":publish(id,JSON.stringify(Orderbook))  
                break;
                case "/balances/inr":publish(id,JSON.stringify(inr_balance))
                break;
                case "/balances/stock":publish(id,JSON.stringify(stock_balance));
                break;
                case "/balance/inr/:userId":getBalance(id,data);
                break;
                case "/balance/stock/:userId":getStock(id,data);
                break;
                case "/orderbook/:stockSymbol":getOrderbook(id,data);
                break;
                case "/reset":reset(id);
                break
                case "/user/create/:userId":createUser(id,data);
                break
                case "/symbol/create/:stockSymbol":createStock(id,data)
                break
                case "/onramp/inr":addMoney(id,data)
                break
                case "/order/buy":buyStock(id,data)
                break
                case "/order/sell":sellStock(id,data)
                break

            }
        }catch(err){
            console.log(err)
        }
    }
 
}
check();