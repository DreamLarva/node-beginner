// 错误处理
function errprHandler() {
    const env = process.env.Node_ENV || 'development';
    return function (err, req, res, next) {
        res.statusCode = 500;
        switch (env) {
            case 'development':
                // 开发阶段发送完整的错误
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(err));
                break;
            default:
                // 生产环境 只发送错误提示
                res.end("Server err");
        }
    }
}