exports.run = (client, message, args, level) => {
  if (!args[0]) {
    const settings = message.settings;

    const myCommands = message.guild ? client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level) : client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level &&  cmd.conf.guildOnly !== true);

    const commandNames = myCommands.keyArray();
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

    let currentCategory = "";
    let output = `= Command List =\n\n[Use ${settings.prefix}help <commandname> for details]\n`;
    const sorted = myCommands.array().sort((p, c) => p.help.category > c.help.category ? 1 :  p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1 );
    sorted.forEach( c => {
      const cat = c.help.category.toProperCase();
      if (currentCategory !== cat) {
        output += `\n== ${cat} ==\n`;
        currentCategory = cat;
      }
      output += `${settings.prefix}${c.help.name}${" ".repeat(longest - c.help.name.length)} :: ${c.help.description}\n`;
    });
    message.channel.send(output, {code:"asciidoc"});
  } else {
    let command = args[0];
    if (client.commands.has(command)) {
      command = client.commands.get(command);
      if (level < client.levelCache[command.conf.permLevel]) return;

    const settings = message.settings;
	const { Client, RichEmbed } = require('discord.js');
	const helpEmbed = new RichEmbed()
	.setColor("RANDOM")
	.setAuthor(`${message.author.tag}`, `${message.author.avatarURL}`)
    .setTitle(`${command.help.name}`)
    .setDescription(`${command.help.description}`)
	.addField("• Usage •", `${settings.prefix}${command.help.usage}`, true)
    .setTimestamp(new Date())
    message.channel.send(helpEmbed);
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["h", "halp"],
  permLevel: "User"
};

exports.help = {
  name: "help",
  category: "Info",
  description: "Displays all the available commands for your permission level.",
  usage: "help [command]"
};