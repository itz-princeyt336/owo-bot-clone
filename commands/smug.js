const { EmbedBuilder } = require('discord.js');
const { getGif } = require('../utils/giphy');

module.exports = {
    name: 'smug',
    description: 'Send a smug GIF.',
    async execute(message, args) {
        const gifUrl = await getGif('smug');

        if (gifUrl) {
            const embed = new EmbedBuilder()
                .setTitle(`${message.author.username} is smug!`)
                .setImage(gifUrl)
                .setColor('#FF69B4');

            message.channel.send({ embeds: [embed] });
        } else {
            message.reply('Sorry, I couldn’t find a GIF for that.');
        }
    },
};
