const fs = require('fs');
const path = require('path');
require('dotenv').config();
const connectDB = require('./db');
const { Client, GatewayIntentBits, Events, Collection, ActivityType } = require('discord.js');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Set up default prefix and other variables
const DEFAULT_PREFIX = '?';
client.prefix = DEFAULT_PREFIX;

const prefixesPath = path.join(__dirname, 'database/prefixes.json');

// Load the prefixes from file
let prefixes = {};
if (fs.existsSync(prefixesPath)) {
    prefixes = JSON.parse(fs.readFileSync(prefixesPath, 'utf-8'));
}
client.prefixes = prefixes;

// Load commands
client.commands = new Collection();
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const commands = require(`./commands/${file}`);
    if (Array.isArray(commands)) {
        for (const command of commands) {
            client.commands.set(command.name, command);
        }
    } else {
        client.commands.set(commands.name, commands);
    }
}

connectDB();
// Event: Bot is ready
client.once(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}!`);

    // Set streaming status with a URL
    const serverCount = client.guilds.cache.size; // Number of servers the bot is in
    client.user.setActivity(`with ${serverCount} servers!`, {
        type: ActivityType.Streaming,
        url: 'https://www.twitch.tv/', // Replace with an actual stream URL
    });
});

// Event: Message is received
client.on(Events.MessageCreate, async message => {
    if (message.author.bot) return;

    const guildId = message.guild.id;
    const prefix = client.prefixes[guildId] || client.prefix;

    if (message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        if (!client.commands.has(commandName)) return;

        const command = client.commands.get(commandName);
        try {
            await command.execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply('There was an error while executing the command.');
        }
    }

    if (message.mentions.has(client.user)) {
        message.reply(`Hello! Here is my prefix: \`${prefix}\``);
    }
});

// Log in to Discord with your app's token
client.login(process.env.TOKEN);
