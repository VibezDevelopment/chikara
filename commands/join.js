exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

  return new Promise((resolve, reject) => {
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel || voiceChannel.type !== 'voice') return message.reply('I couldn\'t connect to your voice channel...');
    voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
  });

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [""],
  permLevel: "User"
};

exports.help = {
  name: "join",
  category: "Music",
  description: "Joins voice chat",
  usage: "join"
};