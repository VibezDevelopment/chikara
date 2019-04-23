exports.run = async (client, message, args, level) => {// eslint-disable-line no-unused-vars

  const friendly = client.config.permLevels.find(l => l.level === level).name;
  const { Client, RichEmbed } = require('discord.js');
  const myLevel = new RichEmbed()
    .setAuthor(`${message.author.tag}`, `${message.author.avatarURL}`)
    .setTitle("Permissions")
    .setColor("RANDOM")
    .addField("• Level •", `${level}`, true)
	.addField("• Title •", `${friendly}`, true)
	.addBlankField(true)
    .setTimestamp(new Date())
    message.channel.send(myLevel);

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["perm","perms"],
  permLevel: "User"
};

exports.help = {
  name: "level",
  category: "Info",
  description: "Tells you your permission level for the current message location.",
  usage: "level"
};