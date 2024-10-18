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
const Q=7;
  const order:orderbook={
    "probo":{
        "yes":{
            8.5:{
                total:12,
                orders:{
                    "user1":2,
                    "user2":5,
                    "user3":5
                }
            }
        }
    }
  }

  let orders;
if(order["probo"]["yes"]){
    orders=order["probo"]["yes"][8.5].orders;
}
  
for(const order in orders){
    const userQ=orders[order]
    console.log({userQ});

}
