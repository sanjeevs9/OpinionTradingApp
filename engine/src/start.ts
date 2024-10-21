import { createClient } from "redis";

export const client=createClient();
export const publisher=createClient();
export const subscriber=createClient();

export async function start(){
    try{
        await client.connect();
        await publisher.connect();
        await subscriber.connect();
        console.log("engine connected to client")

    }catch(err){
        console.log(err);
    }
}

