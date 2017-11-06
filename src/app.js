import Discord from 'discord.js';
import Opus from 'node-opus';

import keepAlive from './keepAlive';
import startServer from './server';
import Database from './db';
import VoicePlayer from './VoicePlayer';
const voiceCommands = require('./voiceCommands.json');

startServer();
keepAlive();

const client = new Discord.Client();
client.login(process.env.TOKEN);
client.on('ready', () => {
    console.log('bot is ready!');
});

const voicePlayer = new VoicePlayer(client);

client.on('message', message => {
    for(let command in voiceCommands) {
        if(voiceCommands.hasOwnProperty(command)) {
            if(message.content.startsWith(command)) {
                voicePlayer.play(message, voiceCommands[command]);
            }
        }
    }
});