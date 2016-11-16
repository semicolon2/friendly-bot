const env = require('./env.js');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const Eris = require('eris');
const FS = require('fs');

var client = new Eris("MTgxNTE3Njc4NjYwNDE5NTg0.Cw1s5A.cpIAL2_Acm9TFcrM1fi6EU352Xk");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
   res.render('index', {title: 'Friendly-bot'});
});

//message regex
var succ = /succ/;
var addQuote = /!addquote/;

var quotes = [];
var playQueue = [];

function playSoundxx(voiceConnection, fileName){
    if(voiceConnection.playing) { // Stop playing if the connection is playing something
        voiceConnection.once("end", () => {
            voiceConnection.playFile("./sounds/"+fileName);
        });
    } else {
        voiceConnection.playFile("./sounds/"+fileName); // Play the file and notify the user
        voiceConnection.disconnect;
    }
}

client.on('messageCreate', msg => {
    if(msg.content == "!blackjack"){
        client.joinVoiceChannel(msg.member.voiceState.channelID).catch((err) => { // Join the user's voice channel
                    console.log(err); // Log the error
                }).then((voiceConnection) => {
                    playSound(voiceConnection, "blackjack.wav");
                });
    }
    if(msg.content == "!ohshit"){
        client.joinVoiceChannel(msg.member.voiceState.channelID).catch((err) => { // Join the user's voice channel
                    console.log(err); // Log the error
                }).then((voiceConnection) => {
                    playSound(voiceConnection, "oh_shit.wav")
                });
    }
    if(!(msg.content == "!succ") && succ.test(msg.content)){
        client.joinVoiceChannel(msg.member.voiceState.channelID).catch((err) => { // Join the user's voice channel
                    console.log(err); // Log the error
                }).then((voiceConnection) => {
                    playSound(voiceConnection, "succ.wav");
                });
    }
    if(msg.content == "!succ"){
        client.createMessage(msg.channel.id, {content: "succ", tts: true});
    }
    if(addQuote.test(msg.content)){
        quotes.push(msg.content.slice(10));
        console.log(quotes);
    }
    if(msg.content == "!quote"){
        client.createMessage(msg.channel.id, quotes[Math.floor(Math.random() * (quotes.length))]);
    }
    // if(msg.content == "!fuckthatshit"){
    //     client.createMessage(msg.channel.id, "FUCK \n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nTHAT \n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nSHIT")
    // }

});


client.connect();
app.listen(8080, function () {
    console.log('listening on port 8080');
});
