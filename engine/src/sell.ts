import { createOrder } from "./purchase";
import { Orderbook, stock_balance, stockType } from "./schema";
import { inr_balance } from "./schema";

export function sell(userId: string, stockSymbol: string, quantity: number, price: number, stockType: stockType){
    let message="your stocks are sold"
    const altType=stockType==="yes" ? "no" : "yes";
    const altPrice=1000-price;
    
    const obj=Orderbook[stockSymbol][altType];
    const keys=Object.keys(obj);

    //no sell order directly no alt buy order present
    if(keys.length===0){
        createOrder(userId,stockSymbol,quantity,price,stockType,"sell");
        stock_balance[userId][stockSymbol][stockType].locked+=quantity;
        message="bid submitted"
        return message;
    }
    const minPrice:number=Number(keys[0]);
    
    //create sell order directly no alt buy order of same price is present 
    if(minPrice>altPrice){
        createOrder(userId,stockSymbol,quantity,price,stockType,"sell");
        stock_balance[userId][stockSymbol][stockType].locked+=quantity;
        message="bid submitted"
        return message;
    }
    let remainingQuantity=quantity;
    for(let key in obj){
        const value:number=Number(key);

        if (remainingQuantity === 0) {
            break;
        }
        if(value>=altPrice && remainingQuantity!=0){
            const orders=obj[value].orders;
            while(orders.length!=0){
                const Seller = orders[0].user;
                const SellerType = orders[0].type
                const sellerQuantity = orders[0].quantity
                
                if(sellerQuantity>=remainingQuantity){         
                    transaction(userId, Seller, SellerType, remainingQuantity, value, altType, stockSymbol, stockType);
                    if(orders[0].quantity===0){
                        orders.shift();
                    }
                    remainingQuantity=0;
                    break;
                }else{
                    transaction(userId, Seller, SellerType, sellerQuantity, value, altType, stockSymbol, stockType);
                    Orderbook[stockSymbol][altType][value].orders.shift();
                    remainingQuantity-=sellerQuantity
                }
            }
        }
    }
    if(remainingQuantity!==0){
        createOrder(userId,stockSymbol,remainingQuantity,price,stockType,"sell");
        message=`${quantity-remainingQuantity} sold  and ${remainingQuantity} bid is submitted`
        return message
    }
    return message;
}

export function transaction(userId: string, sellerId: string, SellerType: "buy" | "sell", quantity: number, price: number, stockType: stockType, stockSymbol: string, altType: stockType) {

    Orderbook[stockSymbol][stockType][price].total -= quantity;
    Orderbook[stockSymbol][stockType][price].orders[0].quantity -= quantity;

    if (SellerType === "buy") {

        //seller case
        const lockedMoney: number = (1000 - price) * quantity;
        inr_balance["probo"].balance += lockedMoney;
        inr_balance[sellerId].locked -= lockedMoney;

        if(!stock_balance[sellerId]){
            stock_balance[sellerId]={}
        }
        if (!stock_balance[sellerId][stockSymbol]) {
            stock_balance[sellerId][stockSymbol] = {
                "yes": {
                    quantity: 0,
                    locked: 0
                },
                "no": {
                    quantity: 0,
                    locked: 0
                }
            }
        }
        stock_balance[sellerId][stockSymbol][altType].quantity += quantity;

        //buyer case
        if(!stock_balance[userId]){
            stock_balance[userId]={};
        }
        if(!stock_balance[userId][stockSymbol]){
            stock_balance[userId][stockSymbol] = {
                "yes": {
                    quantity: 0,
                    locked: 0
                },
                "no": {
                    quantity: 0,
                    locked: 0
                }
            }
        }
        stock_balance[userId][stockSymbol][altType].quantity -= quantity;
        inr_balance[userId].balance += price * quantity;
    } else {
        //seller case
        if (!stock_balance[sellerId][stockSymbol]) {
            stock_balance[sellerId][stockSymbol] = {
                "yes": {
                    quantity: 0,
                    locked: 0
                },
                "no": {
                    quantity: 0,
                    locked: 0
                }
            }
        }
        stock_balance[sellerId][stockSymbol][altType].locked -= quantity;
        inr_balance[sellerId].balance += price * quantity;

        //buyer case
        if(!stock_balance[userId][stockSymbol]){
            stock_balance[userId][stockSymbol] = {
                "yes": {
                    quantity: 0,
                    locked: 0
                },
                "no": {
                    quantity: 0,
                    locked: 0
                }
            }
        }
        stock_balance[userId][stockSymbol][altType].quantity -= quantity;
        inr_balance[userId].balance += price * quantity;
    }
}

