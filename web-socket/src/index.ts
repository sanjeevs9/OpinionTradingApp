import {WebSocketServer,WebSocket} from "ws"
import {createClient} from "redis"

const subscriber=createClient();
subscriber.connect()
const wss=new WebSocketServer({port:8080});

interface subscribe{
    [stockSymbol:string]:Set<WebSocket>
}


const subscribedFolks:subscribe={};

wss.on("connection",function connection(socket){
    socket.on("message",async function message(data){
        console.log(data.toString());
    
        const receivedmsg = JSON.parse(data.toString());
        const {stockName,eventType}=receivedmsg;
    
        socket.send(data.toString());
        if(eventType==="subscribe"){
            console.log("subscribed");
            
            if(!subscribedFolks[stockName]){
                subscribedFolks[stockName]=new Set();
            }
            subscribedFolks[stockName].add(socket);
            console.log(stockName)
           await subscriber.subscribe(stockName,(message:string)=>{
                console.log(message);
                
                
                if(subscribedFolks[stockName]){
                    subscribedFolks[stockName].forEach(client=>{
                        if(client.readyState===WebSocket.OPEN){
                            client.send(message);
                        }
                    })
                }
            });

        }else if(eventType==="unsubscribe"){
            if(subscribedFolks[stockName] && subscribedFolks[stockName].has(socket)){
                console.log("unsubscribe");
                subscribedFolks[stockName].delete(socket);
            }
        }
    })
    socket.send("connection established")
    socket.on("close",()=>{
        socket.send("connection lost")
    })
})

