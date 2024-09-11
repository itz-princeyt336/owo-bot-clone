const { EmbedBuilder, Colors } = require('discord.js');
const User = require('../models/User'); // Ensure the correct path

const cooldowns = new Map(); // In-memory storage for cooldowns

module.exports = {
    name: 'battle',
    description: 'Battle with your animals!',
    async execute(message, args) {
        const opponent = message.mentions.users.first();
        if (!opponent) {
            return message.reply('Please mention a user to battle.');
        }

        const userId = message.author.id;
        const opponentId = opponent.id;

        // Check cooldown
        const now = Date.now();
        const cooldownAmount = 60 * 1000; // 1 minute in milliseconds

        if (cooldowns.has(userId)) {
            const expirationTime = cooldowns.get(userId) + cooldownAmount;
            if (now < expirationTime) {
                const timeLeft = ((expirationTime - now) / 1000).toFixed(0);
                return message.reply(`Please wait ${timeLeft} more seconds before using this command again.`);
            }
        }

        // Set cooldown
        cooldowns.set(userId, now);
        setTimeout(() => cooldowns.delete(userId), cooldownAmount);

        // Battle logic
        const user = await User.findOne({ userId });
        const opponentUser = await User.findOne({ userId: opponentId });

        if (!user || !opponentUser || user.zoo.length === 0 || opponentUser.zoo.length === 0) {
            return message.reply('Both users must have animals to battle.');
        }

        const userAnimal = user.zoo[Math.floor(Math.random() * user.zoo.length)];
        const opponentAnimal = opponentUser.zoo[Math.floor(Math.random() * opponentUser.zoo.length)];

        const winner = Math.random() > 0.5 ? message.author.username : opponent.username;

        // If user won, give lootbox and crates
        if (winner === message.author.username) {
            user.lootboxes = (user.lootboxes || 0) + 1;
            user.crates = (user.crates || 0) + 1;
            await user.save();
        }

        const embed = new EmbedBuilder()
            .setTitle('Animal Battle!')
            .setDescription(`${userAnimal} vs. ${opponentAnimal}\n\n**${winner} wins!**`)
            .setColor(Colors.Orange);

        message.channel.send({ embeds: [embed] });
    }
};
