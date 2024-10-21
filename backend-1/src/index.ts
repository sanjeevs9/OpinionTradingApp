import { Request,Response } from "express";
// const {router}=require("../src/routes/index.ts")
import { router } from "./routes";
import cors from "cors"
import start from "./redis";


import express  from "express";
const app=express();
const PORT=3000;
app.use(express.json());
app.use(cors());

//call redis function 
start();

app.get("/",(req:Request,res:Response)=>{
     res.json({
        message:"hi form backend"
    })
    return;
})

//test redis




app.use("/",router);

app.listen(PORT,()=>{
    console.log(`Backend is up and working on PORT${PORT}`);
})