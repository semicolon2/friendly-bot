const express = require('express');
var app = express();
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const Discord = require('discord.js');
const opus = require('node-opus');
const jsonFile = require('jsonfile');
const Promise = require('promise');

if (fs.existsSync(path.join(__dirname, "/env.js"))) {
    var env = require('./env.js');
}

//keep alive
var http = require("http");
setInterval(function() {
    http.get("http://whispering-cove-88085.herokuapp.com/");
}, 1200000);

//================for displaying a page with discord request===================
app.set('port', (process.env.PORT || 5000));
app.set('dbURI', (process.env.DATABASE_URL || env.dbURI));
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
const db = require("./db.js");
db.connect(app.get("dbURI"));
db.updateServer().then((result) => {
    console.log(result);
}, (err) => {
    console.log(err);
});
//================bot & bot logic===============================================
const bot = new Discord.Client();
bot.login(app.get('token'));
bot.on('ready', () => {
    console.log('bot is ready!');
});

//regex for some commands, mostly 8ball
var regQuoteNumber = /\d+/;
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
var chill = / ?chill[^a-zA-Z]/i;

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
                nextSound = soundQueue[0];
                soundQueue.splice(0, 1);
                playSound(nextSound.connection, nextSound.fileName);
            }
        });
    }
}

var commandList = jsonFile.readFileSync(path.join(__dirname, "/voicecommands.json"));

bot.on('message', message => {

    //bot ignores specified text channel
    if (message.content.startsWith("!ignorechannel")) {
        if (message.guild.channels.exists("name", message.content.slice(15))) {
            ignoreChannel = message.guild.channels.find("name", message.content.slice(15));
            //do the thing here
        } else {
            message.channel.send("channel with that name not found.");
        }
    }

    //for single command => single sound
    for (let command in commandList) {
        if (commandList.hasOwnProperty(command)) {
            if (message.content === command) {
                if (message.member.voiceChannel) {
                    message.member.voiceChannel.join().then(connection => {
                        playSound(connection, commandList[command]);
                    }, error => {
                        console.error(error);
                    });
                } else {
                    return;
                }
            }
        }
    }

    if (message.content === "!wurtz") {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join().then(connection => {
                let wurtz = "wurtz/wurtz" + Math.floor((Math.random() * 10)) + ".mp3";
                playSound(connection, wurtz);
            }, error => {
                console.error(error);
            });
        } else {
            return;
        }
    }

    if (message.content === "!machine") {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join().then(connection => {
                let machine = "machine/Machine" + Math.floor((Math.random() * 5)) + ".wav";
                playSound(connection, machine);
            }, error => {
                console.error(error);
            });
        } else {
            return;
        }
    }

    if (message.content.startsWith("!mhmm")) {
        if (regQuoteNumber.test(message.content)) { //can play a specific numbered mhmm
            if (message.member.voiceChannel) {
                message.member.voiceChannel.join().then(connection => {
                    let mhmm = "nick/Mhmm" + regQuoteNumber.exec(message.content) + ".wav";
                    playSound(connection, mhmm);
                }, error => {
                    console.error(error);
                });
            } else {
                return;
            }
        } else {
            if (message.member.voiceChannel) {
                message.member.voiceChannel.join().then(connection => {
                    let mhmm = "nick/Mhmm" + Math.floor((Math.random() * 15)) + ".wav";
                    playSound(connection, mhmm);
                }, error => {
                    console.error(error);
                });
            } else {
                return;
            }
        }
    }

    if (message.content === '!wah') {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join().then(connection => {
                let wah = "waluigi/wah" + Math.floor((Math.random() * 12)) + ".wav";
                playSound(connection, wah);
            }, error => {
                console.error(error);
            });
        } else {
            return;
        }
    }

    //=============text chat only commands========================

    if (message.content === '!ducc') {
        message.channel.send("https://i.imgur.com/tqSfO6z.jpg");
    }

    if (message.content === '!clucc') {
        message.channel.send("https://cdn.discordapp.com/attachments/211938490995179521/281669230976565249/f0db1b8cd9d0ed7a54e571dc340e8ec4e609d1fee854c2fecdbf3bb63e3f338c_1.jpg");
    }

    if (message.content === '!sergei') {
        message.channel.send("https://gifsound.com/?gif=i.imgur.com/HfbMsaE.gif&v=dXYs5GsnMbI&s=23");
    }


    if (message.content.startsWith("!8ball")) {
        if (grounded) {
            message.channel.send("I've been a bad bot & got grounded :C");
            return;
        }

        let content = message.content.slice(7);

        if (content === "") {
            message.channel.send("  ");
        } else if (goingToDie.test(message.content)) {
            message.channel.send("Everyone will die some day.");
        } else if (areYouGay.test(message.content)) {
            message.channel.send("I couldn't stop thinking about my stupid ex girlfriend!");
        } else if (lesbian.test(content)) {
            message.channel.send("The other L word.");
        } else if (lesbians.test(content)) {
            message.channel.send("I'm talking about love, Scott!");
        } else if (bread.test(content)) {
            message.channel.send("BREAD MAKES YOU FAT?!");
        } else if (goodnight.test(content)) {
            message.channel.send("Goodnight!");
        } else if (heTries.test(content)) {
            message.channel.send("oh mY GOD do I try");
        } else if (coffeeCheck.test(content)) {
            message.channel.send(eightBall[Math.floor(Math.random() * 8)]);
        } else if (vagueCheck.test(message.content.slice(6))) {
            message.channel.send("plz, I can't read minds");
        } else if (valentine.test(content)) {
            message.channel.send(eightBall[Math.floor(Math.random() * 8)]);
        } else
            message.channel.send(eightBall[Math.floor(Math.random() * eightBall.length)]);
    }

    //==================quote commands==========================================

    //add a quote
    if (message.content.startsWith("!addquote")) {
        db.addQuote(message.content.slice(10), message.guild.id).then((newQuote) => {
            message.channel.send("Quote number " + (newQuote.id) + " has been added");
        }, (err) => {
            console.log(err);
            message.channel.send("Error saving quote x_x");

        });

    }

    //get a quote
    if (message.content.startsWith("!quote")) {
        if (findQuote.test(message.content)) { //find a specific quote by number
            if (isNaN(message.content.slice(7))) {
                message.channel.sendMessage("Quote request must be a number");
                return;
            }
            db.getQuote(message.guild.id, message.content.slice(7)).then((quote) => {
                message.channel.send(quote);
            }, (err) => {
                console.log(err);
            });
        } else { //get a random quote
            db.getQuote(message.guild.id).then((quote) => {
                message.channel.send(quote);
            }, (err) => {
                console.log(err);
            });
        }
    }

    //modify a quote
    if (message.content.startsWith("!modifyquote")) {
        var quoteNumber = regQuoteNumber.exec(message.content);
        if (!message.content.slice(14 + quoteNumber.length)) {
            message.channel.send("Don't make an empty quote");
            return;
        }
        db.modifyQuote(message.content.slice(14 + quoteNumber.length), message.guild.id, quoteNumber).then((quote) => {
            message.channel.send("Quote " + quote.id + " has been modified");
        }, (err) => {
            console.log(err);
        });
    }

    //remove a quote
    // if (message.content.startsWith("!removequote")) {
    //     var quoteNumber = regQuoteNumber.exec(message.content);
    //     db.removeQuote(quoteNumber, message.guild.id).then((quote) => {
    //         message.channel.send("Quote " + quoteNumber + " has been removed");
    //     }, (err) => {
    //         console.log(err);
    //     });
    // }
});

app.listen(app.get('port'), function() {
    console.log('listening on port ', app.get('port'));
});