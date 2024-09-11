const { EmbedBuilder } = require('discord.js');
const User = require('../models/User'); // Load User schema

module.exports = {
    name: 'bank',
    description: 'Check your bank balance.',
    async execute(message) {
        const userId = message.author.id;

        try {
            // Find user in the database or create a new entry
            let user = await User.findOne({ userId });

            if (!user) {
                user = new User({
                    userId: userId,
                    username: message.author.username,
                    balance: 0,
                    bankBalance: 0,
                });
                await user.save(); // Save the new user
            }

            // Create embed for bank balance
            const bankEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('Bank Balance')
                .addFields(
                    { name: 'Wallet Balance', value: `💰 ${user.balance}`, inline: true },
                    { name: 'Bank Balance', value: `🏦 ${user.bankBalance}`, inline: true }
                )
                .setTimestamp();

            message.channel.send({ embeds: [bankEmbed] });
        } catch (error) {
            console.error('Error fetching bank balance:', error);
            message.channel.send('An error occurred while fetching your bank balance.');
        }
    },
};
