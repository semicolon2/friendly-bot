import Discord from 'discord.js';

import keepAlive from './keepAlive';
import startServer from './server';
import VoicePlayer from './VoicePlayer';
import {getAQuote, addAQuote, modifyAQuote, exportAllQuotes} from './quotes';
import convertTemp from './convertTemp';
import {addSanta, sendSantas, showSantas} from './secretSanta';

const commands = require('./commands.json');
const voiceCommands = commands.voiceCommands;
const multiVoiceCommands = commands.multiVoiceCommands;
const textCommands = commands.textCommands;
const eightball = [
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

startServer();
keepAlive();

const client = new Discord.Client();
client.login(process.env.TOKEN);
client.on('ready', () => {
    console.log('bot is ready!');
});

const voicePlayer = new VoicePlayer(client);

client.on('message', message => {
    if (message.author.bot || !message.content.startsWith("!")) {
        return;
    }

    for(let command in textCommands) {
        if(textCommands.hasOwnProperty(command)) {
            if(message.content === command) {
                message.channel.send(textCommands[command]);
                return;
            }
        }
    }

    for(let command in voiceCommands) {
        if(voiceCommands.hasOwnProperty(command)) {
            if(message.content === command) {
                voicePlayer.play(message, voiceCommands[command]);
                return;
            }
        }
    }

    for(let command in multiVoiceCommands) {
        if(multiVoiceCommands.hasOwnProperty(command)) {
            if(message.content === command) {
                voicePlayer.multiPlay(message, multiVoiceCommands[command]);
                return;
            }
        }
    }


    if(message.content.startsWith('!quote')) {
        getAQuote(message);
        return;
    }else if(message.content.startsWith('!addquote')) {
        addAQuote(message);
        return;
    } else if(message.content.startsWith('!modifyquote')) {
        modifyAQuote(message);
        return;
    } else if(message.content.startsWith("!convert")) {
        convertTemp(message);
    } else if(message.content.startsWith("!8ball")) {
        message.channel.send(eightball[Math.floor(Math.random() * eightball.length)]);
    } else if(message.content.startsWith("!entersanta")) {
        addSanta(message);
    } else if(message.content.startsWith("!sendsantas")) {
        sendSantas(message);
    } else if(message.content.startsWith("!showsantas")) {
        showSantas(message);
    } else if(message.content.startsWith("!export") && message.author.id == 145650335170428928) {
        exportAllQuotes(message);
    }

    //TODO: let bot ignore specified channels

});