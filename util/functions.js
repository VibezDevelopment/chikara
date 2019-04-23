const _ = require("lodash");
module.exports = (client) => {

  /*
  PERMISSION LEVEL FUNCTION
  */
  client.permlevel = message => {
    let permlvl = 0;

    const permOrder = client.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (message.guild && currentLevel.guildOnly) continue;
      if (currentLevel.check(message)) {
        permlvl = currentLevel.level;
        break;
      }
    }
    return permlvl;
  };

  /*
  LOGGING FUNCTION
  */
  client.log = (type, msg, title) => {
    if (!title) title = "Log";
    console.log(`[${type}] [${title}]${msg}`);
  };

  /*
  SINGLE-LINE AWAITMESSAGE
  */
  client.awaitReply = async (msg, question, limit = 60000) => {
    const filter = m=>m.author.id = msg.author.id;
    await msg.channel.send(question);
    try {
      const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
      return collected.first().content;
    } catch (e) {
      return false;
    }
  };

  /*
  MESSAGE CLEAN FUNCTION

  "Clean" removes @everyone pings, as well as tokens, and makes code blocks
  escaped. Resolves promises and stringifies objects.
  */
  client.clean = async (client, text) => {
    if (text && text.constructor.name == "Promise")
      text = await text;
    if (typeof evaled !== "string")
      text = require("util").inspect(text, {depth: 0});

    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203))
      .replace(client.token, "mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0");

    return text;
  };

  /*   COMMAND LOAD AND UNLOAD  */
  
  client.loadCommand = (commandName) => {
    try {
      const props = require(`${process.cwd()}/commands/${commandName}`);
      client.log("log", `Loading Command: ${props.help.name}. 👌`);
      if (props.init) {
        props.init(client);
      }
      client.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (e) {
      return `Unable to load command ${commandName}: ${e}`;
    }
  };

  client.unloadCommand = async (commandName) => {
    console.log(`Trying to unload ${commandName}`);
    const command = client.commands.get(commandName);
    if (!command) return `The command \`${commandName}\` doesn't seem to exist, nor is it an alias. Try again!`;
    if (command.shutdown) {
      await command.shutdown(client);
    }
    command.conf.aliases.forEach(alias => {
      client.aliases.delete(alias);
    });
    client.commands.delete(command.help.name);
    delete require.cache[require.resolve(`${process.cwd()}/commands/${command.help.name}.js`)];
    return false;
  };

  /* SETTINGS FUNCTIONS */

  client.getSettings = (guild) => {
    if(!guild) return client.settings.get("default");
    const guildConf = client.settings.ensure(guild.id, client.settings.get("default"));
    return ({...client.settings.get("default"), ...guildConf});
  }    
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax


  client.writeSettings = (id, newSettings) => {
    const defaults = client.settings.get("default");
    let settings = client.settings.get(id) || {};

    client.settings.set(id, {
      ..._.pickBy(settings, (v, k) => !_.isNil(defaults[k])),
      ..._.pickBy(newSettings, (v, k) => !_.isNil(defaults[k]))
    });
  };

  client.split_message = (content) => {
      if(content.length < 2000) {
        return [content];
      }
  
      // Too long, let's try and split it at a logical place
      else {
        // Attempt to split on newlines
        let split = content.split('\n');
        let progress = '';
        let lines = [];
        for(line in split) {
          // I sure hope no lines are 1999 characters or longer
          if(progress.length + line.length > 1998) {
            lines.push(progress);
            progress = '';
          }
          progress = progress + line;
        }
        lines.push(progress);
        return lines;
      }
  }
  /* MISCELANEOUS NON-CRITICAL FUNCTIONS */

  String.prototype.toProperCase = function() {
    return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  };    

  Array.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)];
  };

  client.wait = require("util").promisify(setTimeout);

  process.on("uncaughtException", (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    console.error("Uncaught Exception: ", errorMsg);
    process.exit(1);
  });

  process.on("unhandledRejection", err => {
    console.error("Uncaught Promise Error: ", err);
  });
};