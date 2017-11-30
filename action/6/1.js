
















function logger(req,res,next){
    "use strict";
    console.log('%s %s',req.method,req.url);
    next()
}
