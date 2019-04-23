exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const Discord = require('discord.js');
  const yt = require('ytdl-core');
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) {
      return message.reply(`Please be in a voice channel first!`);
    }
    voiceChannel.join()
      .then(connnection => {
        let stream = yt('https://www.youtube.com/watch?v=dQw4w9WgXcQ', {audioonly: true});
        const dispatcher = connnection.playStream(stream);
        dispatcher.on('end', () => {
          voiceChannel.leave();
        });
      });
  };

  exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["stream","ytstream"],
    permLevel: "User"
  };

  exports.help = {
    name: "yt",
    category: "Music",
    description: "Plays ",
    usage: "yt"
  };