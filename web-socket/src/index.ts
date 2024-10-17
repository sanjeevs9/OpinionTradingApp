import {WebSocketServer} from "ws"
import {createClient} from "redis"

const client=createClient();
const wss=new WebSocketServer({port:8080});

async function start(){
    try{
        await client.connect();
        console.log("redis websocket connected")

        while(true){
            try{
                const value=await client.brPop("submission",0);
                console.log(value);
            }catch(err){
                console.log(err);
            }
        }
    }catch(err){
        console.log(err);
    }
}

start();

wss.on("connection",function connection(socket){
    socket.on("message",function message(data){
        console.log({data});
    })
    socket.send("connection established")
})

