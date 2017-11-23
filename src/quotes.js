import {getQuote, addQuote, modifyQuote} from './db';

export function getAQuote(message) {
    if(message.content.slice(7)){
        if (isNaN(message.content.slice(7))) {
            message.channel.send("Quote request must be a number");
        } else {
            getQuote(message.guild.id, message.content.slice(7)).then(({quote, quoteID}) => {
                message.channel.send(quoteID + ": " + quote);
            }, (err) => {
                console.log(err);
            });
        }
    } else {
        getQuote(message.guild.id).then(({quote, quoteID}) => {
            message.channel.send(quoteID + ": " + quote);
        }, (err) => {
            console.log(err);
        });
    }
}

export function addAQuote(message) {
    if(!message.content.slice(10)) {
        message.channel.send("Cannot create empty quote");
    } else {
        addQuote(message.content.slice(10), message.guild.id).then((newQuote) => {
            message.channel.send("Quote number " + (newQuote.id) + " has been added");
        }, (err) => {
            console.log(err);
            message.channel.send("Error saving quote x_x");
        });
    }
}

export function modifyAQuote(message) {
    let quoteNumber = /^ \d+/.exec(message.content.slice(12));
    if (!quoteNumber) {
        message.channel.send("usage: !modifyquote [number] [new quote]");
    } else if(!message.content.slice(13+quoteNumber.length)) {
        message.channel.send("Cannot create an empty quote")
    } else {
        modifyQuote(message.content.slice(13 + quoteNumber.length), message.guild.id, quoteNumber[0]).then((quote) => {
            message.channel.send("Quote " + quote.id + " has been modified");
        }, (err) => {
            console.log(err);
        });
    }
}