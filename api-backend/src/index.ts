import express from "express"
import router from "./router/router";
import { start } from "./redis.ts/start";
import post from "./router/post"

const app=express();
const PORT=3000;
app.use(express.json())

start()
app.use("/",router);
app.use("/",post);

app.listen(PORT,()=>{
    console.log(`backend connected on ${PORT}`);
})

