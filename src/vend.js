const vendlist = require("../vendlist.json");

module.exports = function vend(message) {
    let words = message.content.split(' ');
    let reason = '';
    if (words.length > 1) {
        words.shift();
        if (words instanceof(Array)) {
            reason = words.join(' ');
        } else {
            reason = words;
        }
    }

    let item;

    // One in ten chance of a special vend
    if (Math.floor(Math.random() *  10) + 1 == 10) {
        item = vendlist["special"][Math.floor(Math.random() * vendlist["special"].length)];
    } else {
        item = vendlist["items"][Math.floor(Math.random() * vendlist["items"].length)];
    }

    return "It vends " + item + ' ' + reason;
};