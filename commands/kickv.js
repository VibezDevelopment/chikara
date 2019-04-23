exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

  if (!message.guild.me.hasPermission(['MANAGE_CHANNELS', 'MOVE_MEMBERS'])) return message.reply('Missing the required `Manage Channels` and `Move Members` permissions.');
  
  const member = message.mentions.members.first();
  if (!member) return message.reply('You need to @mention a user/bot to kick from the voice channel.');
  if (!member.voiceChannel) return message.reply('That user/bot isn\'t in a voice channel.');
  
  const temp_channel = await message.guild.createChannel(member.id, 'voice', [
    { id: message.guild.id,
      deny: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK'], },
    { id: member.id,
      deny: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK'] }
  ]);
  
  await member.setVoiceChannel(temp_channel);
  await temp_channel.delete();

  const { Client, RichEmbed } = require('discord.js');
  const embed = new RichEmbed()
    .setTitle("Begone!!")
    .setURL("https://cdn.discordapp.com/emojis/564778786982461450.gif")
    .setAuthor(`${message.author.tag}`, `${message.author.avatarURL}`)
   
    .setColor("RANDOM")
    .setDescription(" ~ User Kicked ~")
    .setImage("")
    .addField(`${message.author.tag} was removed from voice channel.`)
    .setThumbnail("")
    .setFooter("rawr!", "")
    .setTimestamp(new Date())
    .addBlankField(true)
   
    message.reply(embed);  
};
  
  exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["kickvoice","kickfromvoice"],
    permLevel: "User"
  };
  
  exports.help = {
    name: "kickv",
    category: "Moderation",
    description: "Kicks a user from voice chat.",
    usage: "kickv @mention/ID "
  };