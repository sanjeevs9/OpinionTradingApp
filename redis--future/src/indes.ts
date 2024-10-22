import {createClient} from "redis"
const client= createClient();
export default client;

export async  function start(){
    try{
        await client.connect();
        console.log("redis connected");
        
    }catch(err){
        console.log(err);
    }
}