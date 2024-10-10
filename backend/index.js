const express =require("express");
const app=express();

app.get("/",function(req,res){
    return res.json({
        message:"sanjeev"
    })
});

app.listen(3000,()=>{
    console.log("backend connected");
});