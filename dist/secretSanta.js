"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addSanta = addSanta;
exports.sendSantas = sendSantas;
var santas = [];

function addSanta(message) {
  if (santas.some(function (santa) {
    return santa.id === message.author.id;
  })) {
    message.channel.send("you've already been added!");
    return;
  }
  santas.push(message.author);
  message.channel.send("You're entered into the Secret Santa, " + message.author.username + "!");
}

function sendSantas(message) {
  if (message.author.id !== '145650335170428928') {
    message.channel.send("Only Ben can send the entries.");
    return;
  }
  if (santas.length < 2) {
    message.channel.send("Cannot send with less than 2 entries!");
    return;
  }

  santas = shuffle(santas);

  for (var i = 0; i < santas.length; i++) {
    var gifter = santas[i];
    var giftee = void 0;
    if (i + 1 === santas.length) {
      giftee = santas[0];
    } else {
      giftee = santas[i + 1];
    }
    gifter.send("your giftee is: " + giftee.username);
    // if(gifter.dmChannel) {
    //   gifter.dmChannel.send("your giftee is: " + giftee.username);
    // } else {
    //   gifter.createDM()
    //     .then((dmChannel) => {
    //       dmChannel.send("your giftee is: " + giftee.username);
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // }
  }

  message.channel.send("Secret Santa's sent!");
}

function shuffle(array) {
  var counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    var index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    var temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}