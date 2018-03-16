/**
 * Created by Agent47 on 2018/3/6
 * */
"use strict";
const
    request = require('request'),
    url = require('url'),
    promisify = require('util').promisify;

module.exports = function (config, app) {
    /**
     * curl -X POST http://localhost:3000/api/bundle/
     * */
    app.post('/api/bundle', function (req, res) {
        new Promise(function (resolve, reject) {
            request.post({
                url: config.b4db,
                json: {
                    type: 'bundle',
                    name: req.query.name,
                    books: {}
                }
            }, function (err, couchRes, body) {
                if (err) return reject(err);
                resolve([couchRes, body])
            })
        })
            .then(function (args) {
                let
                    couchRes = args[0],
                    body = args[1];
                res.status(couchRes.statusCode).json(body)
            })
            .catch(function (err) {
                res.status(502).json({error: 'bad_gateway', reason: err.code})
            })
    });

    /**
     * curl http://localhost:3000/api/bundle/9a6ec9a4c3bdc4a901c1b1e7c800604e
     * */
    app.get('/api/bundle/:id', function (req, res) {
        promisify(request.get)(url.resolve(config.b4db, req.params.id))
            .then(data =>
                res.status(data.statusCode)
                    .json(data.body)
            )
            .catch(err =>
                res.status(502).json({error: 'bad_gateway', reason: err.code})
            )
    });

    app.put('/api/bundle/:id/name/:name', function (req, res) {
        promisify(request.get)(url.resolve(config.b4db, req.params.id))
            .then(data => {
                // 已经存在 还需要操作
                if (data.statusCode !== 200) {
                    return data
                }

                // data.body 是字符串

                return promisify(request.put)({
                    url: url.resolve(config.b4db, req.params.id),
                    json: Object.assign(JSON.parse(data.body), {name: req.params.name})
                })
            })
            .then(data =>
                res
                    .status(data.statusCode)
                    .json(data.body)
            )
            .catch(err =>
                res.status(502)
                    .json({error: "bad_gateway", reason: err.code})
            )
    });

    app.put('/api/bundle/:id/book/:pgid', function (req, res) {
        let
            get = promisify(request.get),
            put = promisify(request.put);

        (async function () {
            let args, couchRes, bundle, book;

            // grab the bundle from the b4 database
            couchRes = await get(config.b4db + req.params.id);
            bundle = JSON.parse(couchRes.body);

            // fail fast if we couldn't retrieve the bundle
            if (couchRes.statusCode !== 200) {
                return res.status(couchRes.statusCode).json(couchRes.body)
            }
            // look up the book by its Project Gutenberg ID
            couchRes = await get(config.bookdb + req.params.pgid);
            book = JSON.parse(couchRes.body);

            // fail fast if we couldn't retrieve the book
            if (couchRes.statusCode !== 200) {
                return res.status(couchRes.statusCode).json(book)
            }

            // add the book to the bundle and put it back in CouchDB
            bundle.books[book._id] = book.title;
            couchRes = await put({url: config.b4db + bundle._id, json: bundle})
            res.status(couchRes.statusCode).json(couchRes.body)
        }())
            .catch(err =>
                res.status(502).json({
                    error: "bad_gateway",
                    reason: err.codes
                })
            )
    })

};

