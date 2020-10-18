const { getQuote, addQuote, modifyQuote, serverQuotes } = require("./db");
const fs = require("fs");

async function quote(message) {
  if (message.content.slice(7)) {
    if (isNaN(message.content.slice(7))) {
      return "Quote request must be a number";
    } else if (message.content.slice(7) < 0) {
      return "Quote request must be a positive number";
    } else {
      try {
        let { quote, quoteID } = await getQuote(
          message.guild.id,
          message.content.slice(7)
        );
        return quoteID + ": " + quote;
      } catch (e) {
        console.error(e);
        return "Error finding quote";
      }
    }
  } else {
    try {
      let { quote, quoteID } = await getQuote(message.guild.id);
      return quoteID + ": " + quote;
    } catch (e) {
      console.error(e);
      return "Error finding quote";
    }
  }
}

async function newQuote(message) {
  if (!message.content.slice(10)) {
    return "Cannot create empty quote";
  } else {
    try {
      let newQuote = await addQuote(
        message.content.slice(10),
        message.guild.id
      );
      return "Quote number " + newQuote.id + " has been added";
    } catch (e) {
      console.error(e);
      return "Error saving quote x_x";
    }
  }
}

async function editQuote(message) {
  let quoteNumber = /^\d+/.exec(message.content.slice(11));
  if (!quoteNumber) {
    return "usage: !modifyquote [number] [new quote]";
  } else if (!message.content.slice(11 + quoteNumber[0].length)) {
    return "Cannot create an empty quote";
  } else {
    try {
      let quote = await modifyQuote(
        message.content.slice(11 + quoteNumber[0].length),
        message.guild.id,
        quoteNumber[0]
      );
      return "Quote " + quote.id + " has been modified";
    } catch (e) {
      console.error(e);
      return "Error editing quote";
    }
  }
}

async function exportQuotes(message) {
  try {
    let quotes = await serverQuotes(message.guild.id);
    let quotestr = quotes.reduce((file, quote) => {
      return file + quote.id + "," + '"' + quote.quote + '"' + "\r\n";
    }, "");
    fs.writeFile("export.csv", quotestr, (err) => {
      if (err) throw err;
    });
    return { files: [{ attachment: "export.csv", name: "export.csv" }] };
  } catch (e) {
    console.error(e);
    return "Error getting quotes list";
  }
}

module.exports = {
  quote,
  newQuote,
  editQuote,
  exportQuotes,
};
