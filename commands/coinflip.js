const { EmbedBuilder } = require('discord.js');
const User = require('../models/User');
const GIF_LINKS = {
    flipping: 'https://media.tenor.com/UTgK0rCiKLMAAAAi/ultimate-coin-flip-lucky-louie-flip.gif',
    head: 'https://i.imgur.com/hOidl0u.png',
    tails: 'https://i.imgur.com/Z2lHqjq.png'
};

module.exports = {
    name: 'coinflip',
    description: 'Bet on a coin flip to win or lose coins',
    args: true,
    usage: '<bet-amount> <head/tails>',
    async execute(message, args) {
        const userId = message.author.id;
        const betAmount = parseInt(args[0], 10);
        const choice = args[1]?.toLowerCase();

        if (isNaN(betAmount) || betAmount <= 0 || !['head', 'tails'].includes(choice)) {
            return message.channel.send('Invalid arguments. Use `?coinflip <bet-amount> <head/tails>`');
        }

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

        if (user.balance < betAmount) {
            return message.channel.send('Insufficient balance for this bet.');
        }

        // Send the flipping embed
        const flippingEmbed = new EmbedBuilder()
            .setColor('#FFFF00')
            .setDescription('Coin is flipping...')
            .setThumbnail(GIF_LINKS.flipping) // Use thumbnail for the flipping image

        const flippingMessage = await message.channel.send({ embeds: [flippingEmbed] });

        // Remove flipping embed after 5 seconds
        setTimeout(async () => {
            const result = Math.random() < 0.5 ? 'head' : 'tails';
            const win = result === choice;
            const reward = win ? betAmount * 2 : 0;

            user.balance += (win ? reward : -betAmount);

            try {
                await user.save();
            } catch (error) {
                console.error('Error updating user data:', error);
                return message.channel.send('An error occurred while updating your balance.');
            }

            // Update with result
            const resultEmbed = new EmbedBuilder()
                .setColor(win ? '#00FF00' : '#FF0000')
                .setTitle(`You ${win ? 'Won' : 'Lost'} The Game!`)
                .setDescription(`You were ${win ? 'given' : 'fined'}:\n> 💰 ${win ? reward : -betAmount}`)
                .setThumbnail(win ? GIF_LINKS.head : GIF_LINKS.tails)
                .addFields(
                    { name: 'Balance', value: `💳 ${user.balance}`, inline: true }
                )
                .setTimestamp();

            await flippingMessage.edit({ embeds: [resultEmbed] });
        }, 5000); // 5 seconds delay
    },
};
