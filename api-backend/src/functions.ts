import { client } from "./redis.ts/start";

export function generate(){
    let num="";
    const alpha="ABCDEFGHIJKLMNOPQRSTUVQXYZ"
    for(let i=0;i<5;i++){
        const n=Math.floor(Math.random()* 10);
        num+=n;
        const char=alpha.charAt(Math.floor(Math.random()*alpha.length));
        num+=char;
    }
    return num;
}

export async  function queue(endpoint:string,data:object,id:string){
    const message={
        endpoint:endpoint,
        data:data,
        id:id
    }
    console.log(endpoint);

    await client.lPush("endpoint",JSON.stringify(message));

}