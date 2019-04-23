if (process.version.slice(1).split(".")[0] < 8) throw new Error("Node 8.0.0 or higher is required. Update Node on your system.");
console.time('Modules');
const Discord = require("discord.js");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const Enmap = require("enmap");
const klaw = require("klaw");
const path = require("path");
const cleverbot = require("cleverbot.io");
const client = new Discord.Client();
console.timeEnd('Modules');
             
console.time('Client')           
client.config = require("./config.js");
// client.config.token  bot's token
// client.config.prefix  message prefix
require("./util/functions")(client);
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.queue = new Discord.Collection();
client.settings = new Enmap({ 
  name: "settings",
  autoFetch: true,
  fetchAll: false,
  cloneLevel: 'deep',
  ensureProps: true
});
client.wait = promisify(setTimeout);
console.timeEnd('Client')       
const init = async () => {
  console.time('Commands');
  const cmdFiles = await readdir("./commands/");
  client.log("log", `Loading a total of ${cmdFiles.length} commands.`);
  klaw("./commands").on("data", (item) => {
    const cmdFile = path.parse(item.path);
    if (!cmdFile.ext || cmdFile.ext !== ".js") return;
    const response = client.loadCommand(`${cmdFile.name}${cmdFile.ext}`);
    if (response) console.log(response);
  });
  console.timeEnd('Commands');
  console.time('Events');
  const evtFiles = await readdir("./events/");
  client.log("log", `Loading a ${evtFiles.length} events.`);
  klaw("./events").on("data", (item) => {
    const evtFile = path.parse(item.path);
    if (!evtFile.ext || evtFile.ext !== ".js") return;
    const event = require(`./events/${evtFile.name}${evtFile.ext}`);
    client.on(evtFile.name, event.bind(null, client));
  });
  console.timeEnd('Events');

  // Generate a cache
  client.levelCache = {};
  for (let i = 0; i < client.config.permLevels.length; i++) {
    const thisLevel = client.config.permLevels[i];
    client.levelCache[thisLevel.name] = thisLevel.level;
  }
  console.time("Client Login")
  client.login(client.config.token);
  console.timeEnd("Client Login")
};

init();
