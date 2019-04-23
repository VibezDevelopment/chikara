exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

  const msg = await message.channel.send("SatoSuks!");

  setTimeout(() => {msg.edit("Not! :D");  }, 2000);

  msg.channel.send(`Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["satosuks"],
  permLevel: "User"
};

exports.help = {
  name: "rawr",
  category: "Sato Stuff",
  description: ":)",
  usage: "rawr"
};