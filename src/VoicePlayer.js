import {List, Map} from 'immutable';
import path from 'path';

export default class VoicePlayer {
    constructor(client) {
        this.soundQueue = Map();
        this.client = client;
    }

    play(message, fileName) {
        if(!message.member.voiceChannel) {
            return;
        }
        if(message.member.voiceChannel.connection){
            this.playSound(message.guild.id, message.member.voiceChannel.connection, fileName);
        } else {
            message.member.voiceChannel.join()
                .then(connection => {
                    this.playSound(message.guild.id, connection, fileName);
                }, err => {console.error(err)});
        }
    }

    multiPlay(message, command) {
        var fileName = command.filePrefix + Math.floor(Math.random() * command.count) + command.fileSuffix;
        this.play(message, fileName);
    }
    
    playSound(guildId, connection, fileName){
        if (connection.speaking === true) {
            this.soundQueue = this.soundQueue.update(guildId, List(), list => list.push(Map({message, fileName})));
        } else {
            connection.playFile(path.join(__dirname, '..', 'sounds', fileName)).on('end', () => {
                if (!this.soundQueue.has(guildId)) {
                    connection.disconnect();
                } else {
                    nextSound = this.soundQueue.get(guildId).first();
                    this.soundQueue = this.soundQueue.update(guildId, list => list.shift());

                    if(this.soundQueue.get(guildId).isEmpty()){
                        this.soundQueue.delete(guildId);
                    }
                    playSound(nextSound.get('message'), nextSound.get('fileName'));
                }
            });
        }
    }
}
