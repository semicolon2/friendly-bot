# Friendly Bot

A bot for discord

## How to Run

### Prerequisites

First you'll need to register an app on discord, set it to be a bot user to get a connection token.

You'll also need node and postgres installed, as well as have ffmpeg in your path.

### Installing

```
git clone https://github.com/semicolon2/friendly-bot.git
npm install
```

rename `.env.example` to simply `.env`, and add your own values

### Running

```
npm run start
```

[generate a link here](https://discordapi.com/permissions.html) to add the bot to your server, it requires read messages, send messages, view channel, connect, and speak to fully function

### Built With

[Discord.js](https://discord.js.org/)