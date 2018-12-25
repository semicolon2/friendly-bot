const vendlist = require("../vendlist.json");

module.exports = function vend() {
    let item;

    // One in ten chance of a special vend
    if (Math.floor(Math.random() *  10) + 1 == 10) {
        item = vendlist["special"][Math.floor(Math.random() * vendlist["special"].length)];
    } else {
        item = vendlist["items"][Math.floor(Math.random() * vendlist["items"].length)];
    }

    return "It vends " + item;
};