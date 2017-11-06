"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getQuote = getQuote;
exports.addQuote = addQuote;
exports.modifyQuote = modifyQuote;
exports.removeQuote = removeQuote;

var _pg = require("pg");

var client = new _pg.Pool({
    connectionString: process.env.DATABASE_URL
});

function getQuote(guildID) {
    var quoteID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    return new Promise(function (fulfill, reject) {
        if (quoteID) {
            client.query("SELECT quote FROM quotes WHERE guild = $1 AND id = $2", [guildID, quoteID], function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    if (res.rowCount == 0) {
                        fulfill("No quote with that number exists");
                    } else {
                        fulfill(res.rows[0].quote);
                    }
                }
            });
        } else {
            client.query("SELECT COUNT(*) FROM quotes WHERE guild = $1", [guildID], function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    client.query("SELECT quote FROM quotes WHERE guild = $1 AND id = $2", [guildID, Math.floor(Math.random() * res.rows[0].count)], function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            fulfill(res.rows[0].quote);
                        }
                    });
                }
            });
        }
    });
}

function addQuote(quote, guildID) {
    return new Promise(function (fulfill, reject) {
        client.query("SELECT id FROM quotes WHERE guild = $1 ORDER BY id desc LIMIT 1", [guildID], function (err, res) {
            if (err) {
                reject(err);
            } else {
                var quoteID = res.rows[0].id + 1;
                client.query("INSERT INTO quotes(id, guild, quote) VALUES($1, $2, $3) RETURNING *", [quoteID, guildID, quote], function (err, res) {
                    if (err) {
                        reject(err);
                    } else {
                        fulfill(res.rows[0]);
                    }
                });
            }
        });
    });
}

function modifyQuote(quote, guildID, quoteID) {
    return new Promise(function (fulfill, reject) {
        client.query("UPDATE quotes SET quote = $1 WHERE guild = $2 AND id = $3 RETURNING *", [quote, guildID, parseInt(quoteID)], function (err, res) {
            if (err) {
                reject(err);
            } else {
                fulfill(res.rows[0]);
            }
        });
    });
}

function removeQuote(quoteID, guildID) {
    return new Promise(function (fulfill, reject) {
        client.query("UPDATE quotes SET id = -1 WHERE guild = $1 AND id = $2 RETURNING *", [guildID, parseInt(quoteID)], function (err, res) {
            if (err) {
                reject(err);
            } else {
                fulfill(res.rows[0]);
            }
        });
    });
}