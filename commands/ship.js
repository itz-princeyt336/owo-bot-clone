// commands/ship.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ship',
    description: 'Ship yourself with another user!',
    args: true,
    execute(message, args) {
        const target = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
        if (!target || target.id === message.author.id) {
            return message.channel.send('Please mention a valid user to ship with!');
        }

        const shipPercentage = Math.floor(Math.random() * 101);
        const embed = new EmbedBuilder()
            .setColor('#FF69B4')
            .setTitle('💘 Shipping Results!')
            .setDescription(`You and ${target.username} are ${shipPercentage}% compatible!`)
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    },
};
