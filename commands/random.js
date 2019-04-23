const { get : fetch } = require("snekfetch");
const { Attachment } = require("discord.js");

const animals = {
	
  "cat, kitty": {
    fetch: async () => fetch ("http://aws.random.cat/meow"),
    get: async (resp) => resp.body.file
  },
  "dog, doggo": {
    fetch: async (args) => {
      const url = args[1] ? `https://dog.ceo/api/breed/${args[1]}/images/random` : "https://dog.ceo/api/breeds/image/random";
      return fetch(url);
    },
    get: async (resp) => resp.body.message
  },
  "bunny, bunnie": {
    fetch: async () => fetch("https://api.bunnies.io/v2/loop/random/?media=gif,png"),
    get: async (resp) => resp.body.media.poster
  },
  "fox": {
    fetch: async () => fetch("https://randomfox.ca/floof"),
    get: async (resp) => resp.body.image
  }
  
  
};


exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  if (!args[0]) {
    return message.reply("Please pick an animal : " + Object.keys(animals).join(" , "));
  }
  const api = animals[args[0]];
  try {
    if (!api) {
      const resp = await fetch(`http://loremflickr.com/400/300/${args[0]}`);
      console.log(typeof resp.body);
      return message.channel.send(new Attachment(resp.body, `random${args[0]}.jpg`));
    }
  } catch (e) {
    return message.reply("Sorry I couldn't find any pictures for that word. help random");
  }

  const response = await api.fetch(args);
  const image = await api.get(response);
  message.channel.send({files: [image]});
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["ran","rd"],
  permLevel: "User"
};

exports.help = {
  name: "random",
  category: "Fun",
  description: "Grabs a random image.",
  usage: "random <dog, cat, bunny>"
};