const env = require('./env.js');
const express = require('express');
var app = express();
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const Discord = require('discord.js');
const opus = require('node-opus');
const jsonFile = require('jsonfile');
const mongoose = require('mongoose');
const Promise = require('promise');

//keep alive
var http = require("http");

//================for displaying a page with discord request===================
app.set('port', (process.env.PORT || 5000));
app.set('dbURI', (process.env.MONGODB_URI || 'mongodb://localhost/friendlybot'));
app.set('token', (process.env.TOKEN || env.token));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.render('index', { title: 'Friendly-bot' });
});

//=================Database=====================================================
mongoose.connect(app.get('dbURI'));
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var Quote = require(path.join(__dirname, '/schemas/Quotes'));


//================bot & bot logic===============================================
const bot = new Discord.Client();
bot.login(app.get('token'));
bot.on('ready', () => {
    console.log('bot is ready!');
});

//regex for some commands
var quoteCommand = /^!quote/i;
var addQuote = /^!addquote/i;
var modifyQuoteReg = /^!modifyquote/i;
var removeQuoteReg = /^!removequote/i;
var regQuoteNumber = /\d+/;
var regEightBall = /^!8ball/i;
var findQuote = /^!quote \d*/i;
var goingToDie = /going to die/i;
var areYouGay = /are you gay/i;
var lesbian = /^lesbian\?/i;
var lesbians = /^lesbians\?/i;
var bread = /^bread makes you fat/i;
var goodnight = /^goodnight, bot/i;
var heTries = /^and he tries/i;
var coffeeCheck = /coffee/i;
var vagueCheck = / thing/i;
var valentine = / my valentine/i;
var chill = / ?just chill/i;

var eightBall = [
    "It is certain",
    "It is decidedly so",
    "Without a doubt",
    "Yes, definitely",
    "You may rely on it",
    "As I see it, yes",
    "Most likely",
    "Outlook good",
    "Yes",
    "Signs point to yes",
    "Reply hazy try again",
    "Ask again later",
    "Better not tell you now",
    "Cannot predict now",
    "Concentrate and ask again",
    "Don't count on it",
    "My reply is no",
    "My sources say no",
    "Outlook not so good",
    "Very doubtful"
];

var grounded = false;
var soundQueue = [];

function playSound(message, fileName) {
    getConnection(message).then(connection => {
        if (connection.speaking) {
            console.log(connection.channel.id);
            soundQueue.push({ channel: connection.channel.id, message: message, fileName: fileName });
        } else {
            connection.playFile('./sounds/' + fileName).on('end', () => {
                if (soundQueue.length == 0) {
                    connection.disconnect();
                    return;
                }
                let nextSound = null;
                for (let i; i < soundQueue.length; i++) {
                    if (soundQueue[i].channel == connection.voiceChannel.id) {
                        nextSound = soundQueue[i];
                        soundQueue.splice(i, 1);
                        break;
                    }
                }
                if (nextSound) {
                    playSound(nextSound.message, nextSound.fileName);
                } else {
                    connection.disconnect;
                }
            });
        }
    }, error => {
        console.error(error);
    });

}

function getConnection(message) {
    return new Promise(function(fulfill, reject) {
        if (message.member.voiceChannel) {
            if (message.member.voiceChannel.connection) {
                console.log("already connected");
                fulfill(message.member.voiceChannel.connection);
            } else {
                message.member.voiceChannel.join().then(connection => {
                    fulfill(connection);
                }, error => {
                    reject(error);
                });
            }
        }
    });
}

//quote controls

function saveQuote(quote, guildID) {
    return new Promise(function(fulfill, reject) {
        Quote.findOne({ "guild": guildID }, {}, { sort: { "id": -1 } }, (err, lastID) => {
            if (err) {
                reject(err);
            } else {
                var nextID = 0;
                if (lastID) {
                    nextID = lastID.id + 1;
                }
                var newQuote = new Quote({ "id": nextID, "quote": quote, "guild": guildID });
                newQuote.save((err, newQuote) => {
                    if (err) {
                        reject(err);
                    } else {
                        fulfill(newQuote);
                    }
                });
            }
        });
    });
}

function modifyQuote(quote, guildID, quoteID) {
    return new Promise(function(fulfill, reject) {
        Quote.findOneAndUpdate({ "guild": guildID, "id": quoteID }, { "quote": quote }, (err, quote) => {
            if (err) {
                reject(err);
            }
            if (quote) {
                fulfill("Quote " + quote.id + " has been modified");
            } else {
                fulfill(beRude());
            }
        });
    });
}

function removeQuote(quoteID, guildID) {
    return new Promise(function(fulfill, reject) {
        Quote.findOneAndRemove({ "guild": guildID, "id": quoteID }, (err, quote) => {
            if (err) {
                reject(err);
            }
            if (quote) {
                fulfill("Quote " + quote.id + " has been removed");
            } else {
                fulfill(beRude());
            }
        })
    });
}

function getQuote(guildID, quoteID = null) {
    return new Promise(function(fulfill, reject) {
        if (quoteID) {
            Quote.findOne({ "guild": guildID, "id": quoteID }, (err, quote) => {
                if (err) {
                    reject(err);
                }
                if (quote) {
                    fulfill(quote.quote);
                } else {
                    fulfill(beRude());
                }
            });
        } else {
            Quote.find({ "guild": guildID }, (err, quote) => {
                if (err) {
                    reject(err);
                }
                fulfill(quote[Math.floor(Math.random() * quote.length)].quote);
            });
        }
    });
}

bot.on("message", message => {
    if (message.content === '!succ') {
        playSound(message, "succ.wav");
    }
});

app.listen(app.get('port'), function() {
    console.log('listening on port ', app.get('port'));
});