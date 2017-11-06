import Discord from 'discord.js';
import Opus from 'node-opus';

import keepAlive from './keepAlive';
import startServer from './server';
import VoicePlayer from './VoicePlayer';
import {getAQuote, addAQuote, modifyAQuote} from './quotes';
import convertTemp from './convertTemp';

const commands = require('./commands.json');
const voiceCommands = commands.voiceCommands;
const multiVoiceCommands = commands.multiVoiceCommands;
const textCommands = commands.textCommands;

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
    }

    //TODO: let bot ignore specified channels

});