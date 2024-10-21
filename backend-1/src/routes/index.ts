import express from "express";
export  const router=express.Router();
import get from "../routes/GET"
import create from "../routes/create"

//get routes
router.use("/",get);
router.use("/",create);