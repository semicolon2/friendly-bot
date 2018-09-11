const path = require("path");

module.exports = class VoicePlayer {
  constructor(client) {
    this.soundQueue = {};
    this.client = client;
    this.multiPlayHistory = {};
  }

  async join(message) {
    let voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) {
      return "Must be in a voice channel";
    }
    if (voiceChannel.connection) {
      return "already in channel";
    }
    try {
      await voiceChannel.join();
    } catch (e) {
      console.error(e);
      return "Error connecting to channel :(";
    }
  }

  leave(message) {
    if (message.guild.voiceConnection) {
      message.guild.voiceConnection.disconnect();
    }
  }

  play(message, fileName) {
    if (!message.member.voiceChannel) {
      return "Must be in a voice channel";
    }
    if (!message.member.voiceChannel.connection) {
      return "Must use !join first";
    }
    this._playSound(
      message.guild.id,
      message.member.voiceChannel.connection,
      fileName
    );
  }

  multiPlay(message, command) {
    let soundNumber = Math.floor(Math.random() * command.count);

    if (command.filePrefix in this.multiPlayHistory) {
      while (soundNumber == this.multiPlayHistory[command.filePrefix]) {
        soundNumber = Math.floor(Math.random() * command.count);
      }
    }

    this.multiPlayHistory[command.filePrefix] = soundNumber;

    var fileName = command.filePrefix + soundNumber + command.fileSuffix;
    this.play(message, fileName);
  }

  _playSound(guildId, connection, fileName) {
    if (connection.speaking === true) {
      if (this.soundQueue.hasOwnProperty(guildId)) {
        this.soundQueue[guildId].push({ connection, fileName });
      } else {
        this.soundQueue[guildId] = [{ connection, fileName }];
      }
    } else {
      connection
        .playFile(path.join(__dirname, "..", "sounds", fileName))
        .on("end", () => {
          if (!this.soundQueue.hasOwnProperty(guildId)) {
            return;
          }
          let nextSound = this.soundQueue[guildId].shift();
          if (this.soundQueue[guildId].length === 0) {
            delete this.soundQueue[guildId];
          }
          this._playSound(guildId, nextSound.connection, nextSound.fileName);
        });
    }
  }

  stop(message) {
    if (message.member.voiceChannel.connection) {
      this.soundQueue.clear();
      message.member.voiceChannel.connection.disconnect();
    }
  }
};
