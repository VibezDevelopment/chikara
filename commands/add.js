exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const yt = require('ytdl-core'),
        settings = message.settings;
  let url = message.content.split(' ')[1],
      queue = {};

  if (url == '' || url === undefined) return message.channel.send(`You must add a YouTube video url, or id after ${settings.prefix}add`);

  yt.getInfo(url, (err, info) => {
    if (err) return message.channel.send('Invalid YouTube Link: ' + err);

    if (!queue.hasOwnProperty(message.guild.id)) queue[message.guild.id] = {}, queue[message.guild.id].playing = false, queue[message.guild.id].songs = [];

    queue[message.guild.id].songs.push({ url: url, title: info.title, requester: message.author.username });

    message.channel.send(` **${info.title}** had been added to the queue.`);
  });

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [""],
  permLevel: "User"
};

exports.help = {
  name: "add",
  category: "Music",
  description: "Adds a song to the queue",
  usage: "add [link]"
};