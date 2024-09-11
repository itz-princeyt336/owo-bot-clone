const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'prefix',
    description: 'View or change the bot\'s command prefix for this server.',
    execute(message, args) {
        const prefixesPath = path.join(__dirname, '../database/prefixes.json');
        let prefixes = {};

        // Load the existing prefixes
        if (fs.existsSync(prefixesPath)) {
            prefixes = JSON.parse(fs.readFileSync(prefixesPath, 'utf-8'));
        }

        const guildId = message.guild.id;

        // If no arguments, display the current prefix
        if (!args.length) {
            const currentPrefix = prefixes[guildId] || message.client.prefix;
            return message.channel.send(`The current prefix is: \`${currentPrefix}\``);
        }

        // Set a new prefix
        const newPrefix = args[0];
        prefixes[guildId] = newPrefix;

        // Save the new prefix
        fs.writeFileSync(prefixesPath, JSON.stringify(prefixes, null, 2));

        // Reload the prefix in memory
        message.client.prefixes = prefixes;

        message.channel.send(`Prefix changed to: \`${newPrefix}\``);
    }
};
