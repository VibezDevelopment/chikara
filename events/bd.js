module.exports = (client, member, message) => {
	
  const bdHelp = ["bd", "bd help"];
	if( bdHelp.some(word => message.content.includes(word)) ) {
		message.channel.send("This guide should help you with most BD issues. https://0x71.cc/bd/guide/");
	}

};