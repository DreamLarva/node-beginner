function parseField(field){
    // 解析[ ]
    return field
        .split(/[\[\]]/)
        .filter(v => v) // 过滤undefined
}
function getField(req,field){
    let val = req.body;

    // 获取属性的值
    field.forEach(function(prop){ // 自然忽略field 中所有的undefined
        val = val[prop]
    });
    return val
}

exports.required = function(field){
  field = parseField(field);
  return function(req,res,next){
      if(getField(req,field)){
          next();
      }else{
          res.error(field.join(' ') + 'is required');
          res.redirect('back');
      }
  }
};

exports.lengthAbove = function(field,len){
    field = parseField(field);
    return function (req,res,next) {
        if(getField(req,field).length > len){
            next()
        }else{
           res.error(`${field.join(" ")} must have more than ${len} characters`);
           res.redirect('back')

        }
    }
};