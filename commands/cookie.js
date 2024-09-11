// commands/cookie.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'cookie',
    description: 'Receive a virtual cookie!',
    execute(message) {
        const embed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle('🍪 Cookie Time!')
            .setDescription(`${message.author.username} received a delicious virtual cookie!`)
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    },
};
