const parse = require('url').parse;
module.exports = function route(obj) {
    return function (req, res, next) {
        if ((!obj[req.method])) {
            next();
            return
        }
        const routes = obj[req.method];
        const url = parse(req.url);
        const paths = Object.keys(routes);

        for (let i = 0; i < paths.length; i++) {
            let path = paths[i];
            const fn = routes[path];
            path = path
                .replace(/\//g, '\\/')             // 为了使用字符串匹配 url 所以要要替换 \ 为 \\
                .replace(/:(\w+)/g, '([^\\/]+)');  // 匹配 :id  的部分也作为正则
            const re = new RegExp('^' + path + "$");
            const captures = url.pathname.match(re);
            if (captures) {
                const args = [req, res].concat(captures.slice(1));
                fn.apply(null, args); // 最终得到的参数是 (req,res,:id...)
                return
            }
        }
        next()
    }
};