const env = require('./env.js');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const Eris = require('eris');
const FS = require('fs');

var client = new Eris(env.token);

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

var succ = /succ/;

client.on('messageCreate', msg => {
    if(msg.content == "!blackjack"){
        client.joinVoiceChannel(msg.member.voiceState.channelID).catch((err) => { // Join the user's voice channel
                    console.log(err); // Log the error
                }).then((voiceConnection) => {
                    if(voiceConnection.playing) { // Stop playing if the connection is playing something
                        voiceConnection.stopPlaying();
                    }
                    voiceConnection.playFile("./sounds/blackjack.wav"); // Play the file and notify the user
                    voiceConnection.once("end", () => {
                        voiceConnection.disconnect();
                    });
                });
    }
    if(msg.content == "!ohshit"){
        client.joinVoiceChannel(msg.member.voiceState.channelID).catch((err) => { // Join the user's voice channel
                    console.log(err); // Log the error
                }).then((voiceConnection) => {
                    if(voiceConnection.playing) { // Stop playing if the connection is playing something
                        voiceConnection.stopPlaying();
                    }
                    voiceConnection.playFile("./sounds/oh_shit.wav"); // Play the file and notify the user
                    voiceConnection.once("end", () => {
                        voiceConnection.disconnect();
                    });
                });
    }
    if(succ.test(msg.content) && (msg.content != "!succ")){
        client.joinVoiceChannel(msg.member.voiceState.channelID).catch((err) => { // Join the user's voice channel
                    console.log(err); // Log the error
                }).then((voiceConnection) => {
                    if(voiceConnection.playing) { // Stop playing if the connection is playing something
                        voiceConnection.stopPlaying();
                    }
                    voiceConnection.playFile("./sounds/succ.wav"); // Play the file and notify the user
                    voiceConnection.once("end", () => {
                        voiceConnection.disconnect();
                    });
                });
    }
    if(msg.content == "!succ"){
        client.createMessage(msg.channel.id, {content: "succ", tts: true});
    }

});

client.connect();
app.listen(8080, function () {
    console.log('listening on port 8080');
});
