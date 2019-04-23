const { inspect } = require("util");

/*
For guild settings go to - set.js

This command is used to modify the bot's default configuration values, which affects all guilds. 

If a default setting is not specifically overwritten by a guild, changing a default here will
change it for that guild.

The `add` action adds a key to the configuration of every guild in your bot. 
The `del` action removes the key also from every guild, and loses its value forever.
*/

exports.run = async (client, message, [action, key, ...value], level) => { // eslint-disable-line no-unused-vars

  const defaults = client.settings.get("default");
  
  if (action === "add") {
    if (!key) return message.reply("Please specify a key to add");
    if (defaults[key]) return message.reply("This key already exists in the default settings");
    if (value.length < 1) return message.reply("Please specify a value");

    defaults[key] = value.join(" ");
  
    client.settings.set("default", defaults);
    message.reply(`${key} successfully added with the value of ${value.join(" ")}`);
  } else
  
  if (action === "edit") {
    if (!key) return message.reply("Please specify a key to edit");
    if (!defaults[key]) return message.reply("This key does not exist in the settings");
    if (value.length < 1) return message.reply("Please specify a new value");

    defaults[key] = value.join(" ");

    client.settings.set("default", defaults);
    message.reply(`${key} successfully edited to ${value.join(" ")}`);
  } else
  
  // WARNING: DELETING A KEY FROM THE DEFAULTS ALSO REMOVES IT FROM EVERY GUILD
  if (action === "del") {
    if (!key) return message.reply("Please specify a key to delete.");
    if (!defaults[key]) return message.reply("This key does not exist in the settings");
    
    const response = await client.awaitReply(message, `Are you sure you want to permanently delete ${key} from all guilds? This **CANNOT** be undone.`);

    if (["y", "yes"].includes(response)) {

      delete defaults[key];
      client.settings.set("default", defaults);
      
      // then we loop on all the guilds and remove this key if it exists.
      // "if it exists" is done with the filter (if the key is present and it's not the default config!)
      for (const [guildid, conf] of client.settings.filter((setting, id) => setting[key] && id !== "default")) {
        delete conf[key];
        client.settings.set(guildid, conf);
      }
      
      message.reply(`${key} was successfully deleted.`);
    } else
    if (["n","no","cancel"].includes(response)) {
      message.reply("Action cancelled.");
    }
  } else
  
  if (action === "get") {
    if (!key) return message.reply("Please specify a key to view");
    if (!defaults[key]) return message.reply("This key does not exist in the settings");
    message.reply(`The value of ${key} is currently ${defaults[key]}`);

  } else {
    await message.channel.send(`***__Bot Default Settings__***\n\`\`\`json\n${inspect(defaults)}\n\`\`\``);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["defaults"],
  permLevel: "Bot Admin"
};

exports.help = {
  name: "conf",
  category: "System",
  description: "Modify the default configuration for all guilds.",
  usage: "conf <view/get/edit> <key> <value>"
};