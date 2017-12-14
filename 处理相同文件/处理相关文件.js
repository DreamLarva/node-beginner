const fs = require("fs");
const files = require("./result")


for(let file of files){
    file[1].forEach(function(v,index){
        if(index !== 0){
            try{

                fs.unlinkSync(v.path)

            }catch(e){}

        }

    })


}