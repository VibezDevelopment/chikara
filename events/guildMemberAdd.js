module.exports = (client, member) => {
  const settings = client.getSettings(member.guild);
  
  if (settings.welcomeEnabled !== "true") return;
  const welcomeMessage = settings.welcomeMessage.replace("{{user}}", member.user.tag);
  member.guild.channels.find("name", settings.welcomeChannel).send(welcomeMessage).catch(console.error);
  
  member.guild.fetchInvites().then(guildInvites => {
    const ei = client.invites[member.guild.id];
    client.invites[member.guild.id] = guildInvites;
	
    const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
    const inviter = client.users.get(invite.inviter.id);
    const logChannel = member.guild.channels.find(channel => channel.name === "logs");
	
    logChannel.send(`${member.user.tag} joined using invite code ${invite.code} from ${inviter.tag}. Invite was used ${invite.uses} times since its creation.`);
  });
};