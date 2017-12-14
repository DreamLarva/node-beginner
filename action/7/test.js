// ./test.js
var assert = require("assert")
    , Keygrip = require("keygrip")
    , keylist, keys, hash, index

// but we're going to use our list.
// (note that the 'new' operator is optional)
keylist = ["SEKRIT3", "SEKRIT2", "SEKRIT1"]
keys = Keygrip(keylist)
// .sign returns the hash for the first key
// all hashes are SHA1 HMACs in url-safe base64
hash = keys.sign("bieberschnitzel")
assert.ok(/^[\w\-]{27}$/.test(hash))

// .index returns the index of the first matching key
index = keys.index("bieberschnitzel", hash)
assert.equal(index, 0)

// .verify returns the a boolean indicating a matched key
matched = keys.verify("bieberschnitzel", hash)
assert.ok(matched)

index = keys.index("bieberschnitzel", "o_O")
assert.equal(index, -1)

// rotate a new key in, and an old key out
keylist.unshift("SEKRIT4")
keylist.pop()

// if index > 0, it's time to re-sign
index = keys.index("bieberschnitzel", hash)
assert.equal(index, 1)
hash = keys.sign("bieberschnitzel")