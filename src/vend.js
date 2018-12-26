const vendlist = require("../vendlist.json");

module.exports = function vend(message) {
    let words = message.content.split(' ');

    let action = words[0].substring(1, words[0].length) + 's ';
    if (action === 'appends ') {
        return append()
    }

    let reason = '';
    if (words.length > 1) {
        words.shift(); // Remove the first word "!vend"
        if (words instanceof(Array)) { // JS non-sense I guess
            reason = words.join(' ');
        } else {
            reason = words;
        }
    }

    return "It " + action + getItem() + ' ' + reason;
};

function append() {
    return "It duct-tapes " + getItem() + " to " + getItem();
}

function getItem() {
// One in ten chance of a special vend
    if (Math.floor(Math.random() *  10) + 1 == 10) {
        return vendlist["special"][Math.floor(Math.random() * vendlist["special"].length)];
    } else {
        return vendlist["items"][Math.floor(Math.random() * vendlist["items"].length)];
    }
}