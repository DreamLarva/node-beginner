const data = require("./data");
const fs = require("fs");
const path = require("path");

const keys = {};
for (let item of data) {
    item.key.forEach(function (value) {
        let key = value.replace(/-/, "").toLowerCase();
        !keys[key] && (keys[key] = []);
        keys[key].push({
            path: item.path,
            size: item.size
        })
    })
}

const writeDate = Object.entries(keys).filter(v => v[1].length > 1)
    .map(function (v) {
        return [v[0], v[1].sort(function (a, b) {
            return b.size - a.size
        })]


    });
fs.writeFileSync(path.resolve(__dirname, "result.json"), JSON.stringify(writeDate));