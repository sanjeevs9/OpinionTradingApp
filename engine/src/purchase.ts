import { inr_balance, Orderbook, stock_balance, stockType } from "./schema";
import { sell } from "./sell";

export function buy(userId: string, stockSymbol: string, quantity: number, price: number, stockType: stockType) {
    let message="order created";
    if (Orderbook[stockSymbol]) {
        const altType: stockType = stockType === "yes" ? "no" : "yes";
        const altPrice: number = 1000 - price

        const obj = Orderbook[stockSymbol][stockType];
        const keys = Object.keys(obj);


        //no price for that "yes" / "no" type of stock
        if (keys.length === 0) {
            inr_balance[userId].locked += (price * quantity);
            inr_balance[userId].balance -= (price * quantity);
            createOrder(userId, stockSymbol, quantity, altPrice, altType, "buy");
            message="bid submitted"
            return message;
        }
        const minPrice: number = Number(keys[0]);
        //if asked price is less than current price than create pseudo order
        if (price < minPrice) {
            inr_balance[userId].locked += (price * quantity);
            inr_balance[userId].balance -= (price * quantity);
            createOrder(userId, stockSymbol, quantity, altPrice, altType, "buy");
            message="bid submitted"
            return message;
        }
        //buy the orders
        let remainingQuantity: number = quantity;
        for (let key in obj) {
            const value: number = Number(key);
            if (remainingQuantity === 0) {
                break;
            }
            if (value <= price && remainingQuantity != 0) {
                // let total=obj[value].total;
                const orders = obj[value].orders;
                while (orders.length != 0) {
                    const Seller = orders[0].user;
                    const SellerType = orders[0].type
                    const sellerQuantity = orders[0].quantity

                    if (sellerQuantity >= remainingQuantity) {
                        //place transaction
                        transaction(userId, Seller, SellerType, remainingQuantity, value, stockType, stockSymbol, altType);
                        // Orderbook[stockSymbol][stockType][value].total -= remainingQuantity;
                        // Orderbook[stockSymbol][stockType][value].orders[0].quantity -= remainingQuantity;

                        // if (Orderbook[stockSymbol][stockType][value].orders[0].type === "buy") {

                        //     //seller case
                        //     const lockedMoney: number = (1000 - value) * remainingQuantity;
                        //     inr_balance["probo"].balance += lockedMoney;
                        //     inr_balance[Seller].locked -= lockedMoney;
                        //     stock_balance[Seller][stockSymbol][altType].quantity += remainingQuantity;

                        //     if (!stock_balance[Seller][stockSymbol]) {
                        //         stock_balance[Seller][stockSymbol] = {
                        //             "yes": {
                        //                 quantity: 0,
                        //                 locked: 0
                        //             },
                        //             "no": {
                        //                 quantity: 0,
                        //                 locked: 0
                        //             }
                        //         }
                        //     }
                        //     //buyer case
                        //     stock_balance[userId][stockSymbol][stockType].quantity += remainingQuantity;
                        //     inr_balance[userId].balance -= value * remainingQuantity;
                        // } else {
                        //     //seller case
                        //     stock_balance[Seller][stockSymbol][stockType].locked -= remainingQuantity;
                        //     inr_balance[Seller].balance += value * remainingQuantity;

                        //     //buyer case
                        //     stock_balance[userId][stockSymbol][stockType].quantity += remainingQuantity;
                        //     inr_balance[userId].balance -= value * remainingQuantity;
                        // }
                        if(orders[0].quantity===0){
                            orders.shift();
                        }
                        remainingQuantity = 0;
                        break;
                    } else {
                        //place transaction
                        transaction(userId, Seller, SellerType, sellerQuantity, value, stockType, stockSymbol, altType);
                        
                        // Orderbook[stockSymbol][stockType][value].total -= sellerQuantity;

                        // if (Orderbook[stockSymbol][stockType][value].orders[0].type === "buy") {

                        //     //seller case
                        //     const lockedMoney: number = (1000 - value) * sellerQuantity;
                        //     inr_balance["probo"].balance += lockedMoney;
                        //     inr_balance[Seller].locked -= lockedMoney;
                        //     stock_balance[Seller][stockSymbol][altType].quantity += sellerQuantity;

                        //     //buyer case
                        //     stock_balance[userId][stockSymbol][stockType].quantity += sellerQuantity;
                        //     inr_balance[userId].balance -= value * sellerQuantity;
                        // } else {
                        //     //seller case
                        //     inr_balance[Seller].locked += (value * sellerQuantity);
                        //     stock_balance[Seller][stockSymbol][stockType].locked -= sellerQuantity;

                        //     //buyer case
                        //     stock_balance[userId][stockSymbol][stockType].quantity += sellerQuantity;
                        //     inr_balance[userId].balance -= value * sellerQuantity;
                        //     inr_balance["probo"].balance += value * sellerQuantity;
                        // }


                        Orderbook[stockSymbol][stockType][value].orders.shift();
                        remainingQuantity -= sellerQuantity;
                    }
                }

            }
        }
        //user wants more then create opposite buy order
        if(remainingQuantity!==0){
            createOrder(userId,stockSymbol,remainingQuantity,altPrice,altType,"buy");
            message=`${quantity-remainingQuantity} order placed and ${remainingQuantity} bid submitted`
            return message
        }
        return message;
    }
}

export function createOrder(userId: string, stockSymbol: string, quantity: number, price: number, stockType: stockType, type: "buy" | "sell") {
    if (!Orderbook[stockSymbol][stockType][price]) {
        Orderbook[stockSymbol][stockType][price] = {
            total: 0,
            orders: []
        }
    }
    Orderbook[stockSymbol][stockType][price].total += quantity;
    const order = {
        user: userId,
        type: type,
        quantity: quantity
    }
    Orderbook[stockSymbol][stockType][price].orders.push(order);

}

export function transaction(userId: string, sellerId: string, SellerType: "buy" | "sell", quantity: number, price: number, stockType: stockType, stockSymbol: string, altType: stockType) {

    Orderbook[stockSymbol][stockType][price].total -= quantity;
    Orderbook[stockSymbol][stockType][price].orders[0].quantity -= quantity;

    if (SellerType === "buy") {

        //seller case
        const lockedMoney: number = (1000 - price) * quantity;
        inr_balance["probo"].balance += lockedMoney;
        inr_balance["probo"].balance += (price*quantity)
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
        stock_balance[userId][stockSymbol][stockType].quantity += quantity;
        inr_balance[userId].balance -= price * quantity;
    } else {
        //seller case
        stock_balance[sellerId][stockSymbol][stockType].locked -= quantity;
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
        inr_balance[sellerId].balance += price * quantity;

        //buyer case
        stock_balance[userId][stockSymbol][stockType].quantity += quantity;
        inr_balance[userId].balance -= price * quantity;
    }
}

