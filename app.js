const env = require('./env.js');
const express = require('express');
var app = express();
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const Discord = require('discord.js');
var opus = require('opusscript');
const jsonFile = require('jsonfile');

//================for displaying a page with discord request===================
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
   res.render('index', {title: 'Friendly-bot'});
});

//================bot & bot logic===============================================
const bot = new Discord.Client();
bot.login(env.token);
bot.on('ready', ()=>{
    console.log('bot is ready!');
});

var addQuote = /^!addquote/i;
var findQuote = /^!quote \d*/i;
var quotes = [];
var soundQueue = [];

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

bot.on('message', message => {

    //help message, lists most commands, vaguely
    if(message.content === '!help') {
        message.channel.sendMessage('!help\n!cory\n!succ\n!blackjack\n!ohshit\n!wah\n!uptown\n!yee\n!addquote (quote here)\n!quote\n!quote (number for quote)');
    }

    if (message.content === '!blackjack') {
      message.member.voiceChannel.join().then(connection =>{
          playSound(connection, 'blackjack.wav');
      });
    }
    if (message.content === '!ohshit') {
      message.member.voiceChannel.join().then(connection =>{
          playSound(connection, 'oh_shit.wav');
      });
    }
    if (message.content === '!succ') {
      message.member.voiceChannel.join().then(connection =>{
          playSound(connection, 'succ.wav');
      });
    }
    if (message.content === '!wah') { //random waluigi sounds
      message.member.voiceChannel.join().then(connection =>{
          var wah = "waluigi/wah"+Math.floor((Math.random()*12)+1)+".wav";
          playSound(connection, wah);
      });
    }
    if (message.content === '!uptown') {
      message.member.voiceChannel.join().then(connection =>{
          playSound(connection, 'wahh.wav');
      });
    }
    if (message.content === '!yee') {
      message.member.voiceChannel.join().then(connection =>{
          playSound(connection, 'yee.wav');
      });
    }
    if (message.content === '!yeefull') {
      message.member.voiceChannel.join().then(connection =>{
          playSound(connection, 'yeefull.mp3');
      });
    }
    if (message.content === '!cory') {
      message.member.voiceChannel.join().then(connection =>{
          playSound(connection, 'cory.wav');
      });
    }
    if (addQuote.test(message.content)){
        quotes.push(message.content.slice(10));
        jsonFile.writeFile('quotes.json', {quotes: quotes}, function(err){
            if(err)
                console.log(err);
        });
    }
    if (message.content === '!quote') {
        message.channel.sendMessage("\""+quotes[Math.floor(Math.random()*quotes.length)]+"\"");
    }
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
    }
});

app.listen(8080, function () {
    console.log('listening on port 8080');
});
