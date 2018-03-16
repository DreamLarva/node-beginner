/**
 * Created by Agent47 on 2018/3/5
 * */
"use strict";
const request = require('request');

module.exports = function (config, app) {
    app.get('/api/search/:view', function (req, res) {
        request({
            method: 'GET',
            url: `${config.bookdb}_design/books/_view/by_${req.params.view}`,
            qs: {

                startkey: JSON.stringify(req.query.q),
                endkey: JSON.stringify(req.query.q + '\ufff0'),
                group: true
            }
        }, function (err, couchRes, body) {
            // couldn't connect to CouchDB
            if (err) {
                return res.json(502, {error: 'bad_gateway', reason: err.code})

            }

            // CouchDB couldn't process our request
            if (couchRes.statusCode !== 200) {
                return res.json(couchRes.statusCode, JSON.parse(body));
            }

            // send back just the keys we got back from CouchDB
            res.json(JSON.parse(body).rows.map(function (elem) {
                return elem.key
            }))
        })
    })
};