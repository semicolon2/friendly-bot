'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = convertTemp;
function convertTemp(message) {
    var temp = /-?\d+?[f,c]/i.exec(message.content);
    if (!temp) {
        return;
    }
    temp = temp[0];
    if (temp.endsWith('f') || temp.endsWith('F')) {
        var degrees = temp.slice(0, -1);
        degrees = Math.floor((degrees - 32) / 1.8);
        message.channel.send(temp.toLowerCase() + " = " + degrees + "c");
    } else if (temp.endsWith('c') || temp.endsWith('C')) {
        var degrees = temp.slice(0, -1);
        degrees = Math.floor(degrees * 1.8 + 32);
        message.channel.send(temp.toLowerCase() + " = " + degrees + "f");
    }
}