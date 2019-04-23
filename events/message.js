module.exports = (client, message) => {

  if (message.author.bot) return;

  const settings = client.getSettings(message.guild);

  message.settings = settings;

  if (message.content.indexOf(settings.prefix) !== 0) return;

  const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const level = client.permlevel(message);
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

  if (!cmd) return;

  if (cmd && !message.guild && cmd.conf.guildOnly)
    return message.channel.send("This command is unavailable via private message. Please run this command in a guild.");

  if (level < client.levelCache[cmd.conf.permLevel]) {
    if (settings.systemNotice === "true") {
      
      const permEmbed = new Discord.RichEmbed()
      .setTitle("Inufficient permissions.")
      .setDescription("In order to use this comand, you need to have: "+ client.levelCache[cmd.conf.permLevel] + "(" + cmd.conf.permLevel + ")")
      .setDescription("Your level: " + level + "(" + client.config.permLevels.find(l => level === level).name + ")")
      return message.channel.send(permEmbed)
    } else {
      return;
    }
  }

  message.author.permLevel = level;

  message.flags = [];
  while (args[0] && args[0][0] === "-") {
    message.flags.push(args.shift().slice(1));
  }
  client.log("log", `${client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`, "CMD");
  cmd.run(client, message, args, level);

};