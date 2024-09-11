const { EmbedBuilder } = require('discord.js');
const User = require('../models/User'); // Load the User schema

module.exports = {
    name: 'balance',
    description: 'Check your balance',
    async execute(message) {
        const userId = message.author.id;
        const username = message.author.username;

        try {
            // Find user in database or create a new entry
            let user = await User.findOne({ userId });

            if (!user) {
                user = new User({
                    userId: userId,
                    username: username,
                    balance: 0,
                });
                await user.save(); // Save the new user
            }

            const balance = user.balance;

            // Create and send embed
            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle(`${username}'s Balance`)
                .setDescription(`💰 ${balance}`)
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching balance:', error);
            message.channel.send('An error occurred while fetching your balance.');
        }
    },
};
