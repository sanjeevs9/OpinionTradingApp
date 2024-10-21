export interface ORDERBOOK{
    [name:string]:{
        "yes":{
            [price:number]:{
                total:number,
                orders:{
                    user:string,
                    type:"buy" | "sell",
                    quantity:number
            }[]
            }
        };
        "no":{
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

  export interface STOCK_BALANCES{
    [userid:string]:{
        [name:string]:{
            "yes":{
                quantity:number,
                locked:number
            },
            "no":{
                quantity:number,
                locked:number
            }
        }
    }
}
export interface user{
    balance:number,
    locked:number
}

export interface INR_BALANCES{
    [userid:string]:user
}
export type stockType="yes" | "no";

export const Orderbook:ORDERBOOK={};
export const inr_balance:INR_BALANCES={
    "probo":{
        balance:0,
        locked:0
    }
};
export const stock_balance:STOCK_BALANCES={};