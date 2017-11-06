'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = StartServer;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
require('dotenv').config();

function StartServer() {
    app.get('/', function (req, res) {
        res.send('hello world!');
    });

    app.listen(process.env.PORT, function (err) {
        if (err) console.error(err);
        console.log('listening on port ' + process.env.PORT);
    });
}