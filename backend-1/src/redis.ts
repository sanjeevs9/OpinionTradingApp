import redis from "redis"
import { createClient } from "redis"
export const client =createClient();

export default async function start(){
    try{
        await client.connect();
        console.log("redis is connected on default port")
    }catch(error){
        console.log(error)
    }
}