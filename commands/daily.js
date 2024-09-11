// commands/daily.js
const { EmbedBuilder } = require('discord.js');
const User = require('../models/User');

const cooldowns = new Map();
const COOLDOWN_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

module.exports = {
    name: 'daily',
    description: 'Claim your daily reward',
    async execute(message) {
        const userId = message.author.id;
        const now = Date.now();

        if (cooldowns.has(userId) && now - cooldowns.get(userId) < COOLDOWN_TIME) {
            const remaining = cooldowns.get(userId) + COOLDOWN_TIME - now;
            const remainingHours = Math.ceil(remaining / 1000 / 60 / 60);
            return message.channel.send(`⏳ You can claim your daily reward in ${remainingHours} hours.`);
        }

        cooldowns.set(userId, now);

        let user;
        try {
            user = await User.findOne({ userId });
            if (!user) {
                user = new User({ userId, username: message.author.username });
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            return message.channel.send('An error occurred while fetching user data.');
        }

        const reward = Math.floor(Math.random() * 100) + 50; // Random reward between 50 and 150
        user.balance += reward;
        user.lastDaily = now;

        try {
            await user.save();
        } catch (error) {
            console.error('Error updating user data:', error);
            return message.channel.send('An error occurred while updating your balance.');
        }

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle(`${message.author.username} Daily Coins`)
            .setDescription(`> 💰 ${reward} placed in your wallet!`)
            .addFields(
                { name: 'Balance', value: `💳 ${user.balance}`, inline: true },
                { name: 'Next Daily', value: `in ${Math.ceil((COOLDOWN_TIME - (now - cooldowns.get(userId))) / 1000 / 60 / 60)} hours`, inline: true }
            )
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    },
};
