const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: '8b',
    description: 'Ask the magic 8 ball a question!',
    async execute(message, args) {
        if (args.length === 0) {
            return message.reply('Please ask a question.');
        }

        const responses = [
            'Yes',
            'No',
            'Maybe',
            'Ask again later',
            'Definitely',
            'I wouldn\'t count on it'
        ];

        const answer = responses[Math.floor(Math.random() * responses.length)];

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('🎱 Magic 8 Ball')
            .setDescription(`**Question:** ${args.join(' ')}\n**Answer:** ${answer}`)
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    },
};
