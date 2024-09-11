// commands/beg.js
const User = require('../models/User');
const { EmbedBuilder } = require('discord.js');

const cooldowns = new Map();
const COOLDOWN_TIME = 1 * 60 * 60 * 1000; // 1 hour in milliseconds

module.exports = {
    name: 'beg',
    description: 'Beg for some coins',
    async execute(message) {
        const userId = message.author.id;
        const now = Date.now();

        // Check and update cooldown
        if (cooldowns.has(userId) && now - cooldowns.get(userId) < COOLDOWN_TIME) {
            const remaining = cooldowns.get(userId) + COOLDOWN_TIME - now;
            const remainingMinutes = Math.ceil(remaining / 1000 / 60);
            return message.channel.send(`⏳ You can beg again in ${remainingMinutes} minutes.`);
        }

        cooldowns.set(userId, now);

        // Load or create user data
        let user = await User.findOne({ userId });
        if (!user) {
            user = new User({ userId, username: message.author.username });
        }

        // Generate beg reward
        const reward = Math.floor(Math.random() * 50) + 10; // Random reward between 10 and 60 coins

        // Update user balance and save data
        user.balance += reward;
        user.lastBeg = now;
        await user.save();

        // Create and send embed
        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle(`${message.author.username} Begged`)
            .setDescription(`You were given:\n> 💰 ${reward} on beg!`)
            .addFields(
                { name: 'Balance', value: `💳 ${user.balance}`, inline: true },
                { name: 'Next Beg', value: `in ${Math.ceil((COOLDOWN_TIME - (now - cooldowns.get(userId))) / 1000 / 60)} minutes`, inline: true }
            )
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    },
};
