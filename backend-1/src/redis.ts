import redis from "redis"
import { createClient } from "redis"
const client =createClient();

export default async function start(){
    try{
        await client.connect();
        console.log("redis is connected on default port")
    }catch{
        console.error();
    }
}