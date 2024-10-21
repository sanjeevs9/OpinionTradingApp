import { inr_balance } from "./schema";
import {client,start,publisher,subscriber } from "./start";
start();

async function check(){
    while(true){
        try{
            let data=await client.brPop("endpoint",0);
            const key=data.key;
            const element=JSON.parse(data.element);

            
            
            const endpoint=element.endpoint;
            const value=element.data;
            
           await publisher.publish("result",JSON.stringify(inr_balance));
        }catch(err){
            console.log(err)
        }
    }
 
}

check();