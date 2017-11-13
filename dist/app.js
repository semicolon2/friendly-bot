'use strict';

var _discord = require('discord.js');

var _discord2 = _interopRequireDefault(_discord);

var _nodeOpus = require('node-opus');

var _nodeOpus2 = _interopRequireDefault(_nodeOpus);

var _keepAlive = require('./keepAlive');

var _keepAlive2 = _interopRequireDefault(_keepAlive);

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

var _VoicePlayer = require('./VoicePlayer');

var _VoicePlayer2 = _interopRequireDefault(_VoicePlayer);

var _quotes = require('./quotes');

var _convertTemp = require('./convertTemp');

var _convertTemp2 = _interopRequireDefault(_convertTemp);

var _secretSanta = require('./secretSanta');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var commands = require('./commands.json');
var voiceCommands = commands.voiceCommands;
var multiVoiceCommands = commands.multiVoiceCommands;
var textCommands = commands.textCommands;
var eightball = ["It is certain", "It is decidedly so", "Without a doubt", "Yes, definitely", "You may rely on it", "As I see it, yes", "Most likely", "Outlook good", "Yes", "Signs point to yes", "Reply hazy try again", "Ask again later", "Better not tell you now", "Cannot predict now", "Concentrate and ask again", "Don't count on it", "My reply is no", "My sources say no", "Outlook not so good", "Very doubtful"];

(0, _server2.default)();
//keepAlive();

var client = new _discord2.default.Client();
client.login(process.env.TOKEN);
client.on('ready', function () {
    console.log('bot is ready!');
});

var voicePlayer = new _VoicePlayer2.default(client);

client.on('message', function (message) {
    if (message.author.bot || !message.content.startsWith("!")) {
        return;
    }

    for (var command in textCommands) {
        if (textCommands.hasOwnProperty(command)) {
            if (message.content === command) {
                message.channel.send(textCommands[command]);
                return;
            }
        }
    }

    for (var _command in voiceCommands) {
        if (voiceCommands.hasOwnProperty(_command)) {
            if (message.content === _command) {
                voicePlayer.play(message, voiceCommands[_command]);
                return;
            }
        }
    }

    for (var _command2 in multiVoiceCommands) {
        if (multiVoiceCommands.hasOwnProperty(_command2)) {
            if (message.content === _command2) {
                voicePlayer.multiPlay(message, multiVoiceCommands[_command2]);
                return;
            }
        }
    }

    if (message.content.startsWith('!quote')) {
        (0, _quotes.getAQuote)(message);
        return;
    } else if (message.content.startsWith('!addquote')) {
        (0, _quotes.addAQuote)(message);
        return;
    } else if (message.content.startsWith('!modifyquote')) {
        (0, _quotes.modifyAQuote)(message);
        return;
    } else if (message.content.startsWith("!convert")) {
        (0, _convertTemp2.default)(message);
    } else if (message.content.startsWith("!8ball")) {
        message.channel.send(eightball[Math.floor(Math.random() * eightball.length)]);
    } else if (message.content.startsWith("!entersanta")) {
        (0, _secretSanta.addSanta)(message);
    } else if (message.content.startsWith("!sendsantas")) {
        (0, _secretSanta.sendSantas)(message);
    }

    //TODO: let bot ignore specified channels
});