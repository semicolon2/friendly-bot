const env = require('./env.js');
const express = require('express');
var app = express();
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const Discord = require('discord.js');
var opus = require('opusscript');

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

soundQueue = [];
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
    if (message.content === '!wah') {
      message.member.voiceChannel.join().then(connection =>{
          playSound(connection, 'wah.wav');
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
});

app.listen(8080, function () {
    console.log('listening on port 8080');
});
