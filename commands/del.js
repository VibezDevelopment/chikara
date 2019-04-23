//Information is given at each part! c:

//Load Discord (for embeds)
const Discord = require("discord.js");
exports.run = async (client, message, args, level) => {
  //Grab settings
  const settings = message.settings;

  //Embeds
  const argEmbed = new Discord.RichEmbed()
    .setTitle("Invalid arguments provided.")
    .setFooter("Replying to: " + message.author.username, message.author.avatarURL)
    .setColor("ORANGE")

  const errorEmbed = new Discord.RichEmbed()
    .setTitle("Error while trying to purge.")
    .setFooter("Replying to: " + message.author.username, message.author.avatarURL)
    .setColor("RED")

  const amount = !!parseInt(message.content.split(' ')[1]) ? parseInt(message.content.split(' ')[1]) : parseInt(message.content.split(' ')[2])

  if (!amount) {
    argEmbed.setDescription("Please provide a number of messages to purge! (Limit: 100)")
    return message.channel.send(argEmbed)
  }
  var user = message.mentions.users.first();

  if (!user) {
    user = message.author
  }
  //Grab settings
  message.channel.fetchMessages({
    limit: 100,
  }).then((messages) => {
    if (user) {
      const filterBy = user ? user.id : client.user.id;
      messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
    }
    message.channel.bulkDelete(messages).catch(error => console.log(error.stack) + errorEmbed.addField("**Details**", error.message) + message.channel.send(errorEmbed));
  });

  //Logging
  const logs = message.guild.channels.find(channel => channel.name === settings.modLogChannel);
  const logEmbed = new Discord.RichEmbed()
    .setTitle("Messages deleted.")
    .addField("Moderator ", message.author + "`[" + message.author.tag + "]`")
    .addField("Target ", user)
    .addField("Channel ", "<#" + message.channel.id + "> [`" + message.channel.id + "]`")
    .setTimestamp()
  logs.send(logEmbed)

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "del",
  category: "Moderation",
  description: "Bulk delete messages",
  usage: "del @user 10 , or del 25"
};