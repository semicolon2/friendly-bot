import { Pool } from "pg";

const client = new Pool({
  connectionString: process.env.DATABASE_URL
});

export function getQuote(guildID, quoteID = null) {
  return new Promise(function(fulfill, reject) {
    if (quoteID) {
      client.query(
        "SELECT quote FROM quotes WHERE guild = $1 AND id = $2",
        [guildID, quoteID],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            if (res.rowCount == 0) {
              reject("No quote with that number exists");
            } else {
              fulfill({ quote: res.rows[0].quote, quoteID });
            }
          }
        }
      );
    } else {
      client.query(
        "SELECT COUNT(*) FROM quotes WHERE guild = $1",
        [guildID],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            quoteID = Math.floor(Math.random() * res.rows[0].count);
            client.query(
              "SELECT quote FROM quotes WHERE guild = $1 AND id = $2",
              [guildID, quoteID],
              (err, res) => {
                if (err) {
                  reject(err);
                } else {
                  fulfill({ quote: res.rows[0].quote, quoteID });
                }
              }
            );
          }
        }
      );
    }
  });
}

export function addQuote(quote, guildID) {
  return new Promise(function(fulfill, reject) {
    client.query(
      "SELECT id FROM quotes WHERE guild = $1 ORDER BY id desc LIMIT 1",
      [guildID],
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          var quoteID = res.rows[0].id + 1;
          client.query(
            "INSERT INTO quotes(id, guild, quote) VALUES($1, $2, $3) RETURNING *",
            [quoteID, guildID, quote],
            (err, res) => {
              if (err) {
                reject(err);
              } else {
                fulfill(res.rows[0]);
              }
            }
          );
        }
      }
    );
  });
}

export function modifyQuote(quote, guildID, quoteID) {
  return new Promise(function(fulfill, reject) {
    client.query(
      "UPDATE quotes SET quote = $1 WHERE guild = $2 AND id = $3 RETURNING *",
      [quote, guildID, parseInt(quoteID)],
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          fulfill(res.rows[0]);
        }
      }
    );
  });
}

export function removeQuote(quoteID, guildID) {
  return new Promise(function(fulfill, reject) {
    client.query(
      "UPDATE quotes SET id = -1 WHERE guild = $1 AND id = $2 RETURNING *",
      [guildID, parseInt(quoteID)],
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          fulfill(res.rows[0]);
        }
      }
    );
  });
}

export function exportQuotes(guildID) {
  return new Promise(function(fulfill, reject) {
    client.query(
      "SELECT id, quote from quotes WHERE guild = $1 ORDER BY id",
      [guildID],
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          fulfill(res.rows);
        }
      }
    );
  });
}
