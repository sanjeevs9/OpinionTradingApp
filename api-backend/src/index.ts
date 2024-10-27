import express from "express"
import router from "./router/router";
import { start } from "./redis.ts/start";
import post from "./router/post"
import { Request,Response } from "express";

const app=express();
const PORT=3000;
app.use(express.json())

start()
app.use("/",router);
app.use("/",post);

app.get("/hello",(req:Request,res:Response)=>{
     res.json({
        message:"hello from api backend"
    })
    return
})


app.listen(PORT,()=>{
    console.log(`backend connected on ${PORT}`);
})

