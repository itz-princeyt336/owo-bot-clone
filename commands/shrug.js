const { EmbedBuilder } = require('discord.js');
const { getGif } = require('../utils/giphy');

module.exports = {
    name: 'shrug',
    description: 'Send a shrugging GIF.',
    async execute(message, args) {
        const gifUrl = await getGif('shrug');

        if (gifUrl) {
            const embed = new EmbedBuilder()
                .setTitle(`${message.author.username} is shrugging!`)
                .setImage(gifUrl)
                .setColor('#FF69B4');

            message.channel.send({ embeds: [embed] });
        } else {
            message.reply('Sorry, I couldn’t find a GIF for that.');
        }
    },
};
