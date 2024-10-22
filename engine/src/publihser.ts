import { publisher } from "./start"

export default async function publish(id:string,data:string){
    try{
        await publisher.publish(`${id}`,data);
    }catch(err){
        console.log(err);
    }
}