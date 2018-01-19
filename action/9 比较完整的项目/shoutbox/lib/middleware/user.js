const User = require("../user");


module.exports = function (req, res, next) {
    if (req.remoteUser) {
        res.locals.user = req.remoteUser;
    }
    // 从会话中取出已登录的用户的ID
    const uid = req.session.uid;
    if (!uid) return next();
    User.get(uid, function (err, user) {
        // 从Redis 中取出已登录用户逇数据
        if (err) return next(err);
        // 将用户的数据输出到响应对象中
        req.user = res.locals.user = user;
        next()
    })
};