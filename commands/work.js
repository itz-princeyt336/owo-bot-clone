const { EmbedBuilder, Colors } = require('discord.js');
const User = require('../models/User');

const cooldowns = new Map();
const COOLDOWN_TIME = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

const jobs = [
    'Software Developer', 'Graphic Designer', 'Data Analyst', 'Marketing Specialist',
    'Content Writer', 'Sales Representative', 'Customer Support', 'Project Manager',
    'Web Designer', 'SEO Expert', 'HR Manager', 'Business Analyst',
    'System Administrator', 'Network Engineer', 'Product Manager',
];

module.exports = {
    name: 'work',
    description: 'Work to earn some coins',
    async execute(message) {
        const userId = message.author.id;
        const now = Date.now();

        // Check and update cooldown
        if (cooldowns.has(userId) && now - cooldowns.get(userId) < COOLDOWN_TIME) {
            const remaining = cooldowns.get(userId) + COOLDOWN_TIME - now;
            const remainingMinutes = Math.ceil(remaining / 1000 / 60);
            return message.channel.send(`⏳ You can work again in ${remainingMinutes} minutes.`);
        }

        cooldowns.set(userId, now);

        try {
            const user = await User.findOne({ userId });

            if (!user) {
                // Initialize user if not present
                await User.create({ userId, username: message.author.username });
                return message.channel.send('Your account has been created. Try working again.');
            }

            // Generate work reward and job
            const reward = Math.floor(Math.random() * 50) + 50; // Random reward between 50 and 100 coins
            const job = jobs[Math.floor(Math.random() * jobs.length)];

            // Update user balance and save data
            user.balance += reward;
            await user.save();

            // Create and send embed
            const embed = new EmbedBuilder()
                .setColor(Colors.Green)
                .setTitle(`Great Job ${message.author.username}`)
                .setDescription(`You were given:\n> 💰 ${reward} for your work!`)
                .addFields(
                    { name: 'Balance', value: `💳 ${user.balance}`, inline: true },
                    { name: 'Next Work', value: `in ${Math.ceil((COOLDOWN_TIME - (now - cooldowns.get(userId))) / 1000 / 60)} minutes`, inline: true }
                )
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error working:', error);
            message.channel.send('An error occurred while working.');
        }
    },
};
