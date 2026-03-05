import {createClient} from "redis"
export const client= createClient();
export const publisher=createClient();
export const subscriber=createClient();


export async  function start(){
    try{
        await client.connect();
        await subscriber.connect();
        await publisher.connect();
        console.log("redis connected");
        
    }catch(err){
        console.error("Redis connection failed (is Redis running on 127.0.0.1:6379?). Start with: redis-server");
        console.error(err);
    }
}



// import redis from 'ioredis';


// export const redisPub = new Redis();
// export const redisSub = new Redis();
// export const redisQueue = new Redis();


// redisQueue.