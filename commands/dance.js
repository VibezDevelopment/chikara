exports.run = async (client, message, args, level) => {// eslint-disable-line no-unused-vars

const { Client, RichEmbed } = require('discord.js');
const embed = new RichEmbed()
  .setTitle("Time to dance!!!")
  .setURL("https://cdn.discordapp.com/emojis/564778786982461450.gif")
  .setAuthor(`${message.author.tag}`, `${message.author.avatarURL}`)
 
  .setColor("RANDOM")
  .setDescription(" ~ dance dance ~")
  .setImage("https://cdn.discordapp.com/emojis/564778786982461450.gif")
  .setThumbnail("https://cdn.discordapp.com/emojis/401371917413646357.gif?v=1")
  .setFooter("rawr!", "https://cdn.discordapp.com/emojis/475821823213174799.gif?v=1")
  .setTimestamp(new Date())
  .addBlankField(true)
 
  message.channel.send({embed});
  
};

  exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["dance", "ttd", "yay"],
  permLevel: "User"
};

exports.help = {
  name: "dance",
  category: "Sato Stuff",
  description: "Fun embed :)",
  usage: "dance"
};