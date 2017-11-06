import { Pool } from 'pg';


export default class Database {
    constructor() {
        this.client = new Pool({
            connectionString: process.env.DATABASE_URL
        });
    }

    getQuote(guildID, quoteID = null) {
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

    addQuote(quote, guildID) {
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

    modifyQuote(quote, guildID, quoteID) {
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

    removeQuote(quoteID, guildID) {
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
}