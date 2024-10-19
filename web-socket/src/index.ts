import {WebSocketServer,WebSocket} from "ws"
import {createClient} from "redis"

const client=createClient();
const wss=new WebSocketServer({port:8080});


interface change{
    stockSymbol:string,
    storybook:string
}


interface subscribe{
    [stockSymbol:string]:Map<WebSocket,WebSocket>
}


const subscribedFolks:subscribe={};

async function start(){
    try{
        await client.connect();
        console.log("redis websocket connected")

        while(true){
            try{
                const value=await client.brPop("change",0);
                const data=value?.element || " ";
                const obj=JSON.parse(data);

                
                const stockSymbol:string=obj.stockSymbol;
                const orderbook=obj.orderbook;
                console.log(obj)
                
                if(subscribedFolks[stockSymbol]){
                    console.log(orderbook.toString());
                    console.log({orderbook})
                    subscribedFolks[stockSymbol].forEach((client)=>{
                        client.send(JSON.stringify(orderbook));
                    })
                }
              

                
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
        const receivedmsg = JSON.parse(data.toString());
        const {type,message}=receivedmsg;
// console.log(socket);
console.log(receivedmsg);
        if(message==="subscribe"){
            if(!subscribedFolks[type]){
                subscribedFolks[type]=new Map();
            }
            subscribedFolks[type].set(socket,socket);
        }else if(message==="unsubsribe"){
            if(subscribedFolks.type){
                subscribedFolks.type.delete(socket);
            }
        }
        console.log(subscribedFolks[type])
    })
    socket.send("connection established")
})

