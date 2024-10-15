const mongoose =require("mongoose");
const {Schema} =mongoose

mongoose.connect("mongodb+srv://sanjeev19kr:lJErYTvlhFjcv9c2@cluster0.bzipi.mongodb.net/probo");

const balanceSchema=new Schema({
    balance:Number,
    locked:Number,
    id:{type:Schema.Types.ObjectId,ref:"User"}
})

const userSchema=new Schema({
    name:String,
    email:mongoose.SchemaType.Email,
    password:String,
})

const OrderBook=new Schema({
    
})

const user=mongoose.model("User",userSchema);



