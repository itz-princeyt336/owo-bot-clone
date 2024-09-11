// commands/pray.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'pray',
    description: 'Send a prayer for good luck!',
    execute(message) {
        const embed = new EmbedBuilder()
            .setColor('#8A2BE2')
            .setTitle('🙏 Prayer Time!')
            .setDescription(`${message.author.username} sends a prayer for good luck and blessings!`)
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    },
};
