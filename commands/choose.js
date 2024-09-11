const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'choose',
    description: 'Make a choice between options.',
    execute(message, args) {
        if (args.length < 2) {
            return message.reply('Please provide at least two options.');
        }

        const choice = args[Math.floor(Math.random() * args.length)];

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('🤔 Choose')
            .setDescription(`**Options:** ${args.join(', ')}\n**Chosen Option:** ${choice}`)
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    },
};
