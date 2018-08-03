import { getQuote, addQuote, modifyQuote, exportQuotes } from "./db";
import fs from "fs";

export function getAQuote(message) {
  if (message.content.slice(7)) {
    if (isNaN(message.content.slice(7))) {
      return "Quote request must be a number";
    } else if (message.content.slice(7) < 0) {
      return "Quote request must be a positive number";
    } else {
      getQuote(message.guild.id, message.content.slice(7)).then(
        ({ quote, quoteID }) => {
          return quoteID + ": " + quote;
        },
        err => {
          return err;
        }
      );
    }
  } else {
    getQuote(message.guild.id).then(
      ({ quote, quoteID }) => {
        return quoteID + ": " + quote;
      },
      err => {
        return err;
      }
    );
  }
}

export function addAQuote(message) {
  if (!message.content.slice(10)) {
    return "Cannot create empty quote";
  } else {
    addQuote(message.content.slice(10), message.guild.id).then(
      newQuote => {
        return "Quote number " + newQuote.id + " has been added";
      },
      err => {
        console.log(err);
        return "Error saving quote x_x";
      }
    );
  }
}

export function modifyAQuote(message) {
  let quoteNumber = /^ \d+/.exec(message.content.slice(12));
  if (!quoteNumber) {
    return "usage: !modifyquote [number] [new quote]";
  } else if (!message.content.slice(13 + quoteNumber[0].length)) {
    return "Cannot create an empty quote";
  } else {
    modifyQuote(
      message.content.slice(13 + quoteNumber[0].length),
      message.guild.id,
      quoteNumber[0]
    ).then(
      quote => {
        return "Quote " + quote.id + " has been modified";
      },
      err => {
        console.log(err);
      }
    );
  }
}

export function exportAllQuotes(message) {
  exportQuotes(message.guild.id).then(
    quotes => {
      let quotestr = quotes.reduce((file, quote) => {
        return file + quote.id + " " + quote.quote + "\r\n";
      }, "");
      fs.writeFile("export.csv", quotestr, err => {
        if (err) {
          console.log(err);
        } else {
          return { files: ["export.csv"] };
        }
      });
    },
    err => {
      console.log(err);
    }
  );
}
