import express,{Request,Response} from "express";
import { generate, queue } from "../functions";
import { subscriber } from "../redis.ts/start";
const router=express.Router();
export default router


router.post("/reset",(req:Request,res:Response)=>{
    const id=generate();
    

    subscriber.subscribe(id,(message:any)=>{
        const value=JSON.parse(message);
        res.json({
            message:value
        })
        return;
    })
    queue("/reset",{},id);
    
})

router.post("/user/create/:userId", async (req:Request,res:Response)=>{
    try{
        const userId=req.params.userId;
    const id=generate();
    const data={
        userId
    }
  

    await subscriber.subscribe(id,(message:any)=>{
        subscriber.unsubscribe(id);
        res.json({
            message:message
        })
    });
    
    queue("/user/create/:userId",data,id);

    }catch(err){
        console.log(err);
        
    }
    
})

function get(){
    
}

router.post("/user/create/:userId", async (req:Request,res:Response)=>{
    try{
        const userId=req.params.userId;
    const id=generate();
    const data={
        userId
    }

   const resposne = await new Promise((resolve, reject) => {
        subscriber.subscribe(id,(message:any)=>{
            subscriber.unsubscribe(id);
           resolve(message);
        });
        queue("/user/create/:userId",data,id);
    })
     
    res.send('hi there');
    return;

    }catch(err){
        console.log(err);
        
    }
    
})

//create stockSymbol
router.post("/symbol/create/:stockSymbol",async (req:Request,res:Response)=>{
    const id=generate();
    const stockSymbol=req.params.stockSymbol;
    const data={
        stockSymbol
    }
 
    await subscriber.subscribe(id,(message:string)=>{
        res.json({
            message:message
        })
        return
    })
    queue("/symbol/create/:stockSymbol",data,id);
    
})

//add money to user account
router.post("/onramp/inr", async (req:Request,res:Response)=>{
    try{
            const value=req.body;            
        const userId=value.userId;
        //take amount as rs
        const amount=value.amount;
        const paise=amount *100;
        const id=generate();
        const data={
            userId,
            amount:paise,
        }
       
        subscriber.subscribe(id,(message:any)=>{
            res.json({
                message:message
            })
            return
        })
        queue("/onramp/inr",data,id);
    }catch(err){
        console.log(err);
        
    }
    
  
})

//buy order place
router.post("/order/buy",async (req:Request,res:Response)=>{
    const value=req.body;

    const userId:string=value.userId;
    const stockSymbol:string=value.stockSymbol;
    const quantity:number=value.quantity;
    const price:number=value.price;
    const stockType: "yes" | "no" =value.stockType;
    const id=generate();
    const data={
        userId,
        stockSymbol,
        quantity,
        price,
        stockType,
    }
    queue("/order/buy",data,id);
    subscriber.subscribe(id,(message:any)=>{
        res.json({
            message:message
        })
        return;
    })    
})

router.post("/order/sell",async (req:Request,res:Response)=>{
    const value=req.body;

    const userId:string=value.userId;
    const stockSymbol:string=value.stockSymbol;
    const quantity:number=value.quantity;
    const price:number=value.price;
    const stockType: "yes" | "no" =value.stockType;

    const data={
        userId,
        stockSymbol,
        quantity,
        price,
        stockType
    }
    const id=generate()
    queue("/order/sell",data,id);
    subscriber.subscribe(id,(message:any)=>{
        res.json({
            message:message
        })
        return;
    });

    
    
})