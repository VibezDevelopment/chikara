exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
	const yt = require('ytdl-core'),
		  settings = message.settings;
	let queue = client.queue;

	if (queue[message.guild.id] === undefined) return message.channel.send(`Add some songs to the queue first with ${settings.prefix}add`);
	if (!message.guild.voiceConnection) return commands.join(message).then(() => commands.play(message));
	if (queue[message.guild.id].playing) return message.channel.send('Already Playing');
	queue[message.guild.id].playing = true;

	console.log(queue);
	(function play(song) {
		console.log(song);
		if (song === undefined) return message.channel.send('Queue is empty').then(() => {
			queue[message.guild.id].playing = false;
			message.member.voiceChannel.leave();
		});
		message.channel.send(`Playing: **${song.title}** as requested by: **${song.requester}**`);
		
		let dispatcher = message.guild.voiceConnection.playStream(yt(song.url, { audioonly: true }), { passes: settings.passes });
		let collector = message.channel.collect(m => m);
		collector.on('message', m => {
			if (m.content.startsWith(settings.prefix + 'pause')) {
				message.channel.send('paused').then(() => { dispatcher.pause(); });
			} else if (m.content.startsWith(settings.prefix + 'resume')) {
				message.channel.send('resumed').then(() => { dispatcher.resume(); });
				
			} else if (m.content.startsWith(settings.prefix + 'skip')) {
				message.channel.send('skipped').then(() => { dispatcher.end(); });
				
			} else if (m.content.startsWith(settings.prefix + 'volume+')) {
				if (Math.round(dispatcher.volume * 50) >= 100) return message.channel.send(`Volume: ${Math.round(dispatcher.volume * 50)}%`);
				dispatcher.setVolume(Math.min((dispatcher.volume * 50 + (2 * (m.content.split('+').length - 1))) / 50, 2));
				message.channel.send(`Volume: ${Math.round(dispatcher.volume * 50)}%`);
				
			} else if (m.content.startsWith(settings.prefix + 'volume-')) {
				if (Math.round(dispatcher.volume * 50) <= 0) return message.channel.send(`Volume: ${Math.round(dispatcher.volume * 50)}%`);
				dispatcher.setVolume(Math.max((dispatcher.volume * 50 - (2 * (m.content.split('-').length - 1))) / 50, 0));
				message.channel.send(`Volume: ${Math.round(dispatcher.volume * 50)}%`);
				
			} else if (m.content.startsWith(settings.prefix + 'time')) {
				message.channel.send(`time: ${Math.floor(dispatcher.time / 60000)}:${Math.floor((dispatcher.time % 60000) / 1000) < 10 ? '0' + Math.floor((dispatcher.time % 60000) / 1000) : Math.floor((dispatcher.time % 60000) / 1000)}`);
			}
		});
		dispatcher.on('end', () => {
			collector.stop();
			play(queue[message.guild.id].songs.shift());
		});
		dispatcher.on('error', (err) => {
			return message.channel.send('error: ' + err).then(() => {
				collector.stop();
				play(queue[message.guild.id].songs.shift());
			});
		});
	})(queue[message.guild.id].songs.shift());

};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [""],
	permLevel: "User"
};

exports.help = {
	name: "play",
	category: "Music",
	description: "Plays a song",
	usage: "play"
};