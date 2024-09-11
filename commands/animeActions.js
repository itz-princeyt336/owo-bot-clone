const { EmbedBuilder, Colors } = require('discord.js');
const axios = require('axios');

// List of actions (commands)
const actions = ['cuddle', 'hug', 'kiss', 'lick', 'nom', 'pat', 'poke', 'slap', 'stare', 'highfive', 'bite', 'greet', 'punch', 'handholding', 'tickle', 'kill', 'hold', 'pats', 'wave', 'boop', 'snuggle', 'bully'];

const commands = actions.map(action => ({
    name: action,
    description: `Send a ${action} GIF!`,
    async execute(message, args) {
        const targetUser = message.mentions.users.first();

        if (!targetUser) {
            return message.reply('Please mention a user to perform this action.');
        }

        try {
            const apiKey = 'AIzaSyBaCrzp3U_pNw9nDiojK9VZwhD2sAzduHY'; // Replace with your Tenor API key
            const response = await axios.get(`https://tenor.googleapis.com/v2/search?q=anime ${action}&key=${apiKey}&limit=10`);
            const gifs = response.data.results;

            if (gifs.length === 0) {
                return message.reply(`No ${action} GIFs found!`);
            }

            const gifUrl = gifs[Math.floor(Math.random() * gifs.length)].media_formats.gif.url;

            const embed = new EmbedBuilder()
                .setTitle(`${message.author.username} ${action}s ${targetUser.username}!`)
                .setImage(gifUrl)
                .setColor(Colors.Blue) // Use Colors.Blue or a valid hex code
                .setTimestamp();

            message.channel.send({ embeds: [embed] });

        } catch (error) {
            console.error('Error fetching GIF:', error);
            message.reply(`Failed to find a ${action} GIF.`);
        }
    }
}));

module.exports = commands;
