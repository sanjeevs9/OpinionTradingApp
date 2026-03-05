import {WebSocketServer,WebSocket} from "ws"
import {createClient} from "redis"

const subscriber=createClient();
subscriber.connect()
const wss=new WebSocketServer({port:8080});

interface SubscribedMap{
    [stockSymbol:string]:Set<WebSocket>
}

const subscribedFolks:SubscribedMap={};

wss.on("connection",function connection(socket){
    socket.on("message",async function message(data){
        console.log(data.toString());

        const receivedmsg = JSON.parse(data.toString());
        const stockName = receivedmsg.stockSymbol || receivedmsg.stockName;
        const eventType = receivedmsg.type || receivedmsg.eventType;

        if(eventType==="subscribe"){
            console.log("subscribed to", stockName);

            if(!subscribedFolks[stockName]){
                subscribedFolks[stockName]=new Set();

                // Subscribe to Redis channel only once per stock
                await subscriber.subscribe(stockName,(message:string)=>{
                    console.log("redis message for", stockName);

                    if(subscribedFolks[stockName]){
                        subscribedFolks[stockName].forEach(client=>{
                            if(client.readyState===WebSocket.OPEN){
                                try {
                                    client.send(message);
                                } catch(err) {
                                    console.error("Failed to send to client:", err);
                                }
                            }
                        })
                    }
                });
            }
            subscribedFolks[stockName].add(socket);

        }else if(eventType==="unsubscribe"){
            if(subscribedFolks[stockName] && subscribedFolks[stockName].has(socket)){
                console.log("unsubscribe from", stockName);
                subscribedFolks[stockName].delete(socket);
                if(subscribedFolks[stockName].size===0){
                    subscriber.unsubscribe(stockName);
                    delete subscribedFolks[stockName];
                }
            }
        }
    })

    socket.send("connection established")

    socket.on("close",()=>{
        // Clean up this socket from all subscriptions
        for(const stockName in subscribedFolks){
            if(subscribedFolks[stockName].has(socket)){
                subscribedFolks[stockName].delete(socket);
                if(subscribedFolks[stockName].size===0){
                    subscriber.unsubscribe(stockName);
                    delete subscribedFolks[stockName];
                }
            }
        }
    })
})
