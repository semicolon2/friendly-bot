const Discord = require("discord.js");

const keepAlive = require("./keepAlive");
const startServer = require("./server");
const VoicePlayer = require("./VoicePlayer");
const { quote, newQuote, editQuote, exportQuotes } = require("./quotes");
const convertTemp = require("./convertTemp");
const vend = require("./vend");

const {
  voiceCommands,
  multiVoiceCommands,
  textCommands
} = require("./commands.json");

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
client.on("ready", () => {
  console.log("bot is ready!");
});

const voicePlayer = new VoicePlayer(client);

function listCommands(message) {
  let commandsList = "Text Commands:\n";

  Object.keys(textCommands)
    .sort()
    .forEach(function(v, i) {
      commandsList += `${v}\n`;
    });

  commandsList += "\nVoice Commands:\n";

  let allVoiceCommands = Object.assign({}, voiceCommands, multiVoiceCommands);
  Object.keys(allVoiceCommands)
    .sort()
    .forEach(function(v, i) {
      commandsList += `${v}\n`;
    });

  message.author.send(commandsList);
}

client.on("message", async message => {
  if (message.author.bot || !message.content.startsWith("!")) {
    return;
  }

  for (let command in textCommands) {
    if (textCommands.hasOwnProperty(command)) {
      if (message.content === command) {
        message.channel.send(textCommands[command]);
        return;
      }
    }
  }

  for (let command in voiceCommands) {
    if (voiceCommands.hasOwnProperty(command)) {
      if (message.content === command) {
        let m = voicePlayer.play(message, voiceCommands[command]);
        if (m) message.channel.send(m);
        return;
      }
    }
  }

  for (let command in multiVoiceCommands) {
    if (multiVoiceCommands.hasOwnProperty(command)) {
      if (message.content === command) {
        let m = voicePlayer.multiPlay(message, multiVoiceCommands[command]);
        if (m) message.channel.send(m);
        return;
      }
    }
  }
  if (message.content.startsWith("!join")) {
    let m = await voicePlayer.join(message);
    if (m) message.channel.send(m);
  } else if (message.content.startsWith("!leave")) {
    voicePlayer.leave(message);
  } else if (message.content.startsWith("!quote")) {
    let m = await quote(message);
    message.channel.send(m);
    return;
  } else if (message.content.startsWith("!addquote")) {
    let m = await newQuote(message);
    message.channel.send(m);
    return;
  } else if (message.content.startsWith("!editquote")) {
    let m = await editQuote(message);
    message.channel.send(m);
    return;
  } else if (
    message.content.startsWith("!export") &&
    message.author.id == 145650335170428928
  ) {
    let m = await exportQuotes(message);
    message.channel.send(m);
  } else if (message.content.startsWith("!convert")) {
    message.channel.send(convertTemp(message));
  } else if (message.content.startsWith("!8ball")) {
    message.channel.send(
      eightball[Math.floor(Math.random() * eightball.length)]
    );
  } else if (message.content.startsWith("!commands")) {
    message.channel.send(listCommands(message));
  } else if (message.content.startsWith("!stop")) {
    voicePlayer.stop(message);
  } else if (message.content.startsWith("!vend")) {
      message.channel.send(vend())
  }

  //TODO: let bot ignore specified channels
});
