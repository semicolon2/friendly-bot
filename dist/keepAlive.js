"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = keepAlive;

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function keepAlive() {
    setInterval(function () {
        _http2.default.get("http://whispering-cove-88085.herokuapp.com/");
    }, 1200000);
}