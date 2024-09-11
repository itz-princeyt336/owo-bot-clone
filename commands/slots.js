const User = require('../models/User');
const { EmbedBuilder, Colors } = require('discord.js');

module.exports = {
    name: 'slots',
    description: 'Play a slot machine game!',
    args: true,
    async execute(message, args) {
        const betAmount = parseInt(args[0], 10);
        if (isNaN(betAmount) || betAmount <= 0) {
            return message.channel.send('Please provide a valid bet amount.');
        }

        try {
            const user = await User.findOne({ userId: message.author.id });

            if (!user || user.balance < betAmount) {
                return message.channel.send('You don\'t have enough balance to make this bet.');
            }

            const emojis = ['🍒', '🍋', '🍊', '🍉', '🍇', '🍓'];
            const [emoji1, emoji2, emoji3] = Array.from({ length: 3 }, () => emojis[Math.floor(Math.random() * emojis.length)]);

            const spinEmbed = new EmbedBuilder()
                .setColor(Colors.Gold)
                .setTitle('🎰 Slot Machine 🎰')
                .setDescription('Spinning...')
                .addFields(
                    { name: '1️⃣', value: '...', inline: true },
                    { name: '2️⃣', value: '...', inline: true },
                    { name: '3️⃣', value: '...', inline: true }
                )
                .setTimestamp();

            const msg = await message.channel.send({ embeds: [spinEmbed] });

            const spinStages = [
                ['🍒', '🍋', '🍊'],
                ['🍇', '🍓', '🍉'],
                ['🍒', '🍋', '🍇'],
                [emoji1, emoji2, emoji3]
            ];

            for (const stage of spinStages) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                const stageEmbed = new EmbedBuilder()
                    .setColor(Colors.Gold)
                    .setTitle('🎰 Slot Machine 🎰')
                    .setDescription('Spinning...')
                    .addFields(
                        { name: '1️⃣', value: stage[0], inline: true },
                        { name: '2️⃣', value: stage[1], inline: true },
                        { name: '3️⃣', value: stage[2], inline: true }
                    )
                    .setTimestamp();
                await msg.edit({ embeds: [stageEmbed] });
            }

            const resultEmbed = new EmbedBuilder()
                .setColor(emoji1 === emoji2 && emoji2 === emoji3 ? Colors.Green : Colors.Red)
                .setTitle('🎰 Slot Machine 🎰')
                .setDescription('Results:')
                .addFields(
                    { name: '1️⃣', value: emoji1, inline: true },
                    { name: '2️⃣', value: emoji2, inline: true },
                    { name: '3️⃣', value: emoji3, inline: true }
                )
                .setTimestamp();

            if (emoji1 === emoji2 && emoji2 === emoji3) {
                const winAmount = betAmount * 3;
                user.balance += winAmount;
                resultEmbed.setDescription(`Congratulations! You won 💰 ${winAmount}!`);
            } else {
                user.balance -= betAmount;
                resultEmbed.setDescription(`Sorry! You lost 💰 ${betAmount}.`);
            }

            await user.save();

            await msg.edit({ embeds: [resultEmbed] });
        } catch (error) {
            console.error('Error playing slots:', error);
            message.channel.send('An error occurred while playing slots.');
        }
    },
};
