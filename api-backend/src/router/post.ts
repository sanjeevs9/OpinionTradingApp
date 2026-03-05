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

router.post("/user/create/:userId", async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const id = generate();
        const data = { userId };

        const response = await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                subscriber.unsubscribe(id);
                reject(new Error('Request timeout'));
            }, 5000);

            subscriber.subscribe(id, (message: any) => {
                clearTimeout(timeout);
                subscriber.unsubscribe(id);
                resolve(message);
            });

            queue("/user/create/:userId", data, id);
        });

        res.json({ message: response });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create user' });
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

// --- Bot Market Maker ---

function queueAndWait(endpoint: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
        const id = generate();
        const timeout = setTimeout(() => {
            subscriber.unsubscribe(id);
            reject(new Error(`Timeout waiting for ${endpoint}`));
        }, 5000);

        subscriber.subscribe(id, (message: any) => {
            clearTimeout(timeout);
            subscriber.unsubscribe(id);
            resolve(message);
        });

        queue(endpoint, data, id);
    });
}

function queueFireAndForget(endpoint: string, data: any): void {
    const id = generate();
    queue(endpoint, data, id);
}

function normalRandom(mean: number, stddev: number): number {
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + z * stddev;
}

function randInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clampPrice(p: number): number {
    return Math.max(10, Math.min(990, Math.round(p / 10) * 10));
}

function generateOrders(stockSymbol: string, botUsers: string[]): number {
    let fairPrice = 500 + randInt(-50, 50);
    let orderCount = 0;

    for (let round = 0; round < 5; round++) {
        // Bids: 3 buy YES orders below fair price
        for (let i = 0; i < 3; i++) {
            const price = clampPrice(normalRandom(fairPrice - 40, 30));
            const quantity = randInt(1, 15);
            const userId = botUsers[randInt(0, botUsers.length - 1)];
            queueFireAndForget("/order/buy", { userId, stockSymbol, quantity, price, stockType: "yes" });
            orderCount++;
        }

        // Asks: 3 buy NO orders (appears as YES sell side)
        for (let i = 0; i < 3; i++) {
            const noPrice = clampPrice(normalRandom((1000 - fairPrice) - 40, 30));
            const quantity = randInt(1, 15);
            const userId = botUsers[randInt(0, botUsers.length - 1)];
            queueFireAndForget("/order/buy", { userId, stockSymbol, quantity, price: noPrice, stockType: "no" });
            orderCount++;
        }

        // Crossing trades: 1-2 aggressive orders that cross the spread
        const crossCount = randInt(1, 2);
        for (let i = 0; i < crossCount; i++) {
            const userId = botUsers[randInt(0, botUsers.length - 1)];
            if (Math.random() > 0.5) {
                // Aggressive YES buy at/above fair
                const price = clampPrice(fairPrice + randInt(0, 20));
                queueFireAndForget("/order/buy", { userId, stockSymbol, quantity: randInt(1, 5), price, stockType: "yes" });
            } else {
                // Aggressive NO buy at/above complement
                const price = clampPrice((1000 - fairPrice) + randInt(0, 20));
                queueFireAndForget("/order/buy", { userId, stockSymbol, quantity: randInt(1, 5), price, stockType: "no" });
            }
            orderCount++;
        }

        // Price drift
        fairPrice += randInt(-15, 15);
        fairPrice = Math.max(100, Math.min(900, fairPrice));
    }

    return orderCount;
}

router.post("/bot", async (req: Request, res: Response) => {
    try {
        const { stockSymbol } = req.body;
        if (!stockSymbol) {
            res.status(400).json({ error: "stockSymbol is required" });
            return;
        }

        // Phase 1: Create bot users, fund them, create symbol
        const botUsers: string[] = [];
        for (let i = 0; i < 5; i++) {
            const userId = `bot_${stockSymbol}_${i}_${Date.now()}`;
            await queueAndWait("/user/create/:userId", { userId });
            // Amount in paise (bypassing Express route, no ×100 conversion)
            await queueAndWait("/onramp/inr", { userId, amount: 500000 });
            botUsers.push(userId);
        }

        await queueAndWait("/symbol/create/:stockSymbol", { stockSymbol });

        // Phase 2: Generate orders (fire & forget)
        const ordersPlaced = generateOrders(stockSymbol, botUsers);

        // Phase 3: Return summary
        res.json({
            message: "Bot market maker started",
            botsCreated: botUsers.length,
            ordersPlaced,
            stockSymbol,
        });
    } catch (err) {
        console.error("Bot error:", err);
        res.status(500).json({ error: "Bot market maker failed" });
    }
})