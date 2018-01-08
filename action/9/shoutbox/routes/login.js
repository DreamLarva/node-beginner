const User = require('../lib/user');

exports.form = function(req,res){
    res.render('login',{title:'Login'})
};

exports.submit = function (req, res, next) {
    const data = {
        pass: req.body.pass,
        name: req.body.name
    };
    User.authenticate(data.name, data.pass, function (err, user) {
        // 检查凭证
        if (err) return next(err);
        if (user) {
            // 会话存储 有效用户的id
            req.session.uid = user.id;
            // 重定向
            res.redirect('/')
        } else {
            // 处理凭证有效的用户
            res.error('Sorry! invalid credentials.');
            // 重定向
            res.redirect('back');
        }
    })
};

exports.logout = function (req,res) {
    // 删除会话
    req.session.destroy(function (err) {
      if(err)throw err;
      res.redirect('/')
    })
};