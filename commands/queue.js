exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
const settings = message.settings;
let queue = {};

	if (queue[message.guild.id] === undefined) return message.channel.send(`Add some songs to the queue first with ${settings.prefix}add`);
		
	let tosend = [];
	queue[message.guild.id].songs.forEach((song, i) => { tosend.push(`${i+1}. ${song.title} - Requested by: ${song.requester}`);});
		
	message.channel.send(`__**${message.guild.name}'s Music Queue:**__ Currently **${tosend.length}** songs queued ${(tosend.length > 15 ? '*[Only next 15 shown]*' : '')}\n\`\`\`${tosend.slice(0,15).join('\n')}\`\`\``);

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["q"],
  permLevel: "User"
};

exports.help = {
  name: "queue",
  category: "Music",
  description: "Display the current queue.",
  usage: "queue"
};