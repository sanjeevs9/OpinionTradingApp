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
    return Math.max(50, Math.min(950, Math.round(p / 50) * 50));
}

function generateOrders(stockSymbol: string, botUsers: string[]): number {
    let fairPrice = clampPrice(500 + randInt(-1, 1) * 50);
    let orderCount = 0;

    // BUY YES below fair → creates NO orders above (1000-fair)
    // BUY NO below (1000-fair) → creates YES orders above fair
    // This prevents orders from matching each other

    for (let round = 0; round < 5; round++) {
        // YES bids below fair price
        for (let i = 0; i < 3; i++) {
            const price = clampPrice(fairPrice - randInt(1, 4) * 50);
            const quantity = randInt(1, 15);
            const userId = botUsers[randInt(0, botUsers.length - 1)];
            queueFireAndForget("/order/buy", { userId, stockSymbol, quantity, price, stockType: "yes" });
            orderCount++;
        }

        // NO bids below noFair price
        const noFair = 1000 - fairPrice;
        for (let i = 0; i < 3; i++) {
            const noPrice = clampPrice(noFair - randInt(1, 4) * 50);
            const quantity = randInt(1, 15);
            const userId = botUsers[randInt(0, botUsers.length - 1)];
            queueFireAndForget("/order/buy", { userId, stockSymbol, quantity, price: noPrice, stockType: "no" });
            orderCount++;
        }

        // Price drift in steps of 50
        fairPrice += randInt(-1, 1) * 50;
        fairPrice = Math.max(150, Math.min(850, fairPrice));
    }

    return orderCount;
}

// --- Seed All Events ---

const seedSymbols = [
  { name: "INDvsNZ", yesBase: 250 },
  { name: "UEL", yesBase: 600 },
  { name: "YouTube", yesBase: 900 },
  { name: "Bitcoin", yesBase: 300 },
  { name: "NBA", yesBase: 500 },
  { name: "PATvTAM_KABBADI", yesBase: 700 },
  { name: "PAKvsENG", yesBase: 500 },
  { name: "BLRvsPUN_KABBADI", yesBase: 300 },
  { name: "ISL", yesBase: 750 },
  { name: "BREAKING_NEWS", yesBase: 450 },
  { name: "Weather", yesBase: 450 },
  { name: "STOCKS_JPY", yesBase: 650 },
  { name: "Politics", yesBase: 850 },
  { name: "Esports", yesBase: 450 },
  { name: "GTA6", yesBase: 300 },
  { name: "Climate", yesBase: 250 },
  { name: "BGMI", yesBase: 400 },
  { name: "TAX_REFUND", yesBase: 800 },
];

router.post("/seed", async (req: Request, res: Response) => {
  try {
    // Create 10 bot users with big balances
    const botUsers: string[] = [];
    for (let i = 0; i < 10; i++) {
      const userId = `seed_bot_${i}_${Date.now()}`;
      await queueAndWait("/user/create/:userId", { userId });
      await queueAndWait("/onramp/inr", { userId, amount: 10000000 }); // 100,000 Rs in paise
      botUsers.push(userId);
    }

    let totalOrders = 0;

    for (const sym of seedSymbols) {
      // Create symbol
      await queueAndWait("/symbol/create/:stockSymbol", { stockSymbol: sym.name });

      const fair = sym.yesBase; // in paise (e.g. 250 = ₹2.50)
      const noFair = 1000 - fair;

      // ── HOW IT WORKS ──
      // BUY YES at X (no match) → engine creates NO order at (1000-X)
      // BUY NO  at Y (no match) → engine creates YES order at (1000-Y)
      //
      // To avoid orders matching each other:
      //   - BUY YES at prices BELOW fair → creates NO orders ABOVE noFair
      //   - BUY NO at prices BELOW noFair → creates YES orders ABOVE fair
      //   - The NO buys won't match the high-priced NO orders (engine matches ≤ price)
      //
      // Example: INDvsNZ (fair=250, noFair=750)
      //   BUY YES at 200,150,100 → NO orderbook gets 800,850,900
      //   BUY NO  at 700,650,600 → YES orderbook gets 300,350,400
      //   Result: YES side shows ₹3.0,3.5,4.0  |  NO side shows ₹8.0,8.5,9.0

      // Step 1: BUY YES below fair → populates NO orderbook above noFair
      for (let step = 1; step <= 6; step++) {
        const price = clampPrice(fair - step * 50);
        if (price < 50) continue;
        const qty = randInt(5, 25);
        const userId = botUsers[randInt(0, botUsers.length - 1)];
        queueFireAndForget("/order/buy", {
          userId, stockSymbol: sym.name, quantity: qty, price, stockType: "yes",
        });
        totalOrders++;
      }

      // Step 2: BUY NO below noFair → populates YES orderbook above fair
      for (let step = 1; step <= 6; step++) {
        const price = clampPrice(noFair - step * 50);
        if (price < 50) continue;
        const qty = randInt(5, 25);
        const userId = botUsers[randInt(0, botUsers.length - 1)];
        queueFireAndForget("/order/buy", {
          userId, stockSymbol: sym.name, quantity: qty, price, stockType: "no",
        });
        totalOrders++;
      }

      // Step 3: Extra depth at tighter prices (1-2 steps below fair)
      for (let i = 0; i < 3; i++) {
        const yesPrice = clampPrice(fair - randInt(1, 2) * 50);
        const noPrice = clampPrice(noFair - randInt(1, 2) * 50);
        if (yesPrice >= 50) {
          const userId = botUsers[randInt(0, botUsers.length - 1)];
          queueFireAndForget("/order/buy", {
            userId, stockSymbol: sym.name, quantity: randInt(5, 20), price: yesPrice, stockType: "yes",
          });
          totalOrders++;
        }
        if (noPrice >= 50) {
          const userId = botUsers[randInt(0, botUsers.length - 1)];
          queueFireAndForget("/order/buy", {
            userId, stockSymbol: sym.name, quantity: randInt(5, 20), price: noPrice, stockType: "no",
          });
          totalOrders++;
        }
      }
    }

    res.json({
      message: "Seed complete",
      symbolsCreated: seedSymbols.length,
      botsCreated: botUsers.length,
      totalOrders,
      symbols: seedSymbols.map(s => s.name),
    });
  } catch (err) {
    console.error("Seed error:", err);
    res.status(500).json({ error: "Seed failed" });
  }
});

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