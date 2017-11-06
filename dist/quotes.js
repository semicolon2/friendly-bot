"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getAQuote = getAQuote;
exports.addAQuote = addAQuote;
exports.modifyAQuote = modifyAQuote;

var _db = require("./db");

function getAQuote(message) {
    if (message.content.slice(7)) {
        if (isNaN(message.content.slice(7))) {
            message.channel.send("Quote request must be a number");
        } else {
            (0, _db.getQuote)(message.guild.id, message.content.slice(7)).then(function (quote) {
                message.channel.send(quote);
            }, function (err) {
                console.log(err);
            });
        }
    } else {
        (0, _db.getQuote)(message.guild.id).then(function (quote) {
            message.channel.send(quote);
        }, function (err) {
            console.log(err);
        });
    }
}

function addAQuote(message) {
    if (!message.content.slice(10)) {
        message.channel.send("Cannot create empty quote");
    } else {
        (0, _db.addQuote)(message.content.slice(10), message.guild.id).then(function (newQuote) {
            message.channel.send("Quote number " + newQuote.id + " has been added");
        }, function (err) {
            console.log(err);
            message.channel.send("Error saving quote x_x");
        });
    }
}

function modifyAQuote(message) {
    var quoteNumber = /^ \d+/.exec(message.content.slice(12));
    if (!quoteNumber) {
        message.channel.send("usage: !modifyquote [number] [new quote]");
    } else if (!message.content.slice(13 + quoteNumber.length)) {
        message.channel.send("Cannot create an empty quote");
    } else {
        (0, _db.modifyQuote)(message.content.slice(13 + quoteNumber.length), message.guild.id, quoteNumber[0]).then(function (quote) {
            message.channel.send("Quote " + quote.id + " has been modified");
        }, function (err) {
            console.log(err);
        });
    }
}