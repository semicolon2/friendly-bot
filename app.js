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

function playSound(connection, fileName) {

    if (connection.speaking == true) {
        soundQueue.push({ connection: connection, fileName: fileName });
    } else {
        connection.playFile('./sounds/' + fileName).on('end', () => {
            if (soundQueue.length == 0) {
                connection.disconnect();
            } else {
                if (soundQueue.length > 5) {
                    nextSound = { "connection": soundQueue[0].connection, "fileName": 'sheep.mp3' };
                    soundQueue = [];
                } else {
                    nextSound = soundQueue[0];
                    soundQueue.splice(0, 1);
                }
                playSound(nextSound.connection, nextSound.fileName);
            }
        });
    }
}

//quote controls

function saveQuote(quote, guildID) {
    return new Promise(function(fulfill, reject) {
        Quote.findOne({ "guild": guildID }, {}, { sort: { 'id': -1 } }, (err, lastID) => {
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

bot.on('message', message => {

    //help message, lists most commands, vaguely
    if (message.content === '!help') {
        message.channel.sendMessage('!help\n!sergei\n!cory\n!cruel\n!succ\n!blackjack\n!ohshit\n!wah\n!uptown\n!yee\n!bees\n!ooh\n!time\n!where\n!addquote (quote here)\n!quote\n!quote (number for quote)\n!modifyQuote (quote number) (replacement)\n!removeQuote (quote number)');
    }

    if (message.content === '!ohshit') {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join().then(connection => {
                playSound(connection, 'oh_shit.wav');
            }, error => {
                console.error(error);
            });
        } else {
            return;
        }
    }
    if (message.content === '!smash') {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join().then(connection => {
                playSound(connection, 'smash.wav');
            }, error => {
                console.error(error);
            });
        } else {
            return;
        }
    }
    if (message.content === '!succ') {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join().then(connection => {
                playSound(connection, 'succ.wav');
            }, error => {
                console.error(error);
            });
        } else {
            return;
        }
    }
    if (message.content === '!ducc') {
        message.channel.sendMessage("https://i.imgur.com/tqSfO6z.jpg");
    }
    if (message.content === '!clucc') {
        message.channel.sendMessage("https://cdn.discordapp.com/attachments/211938490995179521/281669230976565249/f0db1b8cd9d0ed7a54e571dc340e8ec4e609d1fee854c2fecdbf3bb63e3f338c_1.jpg");
    }

    if (message.content === '!wah') {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join().then(connection => {
                var wah = "waluigi/wah" + Math.floor((Math.random() * 12) + 1) + ".wav";
                playSound(connection, wah);
            }, error => {
                console.error(error);
            });
        } else {
            return;
        }
    }
    if (message.content === '!uptown') {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join().then(connection => {
                playSound(connection, 'wahh.wav');
            }, error => {
                console.error(error);
            });
        } else {
            return;
        }
    }
    if (message.content === '!yee') {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join().then(connection => {
                playSound(connection, 'yee.wav');
            }, error => {
                console.error(error);
            });
        } else {
            return;
        }
    }
    if (message.content === '!yeefull') {
        message.channel.sendMessage("no");
        // if(message.member.voiceChannel){
        //     message.member.voiceChannel.join().then(connection =>{
        //         playSound(connection, 'yeefull.mp3');
        //     });
        // } else {
        //     return;
        // }
    }
    if (message.content === '!cory') {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join().then(connection => {
                playSound(connection, 'cory.wav');
            }, error => {
                console.error(error);
            });
        } else {
            return;
        }
    }
    if (message.content === '!cruel') {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join().then(connection => {
                playSound(connection, 'cruel.wav');
            }, error => {
                console.error(error);
            });
        } else {
            return;
        }
    }
    if (message.content === '!bees') {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join().then(connection => {
                playSound(connection, 'Dr_Bees.wav');
            }, error => {
                console.error(error);
            });
        } else {
            return;
        }
    }
    if (message.content === '!ooh') {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join().then(connection => {
                playSound(connection, 'ooooh.wav');
            }, error => {
                console.error(error);
            });
        } else {
            return;
        }
    }
    if (message.content === '!myah') {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join().then(connection => {
                playSound(connection, 'myah.wav');
            }, error => {
                console.error(error);
            });
        } else {
            return;
        }
    }
    if (message.content === '!time') {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join().then(connection => {
                playSound(connection, 'timetostop.wav');
            }, error => {
                console.error(error);
            });
        } else {
            return;
        }
    }
    if (message.content === '!where') {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join().then(connection => {
                playSound(connection, 'yourparents.wav');
            }, error => {
                console.error(error);
            });
        } else {
            return;
        }
    }

    if (message.content === '!wakemeup') {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join().then(connection => {
                playSound(connection, 'wake.wav');
            }, error => {
                console.error(error);
            });
        } else {
            return;
        }
    }

    if (message.content === '!bee') {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join().then(connection => {
                playSound(connection, 'bee.wav');
            }, error => {
                console.error(error);
            });
        } else {
            return;
        }
    }

    if (message.content === '!easymode') {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join().then(connection => {
                playSound(connection, 'easymode.mp3');
            }, error => {
                console.error(error);
            });
        } else {
            return;
        }
    }

    if (message.content === '!lutebear') {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join().then(connection => {
                playSound(connection, 'lute.wav');
            }, error => {
                console.error(error);
            });
        } else {
            return;
        }
    }

    if (message.content === '!bigboy') {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join().then(connection => {
                playSound(connection, 'bigboy.wav');
            }, error => {
                console.error(error);
            });
        } else {
            return;
        }
    }

    if (message.content === '!raygay') {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join().then(connection => {
                playSound(connection, 'imgay.mp3');
            }, error => {
                console.error(error);
            });
        } else {
            return;
        }
    }

    if (message.content === '!mhmm') {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join().then(connection => {
                var mhmm = "nick/Mhmm" + Math.floor((Math.random() * 15)) + ".wav";
                playSound(connection, mhmm);
            }, error => {
                console.error(error);
            });
        } else {
            return;
        }
    }

    if (message.content === '!frick') {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join().then(connection => {
                playSound(connection, 'frick.wav');
            }, error => {
                console.error(error);
            });
        } else {
            return;
        }
    }

    if (message.content === '!yes') {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join().then(connection => {
                playSound(connection, 'yes.mp3');
            }, error => {
                console.error(error);
            });
        } else {
            return;
        }
    }

    if (message.content === '!itsben') {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join().then(connection => {
                playSound(connection, 'itsben.wav');
            }, error => {
                console.error(error);
            });
        } else {
            return;
        }
    }

    if (message.content === '!dayman') {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join().then(connection => {
                playSound(connection, 'dayman.wav');
            }, error => {
                console.error(error);
            });
        } else {
            return;
        }
    }


    if (chill.test(message.content)) {
        message.channel.sendMessage("No you chill!");
        return;
    }

    if (message.content === '!sergei') {
        message.channel.sendMessage("https://gifsound.com/?gif=i.imgur.com/HfbMsaE.gif&v=dXYs5GsnMbI&s=23");
    }

    if (message.content === '!ground') {
        message.channel.sendMessage("D:");
        grounded = true;
    }
    if (message.content === '!forgive') {
        message.channel.sendMessage(":D");
        grounded = false;
    }


    if (regEightBall.test(message.content)) {
        if (grounded) {
            message.channel.sendMessage("I've been a bad bot & got grounded :C");
            return;
        }

        var content = message.content.slice(7);

        if (content === "") {
            message.channel.sendMessage("  ");
        } else if (goingToDie.test(message.content)) {
            message.channel.sendMessage("Everyone will die some day.");
        } else if (areYouGay.test(message.content)) {
            message.channel.sendMessage("I couldn't stop thinking about my stupid ex girlfriend!");
        } else if (lesbian.test(content)) {
            message.channel.sendMessage("The other L word.");
        } else if (lesbians.test(content)) {
            message.channel.sendMessage("I'm talking about love, Scott!");
        } else if (bread.test(content)) {
            message.channel.sendMessage("BREAD MAKES YOU FAT?!");
        } else if (goodnight.test(content)) {
            message.channel.sendMessage("Goodnight!");
        } else if (heTries.test(content)) {
            message.channel.sendMessage("oh mY GOD do I try");
        } else if (coffeeCheck.test(content)) {
            message.channel.sendMessage(eightBall[Math.floor(Math.random() * 8)]);
        } else if (vagueCheck.test(message.content.slice(6))) {
            message.channel.sendMessage("plz, I can't read minds");
        } else if (valentine.test(content)) {
            message.channel.sendMessage(eightBall[Math.floor(Math.random() * 8)]);
            // } else if (message.author.id === 158084776509571074) {
            //     message.channel.sendMessage(eightBall[Math.floor(Math.random()*8)]);
        } else
            message.channel.sendMessage(eightBall[Math.floor(Math.random() * eightBall.length)]);
    }

    //==================quote commands==========================================

    //add a quote
    if (addQuote.test(message.content)) {
        saveQuote(message.content.slice(10), message.guild.id).then((newQuote) => {
            message.channel.sendMessage("Quote number " + (newQuote.id) + " has been added");
        }, (err) => {
            console.log(err);
            message.channel.sendMessage("Error saving quote x_x");

        });

    }

    //get a quote
    if (quoteCommand.test(message.content)) {
        if (findQuote.test(message.content)) { //find a specific quote by number?
            getQuote(message.guild.id, message.content.slice(7)).then((quote) => {
                message.channel.sendMessage(quote);
            }, (err) => {
                console.log(err);
            });
        } else { //get a random quote
            getQuote(message.guild.id).then((quote) => {
                message.channel.sendMessage(quote);
            }, (err) => {
                console.log(err);
            });
        }
    }

    //modify a quote
    if (modifyQuoteReg.test(message.content)) {
        var quoteNumber = regQuoteNumber.exec(message.content);
        if (!message.content.slice(14 + quoteNumber.length)) {
            message.channel.sendMessage("Don't make an empty quote, asshole");
            return;
        }
        modifyQuote(message.content.slice(14 + quoteNumber.length), message.guild.id, quoteNumber).then((response) => {
            message.channel.sendMessage(response);
        }, (err) => {
            console.log(err);
        });
    }

    //remove a quote
    if (removeQuoteReg.test(message.content)) {
        if (message.author.id == 145650335170428928) {
            var quoteNumber = regQuoteNumber.exec(message.content);
            removeQuote(quoteNumber, message.guild.id).then((response) => {
                message.channel.sendMessage(response);
            }, (err) => {
                console.log(err);
            });
        } else {
            message.channel.sendMessage("Only Ben gets to do that, you'd probably fuck it up");
        }
    }
});

function beRude() {
    var rude = Math.floor(Math.random() * 101);
    if (rude === (42 || 57 || 98)) {
        return ("There is no quote with that number, dumbass");
    } else {
        return ("There is no quote with that number");
    }
}

app.listen(app.get('port'), function() {
    console.log('listening on port ', app.get('port'));
});