const { Pool } = require("pg");
var client;

module.exports.connect = function(dbURI) {
    client = new Pool({
        connectionString: dbURI
    });
}

module.exports.updateServer = function() {
    return new Promise(function(fulfill, reject) {
        client.query("UPDATE quotes SET guild = '337445976006459393' WHERE guild = '318318372464885762'", (err, res) => {
            if (err) {
                reject(err);
            } else {
                fulfill("success");
            }
        });
    });
}

module.exports.getQuote = function(guildID, quoteID = null) {
    return new Promise(function(fulfill, reject) {
        if (quoteID) {
            client.query("SELECT quote FROM quotes WHERE guild = $1 AND id = $2", [guildID, quoteID], (err, res) => {
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
            client.query("SELECT COUNT(*) FROM quotes WHERE guild = $1", [guildID], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    client.query("SELECT quote FROM quotes WHERE guild = $1 AND id = $2", [guildID, Math.floor(Math.random() * res.rows[0].count)], (err, res) => {
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

module.exports.addQuote = function(quote, guildID) {
    return new Promise(function(fulfill, reject) {
        client.query("SELECT id FROM quotes WHERE guild = $1 ORDER BY id desc LIMIT 1", [guildID], (err, res) => {
            if (err) {
                reject(err);
            } else {
                var quoteID = res.rows[0].id + 1;
                client.query("INSERT INTO quotes(id, guild, quote) VALUES($1, $2, $3) RETURNING *", [quoteID, guildID, quote], (err, res) => {
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

module.exports.modifyQuote = function(quote, guildID, quoteID) {
    return new Promise(function(fulfill, reject) {
        client.query("UPDATE quotes SET quote = $1 WHERE guild = $2 AND id = $3 RETURNING *", [quote, guildID, parseInt(quoteID)], (err, res) => {
            if (err) {
                reject(err);
            } else {
                fulfill(res.rows[0]);
            }
        });
    });
}

module.exports.removeQuote = function(quoteID, guildID) {
    return new Promise(function(fulfill, reject) {
        client.query("UPDATE quotes SET id = -1 WHERE guild = $1 AND id = $2 RETURNING *", [guildID, parseInt(quoteID)], (err, res) => {
            if (err) {
                reject(err);
            } else {
                fulfill(res.rows[0]);
            }
        });
    });
}