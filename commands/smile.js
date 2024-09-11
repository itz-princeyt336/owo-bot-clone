const { EmbedBuilder } = require('discord.js');
const { getGif } = require('../utils/giphy');

module.exports = {
    name: 'smile',
    description: 'Send a smiling GIF.',
    async execute(message, args) {
        const gifUrl = await getGif('smile');

        if (gifUrl) {
            const embed = new EmbedBuilder()
                .setTitle(`${message.author.username} is smiling!`)
                .setImage(gifUrl)
                .setColor('#FF69B4');

            message.channel.send({ embeds: [embed] });
        } else {
            message.reply('Sorry, I couldn’t find a GIF for that.');
        }
    },
};
