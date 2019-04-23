const { inspect } = require("util");

// This command is to modify/edit guild configuration. Perm Level 3 for admins
// and owners only. Used for changing prefixes, role names and such.

// Note that there's no "checks" in this basic version

exports.run = async (client, message, [action, key, ...value], level) => { // eslint-disable-line no-unused-vars
  
  const settings = message.settings;
  const defaults = client.settings.get("default");
  
  if (action === "edit") {
    if (!key) return message.reply("Please specify a key to edit");
    if (!settings[key]) return message.reply("This key does not exist in the settings");
    if (value.length < 1) return message.reply("Please specify a new value");

    settings[key] = value.join(" ");

    client.settings.set(message.guild.id, settings);
    message.reply(`${key} successfully edited to ${value.join(" ")}`);
  } else
  
  if (action === "del" || action === "reset") {
    if (!key) return message.reply("Please specify a key to delete (reset).");
    if (!settings[key]) return message.reply("This key does not exist in the settings");
    
    const response = await client.awaitReply(message, `Are you sure you want to reset \`${key}\` to the default \`${defaults[key]}\`?`);

    if (["y", "yes"].includes(response)) {

      delete settings[key];
      client.settings.set(message.guild.id, settings);
      message.reply(`${key} was successfully deleted.`);
    } else
    if (["n","no","cancel"].includes(response)) {
      message.reply(`Your setting for \`${key}\` remains at \`${settings[key]}\``);
    }
  } else
  
  if (action === "get") {
    if (!key) return message.reply("Please specify a key to view");
    if (!settings[key]) return message.reply("This key does not exist in the settings");
    message.reply(`The value of ${key} is currently ${settings[key]}`);
  
  } else {
    await message.channel.send(`***__Current Guild Settings__***\n\`\`\`json\n${inspect(settings)}\n\`\`\``);
    message.channel.send(`See the Dashboard on <${client.config.dashboard.callbackURL.split("/").slice(0, -1).join("/")}>`);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["setting", "settings"],
  permLevel: "Administrator"
};

exports.help = {
  name: "set",
  category: "System",
  description: "View or change settings for your server.",
  usage: "set <view/get/edit> <key> <value>"
};