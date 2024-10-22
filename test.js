const inr={
    "user1":{
        balance:3,
        locked:3
    },
    "user2":{
        balance:3,
        locked:3
    }
}

for(const key in inr){
    console.log(key);
    delete inr[key];
}
const order={}
order["user1"]
Object.assign(order,{5:"hello"})
Object.assign(order,{6:"hello"})
Object.assign(order,{2:"hello"})



const a=[1,2,3,4];

a.push("afdsf");
console.log(a.shift());
console.log(a);