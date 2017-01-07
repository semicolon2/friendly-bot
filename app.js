const env = require('./env.js');
const express = require('express');
var app = express();
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const Discord = require('discord.js');
var opus = require('opusscript');
const jsonFile = require('jsonfile');

//keep alive
var http = require("http");
setInterval(function() {
    http.get("http://whispering-cove-88085.herokuapp.com");
}, 1200000);

//================for displaying a page with discord request===================
app.set('port', (process.env.PORT || 5000));
app.set('captionKey', (process.env.CAPTION_KEY || env.captionKey))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
   res.render('index', {title: 'Friendly-bot'});
});

app.get('/quotes', function (req, res) {
    res.sendFile((path.join(__dirname, 'quotes.json')));
});

//================bot & bot logic===============================================
const bot = new Discord.Client();
bot.login(process.env.TOKEN || env.token);
bot.on('ready', ()=>{
    console.log('bot is ready!');
});

//regex for some commands
var quoteCommand = /^!quote/i;
var addQuote = /^!addquote/i;
var modifyQuote = /^!modifyquote/i;
var removeQuote = /^!removequote/i;
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

var quotes = [];
var soundQueue = [];

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

jsonFile.readFile('quotes.json', function(err, obj){
    if(err)
        console.log(err);
    else
        quotes = obj.quotes;
});

function playSound(connection, fileName){
    if(connection.speaking == true){
        soundQueue.push({connection: connection, fileName: fileName});
    } else {
        connection.playFile('./sounds/'+fileName).on('end', ()=>{
            if (soundQueue.length == 0){
                connection.disconnect();
            } else {
                nextSound = soundQueue[0];
                soundQueue.splice(0, 1);
                playSound(nextSound.connection, nextSound.fileName);
            }
        });
    }
}

function saveQuotes(){
    jsonFile.writeFile('quotes.json', {quotes: quotes}, function(err){
        if(err)
            console.log(err);
    });
}

bot.on('message', message => {

    //help message, lists most commands, vaguely
    if(message.content === '!help') {
        message.channel.sendMessage('!help\n!sergei\n!cory\n!cruel\n!succ\n!blackjack\n!ohshit\n!wah\n!uptown\n!yee\n!bees\n!ooh\n!time\n!where\n!addquote (quote here)\n!quote\n!quote (number for quote)\n!modifyQuote (quote number) (replacement)\n!removeQuote (quote number)');
    }

    if (message.content === '!blackjack') {
        if(message.member.voiceChannel){
            message.member.voiceChannel.join().then(connection =>{
                playSound(connection, 'blackjack.wav');
            });
        } else {
            return;
        }
    }
    if (message.content === '!ohshit') {
        if(message.member.voiceChannel){
            message.member.voiceChannel.join().then(connection =>{
                playSound(connection, 'oh_shit.wav');
            });
        } else {
            return;
        }
    }
    if (message.content === '!succ') {
        if(message.member.voiceChannel){
            message.member.voiceChannel.join().then(connection =>{
                playSound(connection, 'succ.wav');
            });
        } else {
            return;
        }
    }
    if (message.content === '!wah') {
        if(message.member.voiceChannel){
            message.member.voiceChannel.join().then(connection =>{
                var wah = "waluigi/wah"+Math.floor((Math.random()*12)+1)+".wav";
                playSound(connection, wah);
            });
        } else {
            return;
        }
    }
    if (message.content === '!uptown') {
        if(message.member.voiceChannel){
            message.member.voiceChannel.join().then(connection =>{
                playSound(connection, 'wahh.wav');
            });
        } else {
            return;
        }
    }
    if (message.content === '!yee') {
        if(message.member.voiceChannel){
            message.member.voiceChannel.join().then(connection =>{
                playSound(connection, 'yee.wav');
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
        if(message.member.voiceChannel){
            message.member.voiceChannel.join().then(connection =>{
                playSound(connection, 'cory.wav');
            });
        } else {
            return;
        }
    }
    if (message.content === '!cruel') {
        if(message.member.voiceChannel){
            message.member.voiceChannel.join().then(connection =>{
                playSound(connection, 'cruel.wav');
            });
        } else {
            return;
        }
    }
    if (message.content === '!bees') {
        if(message.member.voiceChannel){
            message.member.voiceChannel.join().then(connection =>{
                playSound(connection, 'Dr_Bees.wav');
            });
        } else {
            return;
        }
    }
    if (message.content === '!ooh') {
        if(message.member.voiceChannel){
            message.member.voiceChannel.join().then(connection =>{
                playSound(connection, 'ooooh.wav');
            });
        } else {
            return;
        }
    }
    if (message.content === '!myah') {
        if(message.member.voiceChannel){
            message.member.voiceChannel.join().then(connection =>{
                playSound(connection, 'myah.wav');
            });
        } else {
            return;
        }
    }
    if (message.content === '!time') {
        if(message.member.voiceChannel){
            message.member.voiceChannel.join().then(connection =>{
                playSound(connection, 'timetostop.wav');
            });
        } else {
            return;
        }
    }
    if (message.content === '!where') {
        if(message.member.voiceChannel){
            message.member.voiceChannel.join().then(connection =>{
                playSound(connection, 'yourparents.wav');
            });
        } else {
            return;
        }
    }

    if (message.content === '!wakemeup') {
        if(message.member.voiceChannel){
            message.member.voiceChannel.join().then(connection =>{
                playSound(connection, 'wake.wav');
            });
        } else {
            return;
        }
    }

    if (message.content === '!bee') {
        if(message.member.voiceChannel){
            message.member.voiceChannel.join().then(connection =>{
                playSound(connection, 'bee.wav');
            });
        } else {
            return;
        }
    }

    if (message.content === '!easymode') {
        if(message.member.voiceChannel){
            message.member.voiceChannel.join().then(connection =>{
                playSound(connection, 'easymode.mp3');
            });
        } else {
            return;
        }
    }

    if (message.content === '!sergei') {
        message.channel.sendMessage("https://gifsound.com/?gif=i.imgur.com/HfbMsaE.gif&v=dXYs5GsnMbI&s=23");
    }

    if (regEightBall.test(message.content)){
        if(goingToDie.test(message.content)){
            message.channel.sendMessage("Everyone will die some day.");
        } else if(areYouGay.test(message.content)){
            message.channel.sendMessage("I couldn't stop thinking about my stupid ex girlfriend!");
        } else if(lesbian.test(message.content.slice(7))){
            message.channel.sendMessage("The other L word.");
        } else if(lesbians.test(message.content.slice(7))){
            message.channel.sendMessage("I'm talking about love, Scott!");
        } else if(bread.test(message.content.slice(7))){
            message.channel.sendMessage("BREAD MAKES YOU FAT?!");
        } else if(goodnight.test(message.content.slice(7))){
            message.channel.sendMessage("Goodnight!");
        } else if(heTries.test(message.content.slice(7))){
            message.channel.sendMessage("oh mY GOD do I try");
        } else
            message.channel.sendMessage(eightBall[Math.floor(Math.random()*eightBall.length)]);
    }
    if (addQuote.test(message.content)){
        quotes.push(message.content.slice(10));
        saveQuotes();
        message.channel.sendMessage("Quote number "+(quotes.length-1)+" has been added");
    }
    if(quoteCommand.test(message.content)){
        if(findQuote.test(message.content)){
            if(quotes[message.content.slice(7)]){
                message.channel.sendMessage("\""+quotes[message.content.slice(7)]+"\"");
            } else {
                var rude = Math.floor(Math.random()*101);
                if(rude === (42 || 57 || 98)){
                    message.channel.sendMessage("There is no quote with that number, dumbass");
                } else {
                    message.channel.sendMessage("There is no quote with that number");
                }
            }
        } else {
            message.channel.sendMessage("\""+quotes[Math.floor(Math.random()*quotes.length)]+"\"");
        }
    }
    if(modifyQuote.test(message.content)){
        var quoteNumber = regQuoteNumber.exec(message.content);
        if(!message.content.slice(14+quoteNumber.length)){
            message.channel.sendMessage("Don't make an empty quote, asshole");
            return;
        }
        if(quotes[quoteNumber]){
            quotes[quoteNumber] = message.content.slice(14+quoteNumber.length);
            saveQuotes();
            message.channel.sendMessage("Quote "+quoteNumber+" modified successfully");
        } else {
            var rude = Math.floor(Math.random()*101);
            if(rude === (42 || 57 || 98)){
                message.channel.sendMessage("There is no quote with that number, dumbass");
            } else {
                message.channel.sendMessage("There is no quote with that number");
            }
        }
    }
    if(removeQuote.test(message.content)){
        if(message.author.id == 145650335170428928){
            var quoteNumber = regQuoteNumber.exec(message.content);
            if(quotes[quoteNumber]){
                quotes.splice(quoteNumber, 1);
                saveQuotes();
                message.channel.sendMessage("Quote "+quoteNumber+" has been removed")
            } else {
                var rude = Math.floor(Math.random()*101);
                if(rude === (42 || 57 || 98)){
                    message.channel.sendMessage("There is no quote with that number, dumbass");
                } else {
                    message.channel.sendMessage("There is no quote with that number");
                }
            }
        } else {
            message.channel.sendMessage("Only Ben gets to do that, you'd probably fuck it up");
        }
    }
});

app.listen(app.get('port'), function () {
    console.log('listening on port ', app.get('port'));
});
