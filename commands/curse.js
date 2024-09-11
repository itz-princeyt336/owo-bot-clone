// commands/curse.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'curse',
    description: 'Jokingly curse someone!',
    args: true,
    execute(message, args) {
        const target = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
        if (!target || target.id === message.author.id) {
            return message.channel.send('Please mention a valid user to curse!');
        }

        const curses = [
            'You will stub your toe today!',
            'Your socks will never match again!',
            'You will spill coffee on your shirt!',
            'Your favorite TV show will be canceled!'
        ];
        const randomCurse = curses[Math.floor(Math.random() * curses.length)];

        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('😈 Curse Time!')
            .setDescription(`${message.author.username} curses ${target.username} with: "${randomCurse}"`)
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    },
};
