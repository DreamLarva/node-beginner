var a = new Promise((resolve,reject)=>{
    setTimeout(()=>resolve(100),1000)
})

a.then( data =>{
    console.log(data)
    return Promise.resolve(999)
}).then(data => {
    console.log(data)
})

async function b(){
    let data = await a
    console.log("async",data)
}
b()