const { EmbedBuilder, Colors } = require('discord.js');
const User = require('../models/User');

module.exports = {
    name: 'top',
    description: 'Show the top 10 richest users.',
    async execute(message) {
        try {
            // Load user data
            const users = await User.find().sort({ balance: -1 }).limit(10);

            // Create embed for top users
            const topEmbed = new EmbedBuilder()
                .setColor(Colors.Gold)
                .setTitle('Top 10 Richest Users')
                .setDescription('Here are the top 10 richest users:')
                .setTimestamp();

            users.forEach((user, index) => {
                topEmbed.addFields(
                    { name: `${index + 1}. ${message.guild.members.cache.get(user.userId)?.user.username || 'Unknown'}`, value: `💰 ${user.balance}`, inline: false }
                );
            });

            message.channel.send({ embeds: [topEmbed] });
        } catch (error) {
            console.error('Error fetching top users:', error);
            message.channel.send('An error occurred while fetching the top users.');
        }
    },
};
